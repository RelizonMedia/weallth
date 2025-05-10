
import { getScoreColor } from "./utils";

interface DotProps {
  cx: number;
  cy: number;
  payload: any;
  index?: number;
}

export const CustomDot = (props: DotProps) => {
  const { cx, cy, payload, index = 0 } = props;
  const color = getScoreColor(payload.score);
  
  return (
    <circle 
      key={`dot-${index}`}
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
  const { cx, cy, payload, index = 0 } = props;
  const color = getScoreColor(payload.score);
  
  return (
    <circle 
      key={`active-dot-${index}`}
      cx={cx} 
      cy={cy} 
      r={7} 
      fill={color} 
      stroke="#fff" 
      strokeWidth={2} 
    />
  );
};
