
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarPlus, MessageCircle } from "lucide-react";

const WelcomeHeader = () => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold">Welcome to Your Wellness Home</h1>
      <p className="text-muted-foreground">
        Track, improve, and celebrate your holistic wellness journey
      </p>
    </div>
  );
};

export default WelcomeHeader;
