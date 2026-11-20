import React, { useRef, useState } from "react";
import { Upload, FileText, X, ArrowRight, Loader2 } from "lucide-react";
import { SAMPLE_PRESETS } from "../data/samples";

export type ResumeInputMode = "pdf" | "text";

interface InputPanelProps {
  inputMode: ResumeInputMode;
  onChangeInputMode: (mode: ResumeInputMode) => void;
  pdfFileName: string | null;
  pdfFileSize: number | null;
  onSelectPdf: (file: File) => void;
  onClearPdf: () => void;
  resumeText: string;
  onChangeResumeText: (text: string) => void;
  jobDescription: string;
  onChangeJobDescription: (text: string) => void;
  onSelectSamplePreset: (presetId: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  fileError: string | null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function InputPanel({
  inputMode,
  onChangeInputMode,
  pdfFileName,
  pdfFileSize,
  onSelectPdf,
  onClearPdf,
  resumeText,
  onChangeResumeText,
  jobDescription,
  onChangeJobDescription,
  onSelectSamplePreset,
  onAnalyze,
  isAnalyzing,
  fileError,
}: InputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onSelectPdf(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectPdf(file);
    }
    e.target.value = "";
  };

  const hasResume =
    inputMode === "pdf" ? Boolean(pdfFileName) : resumeText.trim().length > 0;
  const canSubmit = hasResume && jobDescription.trim().length > 0 && !isAnalyzing;

  return (
    <section
      aria-label="Resume and Job Description Input"
      className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            1. Your Resume
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload a PDF resume or paste plain text.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Resume input format"
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={inputMode === "pdf"}
            onClick={() => onChangeInputMode("pdf")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              inputMode === "pdf"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Upload PDF
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={inputMode === "text"}
            onClick={() => onChangeInputMode("text")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              inputMode === "text"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {inputMode === "pdf" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload PDF Resume"
          />

          {pdfFileName ? (
            <div className="border border-slate-200 bg-slate-50 rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {pdfFileName}
                  </p>
                  <p className="text-xs text-slate-500 font-mono tabular-nums">
                    PDF Document ·{" "}
                    {pdfFileSize !== null ? formatBytes(pdfFileSize) : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={onClearPdf}
                  aria-label="Remove uploaded PDF"
                  className="p-1.5 text-slate-500 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              className={`border border-dashed rounded-lg px-6 py-8 text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                isDragging
                  ? "border-blue-700 bg-blue-50/50"
                  : "border-slate-300 bg-slate-50/70 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 mx-auto flex items-center justify-center text-slate-700 mb-3">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-900">
                Click to upload or drag and drop your resume
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PDF format up to 10 MB
              </p>
            </div>
          )}

          {fileError && (
            <p className="text-xs text-red-700 mt-2" role="alert">
              {fileError}
            </p>
          )}
        </div>
      ) : (
        <div>
          <textarea
            value={resumeText}
            onChange={(e) => onChangeResumeText(e.target.value)}
            rows={8}
            placeholder="Paste your resume content here (education, skills, projects, experience)..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15 resize-y"
          />
          <div className="flex items-center justify-between mt-1.5 text-xs text-slate-500 font-mono tabular-nums">
            <span>Plain text resume</span>
            <span>{resumeText.length} chars</span>
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              2. Target Job Description
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Paste the role responsibilities and required skills.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500">Presets:</span>
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectSamplePreset(preset.id)}
                className="text-xs font-medium text-blue-700 hover:text-blue-900 underline underline-offset-2 cursor-pointer whitespace-nowrap"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => onChangeJobDescription(e.target.value)}
          rows={9}
          placeholder="Paste the job description here (title, required technical skills, qualifications)..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15 resize-y"
        />
        <div className="flex items-center justify-between mt-1.5 text-xs text-slate-500 font-mono tabular-nums">
          <span>Job description text</span>
          <span>{jobDescription.length} chars</span>
        </div>
      </div>

      <div className="pt-1 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          Evaluates keyword coverage, role fit, and 5 targeted edits.
        </p>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              Analyze Resume
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
