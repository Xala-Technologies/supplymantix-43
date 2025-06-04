import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, Play, Pause, X, FileText, Camera, AlertTriangle } from "lucide-react";

interface WorkOrderExecutionProps {
  workOrderId: string;
}

interface Step {
  id: number;
  description: string;
  completed: boolean;
  notes?: string;
  photos?: string[];
  issues?: string[];
}

interface ExecutionSession {
  id: string;
  procedureId: string;
  procedureTitle: string;
  steps: Step[];
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  totalTime: number; // in minutes
}

export const WorkOrderExecution = ({ workOrderId }: WorkOrderExecutionProps) => {
  const [sessions] = useState<ExecutionSession[]>([
    {
      id: '1',
      procedureId: 'proc-1',
      procedureTitle: 'Wrapper Maintenance Procedure',
      status: 'in_progress',
      startedAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      totalTime: 30,
      steps: [
        { id: 1, description: 'Perform lockout/tagout procedures', completed: true },
        { id: 2, description: 'Inspect cutting assembly for damage', completed: true, notes: 'Found worn blade edge' },
        { id: 3, description: 'Check belt tension and alignment', completed: false },
        { id: 4, description: 'Clean wrapper components', completed: false },
        { id: 5, description: 'Test operation and remove lockout', completed: false },
      ]
    }
  ]);

  const [activeSession, setActiveSession] = useState<string | null>('1');
  const [stepNotes, setStepNotes] = useState<{ [key: string]: string }>({});

  const getSessionProgress = (session: ExecutionSession) => {
    const completedSteps = session.steps.filter(step => step.completed).length;
    return (completedSteps / session.steps.length) * 100;
  };

  const handleStepComplete = (sessionId: string, stepId: number) => {
    // In a real app, this would update the backend
    console.log(`Completing step ${stepId} for session ${sessionId}`);
  };

  const handleAddNote = (sessionId: string, stepId: number, note: string) => {
    // In a real app, this would save to backend
    console.log(`Adding note for step ${stepId} in session ${sessionId}:`, note);
  };

  const handleSessionAction = (sessionId: string, action: 'start' | 'pause' | 'resume' | 'complete') => {
    console.log(`${action} session ${sessionId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-600" />
            Procedure Execution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4">
              {/* Session Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-lg">{session.procedureTitle}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.totalTime} minutes elapsed</span>
                    </div>
                    <Badge variant={session.status === 'in_progress' ? 'default' : 'secondary'}>
                      {session.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {session.status === 'not_started' && (
                    <Button onClick={() => handleSessionAction(session.id, 'start')}>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  )}
                  {session.status === 'in_progress' && (
                    <>
                      <Button variant="outline" onClick={() => handleSessionAction(session.id, 'pause')}>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                      <Button onClick={() => handleSessionAction(session.id, 'complete')}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                    </>
                  )}
                  {session.status === 'paused' && (
                    <Button onClick={() => handleSessionAction(session.id, 'resume')}>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{Math.round(getSessionProgress(session))}% Complete</span>
                </div>
                <Progress value={getSessionProgress(session)} className="h-2" />
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {session.steps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`border rounded-lg p-4 ${step.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Step Number/Status */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.completed 
                          ? 'bg-green-600 text-white' 
                          : index === session.steps.findIndex(s => !s.completed)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                      </div>

                      <div className="flex-1">
                        {/* Step Description */}
                        <p className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-900'}`}>
                          {step.description}
                        </p>

                        {/* Existing Notes */}
                        {step.notes && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                            <div className="flex items-center gap-1 text-yellow-700 mb-1">
                              <FileText className="w-3 h-3" />
                              <span className="font-medium">Note:</span>
                            </div>
                            <p className="text-yellow-800">{step.notes}</p>
                          </div>
                        )}

                        {/* Issues */}
                        {step.issues && step.issues.length > 0 && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                            <div className="flex items-center gap-1 text-red-700 mb-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span className="font-medium">Issues:</span>
                            </div>
                            {step.issues.map((issue, idx) => (
                              <p key={idx} className="text-red-800">{issue}</p>
                            ))}
                          </div>
                        )}

                        {/* Step Actions (for current/incomplete steps) */}
                        {!step.completed && session.status === 'in_progress' && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleStepComplete(session.id, step.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Mark Complete
                              </Button>
                              <Button size="sm" variant="outline">
                                <Camera className="w-4 h-4 mr-1" />
                                Add Photo
                              </Button>
                              <Button size="sm" variant="outline">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Report Issue
                              </Button>
                            </div>
                            
                            <Textarea
                              placeholder="Add notes for this step..."
                              value={stepNotes[`${session.id}-${step.id}`] || ''}
                              onChange={(e) => setStepNotes({
                                ...stepNotes,
                                [`${session.id}-${step.id}`]: e.target.value
                              })}
                              className="text-sm"
                              rows={2}
                            />
                            
                            {stepNotes[`${session.id}-${step.id}`] && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  handleAddNote(session.id, step.id, stepNotes[`${session.id}-${step.id}`]);
                                  setStepNotes({ ...stepNotes, [`${session.id}-${step.id}`]: '' });
                                }}
                              >
                                Save Note
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
