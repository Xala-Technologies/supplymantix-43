
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  Clock, 
  User, 
  MapPin,
  Timer,
  Activity,
  ArrowRight,
  Zap
} from "lucide-react";
import { ProcedureExecution } from "./ProcedureExecution";
import { format } from "date-fns";

interface ExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedure: any;
  executionId?: string;
  onComplete: (answers: any, score: number) => void;
  onCancel: () => void;
}

export const ExecutionDialog: React.FC<ExecutionDialogProps> = ({
  open,
  onOpenChange,
  procedure,
  executionId,
  onComplete,
  onCancel
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Early return if procedure is null or undefined
  if (!procedure) {
    return null;
  }

  const handleStart = () => {
    setIsExecuting(true);
  };

  const handleComplete = (answers: any, score: number) => {
    setIsExecuting(false);
    onComplete(answers, score);
  };

  const handleCancel = () => {
    setIsExecuting(false);
    onCancel();
  };

  const elapsedMinutes = Math.floor((currentTime.getTime() - startTime.getTime()) / 60000);
  const elapsedSeconds = Math.floor(((currentTime.getTime() - startTime.getTime()) % 60000) / 1000);

  if (!isExecuting) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="relative p-8 text-center">
            {/* Header */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Play className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Execute</h2>
              <p className="text-gray-600">You're about to start executing this procedure</p>
            </div>

            {/* Procedure Info */}
            <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-white/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{procedure.title || 'Untitled Procedure'}</h3>
              <p className="text-gray-600 mb-4">{procedure.description || 'No description available'}</p>
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Current User</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Workshop</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  <span>{procedure.fields?.length || 0} steps</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="px-8 py-3 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStart}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Execution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[95vh] p-0 overflow-hidden border-0">
        <div className="h-full flex">
          {/* Live Monitor Sidebar */}
          <div className="w-80 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 flex flex-col">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Live Execution</h3>
                  <p className="text-slate-300 text-sm">Real-time monitoring</p>
                </div>
              </div>
              
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Active
              </Badge>
            </div>

            {/* Time & Status */}
            <div className="space-y-4 mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Elapsed Time</span>
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {String(elapsedMinutes).padStart(2, '0')}:{String(elapsedSeconds).padStart(2, '0')}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Started At</span>
                  <Timer className="h-4 w-4 text-slate-400" />
                </div>
                <div className="text-lg font-semibold text-white">
                  {format(startTime, "HH:mm:ss")}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Procedure</span>
                  <Zap className="h-4 w-4 text-slate-400" />
                </div>
                <div className="text-sm font-medium text-white truncate">
                  {procedure.title || 'Untitled Procedure'}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-auto space-y-3">
              <Button 
                variant="outline" 
                className="w-full bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="w-full bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop & Exit
              </Button>
            </div>
          </div>

          {/* Main Execution Area */}
          <div className="flex-1 bg-gray-50">
            <ProcedureExecution
              procedure={procedure}
              executionId={executionId}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
