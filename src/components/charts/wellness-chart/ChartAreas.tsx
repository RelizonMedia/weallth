
import { Area } from "recharts";
import { getCategoryAreas } from "./utils";

const ChartAreas = () => {
  const categoryAreas = getCategoryAreas();
  
  return (
    <>
      {categoryAreas.map((area) => (
        <Area 
          key={area.name}
          dataKey="score"
          y1={area.y1} 
          y2={area.y2} 
          fill={area.fill} 
          fillOpacity={0.15} 
          strokeOpacity={0}
          name={area.name}
        />
      ))}
    </>
  );
};

export default ChartAreas;
