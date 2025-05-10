
import { getScoreColor } from "./utils";

interface DotProps {
  cx: number;
  cy: number;
  payload: any;
}

export const CustomDot = (props: DotProps) => {
  const { cx, cy, payload } = props;
  const color = getScoreColor(payload.score);
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={5} 
      fill={color} 
      stroke="#fff" 
      strokeWidth={2} 
    />
  );
};

export const CustomActiveDot = (props: DotProps) => {
  const { cx, cy, payload } = props;
  const color = getScoreColor(payload.score);
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={7} 
      fill={color} 
      stroke="#fff" 
      strokeWidth={2} 
    />
  );
};
