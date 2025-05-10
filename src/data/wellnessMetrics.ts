
import { WellnessMetric, WellnessScoreCategory } from "@/types/wellness";

export const wellnessMetrics: WellnessMetric[] = [
  {
    id: "sleep",
    name: "Sleep Well",
    description: "Quality and duration of your sleep",
    icon: "moon"
  },
  {
    id: "nourish",
    name: "Nourish Well",
    description: "Quality of your nutrition and eating habits",
    icon: "apple"
  },
  {
    id: "exercise",
    name: "Exercise Well",
    description: "Physical activity and movement",
    icon: "activity"
  },
  {
    id: "think",
    name: "Think Positively",
    description: "Positive thinking and mental outlook",
    icon: "smile"
  },
  {
    id: "touch",
    name: "Physical Touch",
    description: "Experiencing meaningful physical connection",
    icon: "heart"
  },
  {
    id: "relationships",
    name: "Loving Relationships",
    description: "Quality of personal relationships",
    icon: "users"
  },
  {
    id: "purpose",
    name: "Purpose Well",
    description: "Sense of meaning and purpose in life",
    icon: "compass"
  },
  {
    id: "growth",
    name: "Grow Well",
    description: "Personal development and growth",
    icon: "trending-up"
  },
  {
    id: "prosper",
    name: "Prosper Well",
    description: "Financial wellbeing and stability",
    icon: "wallet"
  },
  {
    id: "spiritual",
    name: "Be Well - Spiritual",
    description: "Spiritual enlightenment and connection",
    icon: "sun"
  }
];

export function getWellnessCategory(score: number): WellnessScoreCategory {
  if (score < 4.0) return "Unhealthy";
  if (score < 4.5) return "Healthy";
  if (score < 4.7) return "Great";
  return "Amazing";
}

// Sample data for demo purposes
export const demoWellnessData = {
  entries: [
    {
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ratings: wellnessMetrics.map(metric => ({
        metricId: metric.id,
        score: 3 + Math.random() * 1.5, // Random score between 3-4.5
        babyStep: `Improve my ${metric.name.toLowerCase()} by taking small actions`,
        completed: Math.random() > 0.5,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      })),
      overallScore: 3.8,
      category: "Unhealthy" as WellnessScoreCategory
    },
    {
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ratings: wellnessMetrics.map(metric => ({
        metricId: metric.id,
        score: 3.2 + Math.random() * 1.5,
        babyStep: `Improve my ${metric.name.toLowerCase()} by taking small actions`,
        completed: Math.random() > 0.5,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      })),
      overallScore: 4.1,
      category: "Healthy" as WellnessScoreCategory
    },
    {
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ratings: wellnessMetrics.map(metric => ({
        metricId: metric.id,
        score: 3.5 + Math.random() * 1.5,
        babyStep: `Improve my ${metric.name.toLowerCase()} by taking small actions`,
        completed: Math.random() > 0.5,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      })),
      overallScore: 4.2,
      category: "Healthy" as WellnessScoreCategory
    },
    {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ratings: wellnessMetrics.map(metric => ({
        metricId: metric.id,
        score: 3.8 + Math.random() * 1.2,
        babyStep: `Improve my ${metric.name.toLowerCase()} by taking small actions`,
        completed: Math.random() > 0.5,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      })),
      overallScore: 4.4,
      category: "Healthy" as WellnessScoreCategory
    },
    {
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ratings: wellnessMetrics.map(metric => ({
        metricId: metric.id,
        score: 4.0 + Math.random() * 0.9,
        babyStep: `Improve my ${metric.name.toLowerCase()} by taking small actions`,
        completed: Math.random() > 0.5,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      })),
      overallScore: 4.6,
      category: "Great" as WellnessScoreCategory
    },
    {
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ratings: wellnessMetrics.map(metric => ({
        metricId: metric.id,
        score: 4.2 + Math.random() * 0.8,
        babyStep: `Improve my ${metric.name.toLowerCase()} by taking small actions`,
        completed: Math.random() > 0.3,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      })),
      overallScore: 4.7,
      category: "Amazing" as WellnessScoreCategory
    },
  ],
  streakDays: 6
};
