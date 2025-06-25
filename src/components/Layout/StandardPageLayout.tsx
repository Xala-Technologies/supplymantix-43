
import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StandardPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const StandardPageLayout = ({ children, className }: StandardPageLayoutProps) => {
  return (
    <div className={cn(
      "h-full p-6 bg-gray-50/30 transition-all duration-300 ease-linear",
      className
    )}>
      <Card className="h-full flex flex-col overflow-hidden shadow-lg">
        {children}
      </Card>
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
    <div className={cn("flex-shrink-0 border-b bg-white", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {leftContent}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          {children && (
            <div className="flex items-center gap-3">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StandardPageFiltersProps {
  children: React.ReactNode;
  className?: string;
}

export const StandardPageFilters = ({ children, className }: StandardPageFiltersProps) => {
  return (
    <div className={cn("flex-shrink-0 border-b border-gray-100 bg-white", className)}>
      {children}
    </div>
  );
};

interface StandardPageContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const StandardPageContent = ({ 
  children, 
  className, 
  padding = true 
}: StandardPageContentProps) => {
  return (
    <div className={cn(
      "flex-1 overflow-hidden transition-all duration-300 ease-linear",
      className
    )}>
      <div className={cn(
        "h-full overflow-y-auto",
        padding && "p-6"
      )}>
        {children}
      </div>
    </div>
  );
};
