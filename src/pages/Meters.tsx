
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { MetersHeader } from "@/components/meters/MetersHeader";
import { MetersList } from "@/components/meters/MetersList";
import { MeterForm } from "@/components/meters/MeterForm";
import { MeterDetailDialog } from "@/components/meters/MeterDetailDialog";
import { MeterBulkActions } from "@/components/meters/MeterBulkActions";
import { MeterExportDialog } from "@/components/meters/MeterExportDialog";
import { MeterImportDialog } from "@/components/meters/MeterImportDialog";
import { MeterAnalytics } from "@/components/meters/MeterAnalytics";
import { MeterQuickActions } from "@/components/meters/MeterQuickActions";
import { useMeters } from "@/hooks/useMeters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Meters = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<any>(null);
  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("meters");

  const { data: meters, isLoading, error } = useMeters();

  const filteredMeters = meters?.filter(meter => {
    const matchesSearch = meter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meter.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meter.asset_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || meter.type === typeFilter;
    const matchesStatus = statusFilter === "all" || meter.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const handleMeterClick = (meter: any) => {
    console.log('Meters page: Opening meter detail dialog for:', meter);
    console.log('Meters page: Setting selectedMeter to:', meter.id, meter.name);
    setSelectedMeter(meter);
  };

  const handleCloseDialog = () => {
    console.log('Meters page: Closing meter detail dialog');
    setSelectedMeter(null);
  };

  const handleMeterSelect = (meterId: string, selected: boolean) => {
    if (selected) {
      setSelectedMeters(prev => [...prev, meterId]);
    } else {
      setSelectedMeters(prev => prev.filter(id => id !== meterId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedMeters(filteredMeters.map(m => m.id));
    } else {
      setSelectedMeters([]);
    }
  };

  const handleExport = () => {
    if (selectedMeters.length > 0) {
      setShowExportDialog(true);
    } else {
      // Export all filtered meters
      setShowExportDialog(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <MetersHeader
            onCreateMeter={() => setIsFormOpen(true)}
            onImport={() => setShowImportDialog(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            selectedCount={selectedMeters.length}
            totalCount={filteredMeters.length}
            onSelectAll={handleSelectAll}
          />

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Error loading meters: {error instanceof Error ? error.message : "Unknown error"}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="meters">Meters</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="meters" className="space-y-6">
              <MetersList
                meters={filteredMeters}
                isLoading={isLoading}
                onMeterClick={handleMeterClick}
                selectedMeters={selectedMeters}
                onMeterSelect={handleMeterSelect}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <MeterAnalytics />
            </TabsContent>

            <TabsContent value="overview">
              <MeterQuickActions onCreateMeter={() => setIsFormOpen(true)} />
            </TabsContent>
          </Tabs>

          {/* Dialogs */}
          {isFormOpen && (
            <MeterForm onClose={() => setIsFormOpen(false)} />
          )}

          {selectedMeter && (
            <MeterDetailDialog
              meter={selectedMeter}
              onClose={handleCloseDialog}
            />
          )}

          <MeterExportDialog
            open={showExportDialog}
            onClose={() => setShowExportDialog(false)}
            selectedMeters={selectedMeters.length > 0 ? selectedMeters : undefined}
          />

          <MeterImportDialog
            open={showImportDialog}
            onClose={() => setShowImportDialog(false)}
          />

          {/* Bulk Actions */}
          <MeterBulkActions
            selectedMeters={selectedMeters}
            onClearSelection={() => setSelectedMeters([])}
            onExport={handleExport}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Meters;
