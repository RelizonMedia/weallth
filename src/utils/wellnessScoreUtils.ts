
// Utility functions for wellness score calculations and styling

// Function to get the color based on the wellness score
export const getScoreColor = (score: number): string => {
  if (score < 4.0) return "bg-red-100 text-red-600 border-red-200"; // Unhealthy
  if (score < 4.5) return "bg-green-100 text-green-600 border-green-200"; // Healthy
  if (score < 4.7) return "bg-blue-100 text-blue-600 border-blue-200"; // Great
  return "bg-purple-100 text-purple-600 border-purple-200"; // Amazing
};

// Function to get the category name based on score
export const getScoreCategory = (score: number): string => {
  if (score < 4.0) return "Unhealthy";
  if (score < 4.5) return "Healthy";
  if (score < 4.7) return "Great";
  return "Amazing";
};

// Function to get the text color based on the category
export const getCategoryTextColor = (category: string): string => {
  switch (category) {
    case "Unhealthy": return "text-red-600";
    case "Healthy": return "text-green-600";
    case "Great": return "text-blue-600";
    case "Amazing": return "text-purple-600";
    default: return "text-wellness-teal";
  }
};

// Function to generate recommendations based on metric and score
export const getRecommendation = (metricId: string, metricName: string, score: number): string => {
  if (score >= 4.7) {
    return `Keep up your amazing work with ${metricName.toLowerCase()}!`;
  } else if (score >= 4.5) {
    return `You're doing great with ${metricName.toLowerCase()}. Small improvements could make it amazing.`;
  } else if (score >= 4.0) {
    return `Your ${metricName.toLowerCase()} is healthy. Consider focusing on consistency.`;
  } else {
    return `This area needs attention. Small daily habits can improve your ${metricName.toLowerCase()}.`;
  }
};
