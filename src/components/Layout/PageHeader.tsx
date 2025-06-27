
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  actions,
  className
}) => {
  return (
    <header className={cn(
      "bg-white border-b border-gray-200",
      "px-4 sm:px-6 lg:px-8 py-6",
      "flex-shrink-0",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {Icon && (
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl border border-blue-100">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-base text-gray-600 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};
