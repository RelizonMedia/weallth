
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useStarsManagement = () => {
  const [starsEarned, setStarsEarned] = useState(0);
  const { toast } = useToast();
  
  // On component mount, load stars from localStorage
  useEffect(() => {
    const savedStars = localStorage.getItem('wellnessStars');
    if (savedStars) {
      setStarsEarned(parseInt(savedStars, 10));
    }
  }, []);
  
  const addStar = () => {
    const newStarsCount = starsEarned + 1;
    setStarsEarned(newStarsCount);
    localStorage.setItem('wellnessStars', newStarsCount.toString());
    
    toast({
      title: "🎉 Goal achieved! 🎉",
      description: "Amazing job! You've earned a star for your wellness bank!",
      duration: 5000,
    });
  };
  
  const removeStar = () => {
    if (starsEarned > 0) {
      const newStarsCount = starsEarned - 1;
      setStarsEarned(newStarsCount);
      localStorage.setItem('wellnessStars', newStarsCount.toString());
      
      toast({
        title: "Step unmarked",
        description: "You can complete it later when you're ready.",
        duration: 1500,
      });
    }
  };
  
  return {
    starsEarned,
    addStar,
    removeStar
  };
};
