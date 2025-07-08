import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface SubWorkOrdersTableProps {
  parentWorkOrderId: string;
}

interface SubWorkOrder {
  id: string;
  title: string;
  status: string;
  assigned_to?: string;
  due_date?: string;
  priority: string;
}

const getStatusColor = (status: string) => {
  const colors = {
    'open': 'bg-blue-100 text-blue-800 border-blue-300',
    'in_progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'completed': 'bg-green-100 text-green-800 border-green-300',
    'cancelled': 'bg-red-100 text-red-800 border-red-300',
    'on_hold': 'bg-orange-100 text-orange-800 border-orange-300',
  };
  return colors[status as keyof typeof colors] || colors.open;
};

const getPriorityColor = (priority: string) => {
  const colors = {
    'low': 'text-green-600',
    'medium': 'text-yellow-600',
    'high': 'text-orange-600',
    'urgent': 'text-red-600',
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};

export const SubWorkOrdersTable: React.FC<SubWorkOrdersTableProps> = ({
  parentWorkOrderId
}) => {
  const { data: subWorkOrders = [], isLoading } = useQuery({
    queryKey: ['sub-work-orders', parentWorkOrderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_orders')
        .select('id, title, status, assigned_to, due_date, priority')
        .eq('parent_recurrence_id', parentWorkOrderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as SubWorkOrder[];
    },
    enabled: !!parentWorkOrderId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sub-Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Sub-Work Orders ({subWorkOrders.length})
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Sub-Work Order
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {subWorkOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No sub-work orders</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subWorkOrders.map((subOrder) => (
                <TableRow key={subOrder.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subOrder.title}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: #{subOrder.id.slice(-4)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border ${getStatusColor(subOrder.status)}`}>
                      {subOrder.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {subOrder.assigned_to ? (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="text-sm">{subOrder.assigned_to}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {subOrder.due_date ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(subOrder.due_date), { addSuffix: true })}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No due date</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};