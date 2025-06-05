
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Activity, AlertTriangle, TrendingUp, Clock } from "lucide-react";

interface Meter {
  id: string;
  name: string;
  type: string;
  unit: string;
  current_value: number;
  asset_name?: string;
  location?: string;
  status: 'active' | 'warning' | 'critical' | 'inactive';
  last_reading: string;
  target_range?: { min: number; max: number };
}

interface MetersListProps {
  meters: Meter[];
  isLoading: boolean;
  onMeterClick: (meter: Meter) => void;
}

export const MetersList = ({ meters, isLoading, onMeterClick }: MetersListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {meters.map((meter) => (
        <Card key={meter.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(meter.status)}
                {meter.name}
              </CardTitle>
              <Badge className={getStatusColor(meter.status)}>
                {meter.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {meter.asset_name && <span>{meter.asset_name} • </span>}
              {meter.location}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-emerald-600">
                {meter.current_value.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {meter.unit}
              </div>
            </div>

            {meter.target_range && (
              <div className="text-xs text-muted-foreground">
                Target: {meter.target_range.min} - {meter.target_range.max} {meter.unit}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(meter.last_reading).toLocaleDateString()}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onMeterClick(meter)}
                className="gap-1"
              >
                <TrendingUp className="h-3 w-3" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
