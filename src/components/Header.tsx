import React from 'react';
import { Sparkles, Swords, RefreshCw, GitCompare, Share2, Play, Pause, AlertTriangle } from 'lucide-react';
import { DialecticSession } from '../types';

interface HeaderProps {
  session: DialecticSession | null;
  onReset: () => void;
  onOpenCompare: () => void;
  onOpenExport: () => void;
  onToggleAutoPlay: () => void;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onReset,
  onOpenCompare,
  onOpenExport,
  onToggleAutoPlay,
  hasGeminiKey,
}) => {
  const objectionCount = session?.rounds.filter((r) => r.objection).length || 0;
  const isFinished = session?.isFinished || false;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-zinc-950">
              <Swords className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                Dialectic<span className="text-amber-400">AI</span>
              </h1>
              <span className="hidden rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300 sm:inline-block">
                Autonomous Socratic Crucible
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Automated Objection & Fortification Engine (Max 5 Objections)
            </p>
          </div>
        </div>

        {/* Action Controls & Session Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {session && (
            <>
              {/* Objection Counter Pill */}
              <div className="hidden items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 md:flex">
                <span className="text-xs text-zinc-400">Objections:</span>
                <span
                  className={`text-xs font-bold ${
                    objectionCount >= 5
                      ? 'text-rose-400'
                      : objectionCount > 0
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {objectionCount} / 5
                </span>
              </div>

              {/* AutoPlay Toggle */}
              {!isFinished && (
                <button
                  onClick={onToggleAutoPlay}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    session.autoPlay
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                      : 'border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                  }`}
                  title={session.autoPlay ? 'Pause autonomous loop' : 'Resume autonomous loop'}
                >
                  {session.autoPlay ? (
                    <>
                      <Pause className="h-3.5 w-3.5 fill-current" />
                      <span className="hidden sm:inline">Auto-Advancing</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span className="hidden sm:inline">Auto-Play</span>
                    </>
                  )}
                </button>
              )}

              {/* Compare Button */}
              {session.rounds.length > 1 && (
                <button
                  onClick={onOpenCompare}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  title="Compare Initial vs Fortified Answer"
                >
                  <GitCompare className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Compare</span>
                </button>
              )}

              {/* Export Transcript */}
              <button
                onClick={onOpenExport}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                title="Export Debate Transcript"
              >
                <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* Reset / New Debate */}
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-rose-900/50 hover:bg-rose-950/30 hover:text-rose-300"
                title="Start a new question"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Question</span>
              </button>
            </>
          )}

          {!hasGeminiKey && (
            <div className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Configuring Key</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
