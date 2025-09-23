import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3, 
  LineChart, 
  PieChart,
  Activity,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Target,
  Clock,
  Save,
  Eye,
  Download,
  Settings,
  X,
  Plus,
  TableProperties,
  Filter,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VisualizationConfig {
  id: string;
  name: string;
  type: "column" | "bar" | "line" | "pie" | "area" | "heatmap" | "table" | "scatter" | "funnel";
  metrics: string[];
  dimensions: string[];
  filters: FilterConfig[];
  timeRange: string;
  groupBy?: string;
}

interface FilterConfig {
  field: string;
  operator: string;
  value: string;
}

interface VisualizationBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: Partial<VisualizationConfig>;
  onSave: (config: VisualizationConfig) => void;
}

const availableMetrics = [
  { id: "completions", label: "Course Completions", icon: Award },
  { id: "hours", label: "Learning Hours", icon: Clock },
  { id: "engagement", label: "Engagement Score", icon: TrendingUp },
  { id: "satisfaction", label: "Satisfaction Rating", icon: Target },
  { id: "learners", label: "Active Learners", icon: Users },
  { id: "content_views", label: "Content Views", icon: Eye },
  { id: "skill_growth", label: "Skill Growth", icon: BarChart3 }
];

const availableDimensions = [
  { id: "department", label: "Department", icon: Users },
  { id: "role", label: "Job Role", icon: Users },
  { id: "skill", label: "Skill Category", icon: BookOpen },
  { id: "content_type", label: "Content Type", icon: BookOpen },
  { id: "pathway", label: "Learning Pathway", icon: Award },
  { id: "provider", label: "Content Provider", icon: BookOpen },
  { id: "region", label: "Region", icon: Users },
  { id: "date", label: "Date/Time", icon: Clock }
];

const chartTypes = [
  { type: "column", label: "Column Chart", icon: BarChart3 },
  { type: "bar", label: "Bar Chart", icon: BarChart3 },
  { type: "line", label: "Line Chart", icon: LineChart },
  { type: "area", label: "Area Chart", icon: Activity },
  { type: "pie", label: "Pie Chart", icon: PieChart },
  { type: "table", label: "Table", icon: TableProperties },
  { type: "scatter", label: "Scatter", icon: Activity },
  { type: "funnel", label: "Funnel", icon: Filter }
];

export function VisualizationBuilder({ isOpen, onClose, initialConfig, onSave }: VisualizationBuilderProps) {
  const [config, setConfig] = useState<VisualizationConfig>({
    id: initialConfig?.id || `viz-${Date.now()}`,
    name: initialConfig?.name || "Untitled visualization",
    type: initialConfig?.type || "column",
    metrics: initialConfig?.metrics || [],
    dimensions: initialConfig?.dimensions || [],
    filters: initialConfig?.filters || [],
    timeRange: initialConfig?.timeRange || "last_30_days"
  });

  const [rowItems, setRowItems] = useState<string[]>([]);
  const [columnItems, setColumnItems] = useState<string[]>([]);

  const handleSave = () => {
    const finalConfig = {
      ...config,
      metrics: [...config.metrics],
      dimensions: [...config.dimensions, ...rowItems, ...columnItems]
    };
    onSave(finalConfig);
    onClose();
  };

  const handleClear = () => {
    setConfig(prev => ({
      ...prev,
      name: "Untitled visualization",
      type: "column",
      metrics: [],
      dimensions: []
    }));
    setRowItems([]);
    setColumnItems([]);
  };

  const removeFromMetrics = (item: string) => {
    setConfig(prev => ({
      ...prev,
      metrics: prev.metrics.filter(m => m !== item)
    }));
  };

  const removeFromRows = (item: string) => {
    setRowItems(prev => prev.filter(i => i !== item));
  };

  const removeFromColumns = (item: string) => {
    setColumnItems(prev => prev.filter(i => i !== item));
  };

  if (!isOpen) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        {/* Header */}
        <div className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                className="text-lg font-medium border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                Save
              </Button>
            </div>
          </div>

          {/* Chart Type Selection */}
          <div className="flex items-center gap-2 mt-4">
            {chartTypes.map((type) => (
              <Button
                key={type.type}
                variant={config.type === type.type ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setConfig(prev => ({ ...prev, type: type.type as any }))}
                title={type.label}
              >
                <type.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Filters Section */}
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>FILTERS</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Data Panel */}
          <div className="w-64 border-r bg-muted/30 p-4">
            <div className="mb-4">
              <Input
                placeholder="Search data..."
                className="h-8"
              />
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              {/* Metrics */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">METRICS</h4>
                <div className="space-y-1">
                  {availableMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', JSON.stringify({
                          type: 'metric',
                          id: metric.id,
                          label: metric.label
                        }));
                      }}
                      className="flex items-center gap-2 p-2 rounded hover:bg-background cursor-move transition-colors"
                    >
                      <div className="w-3 h-3 bg-orange-500 rounded-sm flex-shrink-0" />
                      <span className="text-sm">{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">DIMENSIONS</h4>
                <div className="space-y-1">
                  {availableDimensions.map((dimension) => (
                    <div
                      key={dimension.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', JSON.stringify({
                          type: 'dimension',
                          id: dimension.id,
                          label: dimension.label
                        }));
                      }}
                      className="flex items-center gap-2 p-2 rounded hover:bg-background cursor-move transition-colors"
                    >
                      <div className="w-3 h-3 bg-blue-500 rounded-sm flex-shrink-0" />
                      <span className="text-sm">{dimension.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Center Canvas */}
          <div className="flex-1 p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Metrics Drop Zone */}
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                  if (data.type === 'metric') {
                    setConfig(prev => ({
                      ...prev,
                      metrics: [...prev.metrics.filter(m => m !== data.id), data.id]
                    }));
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 min-h-[120px]"
              >
                <h4 className="font-medium text-sm mb-3 text-muted-foreground">METRICS (IN COLUMNS)</h4>
                <div className="space-y-2">
                  {config.metrics.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-blue-500 font-medium">123</div>
                      <div className="text-muted-foreground text-sm mt-1">or</div>
                      <div className="text-orange-500 font-medium">ABC</div>
                      <div className="text-muted-foreground text-sm mt-1">here</div>
                      <p className="text-sm text-muted-foreground/60 mt-2">
                        They are located in the panel on the left.
                      </p>
                    </div>
                  ) : (
                    config.metrics.map((item, idx) => {
                      const metric = availableMetrics.find(m => m.id === item);
                      return (
                        <div key={idx} className="flex items-center justify-between bg-background border rounded px-3 py-2">
                          <span className="text-sm">{metric?.label}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromMetrics(item)}
                            className="h-5 w-5 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Rows Drop Zone */}
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                  if (data.type === 'dimension') {
                    setRowItems(prev => [...prev.filter(i => i !== data.id), data.id]);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 min-h-[120px]"
              >
                <h4 className="font-medium text-sm mb-3 text-muted-foreground">ROWS</h4>
                <div className="space-y-2">
                  {rowItems.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-blue-500 font-medium">ABC</div>
                      <div className="text-muted-foreground text-sm mt-1">or</div>
                      <div className="text-blue-500 font-medium">123</div>
                      <div className="text-muted-foreground text-sm mt-1">here</div>
                    </div>
                  ) : (
                    rowItems.map((item, idx) => {
                      const dimension = availableDimensions.find(d => d.id === item);
                      return (
                        <div key={idx} className="flex items-center justify-between bg-background border rounded px-3 py-2">
                          <span className="text-sm">{dimension?.label}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromRows(item)}
                            className="h-5 w-5 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Columns Drop Zone */}
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                  if (data.type === 'dimension') {
                    setColumnItems(prev => [...prev.filter(i => i !== data.id), data.id]);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 min-h-[120px]"
              >
                <h4 className="font-medium text-sm mb-3 text-muted-foreground">COLUMNS</h4>
                <div className="space-y-2">
                  {columnItems.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-blue-500 font-medium">ABC</div>
                      <div className="text-muted-foreground text-sm mt-1">or</div>
                      <div className="text-blue-500 font-medium">123</div>
                      <div className="text-muted-foreground text-sm mt-1">here</div>
                    </div>
                  ) : (
                    columnItems.map((item, idx) => {
                      const dimension = availableDimensions.find(d => d.id === item);
                      return (
                        <div key={idx} className="flex items-center justify-between bg-background border rounded px-3 py-2">
                          <span className="text-sm">{dimension?.label}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromColumns(item)}
                            className="h-5 w-5 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Configuration */}
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 min-h-[120px]">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-sm text-muted-foreground">CONFIGURATION</h4>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Chart Type: </span>
                    <span className="capitalize">{config.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="border rounded-lg p-6 bg-card min-h-[300px] flex items-center justify-center">
              {config.metrics.length > 0 || rowItems.length > 0 ? (
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-4">123</div>
                  <p className="text-muted-foreground">Drag metrics and dimensions to see preview</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Drag 123, ABC, or HERE</p>
                  <p className="text-sm mt-1">They are located in the panel on the left.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}