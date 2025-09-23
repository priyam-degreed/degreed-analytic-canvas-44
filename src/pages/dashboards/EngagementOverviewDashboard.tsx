import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Target, Heart, Clock, Award } from "lucide-react";

export default function EngagementOverviewDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Engagement Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor learner engagement and interaction patterns across the platform
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Daily Active Users"
          value="2,847"
          change={{ value: 18.3, type: "positive" }}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Session Duration"
          value="24m"
          change={{ value: 12.7, type: "positive" }}
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          title="Content Interactions"
          value="15.2K"
          change={{ value: 25.4, type: "positive" }}
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Satisfaction Score"
          value="4.6/5"
          change={{ value: 8.1, type: "positive" }}
          icon={<Heart className="h-5 w-5" />}
        />
      </div>

      {/* Engagement Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Engagement Trends"
          subtitle="User activity and interaction patterns over time"
        >
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-medium">Engagement Analytics</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Detailed engagement metrics and trend analysis
              </p>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="User Behavior Patterns"
          subtitle="Learning preferences and usage analytics"
        >
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h4 className="font-medium">Behavior Insights</h4>
              <p className="text-sm text-muted-foreground mt-1">
                User journey analysis and interaction patterns
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-muted-foreground">Course Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">92%</div>
                <div className="text-sm text-muted-foreground">Learning Goal Achievement</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Average Content Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}