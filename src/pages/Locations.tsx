
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { LocationsHeader } from "@/components/locations/LocationsHeader";
import { LocationsTree } from "@/components/locations/LocationsTree";
import { LocationForm } from "@/components/locations/LocationForm";
import { LocationDetailDialog } from "@/components/locations/LocationDetailDialog";
import { useLocations } from "@/hooks/useLocations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { Location } from "@/types/location";

const Locations = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: locations, isLoading, error } = useLocations();

  const filteredLocations = locations?.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreateLocation = () => {
    setEditingLocation(null);
    setIsFormOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLocation(null);
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleCloseDetail = () => {
    setSelectedLocation(null);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <LocationsHeader
            onCreateLocation={handleCreateLocation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Error loading locations: {error instanceof Error ? error.message : "Unknown error"}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LocationsTree
                locations={filteredLocations}
                isLoading={isLoading}
                onLocationClick={handleLocationClick}
              />
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Locations:</span>
                    <span className="font-medium">{locations?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Active Assets:</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Pending Work Orders:</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Location "Building A" created</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Asset moved to "Warehouse B"</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Work order assigned to "Office C"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dialogs */}
          {isFormOpen && (
            <LocationForm 
              location={editingLocation || undefined}
              onClose={handleCloseForm} 
            />
          )}

          {selectedLocation && (
            <LocationDetailDialog
              location={selectedLocation}
              onClose={handleCloseDetail}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Locations;
