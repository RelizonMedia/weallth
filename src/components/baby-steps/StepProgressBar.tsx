
interface StepProgressBarProps {
  completed: number;
  total: number;
}

const StepProgressBar = ({ completed, total }: StepProgressBarProps) => {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
      <div 
        className="bg-wellness-purple h-2 rounded-full transition-all duration-300" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default StepProgressBar;
