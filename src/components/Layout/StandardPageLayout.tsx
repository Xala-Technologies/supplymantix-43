
import React from "react";
import { cn } from "@/lib/utils";

interface StandardPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const StandardPageLayout = ({ children, className }: StandardPageLayoutProps) => {
  return (
    <div className={cn("h-full flex flex-col bg-gray-50/30", className)}>
      {children}
    </div>
  );
};

interface StandardPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  leftContent?: React.ReactNode;
  className?: string;
}

export const StandardPageHeader = ({
  title,
  description,
  children,
  leftContent,
  className
}: StandardPageHeaderProps) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {leftContent}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 truncate">{title}</h1>
            {description && (
              <p className="text-sm text-slate-600 mt-1 line-clamp-2 sm:line-clamp-1">{description}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </header>
  );
};

interface StandardPageFiltersProps {
  children: React.ReactNode;
  className?: string;
}

export const StandardPageFilters = ({ children, className }: StandardPageFiltersProps) => {
  return (
    <div className={cn("bg-white border-b border-gray-100 px-4 sm:px-6 py-3", className)}>
      {children}
    </div>
  );
};

interface StandardPageContentProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}

export const StandardPageContent = ({ 
  children, 
  className, 
  padded = true 
}: StandardPageContentProps) => {
  return (
    <main className={cn(
      "flex-1 overflow-hidden",
      padded && "p-4 sm:p-6",
      className
    )}>
      {children}
    </main>
  );
};
