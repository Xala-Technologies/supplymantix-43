
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Ban, AlertCircle } from "lucide-react";

interface RequestStatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export const RequestStatusBadge = ({ status, size = "md" }: RequestStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: Clock,
        };
      case "approved":
        return {
          label: "Approved",
          className: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
        };
      case "rejected":
        return {
          label: "Rejected",
          className: "bg-red-100 text-red-800 border-red-200",
          icon: XCircle,
        };
      case "in_progress":
        return {
          label: "In Progress",
          className: "bg-blue-100 text-blue-800 border-blue-200",
          icon: AlertCircle,
        };
      case "completed":
        return {
          label: "Completed",
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-gray-100 text-gray-600 border-gray-200",
          icon: Ban,
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: AlertCircle,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <Badge className={`${config.className} inline-flex items-center gap-1`}>
      <Icon className={iconSize} />
      {config.label}
    </Badge>
  );
};
