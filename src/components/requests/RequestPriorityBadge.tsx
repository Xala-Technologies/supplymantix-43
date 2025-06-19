
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Minus, ArrowUp, Zap } from "lucide-react";

interface RequestPriorityBadgeProps {
  priority: string;
  size?: "sm" | "md" | "lg";
}

export const RequestPriorityBadge = ({ priority, size = "md" }: RequestPriorityBadgeProps) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "low":
        return {
          label: "Low",
          className: "bg-gray-100 text-gray-600 border-gray-200",
          icon: Minus,
        };
      case "medium":
        return {
          label: "Medium",
          className: "bg-blue-100 text-blue-700 border-blue-200",
          icon: ArrowUp,
        };
      case "high":
        return {
          label: "High",
          className: "bg-orange-100 text-orange-700 border-orange-200",
          icon: AlertTriangle,
        };
      case "urgent":
        return {
          label: "Urgent",
          className: "bg-red-100 text-red-700 border-red-200",
          icon: Zap,
        };
      default:
        return {
          label: priority,
          className: "bg-gray-100 text-gray-600 border-gray-200",
          icon: Minus,
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;
  
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <Badge className={`${config.className} inline-flex items-center gap-1`}>
      <Icon className={iconSize} />
      {config.label}
    </Badge>
  );
};

export default RequestPriorityBadge;
