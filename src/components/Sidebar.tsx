
import { Home, Activity, BarChart2, Users, MessageCircle, Settings, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  active = false,
  href = "#"
}: { 
  icon: React.ElementType;
  label: string;
  active?: boolean;
  href?: string;
}) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
      active 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-muted-foreground hover:bg-accent/50"
    )}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </Link>
);

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();
  
  // Always show sidebar on hover, regardless of the isOpen prop
  const showSidebar = isMobile ? isOpen : isHovering;
  
  return (
    <>
      {/* Hover detection area - always visible */}
      <div
        className="fixed inset-y-0 left-0 z-30 w-6 transition-opacity duration-300"
        onMouseEnter={() => setIsHovering(true)}
        aria-hidden="true"
      />
      
      {/* Main sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out",
          showSidebar ? "translate-x-0" : "-translate-x-full"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 mb-10 px-2 py-4">
            <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center text-white text-lg font-bold animate-pulse-gentle">
              W
            </div>
            <span className="font-display text-xl">
              We<span className="text-wellness-teal">allth</span>
            </span>
          </div>
          
          <nav className="space-y-2 flex-1">
            <NavItem icon={Home} label="Dashboard" active href="/" />
            <NavItem icon={Activity} label="Track Today" href="/track" />
            <NavItem icon={BarChart2} label="Progress" href="/progress" />
            <NavItem icon={Users} label="Community" href="/community" />
            <NavItem icon={MessageCircle} label="My AI Companion" href="/ai-companion" />
            <NavItem icon={ShoppingCart} label="Wellness Marketplace" href="/marketplace" />
          </nav>
          
          <div className="mt-auto pt-4 border-t">
            <NavItem icon={Settings} label="Settings" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
