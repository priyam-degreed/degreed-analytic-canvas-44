import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Dashboard {
  id: string;
  name: string;
  path: string;
  isPublic: boolean;
  createdAt: string;
  components?: any[];
}

interface DashboardContextType {
  dashboards: Dashboard[];
  addDashboard: (dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'path'>) => Dashboard;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => void;
  deleteDashboard: (id: string) => void;
  getDashboard: (id: string) => Dashboard | undefined;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const STORAGE_KEY = 'custom_dashboards';

// Default dashboards (existing system dashboards)
const defaultDashboards: Dashboard[] = [
  { id: "01", name: "Learning Dashboard", path: "/dashboards/learning-engagement", isPublic: true, createdAt: "2024-01-01" },
  { id: "02", name: "Skills Dashboard", path: "/dashboards/skill-insights", isPublic: true, createdAt: "2024-01-01" },
  { id: "03", name: "Skill Progression", path: "/dashboards/skill-progression", isPublic: true, createdAt: "2024-01-01" },
  { id: "04", name: "Content Performance", path: "/dashboards/content-performance", isPublic: true, createdAt: "2024-01-01" },
  { id: "05", name: "Engagement Overview", path: "/dashboards/engagement-overview", isPublic: true, createdAt: "2024-01-01" }
];

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dashboards, setDashboards] = useState<Dashboard[]>(defaultDashboards);

  // Load custom dashboards from localStorage on mount
  useEffect(() => {
    const savedDashboards = localStorage.getItem(STORAGE_KEY);
    if (savedDashboards) {
      try {
        const customDashboards = JSON.parse(savedDashboards);
        setDashboards([...defaultDashboards, ...customDashboards]);
      } catch (error) {
        console.error('Failed to load saved dashboards:', error);
      }
    }
  }, []);

  // Save custom dashboards to localStorage
  const saveToStorage = (allDashboards: Dashboard[]) => {
    const customDashboards = allDashboards.filter(d => !defaultDashboards.some(def => def.id === d.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customDashboards));
  };

  const addDashboard = (dashboardData: Omit<Dashboard, 'id' | 'createdAt' | 'path'>): Dashboard => {
    const newDashboard: Dashboard = {
      ...dashboardData,
      id: `custom_${Date.now()}`,
      createdAt: new Date().toISOString(),
      path: `/dashboard/custom_${Date.now()}`
    };

    const updatedDashboards = [...dashboards, newDashboard];
    setDashboards(updatedDashboards);
    saveToStorage(updatedDashboards);
    return newDashboard;
  };

  const updateDashboard = (id: string, updates: Partial<Dashboard>) => {
    const updatedDashboards = dashboards.map(dashboard =>
      dashboard.id === id ? { ...dashboard, ...updates } : dashboard
    );
    setDashboards(updatedDashboards);
    saveToStorage(updatedDashboards);
  };

  const deleteDashboard = (id: string) => {
    // Only allow deletion of custom dashboards, not default ones
    if (defaultDashboards.some(d => d.id === id)) {
      console.warn('Cannot delete system dashboard');
      return;
    }
    
    const updatedDashboards = dashboards.filter(dashboard => dashboard.id !== id);
    setDashboards(updatedDashboards);
    saveToStorage(updatedDashboards);
  };

  const getDashboard = (id: string): Dashboard | undefined => {
    return dashboards.find(dashboard => dashboard.id === id);
  };

  return (
    <DashboardContext.Provider value={{
      dashboards,
      addDashboard,
      updateDashboard,
      deleteDashboard,
      getDashboard
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboards() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboards must be used within a DashboardProvider');
  }
  return context;
}