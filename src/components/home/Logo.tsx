
import { Star } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-wellness-purple to-wellness-teal opacity-20 animate-pulse-slow"></div>
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-wellness-purple via-purple-500 to-wellness-teal flex items-center justify-center">
          <Star className="h-10 w-10 text-white" />
        </div>
        <div className="absolute w-24 h-24 rounded-full border-2 border-wellness-teal opacity-60 animate-spin-slow"></div>
      </div>
      
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">
        We<span className="text-wellness-teal">allth</span>
      </h2>
      <p className="text-sm text-muted-foreground italic">Balance • Harmony • Wellness</p>
    </div>
  );
};

export default Logo;
