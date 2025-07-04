import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addDays, subDays, startOfMonth, endOfMonth } from 'date-fns';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ReportFilter {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'text';
  value: any;
  options?: { label: string; value: string }[];
}

export interface ReportingContextType {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  filters: ReportFilter[];
  addFilter: (filter: ReportFilter) => void;
  updateFilter: (id: string, value: any) => void;
  removeFilter: (id: string) => void;
  savedFilters: { id: string; name: string; filters: ReportFilter[]; dateRange: DateRange }[];
  saveCurrentFilters: (name: string) => void;
  loadSavedFilters: (id: string) => void;
}

const ReportingContext = createContext<ReportingContextType | undefined>(undefined);

export const useReporting = () => {
  const context = useContext(ReportingContext);
  if (!context) {
    throw new Error('useReporting must be used within a ReportingProvider');
  }
  return context;
};

interface ReportingProviderProps {
  children: ReactNode;
}

export const ReportingProvider = ({ children }: ReportingProviderProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [filters, setFilters] = useState<ReportFilter[]>([
    {
      id: 'assignedTo',
      label: 'Assigned To',
      type: 'multiselect',
      value: [],
      options: [],
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'multiselect',
      value: [],
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
    {
      id: 'location',
      label: 'Location',
      type: 'multiselect',
      value: [],
      options: [],
    },
  ]);

  const [savedFilters, setSavedFilters] = useState<{ id: string; name: string; filters: ReportFilter[]; dateRange: DateRange }[]>([]);

  const addFilter = (filter: ReportFilter) => {
    setFilters(prev => [...prev, filter]);
  };

  const updateFilter = (id: string, value: any) => {
    setFilters(prev => prev.map(f => f.id === id ? { ...f, value } : f));
  };

  const removeFilter = (id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  };

  const saveCurrentFilters = (name: string) => {
    const savedFilter = {
      id: Date.now().toString(),
      name,
      filters: [...filters],
      dateRange: { ...dateRange },
    };
    setSavedFilters(prev => [...prev, savedFilter]);
  };

  const loadSavedFilters = (id: string) => {
    const saved = savedFilters.find(sf => sf.id === id);
    if (saved) {
      setFilters(saved.filters);
      setDateRange(saved.dateRange);
    }
  };

  return (
    <ReportingContext.Provider
      value={{
        dateRange,
        setDateRange,
        filters,
        addFilter,
        updateFilter,
        removeFilter,
        savedFilters,
        saveCurrentFilters,
        loadSavedFilters,
      }}
    >
      {children}
    </ReportingContext.Provider>
  );
};