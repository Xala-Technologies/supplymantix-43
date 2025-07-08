
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
    sm: "space-y-spacing-sm",
    md: "space-y-spacing-md",
    lg: "space-y-spacing-lg"
  };

  return (
    <main className={cn(
      "flex-1 overflow-y-auto bg-background",
      padding && "px-spacing-md sm:px-spacing-lg lg:px-spacing-xl py-spacing-lg",
      spacingClasses[spacing],
      className
    )}>
      {children}
    </main>
  );
};
