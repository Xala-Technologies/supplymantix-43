
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface Asset {
  id: string;
  name: string;
}

interface AssignmentSectionProps {
  form: UseFormReturn<any>;
  watch: (name: string) => any;
  setValue: (name: string, value: any) => void;
  assets: Asset[];
}

export const AssignmentSection = ({ form, watch, setValue, assets }: AssignmentSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="assignedTo">Assignee</Label>
        <Select
          value={watch("assignedTo")}
          onValueChange={(value) => setValue("assignedTo", value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select assignee..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user1">John Doe</SelectItem>
            <SelectItem value="user2">Jane Smith</SelectItem>
            <SelectItem value="team1">Maintenance Team</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <div className="relative mt-1">
          <Input
            id="dueDate"
            type="date"
            {...form.register("dueDate")}
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <Label htmlFor="assetId">Asset</Label>
        <Select
          value={watch("assetId")}
          onValueChange={(value) => setValue("assetId", value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select asset..." />
          </SelectTrigger>
          <SelectContent>
            {assets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
