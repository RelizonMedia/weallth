
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarPlus, MessageCircle } from "lucide-react";
import Logo from "./Logo";

const WelcomeHeader = () => {
  return (
    <div className="flex flex-col items-center md:items-start">
      <Logo />
      
      <div className="flex flex-col space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold">Welcome to Your Wellness Home</h1>
        <p className="text-muted-foreground">
          Track, improve, and celebrate your holistic wellness journey
        </p>
      </div>
    </div>
  );
};

export default WelcomeHeader;
