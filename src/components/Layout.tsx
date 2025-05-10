
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // On mobile, sidebar is only shown when explicitly toggled
  const effectiveSidebarOpen = isMobile ? sidebarOpen : false;
  
  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  return (
    <div className="min-h-screen bg-background max-w-full overflow-x-hidden">
      <Sidebar isOpen={effectiveSidebarOpen} />
      <div className={cn(
        "transition-all duration-300 ease-in-out max-w-full",
        effectiveSidebarOpen ? "ml-64" : "ml-0"
      )}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="container mx-auto p-4 md:p-6 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
