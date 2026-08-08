export type ExamSource = "NBME" | "UWSA1" | "UWSA2" | "FREE120" | "AMBOSS" | "CMS";
export type StepKind = "step1" | "step2" | "step3";

export interface PracticeExam {
  source: ExamSource;
  score: number;
  formNumber?: number;
  takenDaysAgo?: number;
}

export interface ConvertedExam extends PracticeExam {
  equated: number;
}

export interface ScoreEstimate {
  algorithmVersion: "v1.1";
  step: StepKind;
  pointEstimate: number;
  ciLower: number;
  ciUpper: number;
  ciHalfWidth: number;
  passProbability: number;
  freshness: "fresh" | "stale" | "unknown";
  inputCount: number;
  converted: ConvertedExam[];
}

export declare const ALGORITHM_VERSION: "v1.1";
export declare function convertExam(exam: PracticeExam, step: StepKind): number;
export declare function computeEstimate(exams: PracticeExam[], step: StepKind): ScoreEstimate;
