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
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { useCreateWorkOrder } from "@/hooks/useWorkOrders";
import { useLocations } from "@/hooks/useLocations";
import { useProcedures, useCreateProcedure } from "@/hooks/useProcedures";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { workOrderProcedureService, type Procedure } from "@/lib/workOrderProcedureService";

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
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);
  const [showNewProcedureForm, setShowNewProcedureForm] = useState(false);
  const [newProcedureTitle, setNewProcedureTitle] = useState("");
  const [newProcedureDescription, setNewProcedureDescription] = useState("");
  
  const createWorkOrder = useCreateWorkOrder();
  const { data: locations } = useLocations();
  const { data: procedures } = useProcedures();
  const createProcedure = useCreateProcedure();
  
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
      // Get current user to get tenant_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      // Get user's tenant_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        console.error("Error getting user tenant:", userError);
        return;
      }

      // Find the location_id from the selected location name
      const selectedLocation = locations?.find(loc => loc.name === data.location);
      
      await createWorkOrder.mutateAsync({
        title: data.title,
        description: data.description,
        due_date: data.dueDate.toISOString(),
        assigned_to: data.assignedTo,
        asset_id: data.asset,
        location_id: selectedLocation?.id,
        tenant_id: userData.tenant_id,
        status: "open",
      });
      
      setOpen(false);
      form.reset();
      setSelectedProcedures([]);
      setShowNewProcedureForm(false);
      setNewProcedureTitle("");
      setNewProcedureDescription("");
    } catch (error) {
      console.error("Error creating work order:", error);
    }
  };

  const handleAddProcedure = (procedureId: string) => {
    if (!selectedProcedures.includes(procedureId)) {
      setSelectedProcedures([...selectedProcedures, procedureId]);
    }
  };

  const handleRemoveProcedure = (procedureId: string) => {
    setSelectedProcedures(selectedProcedures.filter(id => id !== procedureId));
  };

  const handleCreateNewProcedure = async () => {
    if (!newProcedureTitle.trim()) return;

    try {
      // Get current user to get tenant_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      // Get user's tenant_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        console.error("Error getting user tenant:", userError);
        return;
      }

      const newProcedure = await createProcedure.mutateAsync({
        title: newProcedureTitle,
        description: newProcedureDescription,
        tenant_id: userData.tenant_id,
        created_by: user.id,
        estimated_duration: 30, // Default duration
        steps: [], // Empty steps array for now
      });

      // Add the new procedure to selected procedures
      setSelectedProcedures([...selectedProcedures, newProcedure.id]);
      
      // Reset form
      setNewProcedureTitle("");
      setNewProcedureDescription("");
      setShowNewProcedureForm(false);
    } catch (error) {
      console.error("Error creating procedure:", error);
    }
  };

  // Get recommended procedures based on current form data
  const recommendedProcedures = workOrderProcedureService.getRecommendedProcedures({
    title: form.watch("title"),
    category: form.watch("category"),
    asset: form.watch("asset"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          New Work Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                        {locations?.map((location) => (
                          <SelectItem key={location.id} value={location.name}>
                            {location.name}
                          </SelectItem>
                        ))}
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

            {/* Procedures Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Procedures</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewProcedureForm(!showNewProcedureForm)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Procedure
                </Button>
              </div>

              {/* Selected Procedures */}
              {selectedProcedures.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Selected Procedures:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProcedures.map((procedureId) => {
                      const procedure = procedures?.find(p => p.id === procedureId) || 
                                      workOrderProcedureService.sampleProcedures.find(p => p.id === procedureId);
                      return (
                        <Badge key={procedureId} variant="secondary" className="flex items-center gap-2">
                          {procedure?.title || 'Unknown Procedure'}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-red-600" 
                            onClick={() => handleRemoveProcedure(procedureId)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New Procedure Form */}
              {showNewProcedureForm && (
                <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <h4 className="text-sm font-medium mb-3">Create New Procedure</h4>
                  <div className="space-y-3">
                    <Input
                      placeholder="Procedure title"
                      value={newProcedureTitle}
                      onChange={(e) => setNewProcedureTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Procedure description"
                      value={newProcedureDescription}
                      onChange={(e) => setNewProcedureDescription(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCreateNewProcedure}
                        disabled={!newProcedureTitle.trim() || createProcedure.isPending}
                      >
                        {createProcedure.isPending ? "Creating..." : "Create & Add"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNewProcedureForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommended Procedures */}
              {recommendedProcedures.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Recommended Procedures:</h4>
                  <div className="space-y-2">
                    {recommendedProcedures.map((procedure) => (
                      <div key={procedure.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div>
                          <p className="font-medium text-sm">{procedure.title}</p>
                          <p className="text-xs text-gray-600">{procedure.description}</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddProcedure(procedure.id)}
                          disabled={selectedProcedures.includes(procedure.id)}
                        >
                          {selectedProcedures.includes(procedure.id) ? "Added" : "Add"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Procedures */}
              {procedures && procedures.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Procedures:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {procedures.map((procedure) => (
                      <div key={procedure.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{procedure.title}</p>
                          <p className="text-xs text-gray-600">{procedure.description}</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddProcedure(procedure.id)}
                          disabled={selectedProcedures.includes(procedure.id)}
                        >
                          {selectedProcedures.includes(procedure.id) ? "Added" : "Add"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
