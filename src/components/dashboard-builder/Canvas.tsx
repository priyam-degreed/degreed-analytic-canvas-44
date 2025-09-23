import React from "react";
import { useDrop } from "react-dnd";
import { BarChart3, X, Filter, ToggleLeft, Type } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CanvasProps {
  components: any[];
  onRemoveComponent: (id: number) => void;
  onVisualizationDrop?: () => void;
}

function CanvasComponent({ component, onRemove }: { component: any; onRemove: () => void }) {
  const getIcon = () => {
    switch (component.componentType || component.id) {
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

  const Icon = getIcon();
  const title = component.name || component.id;
  const isRichText = component.componentType === "rich-text";
  const isKPI = component.type === "KPI Metric";

  return (
    <Card className={`relative group hover:shadow-md transition-shadow ${
      isRichText ? 'p-4 bg-accent/30' : 'p-6'
    } ${isKPI ? 'bg-primary/5' : ''}`}>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
      
      {isRichText ? (
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          {component.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{component.description}</p>
          )}
        </div>
      ) : isKPI ? (
        <div className="text-center">
          <h3 className="font-medium text-sm text-muted-foreground mb-2">{title}</h3>
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
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Icon className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-medium">{title}</h3>
              {component.type && (
                <p className="text-sm text-muted-foreground">{component.type}</p>
              )}
            </div>
          </div>
          
          {/* Mock chart visualization */}
          <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/20 rounded border-2 border-dashed border-primary/30 flex items-center justify-center">
            <div className="text-center">
              <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Chart Preview</p>
            </div>
          </div>
          
          {component.description && (
            <p className="text-xs text-muted-foreground mt-3">{component.description}</p>
          )}
        </div>
      )}
    </Card>
  );
}

export function Canvas({ components, onRemoveComponent, onVisualizationDrop }: CanvasProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['component', 'visualization'],
    drop: (item: any) => {
      if ((item.id === 'visualization' || item.componentType === 'visualization' || item.componentType === 'saved-visualization') && onVisualizationDrop) {
        onVisualizationDrop();
        return { dropped: true };
      }
      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isEmpty = components.length === 0;

  return (
    <div className="flex-1 p-6">
      <div
        ref={drop}
        className={`h-full border-2 border-dashed rounded-lg transition-colors ${
          isOver && canDrop 
            ? 'border-primary bg-primary/5' 
            : 'border-border bg-muted/20'
        }`}
      >
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Drag visualization here
            </h3>
            <p className="text-sm text-muted-foreground">
              New visualization can be created using
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>Visualization</span>
            </div>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((component) => (
              <CanvasComponent
                key={component.id}
                component={component}
                onRemove={() => onRemoveComponent(component.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}