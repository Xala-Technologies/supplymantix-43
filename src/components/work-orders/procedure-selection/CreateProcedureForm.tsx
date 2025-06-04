
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateProcedure } from "@/hooks/useProcedures";
import { supabase } from "@/integrations/supabase/client";

interface CreateProcedureFormProps {
  onProcedureCreated: (procedureId: string) => void;
  onCancel: () => void;
}

export const CreateProcedureForm = ({
  onProcedureCreated,
  onCancel,
}: CreateProcedureFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createProcedure = useCreateProcedure();

  const handleCreateProcedure = async () => {
    if (!title.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData) return;

      const newProcedure = await createProcedure.mutateAsync({
        title,
        description,
        tenant_id: userData.tenant_id,
        created_by: user.id,
        estimated_duration: 30,
        steps: [],
      });

      onProcedureCreated(newProcedure.id);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating procedure:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Procedure title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Procedure description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border rounded-md min-h-[100px] resize-none"
      />
      <div className="flex gap-2">
        <Button
          onClick={handleCreateProcedure}
          disabled={!title.trim() || createProcedure.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {createProcedure.isPending ? "Creating..." : "Add Procedure"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
