
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight } from "lucide-react";
import type { RecentActivity } from "@/hooks/useDashboardData";

interface RecentActivityCardProps {
  recentActivities: RecentActivity[];
}

export const RecentActivityCard = ({ recentActivities }: RecentActivityCardProps) => {
  return (
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
  );
};
