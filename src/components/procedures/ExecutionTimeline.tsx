
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
  TrendingUp,
  TrendingDown,
  Minus,
  PlayCircle
} from "lucide-react";
import { format, differenceInMinutes, addMinutes, isAfter, differenceInSeconds } from "date-fns";

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
  const elapsedMinutes = Math.max(0, differenceInMinutes(currentTime, startTime));
  const elapsedSeconds = Math.max(0, differenceInSeconds(currentTime, startTime));
  const remainingMinutes = differenceInMinutes(estimatedEndTime, currentTime);
  
  // Calculate progress based on both steps and time
  const stepProgress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const timeProgress = estimatedDurationMinutes > 0 ? Math.min((elapsedMinutes / estimatedDurationMinutes) * 100, 100) : 0;
  
  // Use step progress as primary, but show time variance
  const primaryProgress = stepProgress;
  const timeVariance = timeProgress - stepProgress;
  
  const isOverdue = isAfter(currentTime, estimatedEndTime) && !isCompleted;
  const isAheadOfSchedule = stepProgress > timeProgress && !isCompleted;
  const isBehindSchedule = stepProgress < timeProgress && !isCompleted && timeProgress > 10;

  const formatDuration = (minutes: number): string => {
    if (minutes < 0) {
      const overdue = Math.abs(minutes);
      if (overdue < 60) return `${overdue}m overdue`;
      const hours = Math.floor(overdue / 60);
      const mins = overdue % 60;
      return `${hours}h ${mins}m overdue`;
    }
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatElapsedTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getStatusInfo = () => {
    if (isCompleted) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-500",
        status: "Completed",
        icon: CheckCircle
      };
    }
    if (isOverdue) {
      return {
        color: "text-red-600",
        bgColor: "bg-red-500",
        status: "Overdue",
        icon: AlertCircle
      };
    }
    if (isAheadOfSchedule) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-500",
        status: "Ahead of Schedule",
        icon: TrendingUp
      };
    }
    if (isBehindSchedule) {
      return {
        color: "text-orange-600",
        bgColor: "bg-orange-500",
        status: "Behind Schedule",
        icon: TrendingDown
      };
    }
    return {
      color: "text-blue-600",
      bgColor: "bg-blue-500",
      status: "On Track",
      icon: Minus
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const estimatedCompletionTime = () => {
    if (isCompleted || stepProgress === 0) return null;
    
    const avgTimePerStep = elapsedMinutes / currentStep;
    const remainingSteps = totalSteps - currentStep;
    const estimatedRemainingMinutes = avgTimePerStep * remainingSteps;
    
    return addMinutes(currentTime, estimatedRemainingMinutes);
  };

  const projectedCompletion = estimatedCompletionTime();

  return (
    <Card className={`border-l-4 ${isCompleted ? 'border-l-green-500' : isOverdue ? 'border-l-red-500' : isAheadOfSchedule ? 'border-l-green-400' : isBehindSchedule ? 'border-l-orange-500' : 'border-l-blue-500'} ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : isOverdue ? 'bg-red-100' : isAheadOfSchedule ? 'bg-green-100' : isBehindSchedule ? 'bg-orange-100' : 'bg-blue-100'}`}>
                <Timer className={`h-5 w-5 ${statusInfo.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Execution Timeline</h3>
                <p className="text-sm text-gray-500">Real-time progress tracking</p>
              </div>
            </div>
            <Badge 
              variant={isCompleted ? "default" : isOverdue ? "destructive" : "secondary"}
              className="flex items-center gap-1"
            >
              <StatusIcon className="h-3 w-3" />
              {statusInfo.status}
            </Badge>
          </div>

          {/* Main Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-gray-900">{Math.round(primaryProgress)}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={primaryProgress} 
                className="h-4"
              />
              {/* Time variance indicator */}
              {!isCompleted && Math.abs(timeVariance) > 5 && (
                <div 
                  className={`absolute top-0 h-4 rounded-full opacity-30 ${
                    timeVariance > 0 ? 'bg-orange-400' : 'bg-green-400'
                  }`}
                  style={{ width: `${Math.min(Math.abs(timeVariance), 100)}%` }}
                />
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Step-based progress</span>
              {!isCompleted && Math.abs(timeVariance) > 5 && (
                <span className={timeVariance > 0 ? 'text-orange-600' : 'text-green-600'}>
                  {timeVariance > 0 ? 'Time pressure' : 'Ahead of time'}
                </span>
              )}
            </div>
          </div>

          {/* Time Information Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <PlayCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Started</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {format(startTime, "HH:mm")}
              </p>
              <p className="text-xs text-gray-500">
                {format(startTime, "MMM d")}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Elapsed</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatElapsedTime(elapsedSeconds)}
              </p>
              <p className="text-xs text-gray-500">
                Since start
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Estimated End</span>
              </div>
              <p className={`text-sm font-semibold ${statusInfo.color}`}>
                {isCompleted ? "Completed" : format(estimatedEndTime, "HH:mm")}
              </p>
              <p className="text-xs text-gray-500">
                {isCompleted ? formatElapsedTime(elapsedSeconds) : formatDuration(Math.abs(remainingMinutes))}
              </p>
            </div>

            {projectedCompletion && !isCompleted && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Projected</span>
                </div>
                <p className="text-sm font-semibold text-blue-600">
                  {format(projectedCompletion, "HH:mm")}
                </p>
                <p className="text-xs text-gray-500">
                  Based on pace
                </p>
              </div>
            )}
          </div>

          {/* Step Progress Visualization */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Steps Completed</span>
              <span className="text-sm text-gray-600">{currentStep} of {totalSteps}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`h-3 flex-1 rounded-full transition-all duration-300 ${
                    index < currentStep
                      ? statusInfo.bgColor
                      : index === currentStep
                      ? "bg-blue-200 animate-pulse"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          {!isCompleted && currentStep > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Performance Insights</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Avg. time per step:</span>
                  <span className="ml-2 font-medium">{Math.round(elapsedMinutes / currentStep)}m</span>
                </div>
                <div>
                  <span className="text-gray-600">Completion rate:</span>
                  <span className="ml-2 font-medium">{Math.round((currentStep / elapsedMinutes) * 60)}/hr</span>
                </div>
              </div>
              {projectedCompletion && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-600 text-sm">
                    At current pace, completion expected at{' '}
                    <strong className="text-blue-600">{format(projectedCompletion, "HH:mm")}</strong>
                    {isAfter(projectedCompletion, estimatedEndTime) && (
                      <span className="text-orange-600 ml-1">
                        ({Math.round(differenceInMinutes(projectedCompletion, estimatedEndTime))}m late)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Status Messages */}
          {isOverdue && !isCompleted && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Procedure is {formatDuration(Math.abs(remainingMinutes))} overdue
                </span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Consider reviewing remaining steps or extending the timeline.
              </p>
            </div>
          )}

          {isAheadOfSchedule && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Great progress! You're ahead of schedule</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Maintain quality while keeping up the pace.
              </p>
            </div>
          )}

          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Procedure completed in {formatElapsedTime(elapsedSeconds)}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                {elapsedMinutes <= estimatedDurationMinutes 
                  ? `Finished ${estimatedDurationMinutes - elapsedMinutes}m ahead of schedule!`
                  : `Completed ${elapsedMinutes - estimatedDurationMinutes}m over estimated time.`
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
