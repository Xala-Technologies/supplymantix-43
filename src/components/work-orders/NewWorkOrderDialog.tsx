
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { useCreateWorkOrder } from "@/hooks/useWorkOrders";

interface NewWorkOrderFormData {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: Date;
  assignedTo: string;
  asset: string;
  location: string;
  category: string;
}

export const NewWorkOrderDialog = () => {
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const createWorkOrder = useCreateWorkOrder();
  
  const form = useForm<NewWorkOrderFormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      dueDate: new Date(),
      assignedTo: "",
      asset: "",
      location: "",
      category: "Equipment",
    },
  });

  const onSubmit = async (data: NewWorkOrderFormData) => {
    try {
      await createWorkOrder.mutateAsync({
        title: data.title,
        description: data.description,
        priority: data.priority,
        due_date: data.dueDate.toISOString(),
        assigned_to: data.assignedTo,
        asset_id: data.asset,
        location: data.location,
        category: data.category,
        status: "open",
      });
      
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating work order:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          New Work Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter work order title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the work order details..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          onClick={() => setShowCalendar(!showCalendar)}
                          type="button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Select date"}
                        </Button>
                      </FormControl>
                      {showCalendar && (
                        <div className="absolute top-full left-0 z-50 mt-1">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setShowCalendar(false);
                            }}
                            className="rounded-md border bg-white shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Zach Brown">Zach Brown</SelectItem>
                        <SelectItem value="Maintenance Team 1">Maintenance Team 1</SelectItem>
                        <SelectItem value="Maintenance Team 2">Maintenance Team 2</SelectItem>
                        <SelectItem value="Safety Team">Safety Team</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Wrapper - Orion Model A">Wrapper - Orion Model A</SelectItem>
                        <SelectItem value="Conveyor - 3200 Series Modular">Conveyor - 3200 Series Modular</SelectItem>
                        <SelectItem value="35-005 - Air Compressor - VSS Single Screw">35-005 - Air Compressor - VSS Single Screw</SelectItem>
                        <SelectItem value="ABC Fire Extinguisher (5 lb)">ABC Fire Extinguisher (5 lb)</SelectItem>
                        <SelectItem value="Facility">Facility</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Production Line 1">Production Line 1</SelectItem>
                        <SelectItem value="Production Line 2">Production Line 2</SelectItem>
                        <SelectItem value="Production Line 3">Production Line 3</SelectItem>
                        <SelectItem value="Utility Room">Utility Room</SelectItem>
                        <SelectItem value="Building A">Building A</SelectItem>
                        <SelectItem value="Entire Facility">Entire Facility</SelectItem>
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Inspection">Inspection</SelectItem>
                        <SelectItem value="PM">Preventive Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createWorkOrder.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createWorkOrder.isPending ? "Creating..." : "Create Work Order"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
