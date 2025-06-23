
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Calendar, 
  Timer, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  PlayCircle,
  User,
  MapPin,
  Target,
  Zap,
  Activity
} from "lucide-react";
import { format, differenceInMinutes, addMinutes, isAfter, differenceInSeconds } from "date-fns";

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
  executorName = "Current User",
  location = "Workshop",
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

  const estimatedEndTime = addMinutes(startTime, estimatedDurationMinutes);
  const elapsedMinutes = Math.max(0, differenceInMinutes(currentTime, startTime));
  const elapsedSeconds = Math.max(0, differenceInSeconds(currentTime, startTime));
  const remainingMinutes = isCompleted ? 0 : differenceInMinutes(estimatedEndTime, currentTime);
  
  const stepProgress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const timeProgress = estimatedDurationMinutes > 0 ? Math.min((elapsedMinutes / estimatedDurationMinutes) * 100, 100) : 0;
  
  const isOverdue = isAfter(currentTime, estimatedEndTime) && !isCompleted;
  const isAheadOfSchedule = stepProgress > timeProgress + 15 && !isCompleted;

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getPriorityGradient = () => {
    switch (priority) {
      case 'critical': return 'from-red-500 to-red-700';
      case 'high': return 'from-orange-500 to-orange-700';
      case 'medium': return 'from-blue-500 to-blue-700';
      case 'low': return 'from-green-500 to-green-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600';
    if (isOverdue) return 'text-red-600';
    if (isAheadOfSchedule) return 'text-emerald-600';
    return 'text-blue-600';
  };

  const getStatusIcon = () => {
    if (isCompleted) return CheckCircle;
    if (isOverdue) return AlertTriangle;
    if (isAheadOfSchedule) return TrendingUp;
    return Activity;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className={`relative ${className}`}>
      {/* Main Timeline Card */}
      <Card className="overflow-hidden shadow-xl border-0">
        <div className={`h-2 bg-gradient-to-r ${getPriorityGradient()}`} />
        
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${getPriorityGradient()} shadow-lg`}>
                <Timer className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Live Execution</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Real-time progress tracking
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className={`px-3 py-1 font-semibold ${
                  priority === 'critical' ? 'border-red-500 text-red-700 bg-red-50' :
                  priority === 'high' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                  priority === 'medium' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                  'border-green-500 text-green-700 bg-green-50'
                }`}
              >
                {priority.toUpperCase()}
              </Badge>
              
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isCompleted ? 'bg-green-100 text-green-800' :
                isOverdue ? 'bg-red-100 text-red-800' :
                isAheadOfSchedule ? 'bg-emerald-100 text-emerald-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                <StatusIcon className="h-4 w-4" />
                <span className="font-medium text-sm">
                  {isCompleted ? 'Completed' :
                   isOverdue ? 'Overdue' :
                   isAheadOfSchedule ? 'Ahead' : 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-gray-800">Progress</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {Math.round(stepProgress)}%
              </span>
            </div>
            
            <div className="relative">
              <Progress 
                value={stepProgress} 
                className="h-4 rounded-full shadow-inner bg-gray-100" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-lg">
                  {currentStep} / {totalSteps} steps
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <PlayCircle className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800 uppercase tracking-wide">Started</span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                {format(startTime, "HH:mm")}
              </p>
              <p className="text-xs text-blue-700">{format(startTime, "MMM d")}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-800 uppercase tracking-wide">Elapsed</span>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {formatTime(elapsedSeconds)}
              </p>
              <p className="text-xs text-purple-700">Active time</p>
            </div>

            <div className={`bg-gradient-to-br rounded-xl p-4 border ${
              isCompleted ? 'from-green-50 to-green-100 border-green-200' :
              isOverdue ? 'from-red-50 to-red-100 border-red-200' :
              'from-amber-50 to-amber-100 border-amber-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Timer className={`h-4 w-4 ${
                  isCompleted ? 'text-green-600' :
                  isOverdue ? 'text-red-600' :
                  'text-amber-600'
                }`} />
                <span className={`text-xs font-medium uppercase tracking-wide ${
                  isCompleted ? 'text-green-800' :
                  isOverdue ? 'text-red-800' :
                  'text-amber-800'
                }`}>
                  {isCompleted ? 'Finished' : 'Est. End'}
                </span>
              </div>
              <p className={`text-lg font-bold ${
                isCompleted ? 'text-green-900' :
                isOverdue ? 'text-red-900' :
                'text-amber-900'
              }`}>
                {isCompleted ? 'Done' : format(estimatedEndTime, "HH:mm")}
              </p>
              <p className={`text-xs ${
                isCompleted ? 'text-green-700' :
                isOverdue ? 'text-red-700' :
                'text-amber-700'
              }`}>
                {isCompleted ? 'Completed' : 
                 isOverdue ? `${Math.abs(remainingMinutes)}m over` :
                 `${remainingMinutes}m left`}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-800 uppercase tracking-wide">Rate</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {currentStep > 0 ? Math.round((currentStep / elapsedMinutes) * 60) : 0}/hr
              </p>
              <p className="text-xs text-gray-700">Steps per hour</p>
            </div>
          </div>

          {/* Context Information */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-gray-600">Executor</span>
                  <p className="font-medium text-gray-900">{executorName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-gray-600">Location</span>
                  <p className="font-medium text-gray-900">{location}</p>
                </div>
              </div>

              {scheduledDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-gray-600">Scheduled</span>
                    <p className="font-medium text-gray-900">{format(scheduledDate, "HH:mm")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step Progress Visualization */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Step Progress</span>
              <span className="text-sm text-gray-600">{currentStep}/{totalSteps} completed</span>
            </div>
            
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`h-3 flex-1 rounded-full transition-all duration-300 ${
                    index < currentStep
                      ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-sm'
                      : index === currentStep
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse shadow-sm'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Status Messages */}
          {isAheadOfSchedule && !isCompleted && (
            <div className="mt-4 bg-emerald-50 border-l-4 border-l-emerald-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 text-emerald-800">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">Excellent pace! You're ahead of schedule</span>
              </div>
              <p className="text-sm text-emerald-700 mt-1">
                Keep up the great work while maintaining quality standards.
              </p>
            </div>
          )}

          {isOverdue && !isCompleted && (
            <div className="mt-4 bg-red-50 border-l-4 border-l-red-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">
                  Procedure is running {Math.abs(remainingMinutes)} minutes behind
                </span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Consider adjusting timeline or seeking assistance to get back on track.
              </p>
            </div>
          )}

          {isCompleted && (
            <div className="mt-4 bg-green-50 border-l-4 border-l-green-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">
                  Procedure completed successfully! 🎉
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Total time: {formatTime(elapsedSeconds)} 
                {elapsedMinutes <= estimatedDurationMinutes 
                  ? ` (${estimatedDurationMinutes - elapsedMinutes}m ahead of schedule)`
                  : ` (${elapsedMinutes - estimatedDurationMinutes}m over estimate)`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
