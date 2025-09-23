import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Award, Target, ArrowUpRight, CheckCircle, Clock, Briefcase, Share, Edit, Download } from "lucide-react";
import { careerDevelopmentData } from "@/data/mockData";
import { FilterBar } from "@/components/filters/FilterBar";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d'];

export default function CareerDevelopment() {
  const mobilityData = careerDevelopmentData.internalMobilityReadiness.map(item => ({
    ...item,
    fill: item.readinessPercent > 35 ? COLORS[0] : item.readinessPercent > 25 ? COLORS[1] : COLORS[3]
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Career Development</h1>
          <p className="text-muted-foreground mt-1">
            Track career progression, internal mobility, and professional growth across your organization
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
          title="Internal Mobility Rate"
          value="32.4%"
          change={{ value: 15.3, type: "positive" }}
          icon={<ArrowUpRight className="h-5 w-5" />}
        />
        <MetricCard
          title="Certifications Achieved"
          value={careerDevelopmentData.certificationsAchieved.reduce((sum, cert) => sum + cert.achievers, 0).toString()}
          change={{ value: 23.7, type: "positive" }}
          icon={<Award className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Career Pathways"
          value={careerDevelopmentData.learnerPathways.length.toString()}
          change={{ value: 8.9, type: "positive" }}
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Promotion Readiness"
          value="28.7%"
          change={{ value: 12.4, type: "positive" }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Internal Mobility Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Internal Mobility Readiness by Role"
          subtitle="Percentage of employees ready for promotion or lateral moves"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mobilityData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 50]} />
              <YAxis dataKey="role" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value}%`, 'Readiness']} />
              <Bar dataKey="readinessPercent" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Career Pathway Performance"
          subtitle="Completion rates for different career tracks"
        >
          <div className="space-y-4">
            {careerDevelopmentData.learnerPathways.map((pathway, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-sm">{pathway.pathway}</h4>
                    <p className="text-xs text-muted-foreground">{pathway.followers} followers</p>
                  </div>
                  <Badge variant={pathway.completionRate > 70 ? "default" : pathway.completionRate > 60 ? "secondary" : "outline"}>
                    {pathway.completionRate}%
                  </Badge>
                </div>
                <Progress value={pathway.completionRate} className="h-2" />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Certifications & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="High-Value Certifications Achieved"
            subtitle="Certifications with highest career impact and business value"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={careerDevelopmentData.certificationsAchieved}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="certification" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'achievers' ? `${value} people` : `$${value.toLocaleString()}`,
                    name === 'achievers' ? 'Certified' : 'Business Value'
                  ]}
                />
                <Bar dataKey="achievers" fill="hsl(var(--primary))" />
                <Bar dataKey="value" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Career Development Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="text-xl font-bold text-blue-600">
                  {careerDevelopmentData.internalMobilityReadiness.reduce((sum, role) => sum + role.readyCandidates, 0)}
                </div>
                <div className="text-xs text-blue-600">Ready for Promotion</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="text-xl font-bold text-green-600">
                  {careerDevelopmentData.certificationsAchieved.reduce((sum, cert) => sum + cert.achievers, 0)}
                </div>
                <div className="text-xs text-green-600">Certified This Year</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Leadership Pipeline</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Technical Advancement</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Cross-functional Moves</span>
                  <span className="text-sm text-muted-foreground">43%</span>
                </div>
                <Progress value={43} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Progression Analysis */}
      <ChartCard
        title="Skill Progression Across Career Stages"
        subtitle="Distribution of skill levels across different career competencies"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careerDevelopmentData.skillProgressionData.map((skillData, index) => (
            <div key={index} className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium">{skillData.skill}</h4>
                <p className="text-sm text-muted-foreground">
                  {skillData.beginner + skillData.intermediate + skillData.advanced + skillData.expert} total learners
                </p>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  innerRadius="20%"
                  outerRadius="90%"
                  data={[
                    { name: 'Expert', value: skillData.expert, fill: COLORS[0] },
                    { name: 'Advanced', value: skillData.advanced, fill: COLORS[1] },
                    { name: 'Intermediate', value: skillData.intermediate, fill: COLORS[2] },
                    { name: 'Beginner', value: skillData.beginner, fill: COLORS[3] }
                  ]}
                >
                  <RadialBar dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>

              <div className="space-y-1">
                {[
                  { label: 'Expert', count: skillData.expert, color: COLORS[0] },
                  { label: 'Advanced', count: skillData.advanced, color: COLORS[1] },
                  { label: 'Intermediate', count: skillData.intermediate, color: COLORS[2] },
                  { label: 'Beginner', count: skillData.beginner, color: COLORS[3] }
                ].map((level, levelIndex) => (
                  <div key={levelIndex} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: level.color }} />
                      <span>{level.label}</span>
                    </div>
                    <span className="font-medium">{level.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Career Success Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Career Development Success Stories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { name: "Sarah Chen", role: "Data Scientist → Sr. Data Scientist", pathway: "Data Science Professional Path", duration: "8 months", certifications: 3 },
                { name: "Marcus Rodriguez", role: "Developer → Team Lead", pathway: "Leadership Development Journey", duration: "12 months", certifications: 2 },
                { name: "Jennifer Kim", role: "Analyst → Product Manager", pathway: "Cross-Functional Leadership", duration: "10 months", certifications: 4 }
              ].map((success, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{success.name}</h5>
                    <Badge variant="secondary">{success.duration}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{success.role}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span>Pathway: {success.pathway}</span>
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {success.certifications} certs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Career Development ROI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$2.4M</div>
                <div className="text-xs text-blue-600">Annual Salary Impact</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-xs text-green-600">Retention Rate</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Time to Promotion</span>
                <span className="font-medium">14 months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Internal Hire Rate</span>
                <span className="font-medium">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Skill Development ROI</span>
                <span className="font-medium">340%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Employee Satisfaction</span>
                <span className="font-medium">4.6/5</span>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                View Detailed Career Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}