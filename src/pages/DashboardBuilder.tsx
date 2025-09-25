import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ComponentPanel } from "@/components/dashboard-builder/ComponentPanel";
import { Canvas } from "@/components/dashboard-builder/Canvas";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { MultiSelectFilter } from "@/components/filters/MultiSelectFilter";
import { VisualizationBuilder } from "@/components/ai/VisualizationBuilder";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface DashboardBuilderProps {
  mode?: "create" | "edit";
  dashboardId?: string;
}

export default function DashboardBuilder({ mode = "create", dashboardId }: DashboardBuilderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardName, setDashboardName] = useState(mode === "edit" ? "01 Learning Dashboard" : "");
  const [isPublic, setIsPublic] = useState(false);
  const [isVisualizationBuilderOpen, setIsVisualizationBuilderOpen] = useState(false);
  
  // Pre-populate with existing dashboard content when in edit mode
  const [canvasComponents, setCanvasComponents] = useState<any[]>(
    mode === "edit" ? [
      {
        id: 1,
        componentType: "visualization",
        name: "Learning Completions",
        type: "KPI Metric",
        description: "Total completions: 740",
        data: { value: 740, change: "+19%", period: "vs last month" }
      },
      {
        id: 2,
        componentType: "visualization",
        name: "Completions Trend",
        type: "Bar Chart", 
        description: "Learning completions by period"
      },
      {
        id: 3,
        componentType: "visualization",
        name: "Learning Duration",
        type: "KPI Metric",
        description: "Average: 14d 22h",
        data: { value: "14d 22h", change: "-55%", period: "vs baseline" }
      },
      {
        id: 4,
        componentType: "visualization", 
        name: "Duration Heatmap",
        type: "Heatmap",
        description: "Learning duration by provider and content type"
      },
      {
        id: 5,
        componentType: "rich-text",
        name: "Learning Completions",
        description: "Which learning provider has gained the most usage in the selected date range?"
      },
      {
        id: 6,
        componentType: "rich-text", 
        name: "Learning Duration Section",
        description: "This section provides an overview of the learning duration estimates by content type and learning provider"
      }
    ] : []
  );

  // Check for imported visualization from AI Assistant
  useEffect(() => {
    const state = location.state as { importedVisualization?: any };
    if (state?.importedVisualization) {
      setCanvasComponents(prev => [...prev, state.importedVisualization]);
      toast.success(`Visualization "${state.importedVisualization.name}" has been added to your dashboard!`);
      
      // Clear the state to prevent re-adding on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSave = () => {
    if (!dashboardName.trim()) {
      toast.error("Please enter a dashboard name");
      return;
    }
    
    toast.success(`Dashboard ${mode === "edit" ? "updated" : "created"} successfully!`);
    navigate("/");
  };

  const handleSaveAsNew = () => {
    if (!dashboardName.trim()) {
      toast.error("Please enter a dashboard name");
      return;
    }
    
    toast.success("Dashboard saved as new copy!");
    navigate("/");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const addComponentToCanvas = (component: any) => {
    setCanvasComponents(prev => [...prev, { ...component, id: Date.now() }]);
  };

  const removeComponentFromCanvas = (id: number) => {
    setCanvasComponents(prev => prev.filter(comp => comp.id !== id));
  };

  const handleCanvasVisualizationDrop = () => {
    setIsVisualizationBuilderOpen(true);
  };

  const handleVisualizationSave = (config: any) => {
    const newComponent = {
      id: Date.now(),
      componentType: "visualization",
      name: config.name || "Untitled Visualization",
      type: config.type,
      description: `${config.metrics.length} metrics, ${config.dimensions.length} dimensions`,
      config: config
    };
    addComponentToCanvas(newComponent);
    setIsVisualizationBuilderOpen(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-background">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Input
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  placeholder="Untitled Dashboard"
                  className="text-lg font-medium border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="visibility"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="visibility" className="text-sm">
                  {isPublic ? "Public" : "Private"}
                </Label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              {mode === "edit" && (
                <Button variant="outline" onClick={handleSaveAsNew}>
                  Save As New
                </Button>
              )}
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                Save
              </Button>
            </div>
          </div>

          {/* Filter Bar - only show in edit mode when there are existing components */}
          {mode === "edit" && (
            <div className="flex items-center gap-4">
              <DateRangeFilter
                value={{ from: new Date(), to: new Date() }}
                onChange={() => {}}
              />
              <MultiSelectFilter
                label="Content Type"
                options={["All", "Video", "Article", "Pathway"]}
                selected={[]}
                onChange={() => {}}
                placeholder="Content Type"
              />
              <MultiSelectFilter
                label="Provider"
                options={["All", "Degreed", "LinkedIn Learning", "Coursera"]}
                selected={[]}
                onChange={() => {}}
                placeholder="Provider"
              />
              <MultiSelectFilter
                label="Skills"
                options={["All", "Leadership", "Technical", "Analytics"]}
                selected={[]}
                onChange={() => {}}
                placeholder="Skills"
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Panel */}
          <ComponentPanel 
            onAddComponent={addComponentToCanvas} 
            showSavedVisualizations={true}
          />
          
          {/* Canvas Area */}
          <Canvas 
            components={canvasComponents}
            onRemoveComponent={removeComponentFromCanvas}
            onVisualizationDrop={handleCanvasVisualizationDrop}
          />
        </div>

        {/* Visualization Builder Modal */}
        <VisualizationBuilder
          isOpen={isVisualizationBuilderOpen}
          onClose={() => setIsVisualizationBuilderOpen(false)}
          onSave={handleVisualizationSave}
        />
      </div>
    </DndProvider>
  );
}