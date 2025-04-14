
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
  Search,
  ChevronDown,
  ChevronRight,
  Settings,
  LogOut,
  BookMarked,
  GraduationCap,
  NotebookPen,
  User,
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

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: <Home className="h-4 w-4" />,
      path: "/dashboard",
    },
    {
      label: "Exam Creation",
      icon: <FileText className="h-4 w-4" />,
      path: "/exam-creation",
    },
    {
      label: "Performance",
      icon: <BarChart2 className="h-4 w-4" />,
      path: "/performance",
    },
    {
      label: "Study Schedule",
      icon: <Calendar className="h-4 w-4" />,
      path: "/schedule",
    },
  ];

  const studyMaterials = [
    { label: "Mathematics", path: "/materials/math" },
    { label: "Physics", path: "/materials/physics" },
    { label: "Chemistry", path: "/materials/chemistry" },
    { label: "Biology", path: "/materials/biology" },
    { label: "History", path: "/materials/history" },
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
      label: "Smart Notes",
      icon: <NotebookPen className="h-4 w-4" />,
      path: "/smart-notes",
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
          <GraduationCap className="h-6 w-6 text-sidebar-primary" />
          <span className="font-bold text-lg">StudyAI</span>
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
      
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-sidebar-foreground opacity-50" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 bg-sidebar-accent/50 text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded-md focus:outline-none focus:ring-2 focus:ring-sidebar-primary"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {sidebarItems.map((item) => (
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

        <div className="py-2">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={toggleMaterials}
          >
            <div className="flex items-center">
              <Book className="h-4 w-4" />
              <span className="ml-2">Study Materials</span>
            </div>
            {materialsExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          {materialsExpanded && (
            <div className="ml-8 space-y-1 mt-1">
              {studyMaterials.map((material) => (
                <Link
                  key={material.path}
                  to={material.path}
                  onClick={isMobile ? closeSidebar : undefined}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      location.pathname === material.path &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    {material.label}
                  </Button>
                </Link>
              ))}
              <Link
                to="/materials"
                className="block text-xs text-primary px-4 py-2 hover:underline"
                onClick={isMobile ? closeSidebar : undefined}
              >
                View all materials
              </Link>
            </div>
          )}
        </div>

        <Separator className="my-3" />

        <div className="space-y-1 py-2">
          <p className="px-4 text-xs font-semibold uppercase text-sidebar-foreground/50 mb-2">
            Features
          </p>
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
          <Link to="/profile" onClick={isMobile ? closeSidebar : undefined}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                location.pathname === "/profile" &&
                  "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <User className="h-4 w-4" />
              <span className="ml-2">Profile</span>
            </Button>
          </Link>
          <Link to="/settings" onClick={isMobile ? closeSidebar : undefined}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                location.pathname === "/settings" &&
                  "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              <span className="ml-2">Settings</span>
            </Button>
          </Link>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
              <span className="text-sm font-semibold">JS</span>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-sidebar-foreground/70">Student</p>
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
