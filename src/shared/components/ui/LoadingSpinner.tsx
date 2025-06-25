
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const LoadingSpinner = ({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div 
        className={cn(
          'border-2 border-primary border-t-transparent rounded-full animate-spin',
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};
