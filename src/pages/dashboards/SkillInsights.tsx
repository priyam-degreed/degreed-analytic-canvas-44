import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Target, Brain, Award, Users, ArrowUp, ArrowDown } from "lucide-react";
import { skillGrowthData, strategicOverviewData } from "@/data/mockData";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Cell
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8'];

export default function SkillInsights() {
  const radarData = strategicOverviewData.topSkills.slice(0, 6).map(skill => ({
    skill: skill.name.length > 15 ? skill.name.substring(0, 12) + "..." : skill.name,
    current: skill.selfRating * 20,
    market: skill.marketDemand || 60,
    users: skill.users / 10
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skill Insights</h1>
          <p className="text-muted-foreground mt-1">
            Analyze skill development, gaps, and market alignment across your workforce
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Skills Tracked"
          value={strategicOverviewData.totalSkills.toString()}
          change={{ value: 8.3, type: "positive" }}
          icon={<Brain className="h-5 w-5" />}
        />
        <MetricCard
          title="Expert-Level Skills"
          value={strategicOverviewData.expertSkills.reduce((sum, skill) => sum + skill.expertRatings, 0).toString()}
          change={{ value: 15.7, type: "positive" }}
          icon={<Award className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Skill Plans"
          value={strategicOverviewData.activeSkillPlans.toString()}
          change={{ value: 23.1, type: "positive" }}
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Skills in Decay"
          value={skillGrowthData.skillDecayAlerts.length.toString()}
          change={{ value: -12.4, type: "negative" }}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {/* Skill Gaps vs Market Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Critical Skill Gaps by Department"
          subtitle="Skills with highest demand vs current capability"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillGrowthData.skillGaps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="current" fill="hsl(var(--secondary))" name="Current Level" />
              <Bar dataKey="required" fill="hsl(var(--primary))" name="Required Level" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Skill Development Radar"
          subtitle="Current skills vs market demand alignment"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Current Skills" dataKey="current" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Radar name="Market Demand" dataKey="market" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Growing Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Top Skills Gained This Quarter"
            subtitle="Skills with highest learning activity and growth"
          >
            <div className="space-y-4">
              {skillGrowthData.topSkillsGained.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{skill.skill}</h4>
                      <p className="text-sm text-muted-foreground">{skill.learners} learners</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">+{skill.averageGrowth}</span>
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Market:</span>
                      <Badge variant={skill.marketDemand > 85 ? "default" : "secondary"}>
                        {skill.marketDemand}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Skill Decay Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillGrowthData.skillDecayAlerts.map((alert, index) => (
                <div key={index} className="p-3 border rounded-md space-y-2">
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-sm">{alert.skill}</h5>
                    <Badge variant={alert.urgency === 'high' ? 'destructive' : 'secondary'}>
                      {alert.urgency}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.affectedUsers} users</p>
                  <p className="text-xs">Last activity: {alert.lastActivity}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skill Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillGrowthData.skillAssessments.map((assessment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{assessment.month}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{assessment.avgScore}%</div>
                    <div className="text-xs text-muted-foreground">{assessment.totalAssessments} assessments</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skill Progression Matrix */}
      <ChartCard
        title="Skill Progression Matrix"
        subtitle="Current skill distribution across proficiency levels"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {strategicOverviewData.expertSkills.slice(0, 4).map((skill, index) => (
            <div key={index} className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium">{skill.name}</h4>
                <p className="text-sm text-muted-foreground">+{skill.growthRate}% growth</p>
              </div>
              
              <div className="space-y-2">
                {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map((level, levelIndex) => {
                  const values = [skill.expertRatings, Math.floor(skill.expertRatings * 1.5), Math.floor(skill.expertRatings * 2), Math.floor(skill.expertRatings * 0.8)];
                  const value = values[levelIndex];
                  const maxValue = Math.max(...values);
                  const percentage = (value / maxValue) * 100;
                  
                  return (
                    <div key={level} className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground w-20">{level}</span>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Market Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Skills vs Market Demand"
          subtitle="How well our skills align with market needs"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={strategicOverviewData.topSkills.slice(0, 8)}>
              <CartesianGrid />
              <XAxis dataKey="users" name="Internal Users" />
              <YAxis dataKey="marketDemand" name="Market Demand" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">Users: {data.users}</p>
                        <p className="text-sm text-muted-foreground">Market Demand: {data.marketDemand || 'N/A'}%</p>
                        <p className="text-sm text-muted-foreground">Rating: {data.selfRating}/5</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="marketDemand" fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skill Investment Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-sm text-red-600">Critical Gaps</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">7</div>
                  <div className="text-sm text-orange-600">High Priority</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-sm mb-2">Immediate Action Required</h5>
                  <div className="space-y-2">
                    {['Kubernetes', 'MLOps', 'Cloud Security'].map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Strategic Investments</h5>
                  <div className="space-y-2">
                    {['AI/ML', 'DevOps', 'Data Science'].map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}