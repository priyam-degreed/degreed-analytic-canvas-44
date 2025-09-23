import { cn } from "@/lib/utils";
import { MoreHorizontal, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: boolean;
  className?: string;
}

export function ChartCard({ 
  title, 
  subtitle, 
  children, 
  actions = true, 
  className 
}: ChartCardProps) {
  return (
    <div className={cn("chart-container", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export Chart
                </DropdownMenuItem>
                <DropdownMenuItem>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Add to Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}