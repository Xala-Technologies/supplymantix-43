
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { LocationsHeader } from "@/components/locations/LocationsHeader";
import { LocationsTree } from "@/components/locations/LocationsTree";
import { LocationForm } from "@/components/locations/LocationForm";
import { LocationDetailDialog } from "@/components/locations/LocationDetailDialog";
import { useLocations } from "@/hooks/useLocations";

const Locations = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: locations, isLoading } = useLocations();

  const filteredLocations = locations?.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <LocationsHeader
          onCreateLocation={() => setIsFormOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LocationsTree
              locations={filteredLocations}
              isLoading={isLoading}
              onLocationClick={setSelectedLocation}
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
          </div>
        </div>

        {isFormOpen && (
          <LocationForm onClose={() => setIsFormOpen(false)} />
        )}

        {selectedLocation && (
          <LocationDetailDialog
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Locations;
