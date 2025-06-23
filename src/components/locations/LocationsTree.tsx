
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Building2, 
  Edit, 
  Trash2, 
  Plus,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import type { Location } from "@/types/location";

interface LocationsTreeProps {
  locations: Location[];
  isLoading: boolean;
  onLocationClick: (location: Location) => void;
}

export const LocationsTree = ({ 
  locations, 
  isLoading, 
  onLocationClick 
}: LocationsTreeProps) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <MapPin className="h-10 w-10 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Locations Found</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Get started by creating your first location to organize your facility structure.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Location
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {locations.map((location) => (
        <LocationTreeItem
          key={location.id}
          location={location}
          isExpanded={expandedItems.has(location.id)}
          onToggle={() => toggleExpanded(location.id)}
          onClick={() => onLocationClick(location)}
        />
      ))}
    </div>
  );
};

interface LocationTreeItemProps {
  location: Location;
  isExpanded: boolean;
  onToggle: () => void;
  onClick: () => void;
  level?: number;
}

const LocationTreeItem = ({ 
  location, 
  isExpanded, 
  onToggle, 
  onClick,
  level = 0 
}: LocationTreeItemProps) => {
  const hasSubLocations = false; // TODO: Implement when we have hierarchical data

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300">
      <CardContent className="p-0">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={onClick}
          style={{ paddingLeft: `${16 + level * 24}px` }}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {hasSubLocations && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {location.name}
              </h3>
              {location.description && (
                <p className="text-sm text-gray-500 truncate">
                  {location.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement edit action
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement delete action
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
