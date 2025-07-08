import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Clock, 
  MoreVertical, 
  Play, 
  Pause, 
  Settings, 
  Calendar,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { useWorkOrderRecurrence, WorkOrderRecurrence } from '@/hooks/useWorkOrderRecurrence';

interface RecurrenceManagerProps {
  workOrderId: string;
  onEditRecurrence?: (recurrence: WorkOrderRecurrence) => void;
}

export const RecurrenceManager: React.FC<RecurrenceManagerProps> = ({
  workOrderId,
  onEditRecurrence
}) => {
  const [recurrences, setRecurrences] = useState<WorkOrderRecurrence[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { 
    generateNextWorkOrder, 
    deleteRecurrence, 
    getRecurrencesByWorkOrder,
    loading: operationLoading 
  } = useWorkOrderRecurrence();

  useEffect(() => {
    loadRecurrences();
  }, [workOrderId]);

  const loadRecurrences = async () => {
    setLoading(true);
    const data = await getRecurrencesByWorkOrder(workOrderId);
    setRecurrences(data);
    setLoading(false);
  };

  const handleGenerateNext = async (recurrenceId: string) => {
    const newWorkOrderId = await generateNextWorkOrder(recurrenceId);
    if (newWorkOrderId) {
      await loadRecurrences(); // Refresh the list
    }
  };

  const handleDisableRecurrence = async (recurrenceId: string) => {
    const success = await deleteRecurrence(recurrenceId);
    if (success) {
      await loadRecurrences();
    }
  };

  const getRuleDisplayName = (rule: string) => {
    switch (rule) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      default: return 'None';
    }
  };

  const getStatusColor = (recurrence: WorkOrderRecurrence) => {
    if (!recurrence.is_active) return 'bg-gray-100 text-gray-800';
    
    const nextDue = new Date(recurrence.next_due_at);
    const now = new Date();
    
    if (nextDue <= now) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (recurrence: WorkOrderRecurrence) => {
    if (!recurrence.is_active) return <Pause className="w-3 h-3" />;
    
    const nextDue = new Date(recurrence.next_due_at);
    const now = new Date();
    
    if (nextDue <= now) return <AlertCircle className="w-3 h-3" />;
    return <CheckCircle className="w-3 h-3" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recurrences.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recurrence Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No recurrence schedule configured for this work order.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recurrence Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recurrences.map((recurrence) => (
            <div key={recurrence.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(recurrence)}>
                      {getStatusIcon(recurrence)}
                      {recurrence.is_active ? 'Active' : 'Disabled'}
                    </Badge>
                    <span className="text-sm font-medium">
                      {getRuleDisplayName(recurrence.recurrence_pattern.rule)} 
                      (Every {recurrence.recurrence_pattern.interval} 
                      {recurrence.recurrence_pattern.rule.slice(0, -2)})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Next Due:</span>
                      <br />
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(recurrence.next_due_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Generated:</span>
                      <br />
                      {recurrence.total_generated} work orders
                    </div>
                  </div>

                  {recurrence.last_generated_at && (
                    <div className="text-xs text-gray-500">
                      Last generated: {format(new Date(recurrence.last_generated_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {recurrence.is_active && (
                      <DropdownMenuItem 
                        onClick={() => handleGenerateNext(recurrence.id)}
                        disabled={operationLoading}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Generate Next
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onEditRecurrence?.(recurrence)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Schedule
                    </DropdownMenuItem>
                    {recurrence.is_active && (
                      <DropdownMenuItem 
                        onClick={() => handleDisableRecurrence(recurrence.id)}
                        disabled={operationLoading}
                        className="text-red-600"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Disable
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};