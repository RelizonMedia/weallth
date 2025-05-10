
import { WellnessScoreCategory } from "@/types/wellness";

// Function to get the color based on the wellness score
export const getScoreColor = (score: number): string => {
  if (score < 4.0) return "#F97316"; // Unhealthy - Orange
  if (score < 4.5) return "#4ECDC4"; // Healthy - Teal
  if (score < 4.7) return "#0EA5E9"; // Great - Blue (updated color)
  return "#8B5CF6"; // Amazing - Vivid Purple
};

// Get category boundaries for reference lines
export const getCategoryBoundaries = () => {
  return [
    { value: 4.7, color: "#8B5CF6" }, // Amazing boundary
    { value: 4.5, color: "#0EA5E9" }, // Great boundary
    { value: 4.0, color: "#4ECDC4" }, // Healthy boundary
  ];
};

// Get category areas for visualization
export const getCategoryAreas = () => {
  return [
    { y1: 4.7, y2: 5, fill: "#8B5CF6", name: "Amazing" },
    { y1: 4.5, y2: 4.7, fill: "#0EA5E9", name: "Great" },
    { y1: 4.0, y2: 4.5, fill: "#4ECDC4", name: "Healthy" },
    { y1: 0, y2: 4.0, fill: "#F97316", name: "Unhealthy" },
  ];
};

// Get wellness legend items
export const getWellnessLegendItems = () => {
  return [
    { color: "#F97316", label: "<4.0: Unhealthy" },
    { color: "#4ECDC4", label: "4.0-4.5: Healthy" },
    { color: "#0EA5E9", label: "4.5-4.7: Great" },
    { color: "#8B5CF6", label: "4.7-5.0: Amazing" },
  ];
};
