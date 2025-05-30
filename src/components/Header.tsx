import { Bell, Menu, User, Activity, Wallet, Target, Users, Mail, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({
  toggleSidebar
}: HeaderProps) => {
  const [notifications] = useState(3);
  const {
    signOut,
    user
  } = useAuth();
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  const handleWellnessTracking = () => {
    navigate('/track');
  };
  const handleWellnessBank = () => {
    navigate('/wellness-bank');
  };
  const handleGoalTracker = () => {
    navigate('/goal-tracker');
  };
  const handleMyWellnessSpaces = () => {
    navigate('/my-wellness-spaces');
  };
  const handleMessages = () => {
    navigate('/messages');
  };
  
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="font-display text-2xl text-wellness-purple mr-auto flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-wellness-purple to-wellness-teal flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">W</span>
            </div>
            <span>We<span className="text-wellness-teal">allth</span></span>
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {/* Messages dropdown */}
          <Button variant="ghost" size="icon" className="relative" onClick={handleMessages}>
            <Mail className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Reminder: Log today's wellness metrics
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                You've maintained a 6-day wellness streak!
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                New goal achieved: Meditation for 7 days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-border">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center" onClick={handleWellnessTracking}>
                <Activity className="h-4 w-4 mr-2" />
                <span>My Wellness Tracking</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center" onClick={handleGoalTracker}>
                <Target className="h-4 w-4 mr-2" />
                <span>My Baby Steps</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center" onClick={handleMyWellnessSpaces}>
                <Users className="h-4 w-4 mr-2" />
                <span>My Wellness Spaces</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center" onClick={handleWellnessBank}>
                <Wallet className="h-4 w-4 mr-2" />
                <span>My Wellness Bank</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={signOut}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
};

export default Header;
