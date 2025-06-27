
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-6",
      className
    )}>
      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-base text-gray-600 mb-6 max-w-md leading-relaxed">
        {description}
      </p>
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
