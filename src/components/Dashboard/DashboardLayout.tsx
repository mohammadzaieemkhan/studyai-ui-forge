
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardLayout = () => {
  const isMobileView = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobileView);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    setIsSidebarOpen(!isMobileView);
  }, [isMobileView]);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar 
        isMobile={isMobileView} 
        isSidebarOpen={isSidebarOpen} 
        closeSidebar={closeSidebar} 
      />
      <div className={`transition-all duration-300 ${isMobileView ? "ml-0" : (isSidebarOpen ? "ml-64" : "ml-0")}`}>
        {isMobileView && (
          <div className="sticky top-0 z-10 flex items-center h-14 px-4 bg-background/80 backdrop-blur-sm border-b">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="mr-2"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">IndelibleAI</h1>
          </div>
        )}
        <main className="px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
