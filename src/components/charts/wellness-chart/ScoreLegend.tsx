
import { getWellnessLegendItems } from "./utils";

const ScoreLegend = () => {
  const legendItems = getWellnessLegendItems();

  return (
    <div className="flex flex-wrap justify-center gap-1 mt-1 text-[9px]">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center">
          <div 
            className="w-2 h-2 rounded-full mr-1" 
            style={{ backgroundColor: item.color }}
          ></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ScoreLegend;
