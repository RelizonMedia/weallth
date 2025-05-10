
import { format } from "date-fns";
import { Star, PartyPopper, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CelebrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stepName: string;
  completionTime: string;
}

const CelebrationDialog = ({ 
  open, 
  onOpenChange, 
  stepName,
  completionTime 
}: CelebrationDialogProps) => {
  // Get motivational messages for celebrations
  const getMotivationalMessage = () => {
    const messages = [
      "You're doing amazing! Every step counts toward your wellness journey.",
      "That's the way! Your commitment to your wellness is truly inspiring.",
      "Fantastic progress! You're building healthy habits one step at a time.",
      "Excellent work! Your dedication to wellness is something to celebrate.",
      "Great job! Small steps lead to big changes in your wellness journey."
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-600 flex items-center justify-center gap-2">
            <PartyPopper className="h-6 w-6 text-amber-500" />
            Celebration Time!
            <PartyPopper className="h-6 w-6 text-amber-500" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <div className="bg-amber-50 rounded-full p-6 mb-4">
            <Award className="h-16 w-16 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Amazing Achievement!</h3>
          <p className="text-center mb-2">
            You've completed: <span className="font-bold">{stepName}</span>
          </p>
          <p className="text-center text-muted-foreground mb-4">
            {getMotivationalMessage()}
          </p>
          <div className="bg-amber-100 rounded-full px-4 py-2 flex items-center mb-4">
            <Star className="h-5 w-5 text-amber-500 mr-2 fill-amber-500" />
            <span className="text-amber-700 font-medium">+1 Star Added to Your Wellness Bank!</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Completed on {completionTime}
          </p>
        </div>
        <div className="flex justify-center">
          <Button onClick={() => onOpenChange(false)} className="bg-wellness-purple hover:bg-wellness-purple/90">
            Continue My Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CelebrationDialog;
