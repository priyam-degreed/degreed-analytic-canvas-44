import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useDashboards } from "@/contexts/DashboardContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Filter, ToggleLeft, Type } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip } from "recharts";

export function DynamicDashboard() {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const { getDashboard } = useDashboards();
  
  if (!dashboardId) {
    return <Navigate to="/" replace />;
  }
  
  const dashboard = getDashboard(dashboardId);
  
  if (!dashboard) {
    return <Navigate to="/" replace />;
  }

  // Sample data for charts
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 }
  ];

  const pieData = [
    { name: 'Online Courses', value: 42.1, fill: 'hsl(var(--primary))' },
    { name: 'Learning Paths', value: 28.6, fill: 'hsl(var(--secondary))' },
    { name: 'Projects', value: 13.2, fill: 'hsl(var(--accent))' },
    { name: 'Other', value: 16.1, fill: 'hsl(var(--muted))' }
  ];

  const renderChart = (component: any) => {
    const chartType = component.type?.toLowerCase();
    
    if (chartType?.includes('area')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    
    if (chartType?.includes('line')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    
    if (chartType?.includes('pie')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    // Default to bar chart
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const getIcon = (componentType: string) => {
    switch (componentType) {
      case "visualization":
      case "saved-visualization":
        return BarChart3;
      case "filter":
        return Filter;
      case "visualization-switcher":
        return ToggleLeft;
      case "rich-text":
        return Type;
      default:
        return BarChart3;
    }
  };

  const renderComponent = (component: any) => {
    const Icon = getIcon(component.componentType || component.id);
    const isRichText = component.componentType === "rich-text";
    const isKPI = component.type === "KPI Metric";
    const isSavedVisualization = component.componentType === "saved-visualization";

    if (isRichText) {
      return (
        <Card key={component.id} className="p-4 bg-accent/30">
          <h3 className="font-semibold text-lg mb-2">{component.name}</h3>
          {component.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{component.description}</p>
          )}
        </Card>
      );
    }

    if (isKPI) {
      return (
        <Card key={component.id} className="p-6 bg-primary/5 text-center">
          <h3 className="font-medium text-sm text-muted-foreground mb-2">{component.name}</h3>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{component.data?.value || "740"}</p>
            {component.data?.change && (
              <div className="flex items-center justify-center gap-1 text-sm">
                <span className={component.data.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {component.data.change}
                </span>
                <span className="text-muted-foreground">{component.data.period}</span>
              </div>
            )}
          </div>
          {component.description && (
            <p className="text-xs text-muted-foreground mt-3">{component.description}</p>
          )}
        </Card>
      );
    }

    if (isSavedVisualization) {
      return (
        <Card key={component.id} className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-medium text-sm">{component.name}</h3>
              {component.type && (
                <p className="text-xs text-muted-foreground">{component.type}</p>
              )}
            </div>
          </div>
          
          <div className="w-full">
            {renderChart(component)}
          </div>
          
          {component.description && (
            <p className="text-xs text-muted-foreground mt-2">{component.description}</p>
          )}
        </Card>
      );
    }

    return (
      <Card key={component.id} className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium">{component.name}</h3>
            {component.type && (
              <p className="text-sm text-muted-foreground">{component.type}</p>
            )}
          </div>
        </div>
        
        <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/20 rounded border-2 border-dashed border-primary/30 flex items-center justify-center">
          <div className="text-center">
            <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Chart Preview</p>
          </div>
        </div>
        
        {component.description && (
          <p className="text-xs text-muted-foreground mt-3">{component.description}</p>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{dashboard.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {dashboard.isPublic ? "Public Dashboard" : "Private Dashboard"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        {dashboard.components && dashboard.components.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboard.components.map(renderComponent)}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No components added yet
            </h3>
            <p className="text-sm text-muted-foreground">
              This dashboard is empty. Add some components to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}