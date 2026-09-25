import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';
import { DialecticSession } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: DialecticSession;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, session }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# Dialectic AI Debate Transcript\n\n`;
    md += `**Question / Inquiry:** "${session.question}"\n\n`;
    md += `**Adversary Persona:** ${session.personaId}\n`;
    md += `**Status:** ${session.isFinished ? 'Concluded' : 'In Progress'}\n`;
    if (session.finishReason) {
      md += `**Conclusion Reason:** ${session.finishReason}\n`;
    }
    md += `**Total Rounds:** ${session.rounds.length}\n\n`;
    md += `---\n\n`;

    session.rounds.forEach((round) => {
      md += `## Round ${round.roundIndex}: ${
        round.roundIndex === 0 ? 'Initial Thesis' : 'Fortified Thesis'
      }\n\n`;

      if (round.userInjectedCritique) {
        md += `> **User Injected Challenge:** ${round.userInjectedCritique}\n\n`;
      }

      if (round.proposerResponse.concession) {
        md += `**Concession Acknowledged:** ${round.proposerResponse.concession}\n\n`;
      }
      if (round.proposerResponse.counterDefense) {
        md += `**Fortification Defense:** ${round.proposerResponse.counterDefense}\n\n`;
      }

      md += `### Proposer Answer:\n${round.proposerResponse.content}\n\n`;

      if (round.proposerResponse.keyPillars?.length) {
        md += `**Key Analytical Pillars:**\n`;
        round.proposerResponse.keyPillars.forEach((p) => {
          md += `- ${p}\n`;
        });
        md += `\n`;
      }

      if (round.objection) {
        md += `### Adversary Objection #${round.objection.objectionNumber}: ${round.objection.title}\n`;
        md += `**Vulnerability Type:** ${round.objection.vulnerabilityType} (${round.objection.severity})\n`;
        if (round.objection.targetAspect) {
          md += `**Target Premise:** "${round.objection.targetAspect}"\n`;
        }
        md += `\n${round.objection.critique}\n\n`;
        md += `**Challenge Question:** *${round.objection.challengeQuestion}*\n\n`;
      }

      if (round.satisfaction) {
        md += `### Satisfactory Resolution Achieved (Score: ${round.satisfaction.score}/10)\n`;
        md += `${round.satisfaction.reasoning}\n\n`;
      }

      md += `---\n\n`;
    });

    if (session.finalSynthesis) {
      md += `## Final Fortified Synthesis\n\n`;
      md += `### Fortified Answer:\n${session.finalSynthesis.fortifiedAnswer}\n\n`;
      md += `### Executive Summary:\n${session.finalSynthesis.executiveSummary}\n\n`;
      md += `### Hardened Core Consensus:\n${session.finalSynthesis.coreConsensus}\n\n`;
      if (session.finalSynthesis.unresolvedTensions?.length) {
        md += `### Residual Tensions:\n`;
        session.finalSynthesis.unresolvedTensions.forEach((t) => {
          md += `- ${t}\n`;
        });
        md += `\n`;
      }
      md += `### Evolution Narrative:\n${session.finalSynthesis.evolutionNarrative}\n\n`;
    }

    return md;
  };

  const markdownText = generateMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dialectic-debate-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(session, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dialectic-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Export Dialectic Transcript
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          <pre className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap">
            {markdownText}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-6 py-4 bg-zinc-900/50">
          <div className="text-xs text-zinc-400">
            {session.rounds.length} rounds • {session.rounds.filter((r) => r.objection).length} objections
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownloadMd}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .md</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>JSON Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
