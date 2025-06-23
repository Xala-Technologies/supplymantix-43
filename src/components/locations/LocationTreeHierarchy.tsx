
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  Edit, 
  Trash2, 
  Plus,
  MoreHorizontal,
  MapPin
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLocationStats } from "@/hooks/useLocations";
import type { LocationHierarchy } from "@/types/location";
import { LOCATION_TYPES } from "@/types/location";

interface LocationTreeHierarchyProps {
  locations: LocationHierarchy[];
  onLocationClick: (location: LocationHierarchy) => void;
  onEditLocation: (location: LocationHierarchy) => void;
  onDeleteLocation: (location: LocationHierarchy) => void;
  onAddChildLocation: (parentLocation: LocationHierarchy) => void;
  level?: number;
}

export const LocationTreeHierarchy = ({ 
  locations, 
  onLocationClick,
  onEditLocation,
  onDeleteLocation,
  onAddChildLocation,
  level = 0 
}: LocationTreeHierarchyProps) => {
  return (
    <div className="space-y-2">
      {locations.map((location) => (
        <LocationTreeNode
          key={location.id}
          location={location}
          onLocationClick={onLocationClick}
          onEditLocation={onEditLocation}
          onDeleteLocation={onDeleteLocation}
          onAddChildLocation={onAddChildLocation}
          level={level}
        />
      ))}
    </div>
  );
};

interface LocationTreeNodeProps {
  location: LocationHierarchy;
  onLocationClick: (location: LocationHierarchy) => void;
  onEditLocation: (location: LocationHierarchy) => void;
  onDeleteLocation: (location: LocationHierarchy) => void;
  onAddChildLocation: (parentLocation: LocationHierarchy) => void;
  level: number;
}

const LocationTreeNode = ({
  location,
  onLocationClick,
  onEditLocation,
  onDeleteLocation,
  onAddChildLocation,
  level
}: LocationTreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const { data: stats } = useLocationStats(location.id);
  
  const hasChildren = location.children && location.children.length > 0;
  const locationTypeInfo = LOCATION_TYPES.find(type => type.value === location.location_type);
  const indent = level * 24;

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
      <CardContent className="p-0">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
            style={{ paddingLeft: `${16 + indent}px` }}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {hasChildren && (
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
              
              <div className="flex items-center gap-3 min-w-0 flex-1" onClick={() => onLocationClick(location)}>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white text-lg">
                    {locationTypeInfo?.icon || '📍'}
                  </span>
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {location.name}
                    </h3>
                    {location.location_code && (
                      <Badge variant="outline" className="text-xs">
                        {location.location_code}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {locationTypeInfo?.label || 'General'}
                    </Badge>
                    
                    {location.address && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">{location.address}</span>
                      </div>
                    )}
                  </div>
                  
                  {location.description && (
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {location.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {stats && (
                <div className="flex items-center gap-3 text-xs text-gray-500 mr-4">
                  <span>{stats.asset_count} Assets</span>
                  <span>{stats.meter_count} Meters</span>
                  {stats.child_location_count > 0 && (
                    <span>{stats.child_location_count} Sub-locations</span>
                  )}
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAddChildLocation(location); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sub-location
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditLocation(location); }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onDeleteLocation(location); }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {hasChildren && (
            <CollapsibleContent>
              <div className="border-t border-gray-100">
                <LocationTreeHierarchy
                  locations={location.children!}
                  onLocationClick={onLocationClick}
                  onEditLocation={onEditLocation}
                  onDeleteLocation={onDeleteLocation}
                  onAddChildLocation={onAddChildLocation}
                  level={level + 1}
                />
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </CardContent>
    </Card>
  );
};
