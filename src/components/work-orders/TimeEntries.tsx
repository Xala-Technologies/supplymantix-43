
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Plus, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

interface TimeEntry {
  id: string;
  user: string;
  timeSpent: number; // hours
  timeType: 'Work' | 'Inspection' | 'Travel' | 'Setup' | 'Cleanup';
  notes: string;
  createdAt: string;
}

interface TimeEntriesProps {
  workOrderId: string;
}

export const TimeEntries = ({ workOrderId }: TimeEntriesProps) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      user: 'Zach Brown',
      timeSpent: 2.5,
      timeType: 'Work',
      notes: 'Diagnosed wrapper malfunction, found cutting assembly issue',
      createdAt: '2023-10-05T10:30:00Z'
    },
    {
      id: '2',
      user: 'Maintenance Team 1',
      timeSpent: 1.0,
      timeType: 'Inspection',
      notes: 'Initial safety inspection and LOTO procedures',
      createdAt: '2023-10-05T09:00:00Z'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      user: '',
      timeSpent: '',
      timeType: '',
      notes: ''
    }
  });

  const onSubmit = (data: any) => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      user: data.user,
      timeSpent: parseFloat(data.timeSpent),
      timeType: data.timeType,
      notes: data.notes,
      createdAt: new Date().toISOString()
    };
    
    setTimeEntries([...timeEntries, newEntry]);
    setIsDialogOpen(false);
    form.reset();
  };

  const deleteEntry = (id: string) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };

  const getTimeTypeColor = (type: string) => {
    switch (type) {
      case 'Work':
        return 'bg-blue-100 text-blue-800';
      case 'Inspection':
        return 'bg-green-100 text-green-800';
      case 'Travel':
        return 'bg-yellow-100 text-yellow-800';
      case 'Setup':
        return 'bg-purple-100 text-purple-800';
      case 'Cleanup':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.timeSpent, 0);

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="user"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Zach Brown">Zach Brown</SelectItem>
                            <SelectItem value="Maintenance Team 1">Maintenance Team 1</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Safety">Safety</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeSpent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Spent (hours)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.25" placeholder="e.g., 2.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Work">Work</SelectItem>
                            <SelectItem value="Inspection">Inspection</SelectItem>
                            <SelectItem value="Travel">Travel</SelectItem>
                            <SelectItem value="Setup">Setup</SelectItem>
                            <SelectItem value="Cleanup">Cleanup</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
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
                    <Button type="submit" className="flex-1">Add Entry</Button>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{entry.user}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{entry.timeSpent}h</span>
                </TableCell>
                <TableCell>
                  <Badge className={getTimeTypeColor(entry.timeType)}>
                    {entry.timeType}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-gray-600 truncate">{entry.notes}</p>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {format(new Date(entry.createdAt), 'MMM dd, yyyy h:mm a')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
