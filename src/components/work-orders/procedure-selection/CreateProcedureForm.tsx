
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProcedure } from "@/hooks/useProcedures";
import { supabase } from "@/integrations/supabase/client";

interface CreateProcedureFormProps {
  onProcedureCreated: (procedureId: string) => void;
  onCancel: () => void;
}

interface ProcedureFormData {
  title: string;
  description: string;
  assetType: string;
  estimatedDuration: number;
  steps: string;
}

export const CreateProcedureForm = ({ onProcedureCreated, onCancel }: CreateProcedureFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProcedure = useCreateProcedure();
  
  const form = useForm<ProcedureFormData>({
    defaultValues: {
      title: "",
      description: "",
      assetType: "",
      estimatedDuration: 30,
      steps: "",
    },
  });

  const onSubmit = async (data: ProcedureFormData) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        console.error("Error getting user tenant:", userError);
        return;
      }

      const stepsArray = data.steps.split('\n').filter(step => step.trim()).map((step, index) => ({
        id: index + 1,
        description: step.trim(),
        completed: false
      }));

      const procedureData = {
        title: data.title,
        description: data.description,
        asset_type: data.assetType,
        estimated_duration: data.estimatedDuration,
        steps: stepsArray,
        tenant_id: userData.tenant_id,
        created_by: user.id,
      };

      const newProcedure = await createProcedure.mutateAsync(procedureData);
      onProcedureCreated(newProcedure.id);
      form.reset();
    } catch (error) {
      console.error("Error creating procedure:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter procedure title" {...field} />
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
                <Textarea 
                  placeholder="Describe the procedure"
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="compressor">Compressor</SelectItem>
                  <SelectItem value="conveyor">Conveyor</SelectItem>
                  <SelectItem value="wrapper">Wrapper</SelectItem>
                  <SelectItem value="fire-safety">Fire Safety</SelectItem>
                  <SelectItem value="forklift">Forklift</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Duration (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="30"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="steps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Steps (one per line)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Step 1: Check equipment status&#10;Step 2: Perform maintenance&#10;Step 3: Document results"
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Creating..." : "Create Procedure"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
