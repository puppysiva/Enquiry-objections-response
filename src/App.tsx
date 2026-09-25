import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Swords,
  Shield,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Play,
  Pause,
  SkipForward,
} from 'lucide-react';
import { DialecticSession, DialecticRound, FinalSynthesis } from './types';
import { Header } from './components/Header';
import { QuestionInput } from './components/QuestionInput';
import { DialecticProgress } from './components/DialecticProgress';
import { RoundCard } from './components/RoundCard';
import { FinalSynthesisView } from './components/FinalSynthesisView';
import { ComparisonModal } from './components/ComparisonModal';
import { UserInterventionModal } from './components/UserInterventionModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [session, setSession] = useState<DialecticSession | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isInterventionOpen, setIsInterventionOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [pendingUserCritique, setPendingUserCritique] = useState<string | null>(null);

  const roundsEndRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll when new rounds are added
  useEffect(() => {
    if (session?.rounds.length) {
      roundsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.rounds.length, session?.status]);

  // Handle autonomous step loop
  useEffect(() => {
    if (
      session &&
      session.autoPlay &&
      !session.isFinished &&
      !isProcessing &&
      session.status !== 'error' &&
      session.status !== 'paused'
    ) {
      autoPlayTimerRef.current = setTimeout(() => {
        executeNextDialecticStep();
      }, 1200);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [session, isProcessing]);

  // 1. Start Dialectic: Create initial response
  const handleStartDialectic = async (question: string, personaId: string) => {
    setIsProcessing(true);
    setErrorMessage(null);

    const initialSession: DialecticSession = {
      id: `session-${Date.now()}`,
      question,
      personaId,
      rounds: [],
      status: 'answering',
      finishReason: null,
      isFinished: false,
      autoPlay: true,
    };
    setSession(initialSession);

    try {
      const res = await fetch('/api/dialectic/initial-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate initial response');
      }

      const initialData = await res.json();

      const round0: DialecticRound = {
        roundIndex: 0,
        proposerResponse: {
          content: initialData.content,
          keyPillars: initialData.keyPillars,
          confidenceScore: initialData.confidenceScore || 75,
        },
        timestamp: Date.now(),
      };

      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          rounds: [round0],
          status: 'idle',
        };
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with AI model');
      setSession((prev) => (prev ? { ...prev, status: 'error' } : null));
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Core Dialectic Stepper: Evaluates or Refines turn-by-turn
  const executeNextDialecticStep = async () => {
    if (!session || isProcessing || session.isFinished) return;

    const currentRounds = session.rounds;
    if (currentRounds.length === 0) return;

    const lastRound = currentRounds[currentRounds.length - 1];
    const totalObjections = currentRounds.filter((r) => r.objection).length;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // CASE A: The last round has an answer, but has NOT been evaluated by the adversary yet
      if (!lastRound.objection && !lastRound.satisfaction) {
        setSession((prev) => (prev ? { ...prev, status: 'objecting' } : null));

        const res = await fetch('/api/dialectic/evaluate-and-object', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: session.question,
            currentResponse: lastRound.proposerResponse.content,
            roundsHistory: currentRounds,
            objectionCount: totalObjections,
            personaId: session.personaId,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Evaluation failed');
        }

        const evalData = await res.json();

        // Check if Satisfactory
        if (evalData.isSatisfactory) {
          // Trigger celebration confetti
          try {
            confetti({
              particleCount: 100,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#10b981', '#34d399', '#f59e0b', '#6366f1'],
            });
          } catch (_) {}

          // Update round with satisfaction
          const updatedRounds = [...currentRounds];
          updatedRounds[updatedRounds.length - 1] = {
            ...lastRound,
            satisfaction: {
              isSatisfactory: true,
              score: evalData.score || 9.0,
              reasoning: evalData.satisfactionReasoning || 'Argument is intellectually resilient.',
              strengthsRecognized: evalData.strengthsRecognized || [],
            },
          };

          setSession((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              rounds: updatedRounds,
              finishReason: 'satisfactory',
              isFinished: true,
              status: 'synthesizing',
            };
          });

          // Fetch final synthesis
          await fetchFinalSynthesis(session.question, updatedRounds, 'satisfactory');
          return;
        }

        // Objection was raised
        const objectionData = evalData.objection;
        const newObjectionCount = totalObjections + 1;

        const updatedRounds = [...currentRounds];
        updatedRounds[updatedRounds.length - 1] = {
          ...lastRound,
          objection: {
            objectionNumber: newObjectionCount,
            title: objectionData?.title || `Objection #${newObjectionCount}`,
            critique: objectionData?.critique || 'A critical vulnerability was identified in this thesis.',
            vulnerabilityType: objectionData?.vulnerabilityType || 'logical_fallacy',
            severity: objectionData?.severity || 'moderate',
            challengeQuestion: objectionData?.challengeQuestion || 'How do you defend against this critique?',
            targetAspect: objectionData?.targetAspect || '',
          },
        };

        // Check if we hit the 5 objections ceiling
        if (newObjectionCount >= 5) {
          setSession((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              rounds: updatedRounds,
              finishReason: 'max_objections_reached',
              isFinished: true,
              status: 'synthesizing',
            };
          });

          await fetchFinalSynthesis(session.question, updatedRounds, 'max_objections_reached');
          return;
        }

        // Under 5 objections: keep session going
        setSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            rounds: updatedRounds,
            status: 'idle',
          };
        });
      }
      // CASE B: The last round has an objection, so Proposer must refine and generate next round!
      else if (lastRound.objection && !session.isFinished) {
        setSession((prev) => (prev ? { ...prev, status: 'refining' } : null));

        const res = await fetch('/api/dialectic/refine-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: session.question,
            previousResponse: lastRound.proposerResponse.content,
            objection: lastRound.objection,
            roundsHistory: currentRounds,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Refinement failed');
        }

        const refineData = await res.json();

        const newRound: DialecticRound = {
          roundIndex: currentRounds.length,
          proposerResponse: {
            content: refineData.refinedResponse,
            concession: refineData.concession,
            counterDefense: refineData.counterDefense,
            keyPillars: refineData.keyPillars,
            confidenceScore: refineData.confidenceScore || 85,
          },
          userInjectedCritique: pendingUserCritique || undefined,
          timestamp: Date.now(),
        };

        setPendingUserCritique(null);

        setSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            rounds: [...prev.rounds, newRound],
            status: 'idle',
          };
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error occurred during dialectic iteration');
      setSession((prev) => (prev ? { ...prev, status: 'error' } : null));
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper: Request Final Synthesis from Server
  const fetchFinalSynthesis = async (
    question: string,
    rounds: DialecticRound[],
    finishReason: 'satisfactory' | 'max_objections_reached'
  ) => {
    try {
      const res = await fetch('/api/dialectic/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          rounds,
          finishReason,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate synthesis');
      }

      const synthesisData: FinalSynthesis = await res.json();

      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'completed',
          finalSynthesis: synthesisData,
        };
      });
    } catch (err) {
      console.error('Synthesis error:', err);
      // Fallback synthesis if server call fails
      const fallbackSynthesis: FinalSynthesis = {
        executiveSummary: `The dialectic exploration of "${question}" concluded after ${
          rounds.filter((r) => r.objection).length
        } rounds of adversarial stress-testing.`,
        coreConsensus:
          'Through iterative concessions and fortifications, the core thesis matured and established resilient conceptual boundaries.',
        unresolvedTensions: [
          'Inherent trade-offs between practical feasibility and theoretical ideals.',
          'Context-specific dependencies that require empirical verification.',
        ],
        evolutionNarrative:
          'The thesis progressed from a broad, vulnerable initial hypothesis to a fortified position accommodating key counter-arguments.',
        fortifiedAnswer:
          rounds[rounds.length - 1]?.proposerResponse?.content || 'Thesis fortified.',
        totalObjectionsFaced: rounds.filter((r) => r.objection).length,
        outcome: finishReason === 'satisfactory' ? 'satisfaction_reached' : 'max_objections_exhausted',
      };

      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'completed',
          finalSynthesis: fallbackSynthesis,
        };
      });
    }
  };

  // User Injected Intervention
  const handleUserIntervention = (critique: string) => {
    setPendingUserCritique(critique);
    // If paused, we can automatically trigger next step
    if (!session?.autoPlay) {
      executeNextDialecticStep();
    }
  };

  const handleToggleAutoPlay = () => {
    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        autoPlay: !prev.autoPlay,
      };
    });
  };

  const handleReset = () => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    setSession(null);
    setErrorMessage(null);
    setPendingUserCritique(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Sticky Header */}
      <Header
        session={session}
        onReset={handleReset}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onToggleAutoPlay={handleToggleAutoPlay}
        hasGeminiKey={true}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => {
                setErrorMessage(null);
                executeNextDialecticStep();
              }}
              className="flex items-center gap-1 font-semibold text-red-400 hover:text-red-300 underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Retry Step</span>
            </button>
          </div>
        )}

        {/* View 1: Question Input Screen (Before starting) */}
        {!session ? (
          <QuestionInput
            onSubmit={handleStartDialectic}
            isLoading={isProcessing}
          />
        ) : (
          /* View 2: Active Dialectic Arena */
          <div className="space-y-6">
            {/* Progress & Stepper Bar */}
            <DialecticProgress
              session={session}
              onStepNext={executeNextDialecticStep}
              onToggleAutoPlay={handleToggleAutoPlay}
              onOpenIntervention={() => setIsInterventionOpen(true)}
              isProcessing={isProcessing}
            />

            {/* Rounds List */}
            <div className="space-y-6">
              {session.rounds.map((round, index) => (
                <RoundCard
                  key={index}
                  round={round}
                  isLatest={index === session.rounds.length - 1}
                  totalRounds={session.rounds.length}
                />
              ))}
            </div>

            {/* In-Flight Processing Spinner */}
            {isProcessing && (
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400 backdrop-blur-md">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                <span>
                  {session.status === 'objecting'
                    ? 'Automated Adversary is rigorously analyzing and probing for vulnerabilities...'
                    : session.status === 'refining'
                    ? 'Proposer Agent is absorbing objection, making concessions, and fortifying thesis...'
                    : session.status === 'synthesizing'
                    ? 'Forging final dialectic consensus and synthesis narrative...'
                    : 'Dialectic engine working...'}
                </span>
              </div>
            )}

            {/* Final Synthesis Hero Card (Shown when finished) */}
            {session.finalSynthesis && (
              <FinalSynthesisView
                synthesis={session.finalSynthesis}
                rounds={session.rounds}
                onOpenCompare={() => setIsCompareOpen(true)}
                onOpenExport={() => setIsExportOpen(true)}
                onRestart={handleReset}
              />
            )}

            <div ref={roundsEndRef} />
          </div>
        )}
      </main>

      {/* Comparison Modal */}
      {session && (
        <ComparisonModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          rounds={session.rounds}
          question={session.question}
        />
      )}

      {/* User Intervention Modal */}
      {session && (
        <UserInterventionModal
          isOpen={isInterventionOpen}
          onClose={() => setIsInterventionOpen(false)}
          onSubmit={handleUserIntervention}
          currentRoundNumber={session.rounds.length}
        />
      )}

      {/* Export Transcript Modal */}
      {session && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          session={session}
        />
      )}
    </div>
  );
}
