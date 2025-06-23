
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
  PlayCircle,
  User,
  MapPin,
  Target
} from "lucide-react";
import { format, differenceInMinutes, addMinutes, isAfter, differenceInSeconds, isToday, isFuture } from "date-fns";

interface ExecutionTimelineProps {
  startTime: Date;
  scheduledDate?: Date;
  estimatedDurationMinutes?: number;
  currentStep: number;
  totalSteps: number;
  isCompleted?: boolean;
  executorName?: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({
  startTime,
  scheduledDate,
  estimatedDurationMinutes = 30,
  currentStep,
  totalSteps,
  isCompleted = false,
  executorName,
  location,
  priority = 'medium',
  className = ""
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Determine if execution is scheduled for future
  const isScheduledExecution = scheduledDate && isFuture(scheduledDate);
  const isLateStart = scheduledDate && isAfter(startTime, scheduledDate);
  
  const estimatedEndTime = addMinutes(startTime, estimatedDurationMinutes);
  const elapsedMinutes = Math.max(0, differenceInMinutes(currentTime, startTime));
  const elapsedSeconds = Math.max(0, differenceInSeconds(currentTime, startTime));
  const remainingMinutes = isCompleted ? 0 : differenceInMinutes(estimatedEndTime, currentTime);
  
  // Calculate progress based on steps completed
  const stepProgress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const timeProgress = estimatedDurationMinutes > 0 ? Math.min((elapsedMinutes / estimatedDurationMinutes) * 100, 100) : 0;
  
  const isOverdue = isAfter(currentTime, estimatedEndTime) && !isCompleted;
  const isAheadOfSchedule = stepProgress > timeProgress + 10 && !isCompleted;
  const isBehindSchedule = stepProgress < timeProgress - 10 && !isCompleted && timeProgress > 15;

  const formatDuration = (minutes: number): string => {
    if (minutes < 0) {
      const overdue = Math.abs(minutes);
      if (overdue < 60) return `${overdue}m overdue`;
      const hours = Math.floor(overdue / 60);
      const mins = overdue % 60;
      return `${hours}h ${mins}m overdue`;
    }
    if (minutes < 60) return `${minutes}m remaining`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m remaining`;
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
      const completionTime = elapsedMinutes <= estimatedDurationMinutes ? 'On Time' : 'Completed Late';
      return {
        color: "text-green-600",
        bgColor: "bg-green-500",
        status: completionTime,
        icon: CheckCircle,
        variant: "success" as const
      };
    }
    if (isOverdue) {
      return {
        color: "text-red-600",
        bgColor: "bg-red-500",
        status: "Overdue",
        icon: AlertCircle,
        variant: "destructive" as const
      };
    }
    if (isAheadOfSchedule) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-500",
        status: "Ahead of Schedule",
        icon: TrendingUp,
        variant: "success" as const
      };
    }
    if (isBehindSchedule) {
      return {
        color: "text-amber-600",
        bgColor: "bg-amber-500",
        status: "Behind Schedule",
        icon: TrendingDown,
        variant: "warning" as const
      };
    }
    return {
      color: "text-blue-600",
      bgColor: "bg-blue-500",
      status: "In Progress",
      icon: PlayCircle,
      variant: "default" as const
    };
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'critical': return 'border-l-red-600 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
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
    <Card className={`border-l-4 ${getPriorityColor()} shadow-lg ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with Priority and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${isCompleted ? 'bg-green-100' : isOverdue ? 'bg-red-100' : isAheadOfSchedule ? 'bg-green-100' : isBehindSchedule ? 'bg-amber-100' : 'bg-blue-100'}`}>
                <Timer className={`h-6 w-6 ${statusInfo.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Execution Timeline</h3>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Real-time progress tracking
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs font-medium ${
                priority === 'critical' ? 'border-red-500 text-red-700' :
                priority === 'high' ? 'border-orange-500 text-orange-700' :
                priority === 'medium' ? 'border-blue-500 text-blue-700' :
                'border-green-500 text-green-700'
              }`}>
                {priority.toUpperCase()} PRIORITY
              </Badge>
              <Badge variant={statusInfo.variant} className="flex items-center gap-1 font-medium">
                <StatusIcon className="h-3 w-3" />
                {statusInfo.status}
              </Badge>
            </div>
          </div>

          {/* Execution Context */}
          <div className="bg-white rounded-lg border p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">Execution Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {scheduledDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-gray-600">Scheduled:</span>
                    <p className="font-medium text-gray-900">
                      {format(scheduledDate, "MMM d, yyyy 'at' HH:mm")}
                    </p>
                    {isLateStart && (
                      <p className="text-red-600 text-xs">Started late</p>
                    )}
                  </div>
                </div>
              )}
              {executorName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-gray-600">Executor:</span>
                    <p className="font-medium text-gray-900">{executorName}</p>
                  </div>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <p className="font-medium text-gray-900">{location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Visualization */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-lg font-bold text-gray-900">{Math.round(stepProgress)}%</span>
            </div>
            <div className="relative">
              <Progress value={stepProgress} className="h-6 rounded-full shadow-inner" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow">
                  {currentStep} of {totalSteps} steps
                </span>
              </div>
            </div>
          </div>

          {/* Time Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <PlayCircle className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Started</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {format(startTime, "HH:mm")}
              </p>
              <p className="text-xs text-gray-500">
                {isToday(startTime) ? 'Today' : format(startTime, "MMM d")}
              </p>
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Elapsed</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {formatElapsedTime(elapsedSeconds)}
              </p>
              <p className="text-xs text-gray-500">
                Active time
              </p>
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Timer className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Est. End</span>
              </div>
              <p className={`text-lg font-bold ${statusInfo.color}`}>
                {isCompleted ? "Completed" : format(estimatedEndTime, "HH:mm")}
              </p>
              <p className="text-xs text-gray-500">
                {isCompleted ? formatElapsedTime(elapsedSeconds) + ' total' : formatDuration(Math.abs(remainingMinutes))}
              </p>
            </div>

            {projectedCompletion && !isCompleted && (
              <div className="bg-white rounded-lg border p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Projected</span>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  {format(projectedCompletion, "HH:mm")}
                </p>
                <p className="text-xs text-gray-500">
                  Current pace
                </p>
              </div>
            )}
          </div>

          {/* Step Progress Visualization */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Step Progress</span>
              <span className="text-sm text-gray-600">{currentStep}/{totalSteps} completed</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    index < currentStep
                      ? statusInfo.bgColor + ' shadow-sm'
                      : index === currentStep
                      ? "bg-blue-300 animate-pulse shadow-sm"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Performance Analytics */}
          {!isCompleted && currentStep > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance Analytics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-600">Avg. time per step:</span>
                  <span className="block font-semibold text-gray-900">{Math.round(elapsedMinutes / currentStep)}m</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-600">Completion velocity:</span>
                  <span className="block font-semibold text-gray-900">{Math.round((currentStep / elapsedMinutes) * 60)}/hr</span>
                </div>
              </div>
              {projectedCompletion && (
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    At current pace, completion expected at{' '}
                    <strong className="text-blue-600">{format(projectedCompletion, "HH:mm")}</strong>
                    {isAfter(projectedCompletion, estimatedEndTime) && (
                      <span className="text-amber-600 ml-1 font-medium">
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
            <div className="bg-red-50 border-l-4 border-l-red-500 p-4 rounded">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">
                  Procedure is {formatDuration(Math.abs(remainingMinutes)).replace(' remaining', '')}
                </span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Consider escalating or adjusting timeline expectations.
              </p>
            </div>
          )}

          {isAheadOfSchedule && (
            <div className="bg-green-50 border-l-4 border-l-green-500 p-4 rounded">
              <div className="flex items-center gap-2 text-green-800">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">Excellent progress! Ahead of schedule</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Maintain quality standards while keeping up the pace.
              </p>
            </div>
          )}

          {isCompleted && (
            <div className="bg-green-50 border-l-4 border-l-green-500 p-4 rounded">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">
                  Procedure completed successfully in {formatElapsedTime(elapsedSeconds)}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {elapsedMinutes <= estimatedDurationMinutes 
                  ? `Finished ${estimatedDurationMinutes - elapsedMinutes}m ahead of schedule! 🎉`
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
