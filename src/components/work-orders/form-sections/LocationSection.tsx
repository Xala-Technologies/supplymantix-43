
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Location {
  id: string;
  name: string;
}

interface LocationSectionProps {
  watch: (name: string) => any;
  setValue: (name: string, value: any) => void;
  locations: Location[];
}

export const LocationSection = ({ watch, setValue, locations }: LocationSectionProps) => {
  return (
    <div>
      <Label htmlFor="location">Location</Label>
      <Select
        value={watch("location")}
        onValueChange={(value) => setValue("location", value)}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Select location..." />
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
