
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Location } from "@/types/location";

interface LocationsTreeProps {
  locations: Location[];
  isLoading: boolean;
  onLocationClick: (location: Location) => void;
}

export const LocationsTree = ({ locations, isLoading, onLocationClick }: LocationsTreeProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first location</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {locations.map((location) => (
        <Card key={location.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                {location.name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onLocationClick(location)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent onClick={() => onLocationClick(location)}>
            <p className="text-sm text-muted-foreground mb-3">
              {location.description || "No description available"}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Created: {new Date(location.created_at).toLocaleDateString()}</span>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
