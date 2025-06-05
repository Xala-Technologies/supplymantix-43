
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, BarChart3, TrendingUp } from "lucide-react";

interface MetersHeaderProps {
  onCreateMeter: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

export const MetersHeader = ({
  onCreateMeter,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: MetersHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            Meters & Monitoring
          </h1>
          <p className="text-muted-foreground">
            Track and monitor asset performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </Button>
          <Button onClick={onCreateMeter} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus className="h-4 w-4" />
            Add Meter
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search meters..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Meter Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="runtime">Runtime Hours</SelectItem>
            <SelectItem value="temperature">Temperature</SelectItem>
            <SelectItem value="pressure">Pressure</SelectItem>
            <SelectItem value="flow">Flow Rate</SelectItem>
            <SelectItem value="vibration">Vibration</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
