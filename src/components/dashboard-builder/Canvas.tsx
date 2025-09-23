import { useDrop } from "react-dnd";
import { BarChart3, X, Filter, ToggleLeft, Type } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CanvasProps {
  components: any[];
  onRemoveComponent: (id: number) => void;
}

function CanvasComponent({ component, onRemove }: { component: any; onRemove: () => void }) {
  const getIcon = () => {
    switch (component.id || component.componentType) {
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

  return (
    <Card className="p-4 relative group hover:shadow-md transition-shadow">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <div>
          <h3 className="font-medium">{title}</h3>
          {component.type && (
            <p className="text-sm text-muted-foreground">{component.type}</p>
          )}
          {component.description && (
            <p className="text-xs text-muted-foreground mt-1">{component.description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export function Canvas({ components, onRemoveComponent }: CanvasProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['component', 'visualization'],
    drop: () => ({ dropped: true }),
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