
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  colorMap?: Record<string, string>;
  className?: string;
}

const defaultColorMap = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
};

export const StatusBadge = ({ 
  status, 
  variant = 'default',
  size = 'md',
  colorMap = defaultColorMap,
  className 
}: StatusBadgeProps) => {
  const colors = colorMap[status.toLowerCase()] || defaultColorMap.inactive;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <Badge 
      variant={variant}
      className={cn(
        'font-medium rounded-full border',
        colors,
        sizeClasses[size],
        className
      )}
    >
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};
