import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageLayout from "@/shared/components/layout/PagesLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { TimerResetIcon } from "lucide-react";

const DashboardSkeletonLoader = () => {
  return (
    <PageLayout
      title={"Attendance Dashboard"}
      subtitle={"Real-time attendance"}
      icon={TimerResetIcon}
      actions={
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      }
    >
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts section skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="p-3 rounded-md bg-gray-100">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default DashboardSkeletonLoader;
