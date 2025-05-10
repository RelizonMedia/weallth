
export type WellnessMetric = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type WellnessRating = {
  metricId: string;
  score: number; // 1-5
  babyStep: string;
  completed: boolean;
  date: string; // ISO string
};

export type WellnessScoreCategory = 
  | "Unhealthy" 
  | "Healthy" 
  | "Great" 
  | "Amazing";

export type DailyWellnessEntry = {
  date: string; // ISO string
  ratings: WellnessRating[];
  overallScore: number;
  category: WellnessScoreCategory;
};

export type UserWellnessData = {
  entries: DailyWellnessEntry[];
  streakDays: number;
};
