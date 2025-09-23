import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VisualizationConfig {
  id: string;
  name: string;
  type: "column" | "bar" | "line" | "pie" | "area" | "heatmap";
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
  { type: "pie", label: "Pie Chart", icon: PieChart }
];

export function VisualizationBuilder({ isOpen, onClose, initialConfig, onSave }: VisualizationBuilderProps) {
  const [config, setConfig] = useState<VisualizationConfig>({
    id: initialConfig?.id || `viz-${Date.now()}`,
    name: initialConfig?.name || "",
    type: initialConfig?.type || "column",
    metrics: initialConfig?.metrics || [],
    dimensions: initialConfig?.dimensions || [],
    filters: initialConfig?.filters || [],
    timeRange: initialConfig?.timeRange || "last_30_days"
  });

  const [previewData] = useState([
    { name: "Engineering", value: 234, change: 12 },
    { name: "Product", value: 189, change: 8 },
    { name: "Design", value: 156, change: -3 },
    { name: "Marketing", value: 134, change: 15 },
    { name: "Sales", value: 98, change: 7 }
  ]);

  const handleMetricToggle = (metricId: string) => {
    setConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId) 
        ? prev.metrics.filter(m => m !== metricId)
        : [...prev.metrics, metricId]
    }));
  };

  const handleDimensionToggle = (dimensionId: string) => {
    setConfig(prev => ({
      ...prev,
      dimensions: prev.dimensions.includes(dimensionId)
        ? prev.dimensions.filter(d => d !== dimensionId)
        : [...prev.dimensions, dimensionId]
    }));
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const renderPreview = () => {
    const maxValue = Math.max(...previewData.map(d => d.value));
    
    return (
      <div className="h-48 bg-white border rounded-lg p-4">
        <div className="h-full flex items-end justify-around gap-1">
          {previewData.map((item, idx) => {
            const height = (item.value / maxValue) * 140;
            return (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm w-full mb-1 flex items-end justify-center text-xs text-white font-medium"
                  style={{ height: `${height}px`, minHeight: '20px' }}
                >
                  {item.value}
                </div>
                <div className="text-xs text-center text-gray-600 px-1">
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[90vh] bg-white rounded-xl shadow-2xl border z-50 flex">
        {/* Configuration Panel */}
        <div className="w-80 border-r bg-gray-50 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Build Visualization</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <Label>Visualization Name</Label>
              <Input
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter visualization name"
              />
            </div>

            {/* Chart Type */}
            <div className="space-y-3">
              <Label>Chart Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {chartTypes.map((type) => (
                  <Button
                    key={type.type}
                    variant={config.type === type.type ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setConfig(prev => ({ ...prev, type: type.type as any }))}
                  >
                    <type.icon className="h-4 w-4 mr-2" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <Label>Metrics ({config.metrics.length} selected)</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded border cursor-pointer transition-colors",
                      config.metrics.includes(metric.id) 
                        ? "bg-blue-50 border-blue-200" 
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => handleMetricToggle(metric.id)}
                  >
                    <metric.icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{metric.label}</span>
                    {config.metrics.includes(metric.id) && (
                      <Badge variant="default" className="ml-auto text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-3">
              <Label>Dimensions ({config.dimensions.length} selected)</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableDimensions.map((dimension) => (
                  <div
                    key={dimension.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded border cursor-pointer transition-colors",
                      config.dimensions.includes(dimension.id) 
                        ? "bg-green-50 border-green-200" 
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => handleDimensionToggle(dimension.id)}
                  >
                    <dimension.icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{dimension.label}</span>
                    {config.dimensions.includes(dimension.id) && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="space-y-3">
              <Label>Time Range</Label>
              <Select
                value={config.timeRange}
                onValueChange={(value) => setConfig(prev => ({ ...prev, timeRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 days</SelectItem>
                  <SelectItem value="last_6_months">Last 6 months</SelectItem>
                  <SelectItem value="last_year">Last year</SelectItem>
                  <SelectItem value="all_time">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  {config.name || "Untitled Visualization"}
                </h3>
                <div className="text-sm text-gray-600 mt-1">
                  {config.metrics.length} metrics • {config.dimensions.length} dimensions
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Advanced
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save Visualization
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 p-6">
            <div className="space-y-6">
              {/* Configuration Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Configuration Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Chart Type: </span>
                    <Badge variant="outline">{config.type}</Badge>
                  </div>
                  
                  {config.metrics.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Metrics: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {config.metrics.map(metricId => {
                          const metric = availableMetrics.find(m => m.id === metricId);
                          return (
                            <Badge key={metricId} variant="default" className="text-xs">
                              {metric?.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {config.dimensions.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Dimensions: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {config.dimensions.map(dimensionId => {
                          const dimension = availableDimensions.find(d => d.id === dimensionId);
                          return (
                            <Badge key={dimensionId} variant="secondary" className="text-xs">
                              {dimension?.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chart Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {config.metrics.length > 0 && config.dimensions.length > 0 ? (
                    renderPreview()
                  ) : (
                    <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Select metrics and dimensions to see preview</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}