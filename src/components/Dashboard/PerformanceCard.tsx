
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart2, ChevronRight } from "lucide-react";
import type { PerformanceData } from "@/hooks/useDashboardData";

interface PerformanceCardProps {
  performanceData: PerformanceData[];
  averagePerformance: number;
}

export const PerformanceCard = ({ performanceData, averagePerformance }: PerformanceCardProps) => {
  return (
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
  );
};
