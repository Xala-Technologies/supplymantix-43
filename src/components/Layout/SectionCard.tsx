
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  children,
  className,
  headerActions,
  padding = "md"
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  return (
    <Card className={cn(
      "bg-white border border-gray-200 shadow-sm rounded-xl",
      "transition-all duration-200",
      className
    )}>
      {(title || headerActions) && (
        <CardHeader className={cn(
          "border-b border-gray-100",
          paddingClasses[padding],
          "pb-4"
        )}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              {title && (
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {title}
                </CardTitle>
              )}
              {description && (
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {headerActions && (
              <div className="flex items-center gap-3 flex-shrink-0">
                {headerActions}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(
        paddingClasses[padding],
        (title || headerActions) && "pt-6"
      )}>
        {children}
      </CardContent>
    </Card>
  );
};
