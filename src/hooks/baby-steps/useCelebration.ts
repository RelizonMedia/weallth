
import { useState } from "react";
import confetti from "canvas-confetti";
import { format } from "date-fns";

export const useCelebration = () => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedStep, setCelebratedStep] = useState<string>("");
  const [completionTime, setCompletionTime] = useState<string>("");
  
  // Show confetti celebration effect
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#9370DB', '#7B68EE'],
        shapes: ['star', 'circle'],
        ticks: 200
      });
      
      // Add a second burst for more festivity
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 }
        });
      }, 250);
    } catch (error) {
      console.error("Error triggering confetti:", error);
    }
  };
  
  const celebrate = (stepName: string) => {
    // Record the exact completion time
    const now = new Date();
    const formattedTime = format(now, "MMM dd, yyyy 'at' h:mm a");
    
    setCompletionTime(formattedTime);
    setCelebratedStep(stepName);
    setShowCelebration(true);
    triggerCelebration();
  };
  
  const shareWin = (type: string) => {
    if (!celebratedStep) return;
    
    const shareMessage = `I just completed "${celebratedStep}" on my wellness journey! 🎉`;
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
        // This would be handled by internal app logic in the future
        console.log("Sharing to community:", shareMessage);
        break;
    }
  };
  
  return {
    showCelebration,
    setShowCelebration,
    celebratedStep,
    completionTime,
    celebrate,
    shareWin
  };
};
