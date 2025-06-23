
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Calendar, 
  Timer, 
  CheckCircle, 
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { format, differenceInMinutes, addMinutes, isAfter, isBefore } from "date-fns";

interface ExecutionTimelineProps {
  startTime: Date;
  estimatedDurationMinutes?: number;
  currentStep: number;
  totalSteps: number;
  isCompleted?: boolean;
  className?: string;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({
  startTime,
  estimatedDurationMinutes = 30,
  currentStep,
  totalSteps,
  isCompleted = false,
  className = ""
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const estimatedEndTime = addMinutes(startTime, estimatedDurationMinutes);
  const elapsedMinutes = differenceInMinutes(currentTime, startTime);
  const remainingMinutes = differenceInMinutes(estimatedEndTime, currentTime);
  
  // Calculate progress based on steps and time
  const stepProgress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const timeProgress = estimatedDurationMinutes > 0 ? (elapsedMinutes / estimatedDurationMinutes) * 100 : 0;
  
  // Use the higher of step progress or time progress, but cap at 100%
  const overallProgress = Math.min(Math.max(stepProgress, timeProgress), 100);
  
  const isOverdue = isAfter(currentTime, estimatedEndTime) && !isCompleted;
  const isOnTrack = !isOverdue && remainingMinutes > 0;

  const formatDuration = (minutes: number): string => {
    if (minutes < 0) return "Overdue";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = () => {
    if (isCompleted) return "text-green-600";
    if (isOverdue) return "text-red-600";
    if (remainingMinutes < 10) return "text-orange-600";
    return "text-blue-600";
  };

  const getProgressColor = () => {
    if (isCompleted) return "bg-green-500";
    if (isOverdue) return "bg-red-500";
    if (remainingMinutes < 10) return "bg-orange-500";
    return "bg-blue-500";
  };

  return (
    <Card className={`border-l-4 ${isCompleted ? 'border-l-green-500' : isOverdue ? 'border-l-red-500' : 'border-l-blue-500'} ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className={`h-4 w-4 ${getStatusColor()}`} />
              <h3 className="font-medium text-gray-900">Execution Timeline</h3>
            </div>
            <Badge 
              variant={isCompleted ? "default" : isOverdue ? "destructive" : "secondary"}
              className="text-xs"
            >
              {isCompleted ? "Completed" : isOverdue ? "Overdue" : "In Progress"}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress 
              value={overallProgress} 
              className="h-3"
              style={{
                '--progress-background': getProgressColor()
              } as React.CSSProperties}
            />
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>Started</span>
              </div>
              <p className="font-medium">
                {format(startTime, "MMM d, HH:mm")}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="h-3 w-3" />
                <span>{isCompleted ? "Completed" : isOverdue ? "Overdue by" : "Remaining"}</span>
              </div>
              <p className={`font-medium ${getStatusColor()}`}>
                {isCompleted ? "Done" : formatDuration(Math.abs(remainingMinutes))}
              </p>
            </div>
          </div>

          {/* Step Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Steps Completed</span>
              <span>{currentStep} of {totalSteps}</span>
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index < currentStep
                      ? getProgressColor()
                      : index === currentStep
                      ? "bg-blue-200"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Performance Indicator */}
          {!isCompleted && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Performance</span>
              <div className="flex items-center gap-1">
                <TrendingUp className={`h-3 w-3 ${
                  stepProgress >= timeProgress ? "text-green-500" : "text-orange-500"
                }`} />
                <span className={stepProgress >= timeProgress ? "text-green-600" : "text-orange-600"}>
                  {stepProgress >= timeProgress ? "On Track" : "Behind Schedule"}
                </span>
              </div>
            </div>
          )}

          {/* Estimated Completion */}
          {!isCompleted && isOnTrack && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Estimated completion: {format(estimatedEndTime, "HH:mm")}</span>
              </div>
            </div>
          )}

          {/* Overdue Warning */}
          {isOverdue && !isCompleted && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Execution is overdue. Consider extending the timeline or completing remaining steps.</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
