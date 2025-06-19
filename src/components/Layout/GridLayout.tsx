
import React from "react";
import { cn } from "@/lib/utils";

interface GridLayoutProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: 4 | 6 | 8;
}

export const GridLayout = ({ 
  children, 
  className, 
  cols = 3,
  gap = 6 
}: GridLayoutProps) => {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  };

  const gapClass = {
    4: "gap-4",
    6: "gap-6", 
    8: "gap-8"
  };

  return (
    <div className={cn(
      "grid auto-rows-fr",
      colsClass[cols],
      gapClass[gap],
      "p-6",
      className
    )}>
      {children}
    </div>
  );
};
