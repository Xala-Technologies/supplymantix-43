
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useUsers } from "@/hooks/useUsers";

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
  const { data: users, isLoading: usersLoading } = useUsers();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("dueDate", value);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Select
          value={watch("assignedTo") || "unassigned"}
          onValueChange={(value) => setValue("assignedTo", value === "unassigned" ? "" : value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select assignee..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {usersLoading ? (
              <SelectItem value="loading" disabled>Loading users...</SelectItem>
            ) : (
              users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name} (${user.email})`
                    : user.email
                  }
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="assetId">Asset</Label>
        <Select
          value={watch("assetId") || "none"}
          onValueChange={(value) => setValue("assetId", value === "none" ? "" : value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select asset..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Asset</SelectItem>
            {assets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={watch("dueDate") || ""}
          onChange={handleDateChange}
          className="mt-1"
        />
      </div>
    </div>
  );
};
