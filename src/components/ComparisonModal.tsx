import React from 'react';
import { X, ArrowRight, ShieldAlert, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { DialecticRound } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  rounds: DialecticRound[];
  question: string;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  rounds,
  question,
}) => {
  if (!isOpen || rounds.length < 2) return null;

  const initialRound = rounds[0];
  const finalRound = rounds[rounds.length - 1];
  const objections = rounds.filter((r) => r.objection);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Dialectic Evolution: Initial vs Fortified Thesis
              </h3>
            </div>
            <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
              Inquiry: "{question}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Side-by-side comparison */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Objections Weathered Summary */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Weathered In This Debate ({objections.length} Objections):
            </h4>
            <div className="flex flex-wrap gap-2">
              {objections.map((r, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300"
                >
                  <span className="font-semibold text-rose-400">#{r.objection?.objectionNumber}:</span>{' '}
                  {r.objection?.title}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Initial Answer (Round 0) */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-xs font-bold text-zinc-300">
                    R0
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Initial Thesis (Naive)
                  </span>
                </div>
                <span className="text-xs text-zinc-500">
                  Confidence: {initialRound.proposerResponse.confidenceScore || 70}%
                </span>
              </div>

              <div className="text-xs sm:text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
                {initialRound.proposerResponse.content}
              </div>

              {initialRound.proposerResponse.keyPillars && (
                <div className="border-t border-zinc-800 pt-3">
                  <div className="text-[11px] font-semibold text-zinc-400 mb-2">
                    Initial Pillars:
                  </div>
                  <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-1">
                    {initialRound.proposerResponse.keyPillars.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Fortified Answer (Final Round) */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-400">
                    R{finalRound.roundIndex}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Fortified Synthesis (Resilient)
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">
                  Confidence: {finalRound.proposerResponse.confidenceScore || 90}%
                </span>
              </div>

              {finalRound.proposerResponse.concession && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200">
                  <span className="font-bold">Key Concession:</span>{' '}
                  {finalRound.proposerResponse.concession}
                </div>
              )}

              <div className="text-xs sm:text-sm leading-relaxed text-zinc-200 whitespace-pre-line">
                {finalRound.proposerResponse.content}
              </div>

              {finalRound.proposerResponse.keyPillars && (
                <div className="border-t border-emerald-500/20 pt-3">
                  <div className="text-[11px] font-semibold text-emerald-400 mb-2">
                    Hardened Pillars:
                  </div>
                  <ul className="list-disc pl-4 text-xs text-zinc-300 space-y-1">
                    {finalRound.proposerResponse.keyPillars.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end border-t border-zinc-800 px-6 py-4 bg-zinc-900/50">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
