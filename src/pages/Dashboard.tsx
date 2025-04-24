
import { useState } from "react";
import { SearchSection } from "@/components/Dashboard/SearchSection";
import { QuickActionPills } from "@/components/Dashboard/QuickActionPills";
import { LoadingState } from "@/components/Dashboard/LoadingState";
import { PerformanceCard } from "@/components/Dashboard/PerformanceCard";
import { UpcomingTestsCard } from "@/components/Dashboard/UpcomingTestsCard";
import { RecentActivityCard } from "@/components/Dashboard/RecentActivityCard";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    performanceData,
    upcomingTests,
    recentActivities,
    averagePerformance,
    isLoading
  } = useDashboardData();
  
  return (
    <div className="space-y-6">
      {/* Search Bar and Quick Actions */}
      <SearchSection 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Quick Action Pills */}
      <QuickActionPills />

      <h1 className="text-2xl font-bold">Study Dashboard</h1>
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Performance Overview Card */}
          <PerformanceCard
            performanceData={performanceData}
            averagePerformance={averagePerformance}
          />

          {/* Upcoming Tests Card */}
          <UpcomingTestsCard
            upcomingTests={upcomingTests}
          />
        </div>
      )}

      {/* Recent Activity Card */}
      <RecentActivityCard
        recentActivities={recentActivities}
      />
    </div>
  );
};

export default Dashboard;
