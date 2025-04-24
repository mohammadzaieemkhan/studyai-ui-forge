
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart,
  BarChart2, 
  Book, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Circle, 
  Clock, 
  FileText, 
  Lightbulb, 
  Zap,
  Upload,
  MapPin,
  Loader2
} from "lucide-react";

interface PerformanceData {
  subject: string;
  score: number;
}

interface UpcomingTest {
  id: number;
  name: string;
  date: string;
  difficulty: string;
}

interface RecentActivity {
  id: number;
  title: string;
  details: string;
  time: string;
  icon: JSX.Element;
}

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [upcomingTests, setUpcomingTests] = useState<UpcomingTest[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [averagePerformance, setAveragePerformance] = useState(0);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch performance data
        const { data: performanceData, error: performanceError } = await supabase
          .from('performance_analytics')
          .select('analytics_id, average_score, subject_id, subjects:subject_id(name)')
          .order('analytics_id', { ascending: false })
          .limit(3);
        
        if (performanceError) {
          console.error('Error fetching performance data:', performanceError);
        } else if (performanceData && performanceData.length > 0) {
          const formattedData = performanceData.map(item => ({
            subject: item.subjects?.name || 'Unknown',
            score: Math.round(item.average_score || 0)
          }));
          setPerformanceData(formattedData);
          
          // Calculate average
          const avg = Math.round(
            formattedData.reduce((acc, item) => acc + item.score, 0) / formattedData.length
          );
          setAveragePerformance(avg);
        } else {
          // If no data, use mock data
          const mockData = [
            { subject: "AI", score: 85 },
            { subject: "Math", score: 72 },
            { subject: "CS", score: 79 },
          ];
          setPerformanceData(mockData);
          setAveragePerformance(Math.round(
            mockData.reduce((acc, item) => acc + item.score, 0) / mockData.length
          ));
          
          toast.info("Using demo data for performance visualization", {
            description: "Connect your account to see your real performance data",
          });
        }
        
        // Fetch upcoming tests
        const { data: scheduledTests, error: scheduledError } = await supabase
          .from('scheduled_tests')
          .select('schedule_id, scheduled_date, exams:exam_id(title, difficulty_level)')
          .eq('completed', false)
          .order('scheduled_date', { ascending: true })
          .limit(2);
          
        if (scheduledError) {
          console.error('Error fetching scheduled tests:', scheduledError);
        } else if (scheduledTests && scheduledTests.length > 0) {
          const formattedTests = scheduledTests.map(test => {
            // Format the date
            const testDate = new Date(test.scheduled_date);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            let dateString = '';
            if (testDate.toDateString() === today.toDateString()) {
              dateString = `Today, ${testDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            } else if (testDate.toDateString() === tomorrow.toDateString()) {
              dateString = `Tomorrow, ${testDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            } else {
              dateString = testDate.toLocaleDateString([], { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric'
              });
            }
            
            return {
              id: test.schedule_id,
              name: test.exams?.title || 'Untitled Test',
              date: dateString,
              difficulty: test.exams?.difficulty_level || 'Medium'
            };
          });
          
          setUpcomingTests(formattedTests);
        } else {
          // If no scheduled tests, use mock data
          setUpcomingTests([
            { 
              id: 1, 
              name: "Machine Learning Quiz", 
              date: "Tomorrow, 2:00 PM", 
              difficulty: "Medium",
            },
            { 
              id: 2, 
              name: "Statistics Final Exam", 
              date: "Next Week, Monday", 
              difficulty: "Hard",
            },
          ]);
          
          toast.info("Using demo data for upcoming tests", {
            description: "Schedule real exams to see them appear here",
          });
        }
        
        // Fetch recent activities
        const { data: activityData, error: activityError } = await supabase
          .from('activity_log')
          .select('log_id, activity_type, description, timestamp')
          .order('timestamp', { ascending: false })
          .limit(3);
        
        if (activityError) {
          console.error('Error fetching activity data:', activityError);
        } else if (activityData && activityData.length > 0) {
          const formattedActivities = activityData.map(activity => {
            // Format relative time
            const activityTime = new Date(activity.timestamp);
            const now = new Date();
            const diffInHours = Math.abs(now.getTime() - activityTime.getTime()) / 36e5;
            
            let timeString = '';
            if (diffInHours < 1) {
              timeString = `${Math.floor(diffInHours * 60)} minutes ago`;
            } else if (diffInHours < 24) {
              timeString = `${Math.floor(diffInHours)} hours ago`;
            } else if (diffInHours < 48) {
              timeString = 'Yesterday';
            } else {
              timeString = `${Math.floor(diffInHours / 24)} days ago`;
            }
            
            // Pick icon based on activity type
            let icon: JSX.Element;
            switch (activity.activity_type) {
              case 'test_completed':
                icon = <CheckCircle2 className="h-4 w-4 text-green-500" />;
                break;
              case 'note_created':
                icon = <FileText className="h-4 w-4 text-blue-500" />;
                break;
              case 'ai_feedback':
                icon = <Lightbulb className="h-4 w-4 text-yellow-500" />;
                break;
              default:
                icon = <Circle className="h-4 w-4 text-gray-500" />;
            }
            
            return {
              id: activity.log_id,
              title: activity.description || 'Activity',
              details: activity.activity_type.replace('_', ' '),
              time: timeString,
              icon
            };
          });
          
          setRecentActivities(formattedActivities);
        } else {
          // If no activity data, use mock data
          setRecentActivities([
            { 
              id: 1, 
              title: "Midterm Practice Test", 
              details: "Score: 85%", 
              time: "2 days ago",
              icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> 
            },
            { 
              id: 2, 
              title: "Lecture Notes: Reinforcement Learning", 
              details: "", 
              time: "Yesterday",
              icon: <FileText className="h-4 w-4 text-blue-500" /> 
            },
            { 
              id: 3, 
              title: "AI Feedback on Assignment 3", 
              details: "", 
              time: "Today",
              icon: <Lightbulb className="h-4 w-4 text-yellow-500" /> 
            },
          ]);
          
          toast.info("Using demo data for recent activities", {
            description: "Complete some actions to see your activities here",
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleAIAction = () => {
    // Process the query or handle syllabus upload
    if (searchQuery.trim()) {
      toast.success("Processing your question", {
        description: `"${searchQuery.trim()}"`,
      });
    } else {
      toast.info("Ask a question or upload your syllabus");
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Search Bar and Quick Actions */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Ask a question or upload your syllabus..."
            className="pl-4 pr-10 py-2 w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <Button className="gap-2 whitespace-nowrap" onClick={handleAIAction}>
          <Zap className="h-4 w-4" />
          Generate Exam
        </Button>
      </div>
      
      {/* Quick Action Pills */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="rounded-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          Review Chapter 3: Neural Networks
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          Practice with last semester's exam questions
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          Summarize key concepts from today's lecture
        </Button>
      </div>

      <h1 className="text-2xl font-bold">Study Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Performance Overview Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Performance Overview</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="relative h-28 w-28">
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
                      strokeDashoffset={(100 - averagePerformance) * 2.512}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{averagePerformance}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {performanceData.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <span className="text-sm">{subject.score}%</span>
                    </div>
                    <Progress value={subject.score} className="h-2" />
                  </div>
                ))}
              </div>
              
              <Button variant="ghost" className="w-full mt-4 text-primary text-sm">
                View detailed analytics
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tests Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Upcoming Tests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-start justify-between p-3 rounded-lg border hover:bg-slate-50"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {test.date}
                        </div>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(test.difficulty)}>
                      {test.difficulty}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                Schedule New Test
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {activity.icon}
                  </div>
                  <div>
                    <div className="font-medium">{activity.title}</div>
                    {activity.details && (
                      <div className="text-sm text-muted-foreground">
                        {activity.details}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" className="w-full mt-4 text-primary text-sm">
            View all activity
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
