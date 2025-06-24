
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Timer, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  PlayCircle,
  User,
  MapPin,
  Activity,
  PauseCircle,
  Award,
  Eye
} from "lucide-react";
import { format, differenceInMinutes, addMinutes, isAfter, differenceInSeconds } from "date-fns";
import { LiveExecutionDialog } from "./LiveExecutionDialog";

interface ExecutionTimelineProps {
  startTime: Date;
  scheduledDate?: Date;
  estimatedDurationMinutes?: number;
  currentStep: number;
  totalSteps: number;
  isCompleted?: boolean;
  isPaused?: boolean;
  executorName?: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  qualityScore?: number;
  efficiency?: number;
  className?: string;
  procedureTitle?: string;
  procedureId?: string;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({
  startTime,
  scheduledDate,
  estimatedDurationMinutes = 30,
  currentStep,
  totalSteps,
  isCompleted = false,
  isPaused = false,
  executorName = "Current User",
  location = "Workshop",
  priority = 'medium',
  qualityScore = 95,
  efficiency = 87,
  className = "",
  procedureTitle = "Procedure Execution",
  procedureId = "proc-1"
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDetailDialog, setShowDetailDialog] = useState(false);

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

  const getPriorityConfig = () => {
    switch (priority) {
      case 'critical': return { 
        color: 'bg-red-50 text-red-700 border-red-200',
        accent: 'text-red-600'
      };
      case 'high': return { 
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        accent: 'text-orange-600'
      };
      case 'medium': return { 
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        accent: 'text-blue-600'
      };
      case 'low': return { 
        color: 'bg-green-50 text-green-700 border-green-200',
        accent: 'text-green-600'
      };
    }
  };

  const config = getPriorityConfig();

  const getStatusIcon = () => {
    if (isCompleted) return CheckCircle;
    if (isPaused) return PauseCircle;
    if (isOverdue) return AlertTriangle;
    if (isAheadOfSchedule) return TrendingUp;
    return Activity;
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isPaused) return 'Paused';
    if (isOverdue) return 'Overdue';
    if (isAheadOfSchedule) return 'Ahead';
    return 'Active';
  };

  const StatusIcon = getStatusIcon();

  const handlePause = () => {
    console.log('Pausing execution');
  };

  const handleResume = () => {
    console.log('Resuming execution');
  };

  const handleComplete = () => {
    console.log('Completing execution');
  };

  const handleStop = () => {
    console.log('Stopping execution');
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <Card className="overflow-hidden shadow-sm border">
          <CardContent className="p-4">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Timer className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Live Execution</h3>
                  <p className="text-xs text-gray-600">Real-time tracking</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={`border text-xs ${config.color}`}>
                  {priority.toUpperCase()}
                </Badge>
                
                <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                  isCompleted ? 'bg-green-100 text-green-800' :
                  isPaused ? 'bg-yellow-100 text-yellow-800' :
                  isOverdue ? 'bg-red-100 text-red-800' :
                  isAheadOfSchedule ? 'bg-emerald-100 text-emerald-800' :
                  config.color
                }`}>
                  <StatusIcon className="h-3 w-3" />
                  <span>{getStatusText()}</span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-800">Progress</span>
                <span className="text-lg font-bold text-blue-600">
                  {Math.round(stepProgress)}%
                </span>
              </div>
              
              <Progress value={stepProgress} className="h-2 mb-2" />
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>{currentStep} / {totalSteps} steps</span>
                <span>{formatTime(elapsedSeconds)} elapsed</span>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Executor</p>
                  <p className="text-sm font-medium text-gray-900">{executorName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Location</p>
                  <p className="text-sm font-medium text-gray-900">{location}</p>
                </div>
              </div>
            </div>

            {/* Step Visualization */}
            <div className="mb-4">
              <div className="flex gap-1 mb-2">
                {Array.from({ length: totalSteps }, (_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                      index < currentStep
                        ? 'bg-green-500'
                        : index === currentStep
                        ? 'bg-blue-500 animate-pulse'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Status Messages */}
            {!isCompleted && isAheadOfSchedule && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-emerald-800">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">Ahead of schedule!</span>
                </div>
              </div>
            )}

            {!isCompleted && isOverdue && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-semibold">
                    Behind by {Math.abs(remainingMinutes)} minutes
                  </span>
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">Completed successfully! 🎉</span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button 
              onClick={() => setShowDetailDialog(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Live Details
            </Button>
          </CardContent>
        </Card>
      </div>

      <LiveExecutionDialog
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        procedureTitle={procedureTitle}
        procedureId={procedureId}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isCompleted={isCompleted}
        isPaused={isPaused}
        executorName={executorName}
        location={location}
        priority={priority}
        onPause={handlePause}
        onResume={handleResume}
        onComplete={handleComplete}
        onStop={handleStop}
      />
    </>
  );
};
