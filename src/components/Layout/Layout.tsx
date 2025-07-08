
import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "min-h-screen bg-background",
      "flex flex-col",
      "w-full",
      className
    )}>
      {children}
    </div>
  );
};
