
import React from "react";
import { Badge } from "@/components/ui/badge";

interface UnitBadgesProps {
  onUnitSelect: (unit: string) => void;
}

export const UnitBadges = ({ onUnitSelect }: UnitBadgesProps) => {
  const commonUnits = [
    "°C", "°F", "PSI", "bar", "kPa", "Hz", "RPM", "V", "A", "kW", "kWh", 
    "L/min", "m³/h", "hours", "minutes", "%", "ppm"
  ];

  return (
    <div className="flex flex-wrap gap-1">
      {commonUnits.map((unit) => (
        <Badge 
          key={unit}
          variant="outline" 
          className="cursor-pointer hover:bg-blue-50 text-xs"
          onClick={() => onUnitSelect(unit)}
        >
          {unit}
        </Badge>
      ))}
    </div>
  );
};
