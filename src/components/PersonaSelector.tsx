import React from 'react';
import { Scale, Microscope, Flame, Wrench, HeartHandshake, Check } from 'lucide-react';
import { CRITIC_PERSONAS } from '../constants';
import { CriticPersona } from '../types';

interface PersonaSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Scale: <Scale className="h-4 w-4" />,
  Microscope: <Microscope className="h-4 w-4" />,
  Flame: <Flame className="h-4 w-4" />,
  Wrench: <Wrench className="h-4 w-4" />,
  HeartHandshake: <HeartHandshake className="h-4 w-4" />,
};

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedId,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Adversarial Critic Persona
        </label>
        <span className="text-[11px] text-zinc-500">Who stress-tests the AI response</span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {CRITIC_PERSONAS.map((persona) => {
          const isSelected = persona.id === selectedId;
          return (
            <button
              key={persona.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(persona.id)}
              className={`relative flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? 'border-amber-500/60 bg-gradient-to-b from-amber-500/10 to-zinc-900 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {ICON_MAP[persona.icon] || <Scale className="h-4 w-4" />}
                  </div>
                  {isSelected && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-zinc-950">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <h4 className="mt-2 text-xs font-semibold text-zinc-200">
                  {persona.name}
                </h4>
                <p className="text-[11px] font-medium text-amber-400/90">{persona.role}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-400 line-clamp-2">
                  {persona.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
