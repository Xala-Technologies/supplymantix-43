
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  additionalInfo?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  additionalInfo,
  showBackButton = false,
  backButtonText = "Back",
  onBack,
  children
}: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b bg-white">
      {showBackButton && onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backButtonText}
        </Button>
      )}
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {additionalInfo && (
          <p className="text-xs text-blue-600 mt-1">
            {additionalInfo}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
