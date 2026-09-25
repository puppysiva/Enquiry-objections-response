import React, { useState } from 'react';
import {
  Shield,
  Swords,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  UserCheck,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { DialecticRound } from '../types';
import { VULNERABILITY_CONFIG } from '../constants';

interface RoundCardProps {
  round: DialecticRound;
  isLatest: boolean;
  totalRounds: number;
}

export const RoundCard: React.FC<RoundCardProps> = ({ round, isLatest }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isInitialRound = round.roundIndex === 0;

  const objection = round.objection;
  const satisfaction = round.satisfaction;
  const vulnConfig = objection
    ? VULNERABILITY_CONFIG[objection.vulnerabilityType] || VULNERABILITY_CONFIG.unexamined_assumption
    : null;

  return (
    <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-lg backdrop-blur-md transition-all hover:border-zinc-700/80">
      {/* Round Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex cursor-pointer items-center justify-between border-b border-zinc-800/60 px-4 py-3 sm:px-6"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
              isInitialRound
                ? 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/40'
                : 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
            }`}
          >
            R{round.roundIndex}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">
              {isInitialRound
                ? 'Round 0: Initial Thesis Presentation'
                : `Round ${round.roundIndex}: Fortified Defense & Critique`}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              {objection ? (
                <span className="flex items-center gap-1 text-rose-400">
                  <Flame className="h-3 w-3" />
                  Objection #{objection.objectionNumber}: {objection.title}
                </span>
              ) : satisfaction ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Satisfactory Consensus Reached (Score {satisfaction.score}/10)
                </span>
              ) : (
                <span>Awaiting adversarial evaluation...</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLatest && (
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
              Latest Turn
            </span>
          )}
          <button
            type="button"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Round Body Content */}
      {isExpanded && (
        <div className="space-y-5 p-4 sm:p-6">
          {/* User Injected Intervention (if applicable) */}
          {round.userInjectedCritique && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs text-cyan-200">
              <div className="flex items-center gap-1.5 font-semibold text-cyan-300 mb-1">
                <UserCheck className="h-3.5 w-3.5" />
                <span>User Injected Challenge & Direction</span>
              </div>
              <p>"{round.userInjectedCritique}"</p>
            </div>
          )}

          {/* 1. Proposer Response Section */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-500/10">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
                  <Shield className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {isInitialRound ? 'Proposer Initial Thesis' : 'Proposer Fortified Synthesis'}
                </span>
              </div>

              {round.proposerResponse.confidenceScore && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span>Confidence:</span>
                  <span className="font-semibold text-emerald-300">
                    {round.proposerResponse.confidenceScore}%
                  </span>
                </div>
              )}
            </div>

            {/* If Round > 0: Concession & Counter-defense highlight */}
            {!isInitialRound && round.proposerResponse.concession && (
              <div className="my-3 space-y-2 rounded-lg border border-amber-500/20 bg-zinc-900/80 p-3 text-xs">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                    Concession
                  </span>
                  <p className="text-zinc-300 leading-relaxed">
                    {round.proposerResponse.concession}
                  </p>
                </div>
                {round.proposerResponse.counterDefense && (
                  <div className="flex items-start gap-2 pt-1 border-t border-zinc-800">
                    <span className="mt-0.5 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      Fortification
                    </span>
                    <p className="text-zinc-300 leading-relaxed">
                      {round.proposerResponse.counterDefense}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Main Response Text */}
            <div className="mt-3 text-sm leading-relaxed text-zinc-200 whitespace-pre-line">
              {round.proposerResponse.content}
            </div>

            {/* Key analytical pillars */}
            {round.proposerResponse.keyPillars && round.proposerResponse.keyPillars.length > 0 && (
              <div className="mt-4 pt-3 border-t border-emerald-500/10">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Key Pillars & Defenses:
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {round.proposerResponse.keyPillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-lg bg-zinc-900/60 p-2 text-xs text-zinc-300 border border-zinc-800/80"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
                        {idx + 1}
                      </span>
                      <span>{pillar}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Adversary Section: Objection OR Satisfaction */}
          {objection && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-500/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/20 text-rose-400">
                    <Swords className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Adversary Objection #{objection.objectionNumber} of 5
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {vulnConfig && (
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${vulnConfig.bg} ${vulnConfig.text} ${vulnConfig.border}`}
                    >
                      {vulnConfig.label}
                    </span>
                  )}
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      objection.severity === 'critical'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : objection.severity === 'moderate'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {objection.severity} Severity
                  </span>
                </div>
              </div>

              {/* Title */}
              <h5 className="mt-3 text-sm font-bold text-rose-300">
                {objection.title}
              </h5>

              {/* Target Aspect */}
              {objection.targetAspect && (
                <div className="mt-1 text-xs text-zinc-400 italic">
                  Target Premise: "{objection.targetAspect}"
                </div>
              )}

              {/* Detailed Critique */}
              <p className="mt-2 text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
                {objection.critique}
              </p>

              {/* Challenge Question */}
              <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-1">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>The Adversary's Gauntlet Question:</span>
                </div>
                <p className="text-xs text-zinc-200 font-medium">
                  {objection.challengeQuestion}
                </p>
              </div>
            </div>
          )}

          {/* Satisfaction Evaluation (if consensus reached this round) */}
          {satisfaction && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 sm:p-5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">
                    Adversary Concedes: Satisfactory Consensus Reached
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  Robustness: {satisfaction.score} / 10
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-zinc-200">
                {satisfaction.reasoning}
              </p>

              {satisfaction.strengthsRecognized?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-emerald-500/20">
                  <div className="text-xs font-semibold text-emerald-400 mb-1.5">
                    Recognized Unassailable Qualities:
                  </div>
                  <ul className="list-disc pl-5 text-xs text-zinc-300 space-y-1">
                    {satisfaction.strengthsRecognized.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
