
import React from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout = ({
  children,
  className
}: PageLayoutProps) => {
  return <div className={cn("h-full flex flex-col bg-gray-50", className)}>
      {children}
    </div>;
};

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  leftContent?: React.ReactNode;
  className?: string;
}

export const PageLayoutHeader = ({
  title,
  description,
  children,
  leftContent,
  className
}: PageHeaderProps) => {
  return (
    <div className={cn("bg-white border-b border-gray-200 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {leftContent}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
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
  );
};

interface PageFiltersProps {
  children: React.ReactNode;
  className?: string;
}

export const PageFilters = ({
  children,
  className
}: PageFiltersProps) => {
  return <div className={cn("bg-white border-b border-gray-100", className)}>
      {children}
    </div>;
};

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayoutContent = ({
  children,
  className
}: PageContentProps) => {
  return <div className={cn("flex-1 overflow-hidden", className)}>
      {children}
    </div>;
};
