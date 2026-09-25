export type VulnerabilityType =
  | 'logical_fallacy'
  | 'empirical_evidence'
  | 'unexamined_assumption'
  | 'edge_case'
  | 'unintended_consequence'
  | 'ethical_blindspot'
  | 'practical_feasibility';

export type ObjectionSeverity = 'mild' | 'moderate' | 'critical';

export interface ObjectionData {
  objectionNumber: number;
  title: string;
  critique: string;
  vulnerabilityType: VulnerabilityType;
  severity: ObjectionSeverity;
  challengeQuestion: string;
  targetAspect: string;
}

export interface SatisfactionEvaluation {
  isSatisfactory: boolean;
  score: number; // 1-10
  reasoning: string;
  strengthsRecognized: string[];
  remainingFlaws?: string[];
}

export interface ProposerResponseData {
  content: string;
  concession?: string;
  counterDefense?: string;
  confidenceScore?: number;
  keyPillars?: string[];
}

export interface DialecticRound {
  roundIndex: number; // 0 = initial response, 1..5 = objection rounds
  proposerResponse: ProposerResponseData;
  objection?: ObjectionData;
  satisfaction?: SatisfactionEvaluation;
  userInjectedCritique?: string;
  timestamp: number;
}

export interface CriticPersona {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  color: string;
}

export interface FinalSynthesis {
  executiveSummary: string;
  coreConsensus: string;
  unresolvedTensions: string[];
  evolutionNarrative: string;
  fortifiedAnswer: string;
  totalObjectionsFaced: number;
  outcome: 'satisfaction_reached' | 'max_objections_exhausted';
}

export interface DialecticSession {
  id: string;
  question: string;
  personaId: string;
  rounds: DialecticRound[];
  status: 'idle' | 'answering' | 'objecting' | 'refining' | 'synthesizing' | 'completed' | 'paused' | 'error';
  finishReason: 'satisfactory' | 'max_objections_reached' | 'stopped_by_user' | null;
  isFinished: boolean;
  finalSynthesis?: FinalSynthesis;
  autoPlay: boolean;
  errorMessage?: string;
}
