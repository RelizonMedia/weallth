
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to closed
  const isMobile = useIsMobile();
  
  // On mobile, sidebar is only shown when explicitly toggled
  const effectiveSidebarOpen = isMobile ? sidebarOpen : false; // Desktop always uses hover
  
  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={effectiveSidebarOpen} />
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        effectiveSidebarOpen ? "ml-64" : "ml-0"
      )}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="container mx-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
