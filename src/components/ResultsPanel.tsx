import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  FileSearch,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { AnalysisResult } from "../types";

interface ResultsPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  onTrySampleAndAnalyze: () => void;
}

function getScoreTone(score: number) {
  if (score >= 80) {
    return {
      text: "text-emerald-700",
      bar: "bg-emerald-600",
      label: "Strong Match",
    };
  }
  if (score >= 65) {
    return {
      text: "text-blue-700",
      bar: "bg-blue-700",
      label: "Good Match",
    };
  }
  if (score >= 45) {
    return {
      text: "text-amber-700",
      bar: "bg-amber-600",
      label: "Moderate Match",
    };
  }
  return {
    text: "text-red-700",
    bar: "bg-red-600",
    label: "Low Match",
  };
}

function formatReportAsText(result: AnalysisResult): string {
  const lines: string[] = [
    "ATS LENS — RESUME ANALYSIS REPORT",
    "==================================",
    `Target Role: ${result.roleTitleDetected}`,
    `ATS Match Score: ${result.matchScore} / 100 (${result.scoreVerdict})`,
    "",
    "SUMMARY",
    result.candidateSummary,
    "",
    `MATCHED SKILLS FOUND (${result.matchedSkills.length})`,
    ...result.matchedSkills.map((m) => `- ${m.skill}: ${m.evidence}`),
    "",
    `MISSING SKILLS / KEYWORDS (${result.missingSkills.length})`,
    ...result.missingSkills.map(
      (m) => `- [${m.priority}] ${m.skill}: ${m.reason}`
    ),
    "",
    "5 SUGGESTIONS TO IMPROVE YOUR RESUME",
    ...result.suggestions.map(
      (s, i) => `${i + 1}. ${s.title}\n   ${s.action}`
    ),
  ];
  return lines.join("\n");
}

export function ResultsPanel({
  result,
  isAnalyzing,
  error,
  onTrySampleAndAnalyze,
}: ResultsPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleDownloadTxt = () => {
    if (!result) return;
    const content = formatReportAsText(result);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ats-resume-report.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(formatReportAsText(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (error) {
    return (
      <section
        aria-label="Analysis Error"
        className="bg-white border border-red-200 rounded-xl p-6"
      >
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Unable to complete ATS analysis
            </h2>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <p className="text-xs text-slate-500 mt-3">
              Verify your inputs or check your Gemini API configuration in
              Settings &gt; Secrets, then try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isAnalyzing) {
    return (
      <section
        aria-label="Analyzing Resume"
        className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6 animate-pulse"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2.5 flex-1">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-6 w-64 bg-slate-200 rounded" />
            <div className="h-4 w-full max-w-md bg-slate-100 rounded" />
          </div>
          <div className="h-14 w-28 bg-slate-200 rounded-lg shrink-0" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-100 pb-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-4 w-14 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section
        aria-label="Analysis Results Placeholder"
        className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-between gap-8"
      >
        <div>
          <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-5">
            <FileSearch className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            ATS Evaluation Report
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-lg leading-relaxed">
            Upload your PDF resume and paste a job description on the left to
            receive an objective recruiter-style breakdown before you submit
            your application.
          </p>

          <div className="mt-8 border-t border-slate-100 divide-y divide-slate-100">
            <div className="py-3.5 flex items-baseline gap-4">
              <span className="font-mono text-xs font-semibold text-slate-400 tabular-nums w-6 shrink-0">
                01
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Match Score out of 100
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Weighted by required skills, relevant tools, and project
                  alignment.
                </p>
              </div>
            </div>
            <div className="py-3.5 flex items-baseline gap-4">
              <span className="font-mono text-xs font-semibold text-slate-400 tabular-nums w-6 shrink-0">
                02
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Matched Skills Found
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified overlap between your resume and the job requirements.
                </p>
              </div>
            </div>
            <div className="py-3.5 flex items-baseline gap-4">
              <span className="font-mono text-xs font-semibold text-slate-400 tabular-nums w-6 shrink-0">
                03
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Missing Skills &amp; Keywords
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Required and preferred terms absent from your current draft.
                </p>
              </div>
            </div>
            <div className="py-3.5 flex items-baseline gap-4">
              <span className="font-mono text-xs font-semibold text-slate-400 tabular-nums w-6 shrink-0">
                04
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  5 Improvement Suggestions
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specific bullet-point, project, and keyword edits you can
                  apply immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs text-slate-500">
            Want to see a live report right away?
          </span>
          <button
            type="button"
            onClick={onTrySampleAndAnalyze}
            className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Load Sample &amp; Run Check
          </button>
        </div>
      </section>
    );
  }

  const tone = getScoreTone(result.matchScore);

  return (
    <section
      aria-label="ATS Evaluation Results"
      className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-7"
    >
      {/* 1. Score & Summary Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{result.roleTitleDetected || "Target Position"}</span>
              <span aria-hidden="true">·</span>
              <span className={`font-semibold ${tone.text}`}>
                {result.scoreVerdict || tone.label}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">
              ATS Compatibility Report
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {result.candidateSummary}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-medium text-slate-500">
              Match Score
            </div>
            <div className="flex items-baseline justify-end gap-1 mt-0.5">
              <span
                className={`font-mono text-4xl font-semibold tabular-nums tracking-tight ${tone.text}`}
              >
                {result.matchScore}
              </span>
              <span className="font-mono text-sm text-slate-400 tabular-nums">
                / 100
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div
            className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={result.matchScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="ATS Match Score"
          >
            <div
              className={`h-full ${tone.bar} transition-all duration-300`}
              style={{
                width: `${Math.max(0, Math.min(100, result.matchScore))}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Summary
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download .txt
          </button>
        </div>
      </div>

      {/* 2. Quick ATS Checks Strip */}
      {result.atsChecks && result.atsChecks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-200 pb-6">
          {result.atsChecks.map((check) => {
            const isPass = check.status === "Pass";
            const isWarn = check.status === "Warning";
            return (
              <div key={check.criterion} className="min-w-0">
                <p className="text-xs text-slate-500 truncate">
                  {check.criterion}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {isPass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isWarn ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      isPass
                        ? "text-emerald-700"
                        : isWarn
                          ? "text-amber-700"
                          : "text-red-700"
                    }`}
                  >
                    {check.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  {check.note}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Matched Skills vs Missing Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Matched Skills Found
            </h3>
            <span className="font-mono text-xs text-emerald-700 font-semibold tabular-nums">
              {result.matchedSkills.length} matched
            </span>
          </div>

          {result.matchedSkills.length === 0 ? (
            <p className="text-sm text-slate-500 py-3">
              No direct skill matches detected.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {result.matchedSkills.map((item, idx) => (
                <li
                  key={`${item.skill}-${idx}`}
                  className="py-2.5 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {item.skill}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {item.evidence}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Missing Skills &amp; Keywords
            </h3>
            <span className="font-mono text-xs text-red-700 font-semibold tabular-nums">
              {result.missingSkills.length} missing
            </span>
          </div>

          {result.missingSkills.length === 0 ? (
            <p className="text-sm text-slate-500 py-3">
              All major keywords from the job description were found.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {result.missingSkills.map((item, idx) => (
                <li
                  key={`${item.skill}-${idx}`}
                  className="py-2.5 flex items-start gap-2.5"
                >
                  <XCircle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      item.priority === "Required"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-900">
                        {item.skill}
                      </span>
                      <span className="text-xs text-slate-400" aria-hidden="true">
                        ·
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          item.priority === "Required"
                            ? "text-red-700"
                            : "text-amber-700"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {item.reason}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 4. Five Actionable Suggestions */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900">
            5 Suggestions to Improve Your Resume
          </h3>
          <span className="text-xs text-slate-500">Prioritized actions</span>
        </div>

        <ol className="divide-y divide-slate-100">
          {result.suggestions.slice(0, 5).map((suggestion, index) => (
            <li
              key={`${suggestion.title}-${index}`}
              className="py-3.5 flex items-start gap-4"
            >
              <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums pt-0.5 shrink-0">
                0{index + 1}.
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {suggestion.title}
                </p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {suggestion.action}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
