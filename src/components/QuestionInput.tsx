import React, { useState } from 'react';
import { Send, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { SAMPLE_QUESTIONS } from '../constants';
import { PersonaSelector } from './PersonaSelector';

interface QuestionInputProps {
  onSubmit: (question: string, personaId: string) => void;
  isLoading: boolean;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({ onSubmit, isLoading }) => {
  const [question, setQuestion] = useState('');
  const [personaId, setPersonaId] = useState('balanced');
  const [activeTab, setActiveTab] = useState<'custom' | 'samples'>('samples');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onSubmit(question.trim(), personaId);
  };

  const handleSelectSample = (samplePrompt: string) => {
    setQuestion(samplePrompt);
    onSubmit(samplePrompt, personaId);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-6 pb-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300 shadow-sm">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <span>Iterative Dialectic: AI Response vs Automated Adversary</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Test Any Premise Until It Shatters or Solidifies
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Ask any question. The Proposer AI gives an answer, then an autonomous adversary
          probes for vulnerabilities and challenges it with sharp objections. The cycle continues
          until reaching a <strong className="text-emerald-400">satisfactory consensus</strong> or exhausting <strong className="text-amber-400">5 objections</strong>.
        </p>
      </div>

      {/* Main Input Form */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="question-input" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Your Inquiry or Thesis
              </label>
              <span className="text-xs text-zinc-500">
                Open questions, philosophical dilemmas, policy, or technical debates
              </span>
            </div>

            <div className="relative">
              <textarea
                id="question-input"
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Is universal basic income economically sustainable at national scale? Should space colonization take priority over deep ocean exploration?"
                className="w-full resize-none rounded-xl border border-zinc-700/80 bg-zinc-950/80 p-4 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Adversary Persona Selector */}
          <PersonaSelector
            selectedId={personaId}
            onSelect={setPersonaId}
            disabled={isLoading}
          />

          {/* Submit Action */}
          <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Capped at 5 rounds of automated counter-objections</span>
            </div>

            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                  <span>Initiating Dialectic...</span>
                </>
              ) : (
                <>
                  <span>Begin Socratic Debate</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Curated Sample Questions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Or Choose a Deeply Contested Dilemma</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_QUESTIONS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectSample(sample.prompt)}
              className="group flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3.5 text-left transition-all hover:border-zinc-700 hover:bg-zinc-800/80 hover:shadow-md"
            >
              <div>
                <span className="inline-block rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400 group-hover:text-amber-400">
                  {sample.category}
                </span>
                <p className="mt-2 text-xs font-medium text-zinc-200 group-hover:text-white line-clamp-2">
                  {sample.title}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-amber-500/80 group-hover:text-amber-400">
                <span>Engage this debate</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
