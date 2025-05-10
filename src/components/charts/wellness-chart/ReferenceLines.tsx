
import { ReferenceLine } from "recharts";
import { getCategoryBoundaries } from "./utils";

const ReferenceLines = () => {
  const boundaries = getCategoryBoundaries();
  
  return (
    <>
      {boundaries.map((boundary) => (
        <ReferenceLine 
          key={boundary.value}
          y={boundary.value} 
          stroke={boundary.color} 
          strokeDasharray="3 3" 
        />
      ))}
    </>
  );
};

export default ReferenceLines;
