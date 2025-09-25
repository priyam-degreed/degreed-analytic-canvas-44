import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';

export interface FilterState {
  dateRange: DateRange;
  contentType: string[];
  provider: string[];
  skills: string[];
  groups: string[];
  roles: string[];
  customAttribute: string[];
}

export interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  dateRange: {
    from: subDays(new Date(), 29),
    to: new Date()
  },
  contentType: [],
  provider: [],
  skills: [],
  groups: [],
  roles: [],
  customAttribute: []
};

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, updateFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}