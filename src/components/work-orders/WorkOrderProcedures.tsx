
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, User, CheckCircle2, AlertCircle, Play, Plus } from "lucide-react";
import { workOrderProcedureService, type Procedure, type WorkOrderProcedureLink } from "@/lib/workOrderProcedureService";

interface WorkOrderProceduresProps {
  workOrderId: string;
  workOrder: any;
}

export const WorkOrderProcedures = ({ workOrderId, workOrder }: WorkOrderProceduresProps) => {
  const linkedProcedures = workOrderProcedureService.getLinkedProcedures(workOrderId);
  const recommendedProcedures = workOrderProcedureService.getRecommendedProcedures(workOrder);
  
  const getStatusColor = (status: WorkOrderProcedureLink['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: WorkOrderProcedureLink['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in_progress':
        return <Play className="w-4 h-4" />;
      case 'not_started':
        return <Clock className="w-4 h-4" />;
      case 'skipped':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const calculateProgress = (procedure: Procedure, link?: WorkOrderProcedureLink) => {
    if (!link || link.status === 'not_started') return 0;
    if (link.status === 'completed') return 100;
    if (link.status === 'skipped') return 0;
    
    // For in_progress, we could calculate based on completed steps
    // For now, return 50% as example
    return 50;
  };

  return (
    <div className="space-y-6">
      {/* Linked Procedures */}
      {linkedProcedures.length > 0 && (
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Active Procedures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {linkedProcedures.map((link) => {
              const procedure = workOrderProcedureService.sampleProcedures.find(p => p.id === link.procedureId);
              if (!procedure) return null;
              
              return (
                <div key={link.procedureId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{procedure.title}</h4>
                        <Badge className={getStatusColor(link.status)}>
                          {getStatusIcon(link.status)}
                          <span className="ml-1 capitalize">{link.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{procedure.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{procedure.estimatedDuration} min</span>
                        </div>
                        {link.assignedTo && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{link.assignedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {link.status === 'not_started' && (
                        <Button size="sm" variant="outline">
                          Start
                        </Button>
                      )}
                      {link.status === 'in_progress' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Continue
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  </div>
                  
                  {link.status !== 'not_started' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Progress</span>
                        <span>{calculateProgress(procedure, link)}%</span>
                      </div>
                      <Progress value={calculateProgress(procedure, link)} className="h-2" />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recommended Procedures */}
      {recommendedProcedures.length > 0 && (
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recommended Procedures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedProcedures.map((procedure) => (
              <div key={procedure.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{procedure.title}</h4>
                      <Badge variant="outline" className="text-blue-700 border-blue-300">
                        {procedure.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{procedure.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{procedure.estimatedDuration} min</span>
                      </div>
                      <span>{procedure.steps.length} steps</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-100">
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Work Order
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
