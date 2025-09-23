import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ComponentPanel } from "@/components/dashboard-builder/ComponentPanel";
import { Canvas } from "@/components/dashboard-builder/Canvas";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardBuilderProps {
  mode?: "create" | "edit";
  dashboardId?: string;
}

export default function DashboardBuilder({ mode = "create", dashboardId }: DashboardBuilderProps) {
  const navigate = useNavigate();
  const [dashboardName, setDashboardName] = useState(mode === "edit" ? "Existing Dashboard" : "");
  const [isPublic, setIsPublic] = useState(false);
  const [canvasComponents, setCanvasComponents] = useState<any[]>([]);

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-background">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
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
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Panel */}
          <ComponentPanel onAddComponent={addComponentToCanvas} />
          
          {/* Canvas Area */}
          <Canvas 
            components={canvasComponents}
            onRemoveComponent={removeComponentFromCanvas}
          />
        </div>
      </div>
    </DndProvider>
  );
}