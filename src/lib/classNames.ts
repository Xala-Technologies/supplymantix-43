// Class name utilities
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Status badge class generators
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Work Order statuses
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    open: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    on_hold: 'bg-orange-100 text-orange-800 border-orange-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    
    // Asset statuses
    active: 'bg-green-100 text-green-800 border-green-200',
    maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    out_of_service: 'bg-red-100 text-red-800 border-red-200',
    retired: 'bg-gray-100 text-gray-800 border-gray-200',
    
    // Purchase Order statuses
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-blue-100 text-blue-800 border-blue-200',
    ordered: 'bg-purple-100 text-purple-800 border-purple-200',
    received: 'bg-green-100 text-green-800 border-green-200',
    
    // Request statuses
    submitted: 'bg-blue-100 text-blue-800 border-blue-200',
    under_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getPriorityColor = (priority: string): string => {
  const priorityColors: Record<string, string> = {
    none: 'bg-gray-400 text-white',
    low: 'bg-green-500 text-white',
    medium: 'bg-yellow-500 text-white',
    high: 'bg-orange-500 text-white',
    urgent: 'bg-red-500 text-white',
  };
  
  return priorityColors[priority] || 'bg-gray-400 text-white';
};

// Loading state classes
export const getLoadingClasses = (size: 'sm' | 'md' | 'lg' = 'md'): string => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  return cn('animate-spin', sizeClasses[size]);
};