import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  Activity,
  Clock,
  MapPin,
  Factory,
  Zap,
  TrendingUp,
  TrendingDown,
  Wrench
} from "lucide-react";
import { useMeters } from "@/hooks/useMeters";
import { useMeterDetail, useMeterReadings, useCreateMeterWorkOrder } from "@/hooks/useMetersEnhanced";
import { MeterForm } from "@/components/meters/MeterForm";
import { MeterReadingModal } from "@/components/meters/MeterReadingModal";
import { MeterReadingsChart } from "@/components/meters/MeterReadingsChart";
import { MeterTriggersManager } from "@/components/meters/MeterTriggersManager";
import { format, addDays } from "date-fns";

const MetersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMeter, setSelectedMeter] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: meters, isLoading, error } = useMeters();
  const { data: meterDetail } = useMeterDetail(selectedMeter?.id);
  const { data: meterReadings } = useMeterReadings(selectedMeter?.id);
  const createWorkOrder = useCreateMeterWorkOrder();

  const filteredMeters = meters?.filter(meter => {
    const matchesSearch = meter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meter.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meter.asset_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || meter.type === typeFilter;
    const matchesStatus = statusFilter === "all" || meter.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const handleCreateMeterWorkOrder = async () => {
    if (!selectedMeter) return;
    
    const dueDate = addDays(new Date(), 7).toISOString();
    
    await createWorkOrder.mutateAsync({
      meterId: selectedMeter.id,
      title: `Meter Reading - ${selectedMeter.name}`,
      description: `Scheduled reading for ${selectedMeter.name} meter`,
      dueDate,
    });
  };

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
      case 'warning': return <TrendingUp className="h-3 w-3" />;
      case 'critical': return <TrendingDown className="h-3 w-3" />;
      default: return <BarChart3 className="h-3 w-3" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-background">
        {/* Left Panel - Meters List */}
        <div className="w-1/3 border-r bg-card">
          {/* Header */}
          <div className="p-6 border-b bg-muted/20">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Meters</h1>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Meter
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search meters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automated">Automated</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Meters List */}
          <div className="overflow-y-auto h-full">
            {isLoading ? (
              <div className="p-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse mb-4 p-4 border rounded-lg">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredMeters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center p-6">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No meters found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || typeFilter !== "all" || statusFilter !== "all" 
                    ? "Try adjusting your filters"
                    : "Create your first meter to get started"
                  }
                </p>
                {!searchQuery && typeFilter === "all" && statusFilter === "all" && (
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Meter
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredMeters.map((meter) => (
                  <Card
                    key={meter.id}
                    className={`cursor-pointer transition-all hover:shadow-md border ${
                      selectedMeter?.id === meter.id ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                    onClick={() => setSelectedMeter(meter)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium truncate pr-2">{meter.name}</h3>
                        <Badge variant="outline" className={getStatusColor(meter.status)}>
                          {getStatusIcon(meter.status)}
                          <span className="ml-1 capitalize">{meter.status}</span>
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        {meter.asset_name && (
                          <div className="flex items-center gap-1">
                            <Factory className="h-3 w-3" />
                            <span className="truncate">{meter.asset_name}</span>
                          </div>
                        )}
                        {meter.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{meter.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          <span>{meter.current_value} {meter.unit}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {meter.last_reading 
                              ? format(new Date(meter.last_reading), 'MMM dd')
                              : 'No readings'
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Meter Details */}
        <div className="flex-1 overflow-hidden">
          {selectedMeter ? (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b bg-muted/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{selectedMeter.name}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {selectedMeter.asset_name && (
                        <span className="flex items-center gap-1">
                          <Factory className="h-3 w-3" />
                          {selectedMeter.asset_name}
                        </span>
                      )}
                      {selectedMeter.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedMeter.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => setShowReadingModal(true)}
                      className="bg-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Record Reading
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleCreateMeterWorkOrder}
                      disabled={createWorkOrder.isPending}
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Create Work Order
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <div className="flex-1 overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                  <div className="px-6 pt-4">
                    <TabsList className="grid w-full grid-cols-3 max-w-md">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="readings">Readings</TabsTrigger>
                      <TabsTrigger value="automations">Automations</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6">
                    <TabsContent value="overview" className="space-y-6">
                      {/* Current Reading */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary mb-2">
                              {selectedMeter.current_value}
                            </div>
                            <div className="text-lg font-medium text-muted-foreground">
                              {selectedMeter.unit}
                            </div>
                            {selectedMeter.last_reading && (
                              <div className="text-sm text-muted-foreground mt-2">
                                Last reading: {format(new Date(selectedMeter.last_reading), 'MMM dd, yyyy HH:mm')}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Meter Details */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Meter Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Type:</span>
                              <span className="ml-2 capitalize">{selectedMeter.type}</span>
                            </div>
                            <div>
                              <span className="font-medium">Status:</span>
                              <Badge variant="outline" className={`ml-2 ${getStatusColor(selectedMeter.status)}`}>
                                {selectedMeter.status}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium">Unit:</span>
                              <span className="ml-2">{selectedMeter.unit}</span>
                            </div>
                            <div>
                              <span className="font-medium">Frequency:</span>
                              <span className="ml-2 capitalize">{selectedMeter.reading_frequency || 'Manual'}</span>
                            </div>
                            {selectedMeter.target_min && (
                              <div>
                                <span className="font-medium">Min Target:</span>
                                <span className="ml-2">{selectedMeter.target_min}</span>
                              </div>
                            )}
                            {selectedMeter.target_max && (
                              <div>
                                <span className="font-medium">Max Target:</span>
                                <span className="ml-2">{selectedMeter.target_max}</span>
                              </div>
                            )}
                          </div>
                          {selectedMeter.description && (
                            <div className="pt-3 border-t">
                              <span className="font-medium">Description:</span>
                              <p className="text-muted-foreground mt-1">{selectedMeter.description}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="readings">
                      {meterReadings && (
                        <MeterReadingsChart 
                          readings={meterReadings} 
                          unit={selectedMeter.unit} 
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="automations">
                      <MeterTriggersManager meterId={selectedMeter.id} />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Select a meter</h3>
                <p className="text-muted-foreground">
                  Choose a meter from the list to view its details and readings
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {showCreateForm && (
        <MeterForm onClose={() => setShowCreateForm(false)} />
      )}

      {showReadingModal && selectedMeter && (
        <MeterReadingModal
          open={showReadingModal}
          onClose={() => setShowReadingModal(false)}
          meter={{
            id: selectedMeter.id,
            name: selectedMeter.name,
            unit: selectedMeter.unit,
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default MetersPage;