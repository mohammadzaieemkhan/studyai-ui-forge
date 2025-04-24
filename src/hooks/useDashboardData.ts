import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface DashboardData {
  performanceData: PerformanceData[];
  upcomingTests: UpcomingTest[];
  recentActivities: RecentActivity[];
  averagePerformance: number;
  isLoading: boolean;
}

export const useDashboardData = (): DashboardData => {
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [upcomingTests, setUpcomingTests] = useState<UpcomingTest[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [averagePerformance, setAveragePerformance] = useState(0);

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

  return {
    performanceData,
    upcomingTests,
    recentActivities,
    averagePerformance,
    isLoading
  };
};

export type { PerformanceData, UpcomingTest, RecentActivity };
