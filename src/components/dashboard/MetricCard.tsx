import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    type: "positive" | "negative" | "neutral";
    period?: string;
  };
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  subtitle, 
  icon, 
  className,
  onClick 
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case "positive":
        return <TrendingUp className="h-4 w-4" />;
      case "negative":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getChangeColor = () => {
    if (!change) return "";
    
    switch (change.type) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div 
      className={cn("metric-card", onClick && "cursor-pointer hover:shadow-md transition-shadow", className)}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            {icon && (
              <div className="text-accent">
                {icon}
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {change && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className={cn("flex items-center gap-1 text-sm", getChangeColor())}>
            {getTrendIcon()}
            <span className="font-medium">{change.value}</span>
            {change.period && (
              <span className="text-muted-foreground">vs {change.period}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}