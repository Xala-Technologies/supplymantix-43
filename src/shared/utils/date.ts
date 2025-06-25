
import { format, parseISO, isValid, differenceInDays, startOfDay, endOfDay } from 'date-fns';

export const formatDate = (date: string | Date, formatString = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid Date';
  } catch {
    return 'Invalid Date';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    
    const now = new Date();
    const diffDays = differenceInDays(dateObj, now);
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return formatDate(dateObj);
  } catch {
    return 'Invalid Date';
  }
};

export const createDateRange = (from: Date, to: Date) => ({
  from: startOfDay(from),
  to: endOfDay(to),
});

export const isDateInRange = (date: Date, range: { from: Date; to: Date }): boolean => {
  return date >= range.from && date <= range.to;
};
