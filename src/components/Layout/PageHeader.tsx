
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
  backButton?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  actions,
  className,
  backButton
}) => {
  return (
    <header className={cn(
      "bg-surface/95 backdrop-blur-xl border-b border-border-secondary",
      "px-spacing-md sm:px-spacing-lg lg:px-spacing-xl py-spacing-lg",
      "flex-shrink-0",
      "shadow-card",
      className
    )}>
      {/* Back button row */}
      {backButton && (
        <div className="mb-4">
          {backButton}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5 min-w-0 flex-1">
          {Icon && (
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100/80 rounded-2xl border border-primary-200/50 shadow-sm">
              <Icon className="w-7 h-7 text-primary-600" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-text-secondary mt-2 leading-relaxed font-medium">
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
