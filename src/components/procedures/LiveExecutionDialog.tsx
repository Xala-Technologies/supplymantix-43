
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  TrendingUp,
  X,
  ChevronRight
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

  const estimatedDurationMinutes = totalSteps * 5;
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
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
    }
  };

  const getStatusInfo = () => {
    if (isCompleted) return { icon: CheckCircle2, text: 'Completed', color: 'text-green-600', bg: 'bg-green-50' };
    if (isPaused) return { icon: Pause, text: 'Paused', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (isOverdue) return { icon: AlertTriangle, text: 'Overdue', color: 'text-red-600', bg: 'bg-red-50' };
    if (isAheadOfSchedule) return { icon: TrendingUp, text: 'Ahead', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    return { icon: Activity, text: 'Running', color: 'text-blue-600', bg: 'bg-blue-50' };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor()}`} />
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {procedureTitle}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Live Execution Monitor</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg}`}>
            <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
            <span className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-6">
            {/* Progress Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Timer className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Progress</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(stepProgress)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentStep} of {totalSteps} steps
                    </div>
                  </div>
                </div>
                
                <Progress value={stepProgress} className="h-3 mb-4" />
                
                {/* Step Visualization */}
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
                
                {/* Current Step Indicator */}
                {!isCompleted && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <ChevronRight className="h-4 w-4" />
                    <span>Step {currentStep + 1}: In Progress</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timing & Context */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Elapsed Time</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatTime(elapsedSeconds)}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <User className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Executor</div>
                  <div className="text-lg font-semibold text-gray-900 truncate">
                    {executorName}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Location</div>
                  <div className="text-lg font-semibold text-gray-900 truncate">
                    {location}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Messages */}
            {!isCompleted && (
              <>
                {isAheadOfSchedule && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 text-emerald-800">
                      <TrendingUp className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">Excellent Progress!</div>
                        <div className="text-sm">You're ahead of the estimated schedule</div>
                      </div>
                    </div>
                  </div>
                )}

                {isOverdue && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">Behind Schedule</div>
                        <div className="text-sm">
                          Running {Math.abs(remainingMinutes)} minutes behind estimated time
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isPaused && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 text-yellow-800">
                      <Pause className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">Execution Paused</div>
                        <div className="text-sm">Click Resume to continue the procedure</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <div className="text-lg font-semibold text-green-800 mb-1">
                  Procedure Completed Successfully! 🎉
                </div>
                <div className="text-sm text-green-700">
                  Total execution time: {formatTime(elapsedSeconds)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-white">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Close
            </Button>
            
            {!isCompleted && (
              <div className="flex gap-3">
                {!isPaused ? (
                  <Button 
                    variant="outline" 
                    onClick={onPause} 
                    className="flex items-center gap-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                ) : (
                  <Button 
                    onClick={onResume} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4" />
                    Resume
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={onStop} 
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
                
                <Button 
                  onClick={onComplete} 
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Complete
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
