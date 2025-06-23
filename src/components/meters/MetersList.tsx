import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Factory,
  Eye,
  Plus
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
  target_min?: number;
  target_max?: number;
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
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!meters || meters.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <BarChart3 className="h-8 w-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meters Found</h3>
        <p className="text-gray-600 mb-6">Get started by creating your first meter to track performance.</p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Meter
        </Button>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-3 w-3" />;
      case 'warning': return <AlertTriangle className="h-3 w-3" />;
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      default: return <BarChart3 className="h-3 w-3" />;
    }
  };

  const calculateProgress = (meter: Meter) => {
    if (!meter.target_min || !meter.target_max) return null;
    const range = meter.target_max - meter.target_min;
    const progress = ((meter.current_value - meter.target_min) / range) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const handleMeterClick = (meter: Meter, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Meter clicked:', meter);
    onMeterClick(meter);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {meters.map((meter) => {
        const progress = calculateProgress(meter);
        return (
          <Card 
            key={meter.id} 
            className="group hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-slate-300 bg-white"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {meter.name}
                    </h3>
                    <p className="text-sm text-slate-500 capitalize">
                      {meter.type} meter
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(meter.status)}>
                  {getStatusIcon(meter.status)}
                  <span className="ml-1 capitalize">{meter.status}</span>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Current Value */}
              <div className="text-center p-4 bg-slate-50 rounded-xl border">
                <div className="text-3xl font-bold text-slate-900">
                  {meter.current_value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  {meter.unit}
                </div>
              </div>

              {/* Progress Bar */}
              {progress !== null && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Target Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{meter.target_min?.toLocaleString()}</span>
                    <span>{meter.target_max?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Asset & Location */}
              <div className="space-y-2">
                {meter.asset_name && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Factory className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{meter.asset_name}</span>
                  </div>
                )}
                {meter.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{meter.location}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(meter.last_reading).toLocaleDateString()}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                  onClick={(e) => handleMeterClick(meter, e)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
