
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText } from "lucide-react";
import type { UpcomingTest } from "@/hooks/useDashboardData";

interface UpcomingTestsCardProps {
  upcomingTests: UpcomingTest[];
}

export const UpcomingTestsCard = ({ upcomingTests }: UpcomingTestsCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };

  return (
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
  );
};
