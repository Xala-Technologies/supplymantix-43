
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Factory,
  Zap,
  Settings,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-4 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
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
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-50 to-blue-50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6">
            <BarChart3 className="h-12 w-12 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Meters Found</h3>
          <p className="text-gray-600 text-center mb-8 max-w-md">
            Get started by creating your first meter to track asset performance and maintenance metrics in real-time.
          </p>
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2 shadow-lg">
            <Plus className="h-4 w-4" />
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

  const calculateProgress = (meter: Meter) => {
    if (!meter.target_min || !meter.target_max) return null;
    const range = meter.target_max - meter.target_min;
    const progress = ((meter.current_value - meter.target_min) / range) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {meters.map((meter) => {
        const progress = calculateProgress(meter);
        return (
          <Card 
            key={meter.id} 
            className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg cursor-pointer hover:scale-105 bg-white/90 backdrop-blur-sm overflow-hidden"
            onClick={() => onMeterClick(meter)}
          >
            {/* Status Indicator Bar */}
            <div className={`h-1 w-full ${
              meter.status === 'active' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
              meter.status === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
              meter.status === 'critical' ? 'bg-gradient-to-r from-red-400 to-red-600' :
              'bg-gradient-to-r from-gray-400 to-gray-500'
            }`} />

            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    meter.status === 'active' ? 'bg-green-100 group-hover:bg-green-200' :
                    meter.status === 'warning' ? 'bg-yellow-100 group-hover:bg-yellow-200' :
                    meter.status === 'critical' ? 'bg-red-100 group-hover:bg-red-200' :
                    'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    {getStatusIcon(meter.status)}
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-emerald-700 transition-colors leading-tight">
                      {meter.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(meter.type)}
                      <span className="text-xs text-gray-500 capitalize">{meter.type}</span>
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(meter.status)} text-xs font-medium`}>
                  {meter.status}
                </Badge>
              </div>
              
              {/* Asset and Location Info */}
              <div className="space-y-2 mt-3">
                {meter.asset_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Factory className="h-3 w-3" />
                    <span className="truncate">{meter.asset_name}</span>
                  </div>
                )}
                {meter.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{meter.location}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Current Value Display */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-blue-50/50 rounded-2xl"></div>
                <div className="relative text-center py-6 px-4">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                    {meter.current_value.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                    {meter.unit}
                  </div>
                </div>
              </div>

              {/* Progress Bar for Target Range */}
              {progress !== null && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Target Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{meter.target_min?.toLocaleString()}</span>
                    <span>{meter.target_max?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              {meter.description && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {meter.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(meter.last_reading).toLocaleDateString()}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMeterClick(meter);
                  }}
                >
                  <Eye className="h-3 w-3" />
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
