import { useState } from "react";
import { Header } from "./components/Header";
import { InputPanel, ResumeInputMode } from "./components/InputPanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { AtsCriteriaSection } from "./components/AtsCriteriaSection";
import { SAMPLE_PRESETS } from "./data/samples";
import { AnalysisResult } from "./types";

const MAX_PDF_BYTES = 10 * 1024 * 1024;

export default function App() {
  const [inputMode, setInputMode] = useState<ResumeInputMode>("pdf");
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [pdfFileSize, setPdfFileSize] = useState<number | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSelectPdf = (file: File) => {
    setFileError(null);
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setFileError("Please select a valid PDF file (.pdf).");
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setFileError("File exceeds 10 MB limit. Please upload a smaller PDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) {
        setFileError("Could not read the selected PDF file.");
        return;
      }
      setPdfBase64(dataUrl);
      setPdfFileName(file.name);
      setPdfFileSize(file.size);
    };
    reader.onerror = () => {
      setFileError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleClearPdf = () => {
    setPdfBase64(null);
    setPdfFileName(null);
    setPdfFileSize(null);
    setFileError(null);
  };

  const runAnalysis = async (payload: {
    resumePdfBase64?: string;
    resumeText?: string;
    jobDescription: string;
  }) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to analyze resume against job description."
        );
      }

      setResult(data as AnalysisResult);
    } catch (err) {
      setAnalysisError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    runAnalysis({
      resumePdfBase64: inputMode === "pdf" ? (pdfBase64 ?? undefined) : undefined,
      resumeText: inputMode === "text" ? resumeText : undefined,
      jobDescription,
    });
  };

  const handleSelectSamplePreset = (presetId: string) => {
    const preset =
      SAMPLE_PRESETS.find((p) => p.id === presetId) ?? SAMPLE_PRESETS[0];
    setInputMode("text");
    setResumeText(preset.resumeText);
    setJobDescription(preset.jobDescription);
    setAnalysisError(null);
  };

  const handleLoadSample = () => {
    const preset = SAMPLE_PRESETS[0];
    setInputMode("text");
    setResumeText(preset.resumeText);
    setJobDescription(preset.jobDescription);
    setAnalysisError(null);
    const el = document.getElementById("analyzer");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTrySampleAndAnalyze = () => {
    const preset = SAMPLE_PRESETS[0];
    setInputMode("text");
    setResumeText(preset.resumeText);
    setJobDescription(preset.jobDescription);
    runAnalysis({
      resumeText: preset.resumeText,
      jobDescription: preset.jobDescription,
    });
  };

  const handleReset = () => {
    setResult(null);
    setAnalysisError(null);
    setFileError(null);
    handleClearPdf();
    setResumeText("");
    setJobDescription("");
    setInputMode("pdf");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        hasResults={Boolean(result)}
      />

      <main id="analyzer" className="flex-1">
        <div className="max-w-[1320px] mx-auto px-6 pt-8 pb-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              AI Resume Analyzer &amp; ATS Score Checker
            </h1>
            <p className="text-base text-slate-600 mt-2.5 leading-relaxed">
              Upload your resume and paste a target job description to check
              your ATS match score, spot missing keywords, and get five
              actionable improvements.
            </p>
          </div>
        </div>

        <div className="max-w-[1320px] mx-auto px-6 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <InputPanel
                inputMode={inputMode}
                onChangeInputMode={setInputMode}
                pdfFileName={pdfFileName}
                pdfFileSize={pdfFileSize}
                onSelectPdf={handleSelectPdf}
                onClearPdf={handleClearPdf}
                resumeText={resumeText}
                onChangeResumeText={setResumeText}
                jobDescription={jobDescription}
                onChangeJobDescription={setJobDescription}
                onSelectSamplePreset={handleSelectSamplePreset}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                fileError={fileError}
              />
            </div>

            <div className="lg:col-span-7">
              <ResultsPanel
                result={result}
                isAnalyzing={isAnalyzing}
                error={analysisError}
                onTrySampleAndAnalyze={handleTrySampleAndAnalyze}
              />
            </div>
          </div>
        </div>

        <AtsCriteriaSection />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between gap-4 flex-wrap text-xs text-slate-500">
          <span>ATS Lens · Resume &amp; Job Description Matcher</span>
          <span>Powered by Gemini</span>
        </div>
      </footer>
    </div>
  );
}
