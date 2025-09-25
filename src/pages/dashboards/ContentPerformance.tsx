import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Star, TrendingUp, Users, Clock, Award, Heart, Share, Edit, Download } from "lucide-react";
import { contentPerformanceData } from "@/data/mockData";
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
  Area,
  AreaChart
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d'];

export default function ContentPerformance() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Performance</h1>
        <p className="text-muted-foreground mt-1">
          Analyze learning content usage, ratings, and effectiveness across modalities
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar showRoles={true} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Content Views"
          value="47.2K"
          change={{ value: 15.3, type: "positive" }}
          icon={<Play className="h-5 w-5" />}
        />
        <MetricCard
          title="Average Rating"
          value={contentPerformanceData.learnerFeedback.averageRating.toString()}
          change={{ value: 2.1, type: "positive" }}
          icon={<Star className="h-5 w-5" />}
        />
        <MetricCard
          title="NPS Score"
          value={contentPerformanceData.learnerFeedback.npsScore.toString()}
          change={{ value: 8.4, type: "positive" }}
          icon={<Heart className="h-5 w-5" />}
        />
        <MetricCard
          title="Content ROI"
          value="3.2x"
          change={{ value: 12.7, type: "positive" }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Top Performing Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Top Performing Content"
          subtitle="Highest rated and most completed learning content"
        >
          <div className="space-y-4">
            {contentPerformanceData.topPerformingContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{content.title}</h4>
                    <p className="text-xs text-muted-foreground">{content.completions.toLocaleString()} completions</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-sm font-medium">{content.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{content.feedback}% positive</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Content Modality Usage"
          subtitle="Learning format preferences and performance"
        >
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={contentPerformanceData.contentByModality}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="usage"
                  nameKey="modality"
                >
                  {contentPerformanceData.contentByModality.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {contentPerformanceData.contentByModality.map((modality, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm font-medium">{modality.modality}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{modality.usage}%</div>
                    <div className="text-xs text-muted-foreground">⭐ {modality.satisfaction} • ROI {modality.roi}x</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Content Ratings Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <ChartCard
            title="Content Rating Distribution"
            subtitle="How learners rate our content across all formats"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={Object.entries(contentPerformanceData.learnerFeedback.feedbackDistribution).map(([rating, percentage]) => ({
                  rating,
                  percentage: parseFloat(percentage.toString())
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Bar dataKey="percentage" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Content Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Content Quality Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Satisfaction</span>
              <span className="text-sm font-bold text-green-600">4.3/5</span>
            </div>
            <Progress value={86} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Completion Rate</span>
              <span className="text-sm font-bold text-blue-600">74%</span>
            </div>
            <Progress value={74} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Engagement Score</span>
              <span className="text-sm font-bold text-purple-600">82%</span>
            </div>
            <Progress value={82} className="h-2" />
          </div>

          <div className="pt-4 space-y-2">
            <div className="text-xs text-muted-foreground">Key Insights:</div>
            <div className="space-y-1">
              <div className="text-xs">• Video content has highest completion rates</div>
              <div className="text-xs">• Interactive labs show best engagement</div>
              <div className="text-xs">• Mobile usage growing 23% monthly</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Performance by Category */}
      <ChartCard
        title="Content Performance by Category"
        subtitle="Completion rates and satisfaction across different learning topics"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { category: "Technical Skills", completions: 2847, rating: 4.5, engagement: 87 },
            { category: "Leadership", completions: 1923, rating: 4.3, engagement: 79 },
            { category: "Data Science", completions: 1654, rating: 4.7, engagement: 92 },
            { category: "Soft Skills", completions: 1432, rating: 4.1, engagement: 73 }
          ].map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div>
                  <h4 className="font-medium text-sm">{category.category}</h4>
                  <p className="text-xs text-muted-foreground">{category.completions.toLocaleString()} completions</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Rating</span>
                    <span className="font-medium">{category.rating}/5</span>
                  </div>
                  <Progress value={category.rating * 20} className="h-1" />
                  
                  <div className="flex justify-between items-center text-xs">
                    <span>Engagement</span>
                    <span className="font-medium">{category.engagement}%</span>
                  </div>
                  <Progress value={category.engagement} className="h-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ChartCard>

      {/* Learning Format Effectiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Learning Format ROI Analysis"
          subtitle="Return on investment by content format"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={contentPerformanceData.contentByModality}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="modality" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="roi" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}