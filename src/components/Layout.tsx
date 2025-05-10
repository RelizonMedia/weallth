
import { useState, useEffect } from "react";
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

  // Effect to ensure proper viewport handling on different domains
  useEffect(() => {
    // Force viewport to be correctly sized
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Add overflow control to prevent unwanted scrolling
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    return () => {
      // Clean up when component unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={effectiveSidebarOpen} />
      <div className={cn(
        "transition-all duration-300 ease-in-out w-full max-w-full",
        effectiveSidebarOpen ? "ml-64" : "ml-0"
      )}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="container mx-auto p-2 md:p-4 max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
