import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Target, ArrowDown, Filter, Search, BarChart3, Share, Edit, Download } from "lucide-react";
import { FilterBar } from "@/components/filters/FilterBar";

export default function DrillDownPaths() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Drill Down Paths</h1>
          <p className="text-muted-foreground mt-1">
            Explore detailed learning pathways and progression analytics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PPT
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Pathways"
          value="47"
          change={{ value: 12.3, type: "positive" }}
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Pathway Completions"
          value="1,234"
          change={{ value: 15.7, type: "positive" }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Average Duration"
          value="6.2 weeks"
          change={{ value: -8.4, type: "negative" }}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Success Rate"
          value="78%"
          change={{ value: 5.2, type: "positive" }}
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      {/* Drill Down Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDown className="h-5 w-5" />
            Detailed Path Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Drill Down Analytics Coming Soon</h3>
                <p className="text-muted-foreground mt-1">
                  Interactive pathway analysis and detailed progression tracking will be available here.
                </p>
              </div>
              <Button variant="outline" className="mt-4">
                <Filter className="h-4 w-4 mr-2" />
                Configure Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}