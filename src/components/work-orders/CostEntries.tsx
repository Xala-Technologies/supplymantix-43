import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Plus, Trash2, User, Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

interface CostEntry {
  id: string;
  user: string;
  category: 'Labor' | 'Parts' | 'Travel' | 'Equipment' | 'Other';
  amount: number;
  notes: string;
  attachments?: string[];
  createdAt: string;
}

interface CostEntriesProps {
  workOrderId: string;
  onSubmit?: (costData: any) => void;
}

export const CostEntries = ({ workOrderId, onSubmit }: CostEntriesProps) => {
  const [costEntries, setCostEntries] = useState<CostEntry[]>([
    {
      id: '1',
      user: 'Zach Brown',
      category: 'Parts',
      amount: 125.50,
      notes: 'Replacement cutting blade for wrapper',
      attachments: ['receipt_001.pdf'],
      createdAt: '2023-10-05T11:15:00Z'
    },
    {
      id: '2',
      user: 'Maintenance Team 1',
      category: 'Labor',
      amount: 75.00,
      notes: 'Overtime labor for emergency repair',
      createdAt: '2023-10-05T09:30:00Z'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      user: '',
      category: '',
      amount: '',
      notes: ''
    }
  });

  const handleSubmit = (data: any) => {
    const newEntry: CostEntry = {
      id: Date.now().toString(),
      user: data.user,
      category: data.category,
      amount: parseFloat(data.amount),
      notes: data.notes,
      createdAt: new Date().toISOString()
    };
    
    setCostEntries([...costEntries, newEntry]);
    setIsDialogOpen(false);
    form.reset();
    
    if (onSubmit) {
      onSubmit(newEntry);
    }
  };

  const deleteEntry = (id: string) => {
    setCostEntries(costEntries.filter(entry => entry.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Labor':
        return 'bg-blue-100 text-blue-800';
      case 'Parts':
        return 'bg-green-100 text-green-800';
      case 'Travel':
        return 'bg-yellow-100 text-yellow-800';
      case 'Equipment':
        return 'bg-purple-100 text-purple-800';
      case 'Other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCost = costEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Cost Entries</CardTitle>
              <p className="text-sm text-gray-600">Total: ${totalCost.toFixed(2)}</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Cost
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Cost Entry</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Labor">Labor</SelectItem>
                            <SelectItem value="Parts">Parts</SelectItem>
                            <SelectItem value="Travel">Travel</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="e.g., 125.50" {...field} />
                        </FormControl>
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
                          <Textarea placeholder="Description of cost..." {...field} />
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
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{entry.user}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(entry.category)}>
                    {entry.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">${entry.amount.toFixed(2)}</span>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 truncate">{entry.notes}</p>
                    {entry.attachments && entry.attachments.length > 0 && (
                      <Paperclip className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
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
