import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ 
  title, 
  subtitle, 
  children, 
  className 
}: ChartCardProps) {
  return (
    <div className={cn("chart-container", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}