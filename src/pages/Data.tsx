import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  RefreshCw, 
  Download,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  TrendingUp
} from "lucide-react";

export default function Data() {
  const dataSources = [
    {
      name: "Learning Management System",
      status: "connected",
      lastSync: "2 minutes ago",
      records: "1.2M+",
      type: "LMS"
    },
    {
      name: "Content Provider APIs", 
      status: "connected",
      lastSync: "15 minutes ago", 
      records: "856K+",
      type: "Content"
    },
    {
      name: "User Directory (LDAP)",
      status: "connected", 
      lastSync: "1 hour ago",
      records: "15.4K+",
      type: "Users"
    },
    {
      name: "Skills Database",
      status: "syncing",
      lastSync: "Syncing...",
      records: "2.1K+", 
      type: "Skills"
    }
  ];

  const dataMetrics = [
    {
      label: "Total Records",
      value: "2.1M+",
      icon: Database,
      color: "blue"
    },
    {
      label: "Active Integrations", 
      value: "12",
      icon: RefreshCw,
      color: "green"
    },
    {
      label: "Data Freshness",
      value: "99.8%",
      icon: Clock, 
      color: "purple"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      connected: "bg-green-100 text-green-800",
      syncing: "bg-blue-100 text-blue-800", 
      error: "bg-red-100 text-red-800"
    };

    return (
      <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Sources</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your learning data integrations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" />
            Manage Connections
          </Button>
        </div>
      </div>

      {/* Data Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dataMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg bg-${metric.color}-100 flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 text-${metric.color}-600`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Connected Data Sources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataSources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(source.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">{source.name}</h3>
                    <p className="text-sm text-gray-600">
                      {source.records} records • Last sync: {source.lastSync}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs">
                    {source.type}
                  </Badge>
                  {getStatusBadge(source.status)}
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Quality Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completeness</span>
                <span className="text-sm text-gray-600">98.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "98.5%" }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accuracy</span>
                <span className="text-sm text-gray-600">96.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "96.2%" }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Timeliness</span>
                <span className="text-sm text-gray-600">99.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "99.1%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">User data synchronized</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Content catalog updated</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Analytics processed</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}