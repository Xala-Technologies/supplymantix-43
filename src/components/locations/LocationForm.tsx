
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLocation, useUpdateLocation } from "@/hooks/useLocations";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Location } from "@/types/location";

interface LocationFormProps {
  location?: Location;
  onClose: () => void;
}

export const LocationForm = ({ location, onClose }: LocationFormProps) => {
  const [formData, setFormData] = useState({
    name: location?.name || "",
    description: location?.description || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
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
        // For now, we'll derive it from the existing data in the system
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
          tenant_id: tenantId
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
      <DialogContent className="max-w-2xl">
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
