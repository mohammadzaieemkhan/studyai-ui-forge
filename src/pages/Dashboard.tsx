
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  CalendarClock, 
  ChevronRight, 
  Clock, 
  FileText, 
  Plus, 
  Rocket, 
  BookOpen, 
  CheckCircle2, 
  PieChart, 
  BookMarked,
  Calendar,
  Info,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock data for the dashboard
  const subjects = [
    { name: "Mathematics", progress: 78, color: "bg-blue-500" },
    { name: "Physics", progress: 65, color: "bg-purple-500" },
    { name: "Chemistry", progress: 42, color: "bg-green-500" },
    { name: "Biology", progress: 91, color: "bg-orange-500" },
  ];
  
  const upcomingTests = [
    { 
      id: 1, 
      name: "Calculus Midterm", 
      date: "2025-04-18",
      time: "10:00 AM", 
      difficulty: "Hard",
      subject: "Mathematics" 
    },
    { 
      id: 2, 
      name: "Physics Quiz", 
      date: "2025-04-20",
      time: "2:30 PM", 
      difficulty: "Medium",
      subject: "Physics" 
    },
    { 
      id: 3, 
      name: "Chemistry Lab", 
      date: "2025-04-22",
      time: "3:15 PM", 
      difficulty: "Easy",
      subject: "Chemistry" 
    },
  ];
  
  const recentActivities = [
    { 
      id: 1, 
      type: "practice", 
      title: "Completed practice test", 
      subject: "Mathematics", 
      timestamp: "2 hours ago",
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> 
    },
    { 
      id: 2, 
      type: "summary", 
      title: "Generated study notes", 
      subject: "Physics", 
      timestamp: "Yesterday",
      icon: <FileText className="h-4 w-4 text-blue-500" /> 
    },
    { 
      id: 3, 
      type: "exam", 
      title: "Created new exam", 
      subject: "Chemistry", 
      timestamp: "2 days ago",
      icon: <BookOpen className="h-4 w-4 text-purple-500" /> 
    },
    { 
      id: 4, 
      type: "review", 
      title: "Reviewed incorrect answers", 
      subject: "Biology", 
      timestamp: "3 days ago",
      icon: <AlertCircle className="h-4 w-4 text-orange-500" /> 
    },
    { 
      id: 5, 
      type: "schedule", 
      title: "Scheduled new test", 
      subject: "Mathematics", 
      timestamp: "1 week ago",
      icon: <Calendar className="h-4 w-4 text-indigo-500" /> 
    },
  ];

  const filteredActivities = activeTab === "all" 
    ? recentActivities 
    : recentActivities.filter(activity => activity.type === activeTab);
  
  // Calculate days until test
  const calculateDaysUntil = (dateString: string) => {
    const today = new Date();
    const testDate = new Date(dateString);
    const diffTime = testDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link to="/exam-creation">
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Exam
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-2">
              <div className="relative h-24 w-24">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset="67.8"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">73%</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              You're doing great! Keep it up.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5h</div>
            <p className="text-xs text-muted-foreground">
              This week (7.5h more than last week)
            </p>
            <div className="mt-4 h-5 w-full rounded-full bg-secondary">
              <div className="h-5 rounded-full bg-primary" style={{ width: '75%' }}></div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              75% of your weekly target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              In the past 30 days
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs">85% average score</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-xs">12 practice, 12 real</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Next: Calculus Midterm in 4 days
            </p>
            <Link to="/schedule" className="mt-4 flex items-center text-primary text-sm hover:underline">
              <span>View schedule</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Performance by Subject</CardTitle>
            <CardDescription>
              Your progress and mastery level across subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${subject.color}`}></div>
                      <span className="text-sm font-medium">{subject.name}</span>
                    </div>
                    <span className="text-sm">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/performance">
                <Button variant="outline" className="w-full">
                  <span>View detailed analytics</span>
                  <BarChart className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Tests</CardTitle>
                <CardDescription>
                  Scheduled exams and quizzes
                </CardDescription>
              </div>
              <Link to="/schedule">
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Schedule New Test
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-start justify-between rounded-lg border p-3 hover-scale"
                >
                  <div>
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm text-muted-foreground">{test.subject}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs">
                        {test.date.replace(/-/g, '/')} at {test.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getDifficultyColor(test.difficulty)} variant="secondary">
                      {test.difficulty}
                    </Badge>
                    <span className="text-xs font-medium">
                      {calculateDaysUntil(test.date)} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest study activities</CardDescription>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
                <TabsTrigger value="summary">Notes</TabsTrigger>
                <TabsTrigger value="exam">Exams</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {activity.icon}
                  </div>
                  <div className="flex flex-1 flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.subject}</p>
                  </div>
                </div>
              ))}
              {filteredActivities.length === 0 && (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <Info className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">No activities found</p>
                  <p className="text-xs text-muted-foreground">
                    Try selecting a different category
                  </p>
                </div>
              )}
              <Button variant="ghost" className="w-full mt-2 text-xs">
                View all activity
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Smart Notes</CardTitle>
            <CardDescription>AI-generated summaries and study materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-hide pr-2">
              <div className="rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">Calculus: Derivatives</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Key concepts and formulas for derivatives
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Mathematics
                  </Badge>
                </div>
                <div className="mt-3 text-sm">
                  <p>
                    The derivative of a function represents its rate of change. Important formulas:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Power Rule: d/dx(x^n) = n*x^(n-1)</li>
                    <li>Product Rule: d/dx(f*g) = f'g + fg'</li>
                    <li>Chain Rule: d/dx(f(g(x))) = f'(g(x))*g'(x)</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">Newton's Laws of Motion</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Summary of the three fundamental laws
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Physics
                  </Badge>
                </div>
                <div className="mt-3 text-sm">
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <strong>First Law (Inertia):</strong> An object will remain at rest or in uniform motion unless acted upon by an external force.
                    </li>
                    <li>
                      <strong>Second Law (F=ma):</strong> The acceleration of an object is directly proportional to the force applied and inversely proportional to its mass.
                    </li>
                    <li>
                      <strong>Third Law:</strong> For every action, there is an equal and opposite reaction.
                    </li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">Periodic Table Patterns</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Key trends and properties
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Chemistry
                  </Badge>
                </div>
                <div className="mt-3 text-sm">
                  <p>
                    The periodic table is organized to show trends in element properties:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Atomic Radius:</strong> Decreases across periods, increases down groups</li>
                    <li><strong>Ionization Energy:</strong> Increases across periods, decreases down groups</li>
                    <li><strong>Electronegativity:</strong> Increases across periods, decreases down groups</li>
                    <li><strong>Metallic Character:</strong> Decreases across periods, increases down groups</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4">
              <FileText className="mr-2 h-4 w-4" />
              Generate new summary
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
