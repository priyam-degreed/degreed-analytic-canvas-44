import { useState } from "react";
import { useDrag } from "react-dnd";
import { 
  BarChart3, 
  Filter, 
  ToggleLeft, 
  Type,
  ChevronDown,
  ChevronRight,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ComponentPanelProps {
  onAddComponent: (component: any) => void;
}

const componentTypes = [
  {
    id: "visualization",
    name: "Visualization",
    icon: BarChart3,
    description: "Charts, graphs, KPI metrics"
  },
  {
    id: "filter",
    name: "Filter",
    icon: Filter,
    description: "Date range, content type filters"
  },
  {
    id: "visualization-switcher",
    name: "Visualization Switcher",
    icon: ToggleLeft,
    description: "Toggle between chart types"
  },
  {
    id: "rich-text",
    name: "Rich Text",
    icon: Type,
    description: "Titles, descriptions, notes"
  }
];

const savedVisualizations = [
  { id: 1, name: "Learning Completions", type: "Area Chart", date: "Oct 24, 2024" },
  { id: 2, name: "Content Overview", type: "Bar Chart", date: "Oct 18, 2024" },
  { id: 3, name: "Learning Insights", type: "Line Chart", date: "Oct 16, 2024" },
  { id: 4, name: "Learning Provider Analysis", type: "Pie Chart", date: "Oct 15, 2024" },
  { id: 5, name: "TEST Content Analysis", type: "Bar Chart", date: "Oct 14, 2024" },
  { id: 6, name: "Skill Progression", type: "Progress Chart", date: "Oct 13, 2024" },
];

function DraggableComponent({ component, onAdd }: { component: any; onAdd: (comp: any) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: component,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        onAdd(item);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = component.icon;

  return (
    <div
      ref={drag}
      className={`p-3 border border-border rounded-lg cursor-move hover:bg-accent transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="text-sm font-medium">{component.name}</div>
          <div className="text-xs text-muted-foreground">{component.description}</div>
        </div>
      </div>
    </div>
  );
}

function DraggableVisualization({ visualization, onAdd }: { visualization: any; onAdd: (viz: any) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'visualization',
    item: { ...visualization, componentType: 'saved-visualization' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        onAdd(item);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 border border-border rounded cursor-move hover:bg-accent transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <BarChart3 className="h-3 w-3 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">{visualization.name}</div>
          <div className="text-xs text-muted-foreground">{visualization.date}</div>
        </div>
      </div>
    </div>
  );
}

export function ComponentPanel({ onAddComponent }: ComponentPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSavedExpanded, setIsSavedExpanded] = useState(true);

  const filteredVisualizations = savedVisualizations.filter(viz =>
    viz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Drag to add
        </h2>
      </div>

      {/* Component Types */}
      <div className="p-4 space-y-3">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          New Item
        </div>
        {componentTypes.map((component) => (
          <DraggableComponent
            key={component.id}
            component={component}
            onAdd={onAddComponent}
          />
        ))}
      </div>

      <Separator />

      {/* Saved Visualizations */}
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <div 
            className="flex items-center gap-2 cursor-pointer mb-3"
            onClick={() => setIsSavedExpanded(!isSavedExpanded)}
          >
            {isSavedExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Saved Visualizations
            </span>
          </div>

          {isSavedExpanded && (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Search all visualizations"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 h-8 text-xs"
                />
              </div>

              <div className="text-xs text-muted-foreground mb-2">
                created by me • All
              </div>
            </>
          )}
        </div>

        {isSavedExpanded && (
          <div className="flex-1 px-4 pb-4 space-y-2 overflow-y-auto">
            {filteredVisualizations.map((visualization) => (
              <DraggableVisualization
                key={visualization.id}
                visualization={visualization}
                onAdd={onAddComponent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}