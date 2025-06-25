
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface Location {
  id: string;
  name: string;
}

interface LocationSectionProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  locations: Location[];
}

export const LocationSection = ({ watch, setValue, locations }: LocationSectionProps) => {
  const currentLocation = watch("location");

  const handleLocationChange = (locationId: string) => {
    setValue("location", locationId);
  };

  // Find the current location to display its name
  const selectedLocation = locations.find(loc => loc.id === currentLocation);

  return (
    <div>
      <Label htmlFor="location">Location</Label>
      <Select value={currentLocation || ""} onValueChange={handleLocationChange}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Select location">
            {selectedLocation?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
