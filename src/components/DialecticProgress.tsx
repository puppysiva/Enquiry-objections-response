import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  SkipForward,
  MessageSquarePlus,
  Shield,
  Swords,
  Sparkles,
} from 'lucide-react';
import { DialecticSession } from '../types';

interface DialecticProgressProps {
  session: DialecticSession;
  onStepNext: () => void;
  onToggleAutoPlay: () => void;
  onOpenIntervention: () => void;
  isProcessing: boolean;
}

export const DialecticProgress: React.FC<DialecticProgressProps> = ({
  session,
  onStepNext,
  onToggleAutoPlay,
  onOpenIntervention,
  isProcessing,
}) => {
  const objectionCount = session.rounds.filter((r) => r.objection).length;
  const isFinished = session.isFinished;

  // Status message
  const getStatusDisplay = () => {
    if (session.status === 'answering') {
      return {
        label: 'Proposer Agent',
        desc: 'Formulating initial foundational thesis...',
        icon: <Shield className="h-4 w-4 text-emerald-400 animate-pulse" />,
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
      };
    }
    if (session.status === 'objecting') {
      return {
        label: `Adversary Agent (Objection #${objectionCount + 1})`,
        desc: 'Scrutinizing thesis for logical gaps, edge cases, and assumptions...',
        icon: <Swords className="h-4 w-4 text-rose-400 animate-pulse" />,
        color: 'text-rose-400',
        badgeBg: 'bg-rose-500/10 border-rose-500/30',
      };
    }
    if (session.status === 'refining') {
      return {
        label: 'Proposer Agent (Fortification)',
        desc: `Absorbing Objection #${objectionCount}, making concessions & fortifying defense...`,
        icon: <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />,
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 border-amber-500/30',
      };
    }
    if (session.status === 'synthesizing') {
      return {
        label: 'Master Synthesizer',
        desc: 'Forging definitive final consensus & dialectic evolution narrative...',
        icon: <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />,
        color: 'text-indigo-400',
        badgeBg: 'bg-indigo-500/10 border-indigo-500/30',
      };
    }
    if (isFinished) {
      if (session.finishReason === 'satisfactory') {
        return {
          label: 'Satisfactory Consensus Reached',
          desc: 'The adversary found the fortified response robust, nuanced, and unassailable.',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
          color: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
        };
      }
      return {
        label: 'Maximum 5 Objections Exhausted',
        desc: 'Completed all 5 adversarial rounds. Final dialectic synthesis established.',
        icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 border-amber-500/30',
      };
    }
    return {
      label: 'Dialectic Paused',
      desc: 'Ready for next turn or user intervention.',
      icon: <Pause className="h-4 w-4 text-zinc-400" />,
      color: 'text-zinc-400',
      badgeBg: 'bg-zinc-800 border-zinc-700',
    };
  };

  const status = getStatusDisplay();

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-xl sm:p-5">
      {/* Top row: Current question & Objection Meter */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              Active Question
            </span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 sm:text-base line-clamp-2">
            "{session.question}"
          </h3>
        </div>

        {/* 5-Objection Stepper */}
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-medium text-zinc-400">Objection Crucible:</span>
            <span className="font-bold text-amber-400">{objectionCount} / 5</span>
            <span className="text-zinc-500">(Max 5)</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((step) => {
              const hasObjection = step <= objectionCount;
              const isCurrent = step === objectionCount + 1 && !isFinished;
              return (
                <div key={step} className="flex items-center gap-1">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                      hasObjection
                        ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40'
                        : isCurrent
                        ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50 animate-pulse'
                        : 'bg-zinc-800/80 text-zinc-500'
                    }`}
                    title={
                      hasObjection
                        ? `Objection ${step} raised & weathered`
                        : isCurrent
                        ? `Awaiting Objection ${step}`
                        : `Objection Slot ${step}`
                    }
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`h-0.5 w-2 sm:w-3 ${
                        step < objectionCount
                          ? 'bg-rose-500/50'
                          : step === objectionCount
                          ? 'bg-amber-500/50'
                          : 'bg-zinc-800'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle row: Live Status Pill & Controls */}
      <div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-zinc-800/80 pt-3 sm:flex-row sm:items-center">
        {/* Status indicator */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${status.badgeBg}`}
          >
            {status.icon}
            <div>
              <div className={`text-xs font-semibold ${status.color}`}>
                {status.label}
              </div>
              <div className="text-[11px] text-zinc-400">{status.desc}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isFinished && (
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            {/* User Intervention */}
            <button
              onClick={onOpenIntervention}
              disabled={isProcessing}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
              title="Inject your own objection or perspective"
            >
              <MessageSquarePlus className="h-3.5 w-3.5 text-amber-400" />
              <span>Intervene</span>
            </button>

            {/* Step Next */}
            <button
              onClick={onStepNext}
              disabled={isProcessing}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              title="Execute next step in the dialectic"
            >
              <SkipForward className="h-3.5 w-3.5" />
              <span>Step Turn</span>
            </button>

            {/* Auto-Play Toggle */}
            <button
              onClick={onToggleAutoPlay}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                session.autoPlay
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 hover:bg-amber-400'
                  : 'border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {session.autoPlay ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Auto-Run</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
