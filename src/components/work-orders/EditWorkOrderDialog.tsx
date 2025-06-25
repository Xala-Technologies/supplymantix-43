
import { NewWorkOrderDialog } from "./NewWorkOrderDialog";
import { WorkOrder } from "@/types/workOrder";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";

interface EditWorkOrderDialogProps {
  workOrder: WorkOrder;
  onSuccess?: () => void;
}

export const EditWorkOrderDialog = ({ workOrder, onSuccess }: EditWorkOrderDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <NewWorkOrderDialog
      workOrder={workOrder}
      onSuccess={() => {
        onSuccess?.();
        setOpen(false);
      }}
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 w-8 p-0"
      >
        <Edit className="h-4 w-4" />
      </Button>
    </NewWorkOrderDialog>
  );
};
