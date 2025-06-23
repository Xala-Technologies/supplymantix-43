import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMeterDetail } from "@/hooks/useMetersEnhanced";
import { MeterReadingForm } from "./MeterReadingForm";
import { MeterTriggersManager } from "./MeterTriggersManager";
import { MeterReadingsHistory } from "./MeterReadingsHistory";
import { X, Activity, AlertTriangle, BarChart3, Clock, MapPin, Factory, TrendingUp, Settings, Plus } from "lucide-react";
interface MeterDetailDialogProps {
  meter: {
    id: string;
    name: string;
  };
  onClose: () => void;
}
export const MeterDetailDialog = ({
  meter,
  onClose
}: MeterDetailDialogProps) => {
  const [showReadingForm, setShowReadingForm] = useState(false);
  const {
    data: meterDetail,
    isLoading
  } = useMeterDetail(meter.id);
  if (isLoading) {
    return <Dialog open onOpenChange={() => onClose()}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>;
  }
  if (!meterDetail) return null;
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-400" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  return <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">{meterDetail.name}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                {meterDetail.assets && <div className="flex items-center gap-1">
                    <Factory className="h-3 w-3" />
                    {meterDetail.assets.name}
                  </div>}
                {meterDetail.location && <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {meterDetail.location}
                  </div>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(meterDetail.status)}>
              {getStatusIcon(meterDetail.status)}
              <span className="ml-1 capitalize">{meterDetail.status}</span>
            </Badge>
            
          </div>
        </DialogHeader>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Number(meterDetail.current_value).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {meterDetail.unit}
              </div>
              <div className="text-xs text-gray-500 mt-1">Current Value</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {meterDetail.type}
              </div>
              <div className="text-sm text-gray-600">
                {meterDetail.reading_frequency?.replace('_', ' ') || 'As needed'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Type & Frequency</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-semibold text-gray-900">
                {meterDetail.meter_triggers?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Rules</div>
              <div className="text-xs text-gray-500 mt-1">Triggers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm font-semibold text-gray-900">
                {meterDetail.last_reading_at ? new Date(meterDetail.last_reading_at).toLocaleDateString() : 'Never'}
              </div>
              <div className="text-sm text-gray-600">Last Updated</div>
              <div className="text-xs text-gray-500 mt-1">Reading Date</div>
            </CardContent>
          </Card>
        </div>

        {/* Target Range */}
        {(meterDetail.target_min || meterDetail.target_max) && <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Target Range</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Min: {meterDetail.target_min || 'N/A'} {meterDetail.unit}</span>
                <span>•</span>
                <span>Max: {meterDetail.target_max || 'N/A'} {meterDetail.unit}</span>
              </div>
            </CardContent>
          </Card>}

        <Tabs defaultValue="readings" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="readings">Readings</TabsTrigger>
            <TabsTrigger value="triggers">Triggers</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="readings" className="flex-1 overflow-hidden">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Reading History</h3>
                <Button onClick={() => setShowReadingForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Reading
                </Button>
              </div>
              <MeterReadingsHistory meterId={meter.id} />
            </div>
          </TabsContent>

          <TabsContent value="triggers" className="flex-1 overflow-hidden">
            <MeterTriggersManager meterId={meter.id} />
          </TabsContent>

          <TabsContent value="details" className="flex-1 overflow-hidden space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Meter Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{meterDetail.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{meterDetail.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unit:</span>
                    <span className="font-medium">{meterDetail.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium capitalize">
                      {meterDetail.reading_frequency?.replace('_', ' ') || 'As needed'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Readings:</span>
                    <span className="font-medium">
                      {Array.isArray(meterDetail.meter_readings) ? meterDetail.meter_readings.length : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Triggers:</span>
                    <span className="font-medium">
                      {meterDetail.meter_triggers?.filter(t => t.is_active).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="outline" className={getStatusColor(meterDetail.status)}>
                      {meterDetail.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {meterDetail.description && <Card>
                <CardHeader>
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{meterDetail.description}</p>
                </CardContent>
              </Card>}
          </TabsContent>
        </Tabs>

        {showReadingForm && <MeterReadingForm meterId={meter.id} meterName={meter.name} unit={meterDetail.unit} onClose={() => setShowReadingForm(false)} />}
      </DialogContent>
    </Dialog>;
};