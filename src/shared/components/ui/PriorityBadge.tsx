
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const priorityConfig = {
  low: { 
    color: 'bg-green-500 text-white border-green-500', 
    icon: '🟢' 
  },
  medium: { 
    color: 'bg-yellow-500 text-white border-yellow-500', 
    icon: '🟡' 
  },
  high: { 
    color: 'bg-orange-500 text-white border-orange-500', 
    icon: '🟠' 
  },
  urgent: { 
    color: 'bg-red-500 text-white border-red-500', 
    icon: '🔴' 
  },
};

export const PriorityBadge = ({ 
  priority, 
  size = 'md',
  showIcon = false,
  className 
}: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <Badge 
      className={cn(
        'font-medium rounded-full border',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {priority.toUpperCase()}
    </Badge>
  );
};
