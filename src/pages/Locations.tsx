import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { LocationsHeader } from "@/components/locations/LocationsHeader";
import { LocationTreeHierarchy } from "@/components/locations/LocationTreeHierarchy";
import { LocationForm } from "@/components/locations/LocationForm";
import { LocationDetailDialog } from "@/components/locations/LocationDetailDialog";
import { LocationBreadcrumbs } from "@/components/locations/LocationBreadcrumbs";
import { useLocationHierarchy, useDeleteLocation } from "@/hooks/useLocations";
import { useGlobalAssetStats, useGlobalMeterStats } from "@/hooks/useGlobalStats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Location, LocationHierarchy } from "@/types/location";

const Locations = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [parentForNewLocation, setParentForNewLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(null);

  const { data: locationHierarchy, isLoading, error } = useLocationHierarchy();
  const { data: assetStats, isLoading: assetStatsLoading } = useGlobalAssetStats();
  const { data: meterStats, isLoading: meterStatsLoading } = useGlobalMeterStats();
  const deleteLocation = useDeleteLocation();
  const { toast } = useToast();

  // Filter locations based on search query
  const filteredLocations = React.useMemo(() => {
    if (!searchQuery || !locationHierarchy) return locationHierarchy;
    
    const filterTree = (locations: LocationHierarchy[]): LocationHierarchy[] => {
      return locations.reduce((acc: LocationHierarchy[], location) => {
        const matchesSearch = 
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.location_code?.toLowerCase().includes(searchQuery.toLowerCase());

        const filteredChildren = location.children ? filterTree(location.children) : [];
        
        if (matchesSearch || filteredChildren.length > 0) {
          acc.push({
            ...location,
            children: filteredChildren
          });
        }
        
        return acc;
      }, []);
    };

    return filterTree(locationHierarchy);
  }, [locationHierarchy, searchQuery]);

  const handleCreateLocation = () => {
    setEditingLocation(null);
    setParentForNewLocation(null);
    setIsFormOpen(true);
  };

  const handleAddChildLocation = (parentLocation: LocationHierarchy) => {
    setEditingLocation(null);
    setParentForNewLocation(parentLocation as Location);
    setIsFormOpen(true);
  };

  const handleEditLocation = (location: LocationHierarchy) => {
    setEditingLocation(location as Location);
    setParentForNewLocation(null);
    setIsFormOpen(true);
  };

  const handleDeleteLocation = async (location: LocationHierarchy) => {
    try {
      await deleteLocation.mutateAsync(location.id);
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete location",
        variant: "destructive",
      });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLocation(null);
    setParentForNewLocation(null);
  };

  const handleLocationClick = (location: LocationHierarchy) => {
    setSelectedLocation(location as Location);
    setCurrentLocationId(location.id);
  };

  const handleCloseDetail = () => {
    setSelectedLocation(null);
    setCurrentLocationId(null);
  };

  const handleBreadcrumbClick = (locationId: string) => {
    if (locationId) {
      // Find the location in the hierarchy
      const findLocation = (locations: LocationHierarchy[]): LocationHierarchy | null => {
        for (const loc of locations) {
          if (loc.id === locationId) return loc;
          if (loc.children) {
            const found = findLocation(loc.children);
            if (found) return found;
          }
        }
        return null;
      };

      const location = locationHierarchy ? findLocation(locationHierarchy) : null;
      if (location) {
        handleLocationClick(location);
      }
    } else {
      setCurrentLocationId(null);
      setSelectedLocation(null);
    }
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

          {currentLocationId && (
            <Card className="p-4">
              <LocationBreadcrumbs 
                locationId={currentLocationId}
                onLocationClick={handleBreadcrumbClick}
              />
            </Card>
          )}

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
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-6 animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : !filteredLocations || filteredLocations.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-10 w-10 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {searchQuery ? "No matching locations found" : "No Locations Found"}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchQuery 
                      ? "Try adjusting your search terms or clear the search to see all locations."
                      : "Get started by creating your first location to organize your facility structure."
                    }
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleCreateLocation} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Location
                    </Button>
                  )}
                </Card>
              ) : (
                <LocationTreeHierarchy
                  locations={filteredLocations}
                  onLocationClick={handleLocationClick}
                  onEditLocation={handleEditLocation}
                  onDeleteLocation={handleDeleteLocation}
                  onAddChildLocation={handleAddChildLocation}
                />
              )}
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Locations:</span>
                    <span className="font-medium">{locationHierarchy?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Active Assets:</span>
                    <span className="font-medium">
                      {assetStatsLoading ? "..." : assetStats?.active || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Meters:</span>
                    <span className="font-medium">
                      {meterStatsLoading ? "..." : meterStats?.total || 0}
                    </span>
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
              parentLocation={parentForNewLocation}
              onClose={handleCloseForm} 
            />
          )}

          {selectedLocation && (
            <LocationDetailDialog
              location={selectedLocation}
              onClose={handleCloseDetail}
              onEdit={() => handleEditLocation(selectedLocation as LocationHierarchy)}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Locations;
