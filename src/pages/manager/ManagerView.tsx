import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BarChart3, 
  Shield, 
  ArrowRight,
  Target,
  TrendingUp,
  Calendar,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ManagerView() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-foreground">Manager Portal</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-6">
          Access learning analytics for your team with appropriate data scope restrictions
        </p>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
          <Shield className="h-4 w-4 mr-2" />
          Role-Based Access Control Enabled
        </Badge>
      </div>

      {/* Role Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Your Management Scope
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">19</div>
            <div className="text-sm text-blue-800">Direct Reports</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">156h</div>
            <div className="text-sm text-green-800">Team Learning Hours</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">73%</div>
            <div className="text-sm text-purple-800">Avg. Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Team Dashboard</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            View comprehensive analytics for your direct reports including learning progress, skills development, and engagement metrics.
          </p>
          <Button 
            onClick={() => navigate('/manager/dashboard')}
            className="w-full"
          >
            Access Team Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold">Individual Reports</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Access detailed learning analytics for each of your team members, track their progress, and identify development opportunities.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/manager/individual-reports')}
            className="w-full"
          >
            View Individual Progress
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <Target className="h-8 w-8 text-orange-500 mx-auto mb-3" />
          <h4 className="font-medium mb-2">Skills Matrix</h4>
          <p className="text-sm text-muted-foreground">Team competency overview</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <h4 className="font-medium mb-2">Progress Trends</h4>
          <p className="text-sm text-muted-foreground">Long-term analytics</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <h4 className="font-medium mb-2">Goal Planning</h4>
          <p className="text-sm text-muted-foreground">Set team objectives</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <FileText className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <h4 className="font-medium mb-2">Reports Export</h4>
          <p className="text-sm text-muted-foreground">PDF & PPT exports</p>
        </div>
      </div>

      {/* Access Control Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-2">Data Access Scope</h4>
            <p className="text-sm text-amber-800 mb-2">
              As a Manager, your access is limited to data from your direct reports only. You can:
            </p>
            <ul className="text-sm text-amber-800 space-y-1 ml-4">
              <li>• View analytics for your 19 direct reports</li>
              <li>• Share dashboards with other users (they'll see data based on their own access level)</li>
              <li>• Export reports containing only your scoped data</li>
              <li>• Access your personal learning data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}