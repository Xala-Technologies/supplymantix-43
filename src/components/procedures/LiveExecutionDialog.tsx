
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle2,
  AlertTriangle,
  Timer,
  Activity,
  Award,
  TrendingUp,
  X
} from "lucide-react";
import { format, differenceInMinutes, differenceInSeconds, addMinutes, isAfter } from "date-fns";

interface LiveExecutionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  procedureTitle: string;
  procedureId: string;
  currentStep: number;
  totalSteps: number;
  isCompleted?: boolean;
  isPaused?: boolean;
  executorName?: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  onPause?: () => void;
  onResume?: () => void;
  onComplete?: () => void;
  onStop?: () => void;
}

export const LiveExecutionDialog: React.FC<LiveExecutionDialogProps> = ({
  isOpen,
  onClose,
  procedureTitle,
  procedureId,
  currentStep,
  totalSteps,
  isCompleted = false,
  isPaused = false,
  executorName = "Current User",
  location = "Workshop",
  priority = 'medium',
  onPause,
  onResume,
  onComplete,
  onStop
}) => {
  const [startTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!isPaused && !isCompleted) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused, isCompleted]);

  const estimatedDurationMinutes = totalSteps * 5; // 5 minutes per step estimate
  const estimatedEndTime = addMinutes(startTime, estimatedDurationMinutes);
  const elapsedSeconds = differenceInSeconds(currentTime, startTime);
  const elapsedMinutes = differenceInMinutes(currentTime, startTime);
  const remainingMinutes = Math.max(0, differenceInMinutes(estimatedEndTime, currentTime));
  
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

  const getPriorityColor = () => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusInfo = () => {
    if (isCompleted) return { icon: CheckCircle2, text: 'Completed', color: 'text-green-600' };
    if (isPaused) return { icon: Pause, text: 'Paused', color: 'text-yellow-600' };
    if (isOverdue) return { icon: AlertTriangle, text: 'Overdue', color: 'text-red-600' };
    if (isAheadOfSchedule) return { icon: TrendingUp, text: 'Ahead', color: 'text-emerald-600' };
    return { icon: Activity, text: 'Running', color: 'text-blue-600' };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        {/* Header Section */}
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Timer className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">Live Execution</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">{procedureTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={`border ${getPriorityColor()}`}>
                {priority.toUpperCase()}
              </Badge>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                isCompleted ? 'bg-green-100 text-green-800' :
                isPaused ? 'bg-yellow-100 text-yellow-800' :
                isOverdue ? 'bg-red-100 text-red-800' :
                isAheadOfSchedule ? 'bg-emerald-100 text-emerald-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                <StatusIcon className="h-4 w-4" />
                <span>{statusInfo.text}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content Section */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Progress Overview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-800">Overall Progress</span>
                <span className="text-xl font-bold text-blue-600">
                  {Math.round(stepProgress)}%
                </span>
              </div>
              
              <div className="space-y-2">
                <Progress value={stepProgress} className="h-3" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{currentStep} of {totalSteps} steps completed</span>
                  <span>{formatTime(elapsedSeconds)} elapsed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Started</p>
                <p className="text-lg font-bold text-gray-900">{format(startTime, "HH:mm")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Timer className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Elapsed</p>
                <p className="text-lg font-bold text-gray-900">{formatTime(elapsedSeconds)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">ETA</p>
                <p className="text-lg font-bold text-gray-900">
                  {isCompleted ? 'Done' : `${remainingMinutes}m`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Context Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Executor</p>
                <p className="font-medium text-gray-900">{executorName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Location</p>
                <p className="font-medium text-gray-900">{location}</p>
              </div>
            </div>
          </div>

          {/* Step Visualization */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-800">Step Progress</span>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Complete</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span>Pending</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }, (_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      index < currentStep
                        ? 'bg-green-500'
                        : index === currentStep
                        ? 'bg-blue-500 animate-pulse'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {!isCompleted && (
            <>
              {isAheadOfSchedule && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-emerald-800">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">Excellent pace! Ahead of schedule</span>
                  </div>
                </div>
              )}

              {isOverdue && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold">
                      Behind schedule by {Math.abs(remainingMinutes)} minutes
                    </span>
                  </div>
                </div>
              )}

              {isPaused && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-yellow-800">
                    <Pause className="h-5 w-5" />
                    <span className="font-semibold">Procedure execution paused</span>
                  </div>
                </div>
              )}
            </>
          )}

          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <span className="font-semibold">Procedure completed successfully! 🎉</span>
                  <p className="text-sm mt-1">
                    Total time: {formatTime(elapsedSeconds)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-0 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Close
            </Button>
            
            <div className="flex gap-2">
              {!isCompleted && (
                <>
                  {!isPaused ? (
                    <Button variant="outline" onClick={onPause} className="flex items-center gap-2">
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={onResume} className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Resume
                    </Button>
                  )}
                  
                  <Button variant="destructive" onClick={onStop} className="flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    Stop
                  </Button>
                  
                  <Button onClick={onComplete} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Complete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
