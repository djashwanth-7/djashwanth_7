import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please check Settings > Secrets."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function generateWithRetry(
  ai: GoogleGenAI,
  params: Parameters<GoogleGenAI["models"]["generateContent"]>[0],
  maxAttempts = 3
) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient =
        msg.includes("503") ||
        msg.includes("UNAVAILABLE") ||
        msg.includes("429") ||
        msg.includes("RESOURCE_EXHAUSTED") ||
        msg.includes("ECONNRESET") ||
        msg.includes("ETIMEDOUT");

      if (!isTransient || attempt === maxAttempts) {
        throw err;
      }
      const delayMs = 800 * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

function extractReadableError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // Not JSON, return raw string
  }
  return raw || "Failed to analyze resume.";
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const { resumePdfBase64, resumeText, jobDescription } = req.body as {
        resumePdfBase64?: string;
        resumeText?: string;
        jobDescription?: string;
      };

      const trimmedJD = (jobDescription ?? "").trim();
      const trimmedResumeText = (resumeText ?? "").trim();

      if (!trimmedJD) {
        return res
          .status(400)
          .json({ error: "Please paste the target job description." });
      }

      if (!resumePdfBase64 && !trimmedResumeText) {
        return res.status(400).json({
          error: "Please upload a PDF resume or paste your resume text.",
        });
      }

      const ai = getGeminiClient();

      const parts: Array<
        | { inlineData: { mimeType: string; data: string } }
        | { text: string }
      > = [];

      if (resumePdfBase64) {
        const cleanBase64 = resumePdfBase64.replace(
          /^data:application\/pdf;base64,/,
          ""
        );
        parts.push({
          inlineData: {
            mimeType: "application/pdf",
            data: cleanBase64,
          },
        });
      }

      const promptText = [
        "Evaluate the candidate resume against the target job description as an Applicant Tracking System (ATS) and senior technical recruiter.",
        trimmedResumeText
          ? `\nCandidate Resume Text:\n"""\n${trimmedResumeText}\n"""`
          : "\nThe candidate's resume is attached as a PDF document above.",
        `\nTarget Job Description:\n"""\n${trimmedJD}\n"""`,
        "\nReturn an objective, honest evaluation:",
        "1. matchScore: integer 0-100 reflecting true keyword overlap, required skills coverage, and relevant project/experience alignment.",
        "2. scoreVerdict: concise band label ('Strong Match' for 80+, 'Good Match' for 65-79, 'Moderate Match' for 45-64, 'Low Match' for <45).",
        "3. roleTitleDetected: the job title extracted from the job description.",
        "4. candidateSummary: 1-2 crisp sentences summarizing fit and primary gap.",
        "5. matchedSkills: list of specific skills, tools, or domain keywords present in both the resume and the job description, with brief evidence of where it appears.",
        "6. missingSkills: list of important skills/keywords from the job description that are absent or weakly evidenced in the resume, marked as 'Required' or 'Preferred'.",
        "7. suggestions: exactly 5 specific, actionable improvements the student can make to their resume for this job.",
        "8. atsChecks: 4 quick ATS readiness checks covering 'Contact & Links', 'Measurable Impact', 'Keyword Density', and 'Section Structure' with status 'Pass', 'Warning', or 'Missing'.",
      ].join("\n");

      parts.push({ text: promptText });

      const response = await generateWithRetry(ai, {
        model: "gemini-4-hydrogen",
        contents: { parts },
        config: {
          systemInstruction:
            "You are a precise ATS resume evaluation engine. Never invent skills that are not in the resume. Be direct, helpful, and concrete so a student knows exactly what to fix.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: {
                type: Type.INTEGER,
                description: "ATS match score from 0 to 100.",
              },
              scoreVerdict: {
                type: Type.STRING,
                description:
                  "One of: Strong Match, Good Match, Moderate Match, Low Match",
              },
              roleTitleDetected: {
                type: Type.STRING,
                description: "Detected job title from the job description.",
              },
              candidateSummary: {
                type: Type.STRING,
                description: "1-2 sentence summary of alignment and main gap.",
              },
              matchedSkills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    evidence: {
                      type: Type.STRING,
                      description: "Brief note on where this appears in resume.",
                    },
                  },
                  required: ["skill", "evidence"],
                },
              },
              missingSkills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    priority: {
                      type: Type.STRING,
                      description: "Required or Preferred",
                    },
                    reason: {
                      type: Type.STRING,
                      description: "Why this keyword matters for the role.",
                    },
                  },
                  required: ["skill", "priority", "reason"],
                },
              },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    action: { type: Type.STRING },
                  },
                  required: ["title", "action"],
                },
                description: "Exactly 5 actionable suggestions to improve the resume.",
              },
              atsChecks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    criterion: { type: Type.STRING },
                    status: {
                      type: Type.STRING,
                      description: "Pass, Warning, or Missing",
                    },
                    note: { type: Type.STRING },
                  },
                  required: ["criterion", "status", "note"],
                },
              },
            },
            required: [
              "matchScore",
              "scoreVerdict",
              "roleTitleDetected",
              "candidateSummary",
              "matchedSkills",
              "missingSkills",
              "suggestions",
              "atsChecks",
            ],
          },
        },
      });

      const rawText = (response.text ?? "").trim();
      if (!rawText) {
        return res.status(502).json({
          error: "The AI model returned an empty response. Please try again.",
        });
      }

      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (error) {
      console.error("ATS analysis error:", error);
      const message = extractReadableError(error);
      res.status(500).json({ error: message });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      const indexFile = path.join(distDir, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("Build artifacts not found.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ATS Lens server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
