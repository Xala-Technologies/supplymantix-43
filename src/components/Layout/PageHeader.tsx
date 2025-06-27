
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
      "bg-white/80 backdrop-blur-sm border-b border-gray-200/60",
      "px-4 sm:px-6 lg:px-8 py-8",
      "flex-shrink-0",
      "shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5 min-w-0 flex-1">
          {Icon && (
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100/80 rounded-2xl border border-blue-200/50 shadow-sm">
              <Icon className="w-7 h-7 text-blue-600" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-gray-600 mt-2 leading-relaxed font-medium">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0 ml-6">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};
