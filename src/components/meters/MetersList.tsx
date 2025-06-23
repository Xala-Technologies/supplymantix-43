
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Factory,
  Zap,
  Settings
} from "lucide-react";

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
  description?: string;
  reading_frequency?: string;
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
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!meters || meters.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Meters Found</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            Get started by creating your first meter to track asset performance and maintenance metrics.
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Create Your First Meter
          </Button>
        </CardContent>
      </Card>
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

  const getTypeIcon = (type: string) => {
    return type === 'automated' ? <Zap className="h-3 w-3" /> : <Settings className="h-3 w-3" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {meters.map((meter) => (
        <Card 
          key={meter.id} 
          className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-emerald-500 group cursor-pointer hover:border-l-emerald-600"
          onClick={() => onMeterClick(meter)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  {getStatusIcon(meter.status)}
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-emerald-700 transition-colors">
                    {meter.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getTypeIcon(meter.type)}
                    <span className="capitalize">{meter.type}</span>
                  </div>
                </div>
              </div>
              <Badge className={`${getStatusColor(meter.status)} text-xs`}>
                {meter.status}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              {meter.asset_name && (
                <div className="flex items-center gap-1">
                  <Factory className="h-3 w-3" />
                  <span>{meter.asset_name}</span>
                </div>
              )}
              {meter.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{meter.location}</span>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Current Value Display */}
            <div className="text-center py-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
              <div className="text-3xl font-bold text-emerald-700 mb-1">
                {meter.current_value.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-emerald-600 uppercase tracking-wider">
                {meter.unit}
              </div>
            </div>

            {/* Target Range */}
            {meter.target_range && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs font-medium text-gray-600 mb-1">Target Range</div>
                <div className="text-sm text-gray-700">
                  {meter.target_range.min.toLocaleString()} - {meter.target_range.max.toLocaleString()} {meter.unit}
                </div>
              </div>
            )}

            {/* Description */}
            {meter.description && (
              <div className="text-sm text-muted-foreground line-clamp-2">
                {meter.description}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(meter.last_reading).toLocaleDateString()}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onMeterClick(meter);
                }}
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
