
import React from "react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "bg-white border-b border-gray-100",
      "px-4 sm:px-6 lg:px-8 py-4",
      "flex flex-col sm:flex-row sm:items-center gap-4",
      "flex-shrink-0",
      className
    )}>
      {children}
    </div>
  );
};
