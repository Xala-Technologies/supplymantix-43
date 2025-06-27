
import React from "react";
import { cn } from "@/lib/utils";

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  spacing?: "sm" | "md" | "lg";
}

export const PageContent: React.FC<PageContentProps> = ({ 
  children, 
  className,
  padding = true,
  spacing = "md"
}) => {
  const spacingClasses = {
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8"
  };

  return (
    <main className={cn(
      "flex-1 overflow-y-auto",
      padding && "px-4 sm:px-6 lg:px-8 py-6",
      spacingClasses[spacing],
      className
    )}>
      {children}
    </main>
  );
};
