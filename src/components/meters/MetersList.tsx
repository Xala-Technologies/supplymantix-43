import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Factory,
  Eye,
  Plus,
  TrendingUp,
  TrendingDown
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
  selectedMeters?: string[];
  onMeterSelect?: (meterId: string, selected: boolean) => void;
}

export const MetersList = ({ 
  meters, 
  isLoading, 
  onMeterClick,
  selectedMeters = [],
  onMeterSelect
}: MetersListProps) => {
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
      <Card className="p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <BarChart3 className="h-10 w-10 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Meters Found</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Get started by creating your first meter to track performance metrics and monitor your assets.
        </p>
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

  const getTrend = (meter: Meter) => {
    // This would typically compare with previous reading
    // For now, we'll use a simple heuristic based on target ranges
    if (!meter.target_min || !meter.target_max) return null;
    
    const midpoint = (meter.target_min + meter.target_max) / 2;
    return meter.current_value > midpoint ? 'up' : 'down';
  };

  const handleMeterClick = (meter: Meter, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('MetersList: Meter clicked:', meter);
    console.log('MetersList: Calling onMeterClick with meter:', meter.id, meter.name);
    onMeterClick(meter);
  };

  const handleSelectChange = (meterId: string, checked: boolean) => {
    if (onMeterSelect) {
      onMeterSelect(meterId, checked);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {meters.map((meter) => {
        const progress = calculateProgress(meter);
        const trend = getTrend(meter);
        const isSelected = selectedMeters.includes(meter.id);
        
        return (
          <Card 
            key={meter.id} 
            className={`group hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-slate-300 bg-white relative cursor-pointer ${
              isSelected ? 'ring-2 ring-blue-500 border-blue-300' : ''
            }`}
            onClick={(e) => {
              // Allow clicking on the card itself to open details
              if (!e.defaultPrevented) {
                handleMeterClick(meter, e);
              }
            }}
          >
            {/* Selection Checkbox */}
            {onMeterSelect && (
              <div className="absolute top-4 left-4 z-10">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleSelectChange(meter.id, checked as boolean)}
                  className="bg-white"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <CardHeader className={`pb-4 ${onMeterSelect ? 'pl-12' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                    <BarChart3 className="h-6 w-6 text-white" />
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
              {/* Current Value with Trend */}
              <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-3xl font-bold text-slate-900">
                    {meter.current_value.toLocaleString()}
                  </div>
                  {trend && (
                    trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )
                  )}
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
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
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
                  onClick={(e) => {
                    console.log('View Details button clicked for meter:', meter.id);
                    handleMeterClick(meter, e);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
