
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { MetersHeader } from "@/components/meters/MetersHeader";
import { MetersList } from "@/components/meters/MetersList";
import { MeterForm } from "@/components/meters/MeterForm";
import { MeterDetailDialog } from "@/components/meters/MeterDetailDialog";
import { useMeters } from "@/hooks/useMeters";

const Meters = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: meters, isLoading, error } = useMeters();

  console.log("Meters page data:", { meters, isLoading, error });

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
      <div className="space-y-6 p-6">
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error loading meters</h3>
            <p className="text-red-600 text-sm mt-1">
              {error instanceof Error ? error.message : "An unknown error occurred"}
            </p>
          </div>
        )}

        <MetersList
          meters={filteredMeters}
          isLoading={isLoading}
          onMeterClick={setSelectedMeter}
        />

        {isFormOpen && (
          <MeterForm
            onClose={() => setIsFormOpen(false)}
          />
        )}

        {selectedMeter && (
          <MeterDetailDialog
            meter={selectedMeter}
            onClose={() => setSelectedMeter(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Meters;
