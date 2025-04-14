
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Book,
  FileText,
  Home,
  BookOpen,
  BarChart2,
  Clock,
  Calendar,
  ChevronDown,
  ChevronRight,
  Settings,
  LogOut,
  BookMarked,
  GraduationCap,
  NotebookPen,
  User,
  Zap,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SidebarProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isMobile, isSidebarOpen, closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [materialsExpanded, setMaterialsExpanded] = useState(true);

  const toggleMaterials = () => {
    setMaterialsExpanded(!materialsExpanded);
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const studyMaterials = [
    { label: "Machine Learning Fundamentals", category: "AI" },
    { label: "Advanced Statistics", category: "Mathematics" },
    { label: "Data Structures & Algorithms", category: "Computer Science" },
    { label: "Neural Networks Deep Dive", category: "AI" },
  ];

  const featureItems = [
    {
      label: "Past Exams",
      icon: <BookMarked className="h-4 w-4" />,
      path: "/past-exams",
    },
    {
      label: "Saved Questions",
      icon: <BookOpen className="h-4 w-4" />,
      path: "/saved-questions",
    },
    {
      label: "Performance Insights",
      icon: <BarChart2 className="h-4 w-4" />,
      path: "/performance",
    },
    {
      label: "Study Schedule",
      icon: <Calendar className="h-4 w-4" />,
      path: "/schedule",
    },
  ];

  const smartNotes = [
    { 
      title: "Backpropagation Explained", 
      subtitle: "The mathematical foundation behind neural networks"
    },
    { 
      title: "Key Statistical Methods", 
      subtitle: "Understanding p-values, confidence intervals & more"
    },
  ];

  if (isMobile && !isSidebarOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground w-64 border-r border-sidebar-border flex flex-col",
        isMobile && "transition-transform duration-300 ease-in-out",
        isMobile && !isSidebarOpen && "-translate-x-full"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-2"
          onClick={isMobile ? closeSidebar : undefined}
        >
          <GraduationCap className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-lg">IndelibleAI</span>
        </Link>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSidebar}
            className="lg:hidden"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-4 py-2">
          <div className="px-3 text-xs uppercase text-sidebar-foreground/50 font-semibold">
            Study Materials
          </div>
          {studyMaterials.map((material, index) => (
            <div key={index} className="px-1">
              <Link
                to={`/materials/${material.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={isMobile ? closeSidebar : undefined}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto py-2"
                >
                  <Book className="h-4 w-4 mr-2 text-blue-500" />
                  <div className="flex flex-col items-start">
                    <span>{material.label}</span>
                    <span className="text-xs text-muted-foreground">{material.category}</span>
                  </div>
                </Button>
              </Link>
            </div>
          ))}
          <Link
            to="/materials"
            className="block text-xs text-primary px-4 py-2 hover:underline"
            onClick={isMobile ? closeSidebar : undefined}
          >
            View all materials
          </Link>
        </div>

        <Separator className="my-3" />

        <div className="space-y-1 py-2">
          <div className="px-3 text-xs uppercase text-sidebar-foreground/50 font-semibold mb-2">
            Features
          </div>
          {featureItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? closeSidebar : undefined}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.path &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        <Separator className="my-3" />

        <div className="space-y-1 py-2">
          <div className="px-3 text-xs uppercase text-sidebar-foreground/50 font-semibold mb-2">
            Smart Notes
          </div>
          {smartNotes.map((note, index) => (
            <div key={index} className="px-1 mb-2">
              <Link
                to={`/smart-notes/${note.title.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={isMobile ? closeSidebar : undefined}
              >
                <div className="p-2 rounded-md hover:bg-muted">
                  <div className="font-medium text-sm">{note.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.subtitle}</div>
                </div>
              </Link>
            </div>
          ))}
          <Button variant="outline" size="sm" className="ml-3 mt-1 gap-2">
            <Zap className="h-3.5 w-3.5" />
            Generate new summary
          </Button>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
              <span className="text-sm font-semibold">JS</span>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">Student Profile</p>
              <p className="text-xs text-sidebar-foreground/70">Advanced Level</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
