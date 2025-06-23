
import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocationBreadcrumbs } from "@/hooks/useLocations";
import type { LocationBreadcrumb } from "@/types/location";

interface LocationBreadcrumbsProps {
  locationId: string | null;
  onLocationClick?: (locationId: string) => void;
}

export const LocationBreadcrumbs = ({ locationId, onLocationClick }: LocationBreadcrumbsProps) => {
  const { data: breadcrumbs, isLoading } = useLocationBreadcrumbs(locationId || "");

  if (isLoading || !locationId || !breadcrumbs?.length) {
    return (
      <nav className="flex items-center space-x-1 text-sm text-gray-500">
        <Home className="h-4 w-4" />
        <span>All Locations</span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-1 text-sm" aria-label="Breadcrumb">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-1 text-gray-500 hover:text-gray-700"
        onClick={() => onLocationClick?.("")}
      >
        <Home className="h-4 w-4" />
      </Button>

      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            className={`h-auto p-1 ${
              index === breadcrumbs.length - 1
                ? "text-gray-900 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => onLocationClick?.(crumb.id)}
            disabled={index === breadcrumbs.length - 1}
          >
            {crumb.name}
          </Button>
        </React.Fragment>
      ))}
    </nav>
  );
};
