
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
  Activity,
  PauseCircle,
  RotateCcw,
  Award,
  Brain,
  Gauge,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { format, differenceInMinutes, addMinutes, isAfter, differenceInSeconds } from "date-fns";

interface ExecutionStep {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'skipped' | 'failed';
  startTime?: Date;
  endTime?: Date;
  estimatedDuration: number; // in seconds
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
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate realistic steps if not provided
  const executionSteps: ExecutionStep[] = steps.length > 0 ? steps : [
    {
      id: '1',
      name: 'Safety Check & Equipment Verification',
      status: currentStep > 0 ? 'completed' : 'active',
      startTime: currentStep > 0 ? startTime : new Date(),
      endTime: currentStep > 0 ? addMinutes(startTime, 3) : undefined,
      estimatedDuration: 180,
      difficulty: 'easy',
      criticalPath: true
    },
    {
      id: '2', 
      name: 'Component Calibration',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending',
      startTime: currentStep > 1 ? addMinutes(startTime, 3) : currentStep === 1 ? new Date() : undefined,
      endTime: currentStep > 1 ? addMinutes(startTime, 8) : undefined,
      estimatedDuration: 300,
      difficulty: 'medium',
      criticalPath: true
    },
    {
      id: '3',
      name: 'Performance Testing',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending',
      startTime: currentStep > 2 ? addMinutes(startTime, 8) : currentStep === 2 ? new Date() : undefined,
      endTime: currentStep > 2 ? addMinutes(startTime, 15) : undefined,
      estimatedDuration: 420,
      difficulty: 'hard',
      criticalPath: true
    },
    {
      id: '4',
      name: 'Quality Verification',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending',
      startTime: currentStep > 3 ? addMinutes(startTime, 15) : currentStep === 3 ? new Date() : undefined,
      endTime: currentStep > 3 ? addMinutes(startTime, 20) : undefined,
      estimatedDuration: 300,
      difficulty: 'medium',
      criticalPath: false
    },
    {
      id: '5',
      name: 'Documentation & Sign-off',
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : 'pending',
      startTime: currentStep > 4 ? addMinutes(startTime, 20) : currentStep === 4 ? new Date() : undefined,
      endTime: currentStep > 4 ? addMinutes(startTime, 25) : undefined,
      estimatedDuration: 300,
      difficulty: 'easy',
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
        gradient: 'from-red-500 via-red-600 to-red-700', 
        glow: 'shadow-red-500/20',
        accent: 'text-red-600',
        bg: 'bg-red-50 border-red-200'
      };
      case 'high': return { 
        gradient: 'from-orange-500 via-orange-600 to-orange-700', 
        glow: 'shadow-orange-500/20',
        accent: 'text-orange-600',
        bg: 'bg-orange-50 border-orange-200'
      };
      case 'medium': return { 
        gradient: 'from-blue-500 via-blue-600 to-blue-700', 
        glow: 'shadow-blue-500/20',
        accent: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200'
      };
      case 'low': return { 
        gradient: 'from-green-500 via-green-600 to-green-700', 
        glow: 'shadow-green-500/20',
        accent: 'text-green-600',
        bg: 'bg-green-50 border-green-200'
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
      <Card className={`overflow-hidden shadow-2xl border-0 ${config.glow} shadow-2xl`}>
        {/* Animated Priority Stripe */}
        <div className={`h-1 bg-gradient-to-r ${config.gradient} relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse`} 
               style={{
                 animation: `slideRight 3s ease-in-out infinite ${animationPhase * 0.25}s`,
                 width: '200%',
                 left: '-100%'
               }} />
        </div>
        
        <CardContent className="p-4">
          {/* Compact Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg animate-pulse`}>
                <Timer className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Live Execution</h3>
                <p className="text-sm text-gray-600">Real-time procedure tracking</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`px-2 py-1 font-semibold ${config.bg} ${config.accent} border-current`}
              >
                {priority.toUpperCase()}
              </Badge>
              
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isCompleted ? 'bg-green-100 text-green-800' :
                isPaused ? 'bg-yellow-100 text-yellow-800' :
                isOverdue ? 'bg-red-100 text-red-800' :
                isAheadOfSchedule ? 'bg-emerald-100 text-emerald-800' :
                config.bg + ' ' + config.accent
              }`}>
                <StatusIcon className="h-3 w-3" />
                <span>{getStatusText()}</span>
              </div>
            </div>
          </div>

          {/* Progress & Current Step */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-800">Overall Progress</span>
              <span className={`text-lg font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                {Math.round(stepProgress)}%
              </span>
            </div>
            
            <div className="relative mb-3">
              <Progress value={stepProgress} className="h-3 rounded-full shadow-inner" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-lg">
                  {currentStep} / {totalSteps} steps
                </span>
              </div>
            </div>

            {/* Current Step Highlight */}
            {currentStepData && !isCompleted && (
              <div className={`p-3 rounded-lg ${config.bg} border relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-current to-transparent opacity-50 animate-pulse" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Current Step</h4>
                    <p className="text-sm text-gray-700">{currentStepData.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        currentStepData.criticalPath ? 'border-red-300 text-red-700 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      {currentStepData.criticalPath ? 'Critical' : 'Standard'}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {currentStepData.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-5 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-1 mb-1">
                <PlayCircle className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">Started</span>
              </div>
              <p className="text-sm font-bold text-blue-900">{format(startTime, "HH:mm")}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-800">Elapsed</span>
              </div>
              <p className="text-sm font-bold text-purple-900">{formatTime(elapsedSeconds)}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-200">
              <div className="flex items-center gap-1 mb-1">
                <Award className="h-3 w-3 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-800">Quality</span>
              </div>
              <p className="text-sm font-bold text-emerald-900">{qualityScore}%</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200">
              <div className="flex items-center gap-1 mb-1">
                <Gauge className="h-3 w-3 text-amber-600" />
                <span className="text-xs font-medium text-amber-800">Efficiency</span>
              </div>
              <p className="text-sm font-bold text-amber-900">{efficiency}%</p>
            </div>

            <div className={`bg-gradient-to-br rounded-lg p-3 border ${
              isCompleted ? 'from-green-50 to-emerald-50 border-green-200' :
              isOverdue ? 'from-red-50 to-pink-50 border-red-200' :
              'from-gray-50 to-slate-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-1 mb-1">
                <Timer className={`h-3 w-3 ${
                  isCompleted ? 'text-green-600' :
                  isOverdue ? 'text-red-600' :
                  'text-gray-600'
                }`} />
                <span className={`text-xs font-medium ${
                  isCompleted ? 'text-green-800' :
                  isOverdue ? 'text-red-800' :
                  'text-gray-800'
                }`}>
                  {isCompleted ? 'Done' : 'ETA'}
                </span>
              </div>
              <p className={`text-sm font-bold ${
                isCompleted ? 'text-green-900' :
                isOverdue ? 'text-red-900' :
                'text-gray-900'
              }`}>
                {isCompleted ? 'Complete' : format(estimatedEndTime, "HH:mm")}
              </p>
            </div>
          </div>

          {/* Step Progress Visualization */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-800">Step Timeline</span>
              <div className="flex items-center gap-2 text-xs text-gray-600">
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
                  className={`flex-1 h-2 rounded-full transition-all duration-500 relative ${
                    step.status === 'completed'
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-sm'
                      : step.status === 'active'
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse shadow-sm'
                      : step.status === 'failed'
                      ? 'bg-gradient-to-r from-red-400 to-red-600'
                      : 'bg-gray-200'
                  }`}
                  title={step.name}
                >
                  {step.criticalPath && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                      <AlertCircle className="h-2 w-2 text-red-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Context Information */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-gray-500" />
                <div>
                  <span className="text-gray-600">Executor</span>
                  <p className="font-medium text-gray-900">{executorName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-gray-500" />
                <div>
                  <span className="text-gray-600">Location</span>
                  <p className="font-medium text-gray-900">{location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Brain className="h-3 w-3 text-gray-500" />
                <div>
                  <span className="text-gray-600">AI Insights</span>
                  <p className="font-medium text-gray-900">
                    {efficiency > 90 ? 'Excellent' : efficiency > 80 ? 'Good' : 'Improving'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {!isCompleted && (
            <>
              {isAheadOfSchedule && (
                <div className="mt-3 bg-emerald-50 border-l-4 border-l-emerald-500 p-3 rounded-r-lg">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold text-sm">Excellent pace! Ahead of schedule</span>
                  </div>
                </div>
              )}

              {isOverdue && (
                <div className="mt-3 bg-red-50 border-l-4 border-l-red-500 p-3 rounded-r-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-semibold text-sm">
                      Behind schedule by {Math.abs(remainingMinutes)} minutes
                    </span>
                  </div>
                </div>
              )}

              {isPaused && (
                <div className="mt-3 bg-yellow-50 border-l-4 border-l-yellow-500 p-3 rounded-r-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <PauseCircle className="h-4 w-4" />
                    <span className="font-semibold text-sm">Procedure execution paused</span>
                  </div>
                </div>
              )}
            </>
          )}

          {isCompleted && (
            <div className="mt-3 bg-green-50 border-l-4 border-l-green-500 p-3 rounded-r-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-semibold text-sm">
                  Procedure completed successfully! 🎉
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Total time: {formatTime(elapsedSeconds)} • Quality Score: {qualityScore}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
};
