
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export const SectionCard = ({
  title,
  description,
  children,
  className,
  headerActions
}: SectionCardProps) => {
  return (
    <Card className={cn("shadow-sm border-gray-200 rounded-xl", className)}>
      {(title || headerActions) && (
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0 flex-1">
              {title && (
                <CardTitle className="text-lg font-semibold text-slate-900 truncate">
                  {title}
                </CardTitle>
              )}
              {description && (
                <p className="text-sm text-slate-600 mt-1">{description}</p>
              )}
            </div>
            {headerActions && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {headerActions}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={title || headerActions ? "pt-0" : undefined}>
        {children}
      </CardContent>
    </Card>
  );
};
