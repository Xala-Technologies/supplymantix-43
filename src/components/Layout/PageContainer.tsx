
import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className,
  maxWidth = "full",
  padding = true
}) => {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md", 
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  };

  return (
    <div className={cn(
      "h-full flex flex-col",
      "mx-auto w-full",
      "bg-background",
      maxWidthClasses[maxWidth],
      padding && "px-spacing-md sm:px-spacing-lg lg:px-spacing-xl",
      className
    )}>
      {children}
    </div>
  );
};
