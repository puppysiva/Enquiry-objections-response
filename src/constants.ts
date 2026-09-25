import { CriticPersona, VulnerabilityType } from './types';

export const CRITIC_PERSONAS: CriticPersona[] = [
  {
    id: 'balanced',
    name: 'The Cross-Examiner',
    role: 'Balanced & Objective',
    description: 'Systematically assesses logic, evidence, and nuances, conceding when proven wrong.',
    icon: 'Scale',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'skeptic',
    name: 'The Empirical Skeptic',
    role: 'Falsifiability & Data',
    description: 'Demands statistical rigor, empirical verification, and questions unproven assumptions.',
    icon: 'Microscope',
    color: 'from-cyan-600 to-teal-600',
  },
  {
    id: 'devil_advocate',
    name: "Devil's Advocate",
    role: 'Contrarian Stress-Tester',
    description: 'Relentlessly explores opposing viewpoints, worst-case consequences, and hidden costs.',
    icon: 'Flame',
    color: 'from-amber-600 to-rose-600',
  },
  {
    id: 'pragmatist',
    name: 'The Pragmatic Engineer',
    role: 'Real-World Bottlenecks',
    description: 'Exposes implementation frictions, resource constraints, human irrationality, and edge cases.',
    icon: 'Wrench',
    color: 'from-emerald-600 to-green-600',
  },
  {
    id: 'ethicist',
    name: 'The Socratic Ethicist',
    role: 'Values, Harm & Equity',
    description: 'Interrogates moral hazards, distributional fairness, and systemic externalities.',
    icon: 'HeartHandshake',
    color: 'from-purple-600 to-pink-600',
  },
];

export const SAMPLE_QUESTIONS = [
  {
    category: 'Philosophy & AI',
    title: 'Can Artificial General Intelligence possess genuine moral agency?',
    prompt: 'Can an Artificial General Intelligence ever possess genuine moral agency and culpability, or are moral obligations fundamentally tied to biological consciousness and sentience?',
  },
  {
    category: 'Economics & Society',
    title: 'Is Universal Basic Income economically sustainable at national scale?',
    prompt: 'Is a non-means-tested Universal Basic Income (UBI) economically sustainable and socially beneficial at a national scale, or does it inevitably trigger catastrophic inflation and labor disincentives?',
  },
  {
    category: 'Technology & Work',
    title: 'Does permanent remote work diminish long-term organizational innovation?',
    prompt: 'Does widespread, permanent remote work inherently degrade serendipitous innovation, mentorship, and creative breakthrough in knowledge organizations?',
  },
  {
    category: 'Science & Energy',
    title: 'Can nuclear fission and fusion fully replace fossil fuels in time?',
    prompt: 'Can nuclear power (both advanced fission and emerging fusion) realistically shoulder the global baseload transition away from fossil fuels faster and more reliably than renewables plus battery storage?',
  },
  {
    category: 'Ethics & Governance',
    title: 'Should human germline genetic editing be globally prohibited?',
    prompt: 'Should human germline genome editing for enhancement be universally outlawed under international treaties, or should regulated therapeutic enhancement be permitted?',
  },
  {
    category: 'Space & Exploration',
    title: 'Should space colonization take priority over deep ocean stewardship?',
    prompt: 'Should civilization prioritize multi-planetary colonization to guard against existential risk, or focus resources on preserving Earth and unlocking deep-ocean ecosystems first?',
  },
];

export const VULNERABILITY_CONFIG: Record<
  VulnerabilityType,
  { label: string; bg: string; text: string; border: string }
> = {
  logical_fallacy: {
    label: 'Logical Fallacy',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
  empirical_evidence: {
    label: 'Empirical Gap',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  unexamined_assumption: {
    label: 'Unexamined Premise',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  edge_case: {
    label: 'Critical Edge-Case',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  unintended_consequence: {
    label: 'Unintended Consequence',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
  },
  ethical_blindspot: {
    label: 'Ethical Blindspot',
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
  },
  practical_feasibility: {
    label: 'Feasibility Roadblock',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
};
