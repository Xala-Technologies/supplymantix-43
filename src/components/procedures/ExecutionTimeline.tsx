
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
  Zap,
  Activity,
  PauseCircle,
  Award,
  Gauge,
  ArrowUp
} from "lucide-react";
import { format, differenceInMinutes, addMinutes, isAfter, differenceInSeconds } from "date-fns";

interface ExecutionStep {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'skipped' | 'failed';
  startTime?: Date;
  endTime?: Date;
  estimatedDuration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  criticalPath: boolean;
}

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
  steps?: ExecutionStep[];
  qualityScore?: number;
  efficiency?: number;
  className?: string;
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
  steps = [],
  qualityScore = 95,
  efficiency = 87,
  className = ""
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate realistic steps if not provided
  const executionSteps: ExecutionStep[] = steps.length > 0 ? steps : [
    {
      id: '1',
      name: 'Safety Check & Equipment Verification',
      status: (currentStep > 0 ? 'completed' : 'active') as 'pending' | 'active' | 'completed' | 'skipped' | 'failed',
      startTime: currentStep > 0 ? startTime : new Date(),
      endTime: currentStep > 0 ? addMinutes(startTime, 3) : undefined,
      estimatedDuration: 180,
      difficulty: 'easy' as 'easy' | 'medium' | 'hard',
      criticalPath: true
    },
    {
      id: '2', 
      name: 'Component Calibration',
      status: (currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending') as 'pending' | 'active' | 'completed' | 'skipped' | 'failed',
      startTime: currentStep > 1 ? addMinutes(startTime, 3) : currentStep === 1 ? new Date() : undefined,
      endTime: currentStep > 1 ? addMinutes(startTime, 8) : undefined,
      estimatedDuration: 300,
      difficulty: 'medium' as 'easy' | 'medium' | 'hard',
      criticalPath: true
    },
    {
      id: '3',
      name: 'Performance Testing',
      status: (currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending') as 'pending' | 'active' | 'completed' | 'skipped' | 'failed',
      startTime: currentStep > 2 ? addMinutes(startTime, 8) : currentStep === 2 ? new Date() : undefined,
      endTime: currentStep > 2 ? addMinutes(startTime, 15) : undefined,
      estimatedDuration: 420,
      difficulty: 'hard' as 'easy' | 'medium' | 'hard',
      criticalPath: true
    },
    {
      id: '4',
      name: 'Quality Verification',
      status: (currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending') as 'pending' | 'active' | 'completed' | 'skipped' | 'failed',
      startTime: currentStep > 3 ? addMinutes(startTime, 15) : currentStep === 3 ? new Date() : undefined,
      endTime: currentStep > 3 ? addMinutes(startTime, 20) : undefined,
      estimatedDuration: 300,
      difficulty: 'medium' as 'easy' | 'medium' | 'hard',
      criticalPath: false
    },
    {
      id: '5',
      name: 'Documentation & Sign-off',
      status: (currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : 'pending') as 'pending' | 'active' | 'completed' | 'skipped' | 'failed',
      startTime: currentStep > 4 ? addMinutes(startTime, 20) : currentStep === 4 ? new Date() : undefined,
      endTime: currentStep > 4 ? addMinutes(startTime, 25) : undefined,
      estimatedDuration: 300,
      difficulty: 'easy' as 'easy' | 'medium' | 'hard',
      criticalPath: false
    }
  ].slice(0, totalSteps);

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

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600';
    if (isPaused) return 'text-yellow-600';
    if (isOverdue) return 'text-red-600';
    if (isAheadOfSchedule) return 'text-emerald-600';
    return config.accent;
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isPaused) return 'Paused';
    if (isOverdue) return 'Overdue';
    if (isAheadOfSchedule) return 'Ahead';
    return 'Active';
  };

  const StatusIcon = getStatusIcon();
  const currentStepData = executionSteps[currentStep];

  return (
    <div className={`relative ${className}`}>
      <Card className="overflow-hidden shadow-md border-0">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Timer className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Live Execution</h3>
                <p className="text-sm text-gray-600">Real-time procedure tracking</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={`border ${config.color}`}>
                {priority.toUpperCase()}
              </Badge>
              
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                isCompleted ? 'bg-green-100 text-green-800' :
                isPaused ? 'bg-yellow-100 text-yellow-800' :
                isOverdue ? 'bg-red-100 text-red-800' :
                isAheadOfSchedule ? 'bg-emerald-100 text-emerald-800' :
                config.color
              }`}>
                <StatusIcon className="h-4 w-4" />
                <span>{getStatusText()}</span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-800">Overall Progress</span>
              <span className="text-2xl font-bold text-blue-600">
                {Math.round(stepProgress)}%
              </span>
            </div>
            
            <div className="relative mb-4">
              <Progress value={stepProgress} className="h-2 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-lg">
                  {currentStep} / {totalSteps} steps
                </span>
              </div>
            </div>

            {/* Current Step */}
            {currentStepData && !isCompleted && (
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Current Step</h4>
                    <p className="text-sm text-gray-700">{currentStepData.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentStepData.criticalPath && (
                      <Badge variant="outline" className="text-xs border-red-300 text-red-700 bg-red-50">
                        Critical
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs capitalize">
                      {currentStepData.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Started</p>
                    <p className="text-lg font-bold text-blue-900">{format(startTime, "HH:mm")}</p>
                  </div>
                  <PlayCircle className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Elapsed</p>
                    <p className="text-lg font-bold text-purple-900">{formatTime(elapsedSeconds)}</p>
                  </div>
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Quality</p>
                    <p className="text-lg font-bold text-emerald-900">{qualityScore}%</p>
                  </div>
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Efficiency</p>
                    <p className="text-lg font-bold text-amber-900">{efficiency}%</p>
                  </div>
                  <Gauge className="w-6 h-6 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step Progress Visualization */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-800">Step Timeline</span>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Complete</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <span>Pending</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-1">
              {executionSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                    step.status === 'completed'
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : step.status === 'active'
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse'
                      : step.status === 'failed'
                      ? 'bg-gradient-to-r from-red-400 to-red-600'
                      : 'bg-gray-200'
                  }`}
                  title={step.name}
                />
              ))}
            </div>
          </div>

          {/* Context Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <span className="text-xs text-gray-600 uppercase tracking-wide">Executor</span>
                <p className="font-medium text-gray-900">{executorName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <span className="text-xs text-gray-600 uppercase tracking-wide">Location</span>
                <p className="font-medium text-gray-900">{location}</p>
              </div>
            </div>
          </div>

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
                    <PauseCircle className="h-5 w-5" />
                    <span className="font-semibold">Procedure execution paused</span>
                  </div>
                </div>
              )}
            </>
          )}

          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <div>
                  <span className="font-semibold">Procedure completed successfully! 🎉</span>
                  <p className="text-sm mt-1">
                    Total time: {formatTime(elapsedSeconds)} • Quality Score: {qualityScore}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
