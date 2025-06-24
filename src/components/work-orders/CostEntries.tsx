
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface CostEntriesProps {
  workOrderId: string;
  onSubmit?: (costData: any) => void;
}

export const CostEntries = ({ workOrderId, onSubmit }: CostEntriesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // For now, using empty array - will be replaced with real data hook when available
  const costEntries: any[] = [];
  
  const form = useForm({
    defaultValues: {
      amount: '',
      description: ''
    }
  });

  const handleSubmit = async (data: any) => {
    // This will be implemented when cost entries API is available
    console.log('Cost entry data:', data);
    
    setIsDialogOpen(false);
    form.reset();
    
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const totalCost = costEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);

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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
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
        {costEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm">No cost entries yet</p>
            <p className="text-xs text-gray-400 mt-1">Add cost entries to track expenses</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <span className="font-semibold">${entry.amount.toFixed(2)}</span>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 truncate">{entry.description}</p>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString()}
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
