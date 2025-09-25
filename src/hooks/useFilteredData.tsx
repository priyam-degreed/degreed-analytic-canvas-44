import { useMemo } from 'react';
import { isWithinInterval, parseISO } from 'date-fns';
import { FilterState } from '@/contexts/FilterContext';

// Enhanced data item interface
export interface FilterableDataItem {
  id?: string;
  date?: string | Date;
  contentType?: string;
  provider?: string;
  skills?: string[];
  groups?: string[];
  roles?: string[];
  customAttribute?: string[];
  [key: string]: any;
}

// Generic filtering function
export function filterData<T extends FilterableDataItem>(
  data: T[],
  filters: FilterState
): T[] {
  return data.filter(item => {
    // Date range filter
    if (filters.dateRange.from && filters.dateRange.to && item.date) {
      const itemDate = typeof item.date === 'string' ? parseISO(item.date) : item.date;
      if (!isWithinInterval(itemDate, { 
        start: filters.dateRange.from, 
        end: filters.dateRange.to 
      })) {
        return false;
      }
    }

    // Content type filter
    if (filters.contentType.length > 0 && item.contentType) {
      if (!filters.contentType.includes(item.contentType)) {
        return false;
      }
    }

    // Provider filter
    if (filters.provider.length > 0 && item.provider) {
      if (!filters.provider.includes(item.provider)) {
        return false;
      }
    }

    // Skills filter
    if (filters.skills.length > 0 && item.skills) {
      const hasMatchingSkill = item.skills.some(skill => 
        filters.skills.includes(skill)
      );
      if (!hasMatchingSkill) {
        return false;
      }
    }

    // Groups filter
    if (filters.groups.length > 0 && item.groups) {
      const hasMatchingGroup = item.groups.some(group => 
        filters.groups.includes(group)
      );
      if (!hasMatchingGroup) {
        return false;
      }
    }

    // Roles filter
    if (filters.roles.length > 0 && item.roles) {
      const hasMatchingRole = item.roles.some(role => 
        filters.roles.includes(role)
      );
      if (!hasMatchingRole) {
        return false;
      }
    }

    // Custom Attribute filter
    if (filters.customAttribute.length > 0 && item.customAttribute) {
      const hasMatchingCustomAttribute = item.customAttribute.some(attr => 
        filters.customAttribute.includes(attr)
      );
      if (!hasMatchingCustomAttribute) {
        return false;
      }
    }

    return true;
  });
}

// Hook for filtered data
export function useFilteredData<T extends FilterableDataItem>(
  data: T[],
  filters: FilterState
): T[] {
  return useMemo(() => filterData(data, filters), [data, filters]);
}

// Hook for aggregated metrics from filtered data
export function useFilteredMetrics<T extends FilterableDataItem>(
  data: T[],
  filters: FilterState,
  metricCalculator: (filteredData: T[]) => Record<string, any>
): Record<string, any> {
  const filteredData = useFilteredData(data, filters);
  return useMemo(() => metricCalculator(filteredData), [filteredData, metricCalculator]);
}

// Chart data helper
export function useFilteredChartData<T extends FilterableDataItem>(
  data: T[],
  filters: FilterState,
  chartDataTransformer: (filteredData: T[]) => any[]
): any[] {
  const filteredData = useFilteredData(data, filters);
  return useMemo(() => chartDataTransformer(filteredData), [filteredData, chartDataTransformer]);
}