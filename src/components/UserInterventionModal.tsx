import React, { useState } from 'react';
import { X, Send, Sparkles, MessageSquare } from 'lucide-react';

interface UserInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (critique: string) => void;
  currentRoundNumber: number;
}

export const UserInterventionModal: React.FC<UserInterventionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentRoundNumber,
}) => {
  const [critique, setCritique] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!critique.trim()) return;
    onSubmit(critique.trim());
    setCritique('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Inject Human Challenge or Direction
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Steer the dialectic! Inject your own counter-argument, overlooked edge case, or
          philosophical challenge to be addressed in the next fortification round (Round {currentRoundNumber + 1}).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows={4}
            value={critique}
            onChange={(e) => setCritique(e.target.value)}
            placeholder="e.g. You haven't considered what happens in developing nations where capital infrastructure is lacking, or the psychological impact on workers..."
            className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            autoFocus
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!critique.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Inject into Crucible</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
