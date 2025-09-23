import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  Clock,
  Target,
  BarChart3,
  Activity
} from "lucide-react";

export default function Metrics() {
  const keyMetrics = [
    {
      id: "active_learners",
      name: "Active Learners",
      value: "15,420",
      change: "+12.5%",
      icon: Users,
      color: "blue"
    },
    {
      id: "completion_rate", 
      name: "Avg Completion Rate",
      value: "73.2%",
      change: "+5.8%",
      icon: Target,
      color: "green"
    },
    {
      id: "learning_hours",
      name: "Total Learning Hours",
      value: "12,847",
      change: "+18.3%",
      icon: Clock,
      color: "purple"
    },
    {
      id: "skills_developed",
      name: "Skills Developed",
      value: "588",
      change: "+22.1%",
      icon: Award,
      color: "orange"
    }
  ];

  const metricCategories = [
    {
      name: "Engagement Metrics",
      metrics: [
        "Monthly Active Users",
        "Session Duration", 
        "Content Engagement Rate",
        "Return Visit Rate"
      ]
    },
    {
      name: "Learning Outcomes",
      metrics: [
        "Course Completion Rate",
        "Assessment Scores",
        "Skill Progression",
        "Certification Achievements"
      ]
    },
    {
      name: "Content Performance", 
      metrics: [
        "Content Consumption",
        "User Ratings",
        "Content Effectiveness",
        "Provider Performance"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metrics</h1>
          <p className="text-gray-600 mt-1">Key performance indicators and learning analytics</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <BarChart3 className="h-4 w-4 mr-2" />
          Create Custom Metric
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg bg-${metric.color}-100 flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                  </div>
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    {metric.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{metric.name}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Metric Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {metricCategories.map((category, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.metrics.map((metric, metricIdx) => (
                <div key={metricIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{metric}</span>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}