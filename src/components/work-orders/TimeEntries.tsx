
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Plus, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useTimeLogs, useCreateTimeLog } from "@/hooks/useWorkOrdersEnhanced";

interface TimeEntriesProps {
  workOrderId: string;
  onSubmit?: (timeData: any) => void;
}

export const TimeEntries = ({ workOrderId, onSubmit }: TimeEntriesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: timeLogs = [], isLoading } = useTimeLogs(workOrderId);
  const createTimeLog = useCreateTimeLog();
  
  const form = useForm({
    defaultValues: {
      duration_minutes: '',
      note: ''
    }
  });

  const handleSubmit = async (data: any) => {
    try {
      await createTimeLog.mutateAsync({
        work_order_id: workOrderId,
        user_id: '', // Will be filled by the API from auth context
        duration_minutes: parseInt(data.duration_minutes),
        note: data.note
      });
      
      setIsDialogOpen(false);
      form.reset();
      
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      console.error("Failed to create time log:", error);
    }
  };

  const totalMinutes = timeLogs.reduce((sum, entry) => sum + entry.duration_minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Time Entries</CardTitle>
              <p className="text-sm text-gray-600">Total: {totalHours} hours</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Time
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Time Entry</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="duration_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description of work performed..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1" disabled={createTimeLog.isPending}>
                      {createTimeLog.isPending ? "Adding..." : "Add Entry"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {timeLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm">No time entries yet</p>
            <p className="text-xs text-gray-400 mt-1">Add time entries to track work progress</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeLogs.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {entry.user?.email || 'Unknown User'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{(entry.duration_minutes / 60).toFixed(1)}h</span>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 truncate">{entry.note || 'No notes'}</p>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(entry.logged_at), 'MMM dd, yyyy h:mm a')}
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
