export interface MatchedSkill {
  skill: string;
  evidence: string;
}

export interface MissingSkill {
  skill: string;
  priority: "Required" | "Preferred";
  reason: string;
}

export interface ResumeSuggestion {
  title: string;
  action: string;
}

export interface AtsCheck {
  criterion: string;
  status: "Pass" | "Warning" | "Missing";
  note: string;
}

export interface AnalysisResult {
  matchScore: number;
  scoreVerdict: string;
  roleTitleDetected: string;
  candidateSummary: string;
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  suggestions: ResumeSuggestion[];
  atsChecks: AtsCheck[];
}
