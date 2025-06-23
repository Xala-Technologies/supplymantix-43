import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeterDetail } from "@/hooks/useMetersEnhanced";
import { MeterReadingForm } from "./MeterReadingForm";
import { MeterTriggersManager } from "./MeterTriggersManager";
import { MeterReadingsHistory } from "./MeterReadingsHistory";
import { 
  X, 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  MapPin, 
  Factory,
  TrendingUp,
  Zap,
  Settings
} from "lucide-react";

interface MeterDetailDialogProps {
  meter: { id: string; name: string };
  onClose: () => void;
}

export const MeterDetailDialog = ({ meter, onClose }: MeterDetailDialogProps) => {
  const [showReadingForm, setShowReadingForm] = useState(false);
  const { data: meterDetail, isLoading } = useMeterDetail(meter.id);

  if (isLoading) {
    return (
      <Dialog open onOpenChange={() => onClose()}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!meterDetail) return null;

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
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">{meterDetail.name}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                {meterDetail.assets && (
                  <div className="flex items-center gap-1">
                    <Factory className="h-3 w-3" />
                    {meterDetail.assets.name}
                  </div>
                )}
                {meterDetail.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {meterDetail.location}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(meterDetail.status)}>
              {getStatusIcon(meterDetail.status)}
              {meterDetail.status}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Meter Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Current Value</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {Number(meterDetail.current_value).toLocaleString()}
                </p>
                <p className="text-xs text-emerald-600 uppercase tracking-wide">
                  {meterDetail.unit}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Type</p>
                <p className="text-xl font-semibold text-blue-700 capitalize">
                  {meterDetail.type}
                </p>
                <p className="text-xs text-blue-600 uppercase tracking-wide">
                  {meterDetail.reading_frequency?.replace('_', ' ')}
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Triggers</p>
                <p className="text-xl font-semibold text-purple-700">
                  {meterDetail.meter_triggers?.length || 0}
                </p>
                <p className="text-xs text-purple-600 uppercase tracking-wide">
                  Active Rules
                </p>
              </div>
              <Settings className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Last Reading</p>
                <p className="text-sm font-semibold text-orange-700">
                  {meterDetail.last_reading_at 
                    ? new Date(meterDetail.last_reading_at).toLocaleDateString()
                    : 'Never'
                  }
                </p>
                <p className="text-xs text-orange-600 uppercase tracking-wide">
                  Updated
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Target Range Display */}
        {(meterDetail.target_min || meterDetail.target_max) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Target Range</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Min: {meterDetail.target_min || 'N/A'} {meterDetail.unit}</span>
              <span>•</span>
              <span>Max: {meterDetail.target_max || 'N/A'} {meterDetail.unit}</span>
            </div>
          </div>
        )}

        <Tabs defaultValue="readings" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="readings">Readings & History</TabsTrigger>
            <TabsTrigger value="triggers">Triggers & Alerts</TabsTrigger>
            <TabsTrigger value="overview">Overview & Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="readings" className="flex-1 overflow-hidden">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Reading History</h3>
                <Button 
                  onClick={() => setShowReadingForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Record New Reading
                </Button>
              </div>
              <MeterReadingsHistory meterId={meter.id} />
            </div>
          </TabsContent>

          <TabsContent value="triggers" className="flex-1 overflow-hidden">
            <MeterTriggersManager meterId={meter.id} />
          </TabsContent>

          <TabsContent value="overview" className="flex-1 overflow-hidden">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Meter Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{meterDetail.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">{meterDetail.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unit:</span>
                      <span className="font-medium">{meterDetail.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reading Frequency:</span>
                      <span className="font-medium capitalize">
                        {meterDetail.reading_frequency?.replace('_', ' ') || 'As needed'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Readings:</span>
                      <span className="font-medium">
                        {Array.isArray(meterDetail.meter_readings) ? meterDetail.meter_readings.length : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Triggers:</span>
                      <span className="font-medium">
                        {meterDetail.meter_triggers?.filter(t => t.is_active).length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(meterDetail.status)}>
                        {meterDetail.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {meterDetail.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-muted-foreground">{meterDetail.description}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {showReadingForm && (
          <MeterReadingForm
            meterId={meter.id}
            meterName={meter.name}
            unit={meterDetail.unit}
            onClose={() => setShowReadingForm(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
