import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DocumentRequestSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          {/* Type and Date Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>

          {/* Footer */}
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default DocumentRequestSkeleton;
