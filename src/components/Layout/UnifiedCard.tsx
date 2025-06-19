
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface UnifiedCardProps {
  title: string;
  subtitle?: string;
  status: string;
  statusColor: string;
  icon?: React.ReactNode;
  metrics?: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
  badges?: Array<{
    label: string;
    color: string;
  }>;
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

export const UnifiedCard = ({
  title,
  subtitle,
  status,
  statusColor,
  icon,
  metrics = [],
  badges = [],
  isSelected = false,
  onClick,
  onEdit,
  onDelete,
  children
}: UnifiedCardProps) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md group relative",
        "border border-gray-200 bg-white",
        isSelected && "ring-2 ring-blue-500 border-blue-500",
        onClick && "hover:border-gray-300"
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {icon && (
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-600 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          {(onEdit || onDelete) && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  {onEdit && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={(e) => { e.stopPropagation(); onDelete(); }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Status and Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={cn("text-xs", statusColor)}>
            {status}
          </Badge>
          {badges.map((badge, index) => (
            <Badge key={index} className={cn("text-xs", badge.color)}>
              {badge.label}
            </Badge>
          ))}
        </div>

        {/* Metrics */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                  {metric.icon}
                  <span>{metric.label}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{metric.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Custom Content */}
        {children}
      </CardContent>
    </Card>
  );
};
