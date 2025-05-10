
import { format } from "date-fns";
import { Star, PartyPopper, Award, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const handleShare = (type: string) => {
    const shareMessage = `I just completed "${stepName}" on my wellness journey! 🎉`;
    const shareUrl = window.location.href;
    
    switch (type) {
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(shareMessage + ' ' + shareUrl)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=My Wellness Achievement&body=${encodeURIComponent(shareMessage + '\n\n' + shareUrl)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`);
        break;
      case 'community':
        // This would be handled by internal app logic to share in the community section
        // For now, we'll just show an alert
        alert("Sharing to Community coming soon!");
        break;
    }
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
        <div className="flex justify-between items-center">
          <Button onClick={() => onOpenChange(false)} className="bg-wellness-purple hover:bg-wellness-purple/90">
            Continue My Journey
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share Win
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="grid gap-2">
                <Button variant="ghost" className="justify-start" onClick={() => handleShare('sms')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  SMS
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleShare('email')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Email
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleShare('twitter')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  Twitter
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleShare('facebook')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  Facebook
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleShare('community')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Community
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CelebrationDialog;
