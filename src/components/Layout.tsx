
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatButton from "./ChatButton";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [appReady, setAppReady] = useState(false);
  
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
    
    // Handle document overflow on all domains including preview
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // Check if we're on a preview domain or production domain
    const isPreviewOrProdDomain = window.location.hostname.includes('preview--') || 
                                 window.location.hostname.includes('lovable.app') ||
                                 window.location.hostname.includes('lovable.dev') ||
                                 window.location.hostname === 'weallth.ai';
    
    if (isPreviewOrProdDomain) {
      console.log("[Layout] Preview or production domain detected, ensuring proper rendering");
      // Force a style update to ensure rendering
      document.documentElement.style.height = '100%';
      document.body.style.minHeight = '100%';
      document.body.style.margin = '0';
    }
    
    // Mark app as ready after a short delay
    const timer = setTimeout(() => {
      setAppReady(true);
      console.log("[Layout] App marked as ready");
    }, 500);
    
    return () => {
      // Clean up when component unmounts
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Diagnostic overlay for preview/editor domains */}
      {window.location.hostname.includes('lovable.dev') && !appReady && (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mb-4"></div>
          <p className="text-lg font-medium">Loading Weallth Application</p>
          <p className="text-sm text-muted-foreground mt-2">Initializing components...</p>
        </div>
      )}
      
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
      <ChatButton />
    </div>
  );
};

export default Layout;
