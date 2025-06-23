
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="space-y-8 p-8">
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
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                <strong>Error loading meters:</strong> {error instanceof Error ? error.message : "An unknown error occurred"}
                <div className="mt-2 text-sm text-red-600">
                  Please try refreshing the page or contact support if the issue persists.
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <MetersList
              meters={filteredMeters}
              isLoading={isLoading}
              onMeterClick={setSelectedMeter}
            />
          </div>

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
      </div>
    </DashboardLayout>
  );
};

export default Meters;
