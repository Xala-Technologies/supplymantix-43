
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProcedureSearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ProcedureSearchInput = ({
  searchQuery,
  onSearchChange,
}: ProcedureSearchInputProps) => {
  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
      <Input
        placeholder="Search Procedure Templates..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};
