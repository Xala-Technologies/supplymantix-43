
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkOrderListSkeletonProps {
  count?: number;
}

export const WorkOrderListSkeleton = ({ count = 6 }: WorkOrderListSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="w-full">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Icon and priority indicator */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-3 h-3 rounded-full" />
              </div>
              
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                
                {/* Asset and ID */}
                <Skeleton className="h-4 w-1/2" />
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                
                {/* Assignee */}
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-5 h-5 rounded-full" />
                  </div>
                </div>
                
                {/* Description */}
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                
                {/* Tags */}
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
