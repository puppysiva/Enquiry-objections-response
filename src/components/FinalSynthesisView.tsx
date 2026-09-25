import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  GitCompare,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { FinalSynthesis, DialecticRound } from '../types';

interface FinalSynthesisViewProps {
  synthesis: FinalSynthesis;
  rounds: DialecticRound[];
  onOpenCompare: () => void;
  onOpenExport: () => void;
  onRestart: () => void;
}

export const FinalSynthesisView: React.FC<FinalSynthesisViewProps> = ({
  synthesis,
  rounds,
  onOpenCompare,
  onOpenExport,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyFortified = () => {
    navigator.clipboard.writeText(synthesis.fortifiedAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSatisfactory = synthesis.outcome === 'satisfaction_reached';

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 p-6 shadow-2xl backdrop-blur-xl sm:p-8 space-y-6">
      {/* Hero Badge Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${
              isSatisfactory
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 shadow-emerald-500/20'
                : 'bg-gradient-to-tr from-amber-500 to-rose-400 text-zinc-950 shadow-amber-500/20'
            }`}
          >
            {isSatisfactory ? (
              <Trophy className="h-6 w-6" />
            ) : (
              <ShieldCheck className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${
                  isSatisfactory
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                }`}
              >
                {isSatisfactory
                  ? 'Consensus Reached: Satisfactory Standard'
                  : 'Dialectic Limit: 5 Objections Exhausted'}
              </span>
            </div>
            <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
              Definitive Fortified Synthesis
            </h3>
            <p className="text-xs text-zinc-400">
              Weathered {synthesis.totalObjectionsFaced} adversarial objection
              {synthesis.totalObjectionsFaced === 1 ? '' : 's'} across {rounds.length} deliberation rounds.
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          {rounds.length > 1 && (
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              <GitCompare className="h-4 w-4 text-indigo-400" />
              <span>Initial vs Fortified</span>
            </button>
          )}

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            <Share2 className="h-4 w-4 text-emerald-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Fortified Final Answer */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>Final Fortified Answer (Forged Through Debate)</span>
          </div>
          <button
            onClick={handleCopyFortified}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Answer</span>
              </>
            )}
          </button>
        </div>

        <div className="text-sm sm:text-base leading-relaxed text-zinc-100 whitespace-pre-line font-serif sm:font-sans">
          {synthesis.fortifiedAnswer}
        </div>
      </div>

      {/* Executive Summary & Evolution Narrative */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Executive Synthesis
          </h4>
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
            {synthesis.executiveSummary}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Intellectual Evolution
          </h4>
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
            {synthesis.evolutionNarrative}
          </p>
        </div>
      </div>

      {/* Core Consensus & Residual Tensions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Core Consensus */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Hardened Core Consensus
            </h4>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
            {synthesis.coreConsensus}
          </p>
        </div>

        {/* Residual Tensions */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Residual Nuances & Open Tensions
            </h4>
          </div>
          {synthesis.unresolvedTensions && synthesis.unresolvedTensions.length > 0 ? (
            <ul className="list-disc pl-5 text-xs sm:text-sm text-zinc-300 space-y-1.5">
              {synthesis.unresolvedTensions.map((tension, idx) => (
                <li key={idx}>{tension}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-400">All primary tensions were reconciled.</p>
          )}
        </div>
      </div>

      {/* Start New Inquiries */}
      <div className="pt-2 text-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all"
        >
          <span>Examine Another Inquiry</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
