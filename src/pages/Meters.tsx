
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { MetersHeader } from "@/components/meters/MetersHeader";
import { MetersList } from "@/components/meters/MetersList";
import { MeterForm } from "@/components/meters/MeterForm";
import { MeterDetailDialog } from "@/components/meters/MeterDetailDialog";
import { useMeters } from "@/hooks/useMeters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Meters = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: meters, isLoading, error } = useMeters();

  const filteredMeters = meters?.filter(meter => {
    const matchesSearch = meter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meter.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meter.asset_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || meter.type === typeFilter;
    const matchesStatus = statusFilter === "all" || meter.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <MetersHeader
            onCreateMeter={() => setIsFormOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Error loading meters: {error instanceof Error ? error.message : "Unknown error"}
              </AlertDescription>
            </Alert>
          )}

          <MetersList
            meters={filteredMeters}
            isLoading={isLoading}
            onMeterClick={setSelectedMeter}
          />

          {isFormOpen && (
            <MeterForm onClose={() => setIsFormOpen(false)} />
          )}

          {selectedMeter && (
            <MeterDetailDialog
              meter={selectedMeter}
              onClose={() => setSelectedMeter(null)}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Meters;
