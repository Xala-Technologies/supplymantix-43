import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLocation, useUpdateLocation, useLocations } from "@/hooks/useLocations";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Location } from "@/types/location";
import { LOCATION_TYPES } from "@/types/location";

interface LocationFormProps {
  location?: Location;
  parentLocation?: Location | null;
  onClose: () => void;
}

export const LocationForm = ({ location, parentLocation, onClose }: LocationFormProps) => {
  const [formData, setFormData] = useState({
    name: location?.name || "",
    description: location?.description || "",
    parent_id: location?.parent_id || parentLocation?.id || null,
    location_code: location?.location_code || "",
    location_type: location?.location_type || "general",
    address: location?.address || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: locations } = useLocations();
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const { toast } = useToast();

  // Filter out current location and its descendants from parent options
  const availableParents = locations?.filter(loc => 
    loc.id !== location?.id && 
    !isDescendant(loc.id, location?.id, locations)
  ) || [];

  const handleInputChange = (field: string, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Location name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (location) {
        await updateLocation.mutateAsync({
          id: location.id,
          updates: formData
        });
        toast({
          title: "Success",
          description: "Location updated successfully",
        });
      } else {
        // Get the current user to extract tenant_id
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          toast({
            title: "Error",
            description: "Could not get user information",
            variant: "destructive",
          });
          return;
        }

        // Get tenant_id from user metadata or from an organization lookup
        const { data: existingData } = await supabase
          .from('assets')
          .select('tenant_id')
          .limit(1)
          .single();
        
        const tenantId = existingData?.tenant_id;
        
        if (!tenantId) {
          toast({
            title: "Error", 
            description: "Could not determine tenant information",
            variant: "destructive",
          });
          return;
        }

        const locationData = {
          ...formData,
          tenant_id: tenantId,
          is_active: true,
          metadata: {},
        };
        
        await createLocation.mutateAsync(locationData);
        toast({
          title: "Success",
          description: "Location created successfully",
        });
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save location",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {location ? "Edit Location" : "Create New Location"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter location name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_code">Location Code</Label>
              <Input
                id="location_code"
                value={formData.location_code}
                onChange={(e) => handleInputChange("location_code", e.target.value)}
                placeholder="e.g., BLD-001, WH-A"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location_type">Location Type</Label>
              <Select value={formData.location_type} onValueChange={(value) => handleInputChange("location_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_id">Parent Location</Label>
              <Select value={formData.parent_id || "none"} onValueChange={(value) => handleInputChange("parent_id", value === "none" ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Parent (Root Level)</SelectItem>
                  {availableParents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter physical address"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter location description (optional)"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {location ? "Update Location" : "Create Location"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to check if a location is a descendant of another
function isDescendant(locationId: string, ancestorId: string | undefined, locations: Location[]): boolean {
  if (!ancestorId) return false;
  
  const location = locations.find(loc => loc.id === locationId);
  if (!location || !location.parent_id) return false;
  
  if (location.parent_id === ancestorId) return true;
  
  return isDescendant(location.parent_id, ancestorId, locations);
}
