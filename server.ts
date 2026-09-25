import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

// Helper to call Gemini with retry and fallback across supported flash models in case of transient 503 spikes
async function callGeminiWithRetry(params: any, maxRetries = 3) {
  const fallbackModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const modelToUse = fallbackModels[attempt % fallbackModels.length];
    try {
      const response = await ai.models.generateContent({
        ...params,
        model: modelToUse,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Attempt ${attempt + 1}] Model ${modelToUse} error:`, err?.message || err);
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

const PERSONA_PROMPTS: Record<string, string> = {
  skeptic: `You are The Rigorous Empirical Skeptic. You demand falsifiable claims, rigorous evidence, precise definitions, and logical consistency. You despise hand-wavy claims, untested assumptions, and cognitive biases.`,
  devil_advocate: `You are The Devil's Advocate. Your job is to challenge the thesis from the polar opposite perspective. You expose hidden costs, perverse incentives, counter-examples, and worst-case failure modes that the proposer neglected.`,
  pragmatist: `You are The Pragmatic Systems Engineer. You stress-test concepts against messy reality, implementation friction, human psychology, resource limitations, supply chains, and second-order unintended consequences.`,
  ethicist: `You are The Socratic Ethicist & Humanist. You interrogate moral assumptions, distributional equity, who gets harmed, power imbalances, and systemic blind spots in utilitarian or technocratic thinking.`,
  balanced: `You are The Senior Dialectic Cross-Examiner. You objectively stress-test arguments across logical coherence, empirical grounding, feasibility, and nuance. You push for intellectual truth and will concede when an argument is truly unassailable.`,
};

// 1. Initial Response from Proposer
app.post('/api/dialectic/initial-response', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Question is required' });
      return;
    }

    const systemInstruction = `You are The Lead Thesis Proposer in an intellectual dialectic. 
Your goal is to provide a well-structured, clear, persuasive, and thoughtful initial answer to the user's inquiry.
Provide:
1. A direct, substantive response explaining your reasoning clearly.
2. 3 to 4 core pillar points supporting your stance.
Avoid being overly apologetic or defensive; present a bold, cogent thesis that invites intellectual testing.`;

    const prompt = `User Question: "${question}"

Provide your initial response and key analytical pillars.`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: {
              type: Type.STRING,
              description: 'Comprehensive, articulate answer to the question with reasoning and context.',
            },
            keyPillars: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 core pillars or premises supporting this initial thesis.',
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: 'Initial confidence score between 60 and 90.',
            },
          },
          required: ['content', 'keyPillars', 'confidenceScore'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: unknown) {
    console.error('Error generating initial response:', err);
    res.status(500).json({ error: (err as Error).message || 'Failed to generate initial response' });
  }
});

// 2. Adversarial Objection & Satisfaction Evaluation
app.post('/api/dialectic/evaluate-and-object', async (req: Request, res: Response) => {
  try {
    const { question, currentResponse, roundsHistory = [], objectionCount = 0, personaId = 'balanced' } = req.body;

    if (!question || !currentResponse) {
      res.status(400).json({ error: 'Question and currentResponse are required' });
      return;
    }

    const personaPrompt = PERSONA_PROMPTS[personaId] || PERSONA_PROMPTS.balanced;
    const currentObjectionNumber = objectionCount + 1;

    const previousContext = roundsHistory
      .map((r: any, idx: number) => {
        let text = `--- Round ${idx} ---\nProposer Answer: ${r.proposerResponse?.content || ''}`;
        if (r.objection) {
          text += `\nAdversary Objection #${r.objection.objectionNumber} (${r.objection.title}): ${r.objection.critique}`;
        }
        if (r.proposerResponse?.concession) {
          text += `\nProposer Concession: ${r.proposerResponse.concession}`;
        }
        return text;
      })
      .join('\n\n');

    const systemInstruction = `${personaPrompt}

You are evaluating the Proposer's current answer to the question: "${question}".
Current objection iteration: #${currentObjectionNumber} (Maximum allowed is 5).

YOUR EVALUATION CRITERIA:
1. Strict Satisfaction Evaluation:
   - Does this response thoroughly withstand rigorous scrutiny?
   - Has it adequately addressed previous objections (if any) with mature nuance, realistic boundaries, and sound evidence?
   - Is it balanced, deep, and resilient against major counter-arguments?
   - If YES, and the answer is truly robust, mature, and satisfactory, set "isSatisfactory" to true, give a score of 8.5 to 10.0, and articulate why the argument is now complete and satisfactory.
   - NOTE: On Round 1 (0 previous objections), rarely mark satisfactory unless the question was extremely trivial or factual, because any rich philosophical/technical topic deserves at least a counter-critique. By Round 3, 4, or 5, if the proposer has refined effectively, be fair and declare satisfaction when earned!

2. If NOT Satisfactory (isSatisfactory = false):
   - You MUST formulate Objection #${currentObjectionNumber}.
   - The objection must be fresh, sharp, and address the specific weak spots, unexamined assumptions, edge cases, or gaps in the *current* response. Do NOT repeat an objection that was already conceded and resolved in a previous round.
   - Identify the exact vulnerability type: logical_fallacy, empirical_evidence, unexamined_assumption, edge_case, unintended_consequence, ethical_blindspot, or practical_feasibility.
   - Formulate a precise Challenge Question that forces the proposer to fortify their position.`;

    const prompt = `QUESTION: "${question}"

PREVIOUS ROUNDS CONTEXT:
${previousContext || 'None (This is the first evaluation).'}

CURRENT PROPOSER ANSWER TO SCRUTINIZE:
"${currentResponse}"

Determine if this response is fully SATISFACTORY or if an OBJECTION #${currentObjectionNumber} must be raised.`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSatisfactory: {
              type: Type.BOOLEAN,
              description: 'Whether the response has reached a genuinely robust and satisfactory standard.',
            },
            score: {
              type: Type.NUMBER,
              description: 'Score from 1.0 to 10.0 assessing argument robustness.',
            },
            satisfactionReasoning: {
              type: Type.STRING,
              description: 'Detailed analysis of why the response is satisfactory OR why it fails to satisfy.',
            },
            strengthsRecognized: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific strengths or improvements acknowledged in the current answer.',
            },
            objection: {
              type: Type.OBJECT,
              description: 'Required if isSatisfactory is false. Leave empty/null if satisfactory.',
              properties: {
                objectionNumber: { type: Type.INTEGER },
                title: { type: Type.STRING, description: 'Snappy, intellectually provocative title for the objection' },
                critique: { type: Type.STRING, description: 'In-depth breakdown of the objection and why the current answer is insufficient' },
                vulnerabilityType: {
                  type: Type.STRING,
                  description: 'Category: logical_fallacy, empirical_evidence, unexamined_assumption, edge_case, unintended_consequence, ethical_blindspot, or practical_feasibility',
                },
                severity: {
                  type: Type.STRING,
                  description: 'mild, moderate, or critical',
                },
                targetAspect: { type: Type.STRING, description: 'The exact premise or sentence being attacked' },
                challengeQuestion: { type: Type.STRING, description: 'Direct question testing the proposer in the next turn' },
              },
            },
          },
          required: ['isSatisfactory', 'score', 'satisfactionReasoning', 'strengthsRecognized'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.isSatisfactory && parsed.objection) {
      parsed.objection.objectionNumber = currentObjectionNumber;

      // Sanitize vulnerabilityType
      const rawType = String(parsed.objection.vulnerabilityType || '').toLowerCase();
      if (rawType.includes('fallacy')) parsed.objection.vulnerabilityType = 'logical_fallacy';
      else if (rawType.includes('empirical') || rawType.includes('evidence')) parsed.objection.vulnerabilityType = 'empirical_evidence';
      else if (rawType.includes('edge')) parsed.objection.vulnerabilityType = 'edge_case';
      else if (rawType.includes('consequence')) parsed.objection.vulnerabilityType = 'unintended_consequence';
      else if (rawType.includes('ethic') || rawType.includes('moral')) parsed.objection.vulnerabilityType = 'ethical_blindspot';
      else if (rawType.includes('feasib') || rawType.includes('practical')) parsed.objection.vulnerabilityType = 'practical_feasibility';
      else parsed.objection.vulnerabilityType = 'unexamined_assumption';

      // Sanitize severity
      const rawSev = String(parsed.objection.severity || '').toLowerCase();
      if (rawSev.includes('critical')) parsed.objection.severity = 'critical';
      else if (rawSev.includes('mild')) parsed.objection.severity = 'mild';
      else parsed.objection.severity = 'moderate';
    }

    res.json(parsed);
  } catch (err: unknown) {
    console.error('Error evaluating and objecting:', err);
    res.status(500).json({ error: (err as Error).message || 'Failed to evaluate response' });
  }
});

// 3. Proposer Refines Response Against Objection
app.post('/api/dialectic/refine-response', async (req: Request, res: Response) => {
  try {
    const { question, previousResponse, objection, roundsHistory = [] } = req.body;

    if (!question || !previousResponse || !objection) {
      res.status(400).json({ error: 'Question, previousResponse, and objection are required' });
      return;
    }

    const systemInstruction = `You are The Lead Thesis Proposer responding to an adversarial objection.
The Adversary has raised Objection #${objection.objectionNumber}: "${objection.title}".
Critique: "${objection.critique}"
Challenge: "${objection.challengeQuestion}"

YOUR TASK:
1. Concession: Honestly and gracefully concede any legitimate points or edge-cases the adversary highlighted. Good philosophers and thinkers do not double-down blindly; they absorb valid critique.
2. Counter-Defense: Explain why your overarching thesis or refined framework survives and how you reconcile the objection (e.g., qualifying scopes, introducing nuance, solving trade-offs, citing principles).
3. Refined Response: Produce an upgraded, comprehensive version of your answer that directly integrates the defense, rectifies the vulnerability, and answers the original inquiry with superior depth.
4. Key Pillars: 3-4 upgraded core pillars.
5. Confidence Score: Updated confidence score (1-100).`;

    const prompt = `QUESTION: "${question}"

YOUR PREVIOUS ANSWER:
"${previousResponse}"

ADVERSARY'S OBJECTION #${objection.objectionNumber}:
Title: ${objection.title}
Target Aspect: ${objection.targetAspect || 'General argument'}
Critique: ${objection.critique}
Challenge: ${objection.challengeQuestion}

Provide your concession, counter-defense, and the complete refined response.`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concession: {
              type: Type.STRING,
              description: 'Clear statement of what valid weakness or limitation is conceded.',
            },
            counterDefense: {
              type: Type.STRING,
              description: 'The core argument or evidence defending and re-grounding the thesis.',
            },
            refinedResponse: {
              type: Type.STRING,
              description: 'The complete, polished, and fortified answer reflecting the upgrades.',
            },
            keyPillars: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 upgraded pillars supporting the refined answer.',
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: 'Updated confidence score (65-98).',
            },
          },
          required: ['concession', 'counterDefense', 'refinedResponse', 'keyPillars', 'confidenceScore'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: unknown) {
    console.error('Error refining response:', err);
    res.status(500).json({ error: (err as Error).message || 'Failed to refine response' });
  }
});

// 4. Final Dialectic Synthesis
app.post('/api/dialectic/synthesize', async (req: Request, res: Response) => {
  try {
    const { question, rounds = [], finishReason = 'max_objections_reached' } = req.body;

    if (!question || rounds.length === 0) {
      res.status(400).json({ error: 'Question and rounds are required' });
      return;
    }

    const objectionCount = rounds.filter((r: any) => r.objection).length;
    const initialAnswer = rounds[0]?.proposerResponse?.content || '';
    const lastRound = rounds[rounds.length - 1];
    const finalAnswer = lastRound?.proposerResponse?.content || initialAnswer;

    const objectionsSummary = rounds
      .filter((r: any) => r.objection)
      .map((r: any, idx: number) => `Objection ${idx + 1}: [${r.objection.title}] - ${r.objection.critique}`)
      .join('\n');

    const systemInstruction = `You are a neutral Master Synthesizer and Philosopher of Science.
You are summarizing an intense dialectic debate on the question: "${question}".
The debate ended because: ${finishReason === 'satisfactory' ? 'The automated critic found the argument satisfactory' : 'The maximum limit of 5 objections was reached'}.
Total objections withstood: ${objectionCount}.

Provide an objective, illuminating synthesis:
1. Executive Summary: High-level overview of the thesis, antithesis, and resultant synthesis.
2. Core Consensus: What truths or principles emerged hardened and agreed upon through the debate.
3. Unresolved Tensions: Nuances, paradoxes, or residual trade-offs that still hold legitimate debate.
4. Evolution Narrative: A concise narrative of how the answer transformed from its naive starting point to its final hardened form.
5. Fortified Answer: The definitive, gold-standard answer to the user's question, capturing all nuance, boundaries, and rebuttals.`;

    const prompt = `QUESTION: "${question}"
TOTAL OBJECTIONS: ${objectionCount}
FINISH REASON: ${finishReason}

INITIAL ANSWER (Round 0):
"${initialAnswer}"

OBJECTIONS RAISED:
${objectionsSummary || 'None (Resolved immediately)'}

LATEST/FINAL ANSWER:
"${finalAnswer}"

Synthesize this dialectic journey into a definitive final verdict.`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            coreConsensus: { type: Type.STRING },
            unresolvedTensions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            evolutionNarrative: { type: Type.STRING },
            fortifiedAnswer: { type: Type.STRING },
          },
          required: ['executiveSummary', 'coreConsensus', 'unresolvedTensions', 'evolutionNarrative', 'fortifiedAnswer'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.totalObjectionsFaced = objectionCount;
    parsed.outcome = finishReason === 'satisfactory' ? 'satisfaction_reached' : 'max_objections_exhausted';

    res.json(parsed);
  } catch (err: unknown) {
    console.error('Error creating synthesis:', err);
    res.status(500).json({ error: (err as Error).message || 'Failed to generate synthesis' });
  }
});

// Vite middleware or static serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
