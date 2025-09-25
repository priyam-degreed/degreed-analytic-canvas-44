import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Filter, ExternalLink, TrendingUp } from "lucide-react";

interface DrillDownData {
  skill?: string;
  role?: string;
  period?: string;
  department?: string;
  contentType?: string;
  value?: number | string;
  ratingType?: string;
  employees?: number;
  additionalData?: Record<string, any>;
}

interface DrillDownTooltipProps {
  data: DrillDownData;
  onDrillDown: (action: string, data: DrillDownData) => void;
  children: React.ReactNode;
  title?: string;
}

export function DrillDownTooltip({ 
  data, 
  onDrillDown, 
  children, 
  title = "Data Point Details" 
}: DrillDownTooltipProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <div className="text-xs text-muted-foreground">
              Hover to explore • Click to drill down
            </div>
          </div>

          <Separator />

          {/* Data Details */}
          <div className="space-y-2">
            {data.skill && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Skill:</span>
                <span className="font-medium text-foreground">{data.skill}</span>
              </div>
            )}
            {data.role && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium text-foreground">{data.role}</span>
              </div>
            )}
            {data.period && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Period:</span>
                <span className="font-medium text-foreground">{data.period}</span>
              </div>
            )}
            {data.department && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium text-foreground">{data.department}</span>
              </div>
            )}
            {data.contentType && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Content Type:</span>
                <span className="font-medium text-foreground">{data.contentType}</span>
              </div>
            )}
            {data.ratingType && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rating Type:</span>
                <span className="font-medium text-foreground">{data.ratingType}</span>
              </div>
            )}
            {data.value !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Value:</span>
                <span className="font-medium text-foreground">
                  {typeof data.value === 'number' ? data.value.toFixed(1) : data.value}
                </span>
              </div>
            )}
            {data.employees && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Employees:</span>
                <span className="font-medium text-foreground">{data.employees}</span>
              </div>
            )}
            
            {/* Additional data fields */}
            {data.additionalData && Object.entries(data.additionalData).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-medium text-foreground">
                  {typeof value === 'number' ? value.toFixed(1) : String(value)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Action Button */}
          <div className="pt-2">
            <Button 
              size="sm" 
              variant="outline"
              className="w-full text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => onDrillDown('filter', data)}
            >
              <Filter className="w-3 h-3 mr-2" />
              Click to drill or filter
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// Simpler click-to-drill component for direct usage
interface ClickableDrillDownProps {
  data: DrillDownData;
  onDrillDown: (action: string, data: DrillDownData) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function ClickableDrillDown({ 
  data, 
  onDrillDown, 
  className = "", 
  style,
  children 
}: ClickableDrillDownProps) {
  return (
    <div 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${className}`}
      style={style}
      onClick={() => onDrillDown('filter', data)}
      title="Click to drill down or filter"
    >
      {children}
    </div>
  );
}