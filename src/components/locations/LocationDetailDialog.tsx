
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Edit, 
  Trash2,
  FileText,
  Users,
  Settings,
  Wrench,
  Package,
  Gauge
} from "lucide-react";
import type { Location } from "@/types/location";
import { useLocationStats } from "@/hooks/useLocationStats";
import { useAssetsByLocation } from "@/hooks/useAssetsByLocation";
import { useWorkOrdersByLocation } from "@/hooks/useWorkOrdersByLocation";
import { useMetersByLocation } from "@/hooks/useMetersByLocation";

interface LocationDetailDialogProps {
  location: Location;
  onClose: () => void;
  onEdit?: () => void;
}

export const LocationDetailDialog = ({ location, onClose, onEdit }: LocationDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("assets");
  
  const { data: stats, isLoading: statsLoading } = useLocationStats(location.id);
  const { data: assets, isLoading: assetsLoading } = useAssetsByLocation(location.id);
  const { data: workOrders, isLoading: workOrdersLoading } = useWorkOrdersByLocation(location.id);
  const { data: meters, isLoading: metersLoading } = useMetersByLocation(location.id);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {location.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Actions */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Location Name</label>
                <p className="text-base text-gray-900 mt-1">{location.name}</p>
              </div>
              
              {location.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-base text-gray-900 mt-1">{location.description}</p>
                </div>
              )}

              {location.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-base text-gray-900 mt-1">{location.address}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Created Date</label>
                <p className="text-base text-gray-900 mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(location.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Quick Stats
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Package className="h-3 w-3" />
                      Assets:
                    </span>
                    <span className="font-medium">
                      {statsLoading ? "..." : stats?.asset_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Wrench className="h-3 w-3" />
                      Work Orders:
                    </span>
                    <span className="font-medium">
                      {statsLoading ? "..." : stats?.work_order_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Gauge className="h-3 w-3" />
                      Meters:
                    </span>
                    <span className="font-medium">
                      {statsLoading ? "..." : stats?.meter_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Building2 className="h-3 w-3" />
                      Sub-locations:
                    </span>
                    <span className="font-medium">
                      {statsLoading ? "..." : stats?.child_location_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Related Information Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assets" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Assets ({stats?.asset_count || 0})
              </TabsTrigger>
              <TabsTrigger value="work-orders" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Work Orders ({stats?.work_order_count || 0})
              </TabsTrigger>
              <TabsTrigger value="meters" className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Meters ({stats?.meter_count || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assets" className="space-y-4">
              <div className="border rounded-lg">
                {assetsLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading assets...</p>
                  </div>
                ) : assets && assets.length > 0 ? (
                  <div className="divide-y">
                    {assets.map((asset) => (
                      <div key={asset.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{asset.name}</h4>
                            <p className="text-sm text-gray-500">{asset.asset_tag}</p>
                          </div>
                          <Badge variant="outline" className={
                            asset.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                            asset.status === 'maintenance' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }>
                            {asset.status}
                          </Badge>
                        </div>
                        {asset.description && (
                          <p className="text-sm text-gray-600 mt-2">{asset.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No assets found for this location</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="work-orders" className="space-y-4">
              <div className="border rounded-lg">
                {workOrdersLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading work orders...</p>
                  </div>
                ) : workOrders && workOrders.length > 0 ? (
                  <div className="divide-y">
                    {workOrders.map((workOrder) => (
                      <div key={workOrder.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{workOrder.title}</h4>
                            <p className="text-sm text-gray-500">#{workOrder.id.slice(-6)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              workOrder.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                              workOrder.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-green-50 text-green-700 border-green-200'
                            }>
                              {workOrder.priority}
                            </Badge>
                            <Badge variant="outline" className={
                              workOrder.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                              workOrder.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }>
                              {workOrder.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        {workOrder.description && (
                          <p className="text-sm text-gray-600 mt-2">{workOrder.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Wrench className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No work orders found for this location</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="meters" className="space-y-4">
              <div className="border rounded-lg">
                {metersLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading meters...</p>
                  </div>
                ) : meters && meters.length > 0 ? (
                  <div className="divide-y">
                    {meters.map((meter) => (
                      <div key={meter.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{meter.name}</h4>
                            <p className="text-sm text-gray-500">{meter.type} • {meter.unit}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {meter.current_value || 0} {meter.unit}
                            </span>
                            <Badge variant="outline" className={
                              meter.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                              meter.status === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-red-50 text-red-700 border-red-200'
                            }>
                              {meter.status}
                            </Badge>
                          </div>
                        </div>
                        {meter.description && (
                          <p className="text-sm text-gray-600 mt-2">{meter.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Gauge className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No meters found for this location</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
