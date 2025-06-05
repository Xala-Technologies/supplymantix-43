
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Building2, ChevronRight, Settings } from "lucide-react";

interface Location {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  type: 'building' | 'floor' | 'room' | 'area';
  assets_count?: number;
}

interface LocationsTreeProps {
  locations: Location[];
  isLoading: boolean;
  onLocationClick: (location: Location) => void;
}

export const LocationsTree = ({ locations, isLoading, onLocationClick }: LocationsTreeProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'building': return <Building2 className="h-5 w-5 text-blue-600" />;
      default: return <MapPin className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-3">
      {locations.map((location) => (
        <Card key={location.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getLocationIcon(location.type)}
                <div>
                  <div className="font-medium">{location.name}</div>
                  {location.description && (
                    <div className="text-sm text-muted-foreground font-normal">
                      {location.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {location.assets_count || 0} assets
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onLocationClick(location)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
