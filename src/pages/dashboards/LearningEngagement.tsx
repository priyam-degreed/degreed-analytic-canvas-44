import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Clock, BookOpen, Play, Award, Target, Share, Edit, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { FilterBar } from "@/components/filters/FilterBar";
import { useFilters } from "@/contexts/FilterContext";
import { useFilteredData, useFilteredMetrics } from "@/hooks/useFilteredData";
import { useState, useMemo } from "react";
import { DrillDownDialog } from "@/components/dashboard/DrillDownDialog";
import { RecordsListDialog } from "@/components/dashboard/RecordsListDialog";
import { getLearningDrillDownData } from "@/data/learningDrillDownData";
import { generateRecords } from "@/data/recordsData";
import { comprehensiveLearningData, comprehensiveSkillRatings, comprehensiveTrendingTopics, aggregateDataByPeriod } from '@/data/comprehensiveMockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from "recharts";
const COLORS = ['#3b82f6', '#60a5fa', '#1e40af', '#93c5fd', '#1d4ed8']; // Blue color palette

export default function LearningEngagement() {
  console.log("LearningEngagement component rendering"); // Debug log
  const {
    filters
  } = useFilters();
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [recordsDialogData, setRecordsDialogData] = useState<{
    isOpen: boolean;
    title: string;
    records: any[];
    category: string;
  }>({
    isOpen: false,
    title: '',
    records: [],
    category: ''
  });
  const handleCardClick = (cardType: string) => {
    const data = getLearningDrillDownData(cardType);
    setDrillDownData({
      additionalData: data
    });
    setIsDrillDownOpen(true);
  };
  const handleDrillDownToRecords = (category: string, title: string) => {
    // Get the actual count from the drill-down data
    const actualCount = drillDownData?.additionalData?.ratingDistribution?.[category] || drillDownData?.additionalData?.skillBreakdown?.[category] || drillDownData?.additionalData?.progressionTiers?.[category] || 10; // fallback

    const records = generateRecords(category, title, actualCount);
    setRecordsDialogData({
      isOpen: true,
      title,
      records,
      category
    });
    setIsDrillDownOpen(false); // Close first dialog
  };
  const closeRecordsDialog = () => {
    setRecordsDialogData({
      isOpen: false,
      title: '',
      records: [],
      category: ''
    });
    setIsDrillDownOpen(true); // Reopen the first dialog when closing records dialog
  };

  // Use comprehensive filtered data with enhanced properties
  const enhancedLearningData = useMemo(() => comprehensiveLearningData.map(item => ({
    ...item,
    rating: Math.floor(Math.random() * 5) + 1,
    // 1-5 star rating
    region: ['North America (NA)', 'Europe, Middle East & Africa (EMEA)', 'Asia-Pacific (APAC)'][Math.floor(Math.random() * 3)]
  })), []);
  const enhancedSkillRatings = useMemo(() => comprehensiveSkillRatings.map(rating => ({
    ...rating,
    rating: Math.floor(Math.random() * 5) + 1,
    // 1-5 star rating  
    region: ['North America (NA)', 'Europe, Middle East & Africa (EMEA)', 'Asia-Pacific (APAC)'][Math.floor(Math.random() * 3)]
  })), []);
  const enhancedTrendingTopics = useMemo(() => comprehensiveTrendingTopics.map(topic => ({
    ...topic,
    rating: Math.floor(Math.random() * 5) + 1,
    // 1-5 star rating
    region: ['North America (NA)', 'Europe, Middle East & Africa (EMEA)', 'Asia-Pacific (APAC)'][Math.floor(Math.random() * 3)]
  })), []);
  const filteredLearningData = useFilteredData(enhancedLearningData, filters);
  const filteredSkillRatings = useFilteredData(enhancedSkillRatings, filters);
  const filteredTrendingTopics = useFilteredData(enhancedTrendingTopics, filters);

  // Calculate aggregated metrics from filtered data
  const aggregatedMetrics = useMemo(() => {
    const totalLearners = filteredLearningData.reduce((sum, item) => sum + item.learners, 0);
    const totalCompletions = filteredLearningData.reduce((sum, item) => sum + item.completions, 0);
    const totalHours = filteredLearningData.reduce((sum, item) => sum + item.hours, 0);
    const totalActiveUsers = filteredLearningData.reduce((sum, item) => sum + item.activeUsers, 0);
    const avgEngagement = filteredLearningData.length > 0 ? filteredLearningData.reduce((sum, item) => sum + item.engagementRate, 0) / filteredLearningData.length : 0;

    // Engagement trends from filtered data grouped by date
    const trendsByDate = filteredLearningData.reduce((acc: any, item) => {
      const key = item.date.substring(0, 7); // YYYY-MM format
      if (!acc[key]) {
        acc[key] = {
          date: key,
          completions: 0,
          activeUsers: 0,
          hours: 0
        };
      }
      acc[key].completions += item.completions;
      acc[key].activeUsers += item.activeUsers;
      acc[key].hours += item.hours;
      return acc;
    }, {});
    const engagementTrends = Object.values(trendsByDate).sort((a: any, b: any) => a.date.localeCompare(b.date));
    return {
      totalLearners: Math.max(totalLearners, 0),
      totalCompletions: Math.max(totalCompletions, 0),
      totalHours: Math.max(totalHours, 0),
      totalActiveUsers: Math.max(totalActiveUsers, 0),
      avgEngagement: Math.max(avgEngagement, 0),
      engagementTrends
    };
  }, [filteredLearningData]);

  // Calculate current vs previous period comparison
  const currentVsPrevComparison = useMemo(() => {
    // Sort filtered data by date to get chronological order
    const sortedData = [...filteredLearningData].sort((a, b) => a.date.localeCompare(b.date));
    if (sortedData.length === 0) {
      return {
        current: {
          completions: 0,
          hours: 0,
          activeUsers: 0
        },
        previous: {
          completions: 0,
          hours: 0,
          activeUsers: 0
        },
        comparison: []
      };
    }

    // Split data into two halves (current vs previous period)
    const midPoint = Math.floor(sortedData.length / 2);
    const previousPeriod = sortedData.slice(0, midPoint);
    const currentPeriod = sortedData.slice(midPoint);

    // Aggregate totals for each period
    const currentTotals = currentPeriod.reduce((acc, item) => ({
      completions: acc.completions + item.completions,
      hours: acc.hours + item.hours,
      activeUsers: acc.activeUsers + item.activeUsers
    }), {
      completions: 0,
      hours: 0,
      activeUsers: 0
    });
    const previousTotals = previousPeriod.reduce((acc, item) => ({
      completions: acc.completions + item.completions,
      hours: acc.hours + item.hours,
      activeUsers: acc.activeUsers + item.activeUsers
    }), {
      completions: 0,
      hours: 0,
      activeUsers: 0
    });

    // Create comparison data for chart
    const comparison = [{
      metric: 'Completions',
      current: currentTotals.completions,
      previous: previousTotals.completions
    }, {
      metric: 'Learning Hours',
      current: currentTotals.hours,
      previous: previousTotals.hours
    }, {
      metric: 'Active Users',
      current: currentTotals.activeUsers,
      previous: previousTotals.activeUsers
    }];
    return {
      current: currentTotals,
      previous: previousTotals,
      comparison
    };
  }, [filteredLearningData]);

  // Calculate filtered metrics from aggregated data (no longer need separate filtering)
  const metrics = {
    totalLearners: aggregatedMetrics.totalLearners || 15420,
    activeUsersThisWeek: aggregatedMetrics.totalActiveUsers || 8934,
    courseCompletions: aggregatedMetrics.totalCompletions || 3847,
    learningHours: aggregatedMetrics.totalHours || 12847,
    avgCompletionRate: Math.round(aggregatedMetrics.avgEngagement) || 75
  };

  // Enhanced job role data structure from filtered learning data
  const roleComparisonData = useMemo(() => {
    console.log('🔄 Learning Engagement Component Loading:', {
      filteredDataLength: filteredLearningData.length,
      totalDataLength: comprehensiveLearningData.length
    });

    // Add test data to verify chart works
    const testData = [{
      role: "Software Engineer",
      currentPeriod: {
        completions: 45,
        hours: 180,
        learners: 12,
        engagementRate: 85,
        count: 4,
        avgEngagementRate: 85
      },
      previousPeriod: {
        completions: 32,
        hours: 128,
        learners: 8,
        engagementRate: 75,
        count: 3,
        avgEngagementRate: 75
      },
      change: 13
    }, {
      role: "Data Scientist",
      currentPeriod: {
        completions: 38,
        hours: 152,
        learners: 10,
        engagementRate: 90,
        count: 3,
        avgEngagementRate: 90
      },
      previousPeriod: {
        completions: 28,
        hours: 112,
        learners: 7,
        engagementRate: 80,
        count: 2,
        avgEngagementRate: 80
      },
      change: 10
    }, {
      role: "Product Manager",
      currentPeriod: {
        completions: 42,
        hours: 168,
        learners: 11,
        engagementRate: 88,
        count: 4,
        avgEngagementRate: 88
      },
      previousPeriod: {
        completions: 35,
        hours: 140,
        learners: 9,
        engagementRate: 82,
        count: 3,
        avgEngagementRate: 82
      },
      change: 7
    }];
    const roleAggregation = filteredLearningData.reduce((acc: any, item) => {
      if (!item.roles || item.roles.length === 0) return acc;
      item.roles.forEach(role => {
        if (!acc[role]) {
          acc[role] = {
            role,
            currentPeriod: {
              completions: 0,
              hours: 0,
              learners: 0,
              engagementRate: 0,
              count: 0
            },
            previousPeriod: {
              completions: 0,
              hours: 0,
              learners: 0,
              engagementRate: 0,
              count: 0
            }
          };
        }

        // Determine period based on date (split data into current vs previous)
        const itemDate = new Date(item.date);
        const sortedData = [...filteredLearningData].sort((a, b) => a.date.localeCompare(b.date));
        const midPoint = Math.floor(sortedData.length / 2);
        const midDate = sortedData[midPoint]?.date;
        const period = item.date >= midDate ? 'currentPeriod' : 'previousPeriod';
        acc[role][period].completions += item.completions;
        acc[role][period].hours += item.hours;
        acc[role][period].learners += item.learners;
        acc[role][period].engagementRate += item.engagementRate;
        acc[role][period].count += 1;
      });
      return acc;
    }, {});
    const result = Object.values(roleAggregation).map((roleData: any) => ({
      ...roleData,
      currentPeriod: {
        ...roleData.currentPeriod,
        avgEngagementRate: roleData.currentPeriod.count > 0 ? roleData.currentPeriod.engagementRate / roleData.currentPeriod.count : 0
      },
      previousPeriod: {
        ...roleData.previousPeriod,
        avgEngagementRate: roleData.previousPeriod.count > 0 ? roleData.previousPeriod.engagementRate / roleData.previousPeriod.count : 0
      },
      change: roleData.currentPeriod.completions - roleData.previousPeriod.completions
    })).filter(roleData => {
      // Apply role filter if specified - show all roles if no filter selected
      if (filters.roles.length === 0) return true;
      return filters.roles.some(selectedRole => roleData.role.toLowerCase().includes(selectedRole.toLowerCase()) || selectedRole.toLowerCase().includes(roleData.role.toLowerCase()));
    }).sort((a, b) => b.currentPeriod.completions - a.currentPeriod.completions) // Sort by current completions
    .slice(0, 10); // Limit to top 10 roles for better visibility

    console.log('📊 Final Role Comparison Data:', result.length, result.slice(0, 3));

    // Return test data if no real data is available
    return result.length > 0 ? result : testData;
  }, [filteredLearningData, filters.roles]);

  // Generate multi-line trend data for activities vs ratings
  const activityRatingTrends = useMemo(() => {
    const monthlyData = [];
    const months = ['SEP 2023', 'OCT', 'NOV', 'DEC', 'JAN 2024', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN 2025', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'];
    months.forEach((month, index) => {
      const baseActivity = 200 + Math.random() * 100;
      // Create spike at the end (Aug 2025)
      const learningActivities = index === months.length - 1 ? 5440 : baseActivity;
      const peerRating = 3.3 + Math.random() * 1.5 + (index < 6 ? 0.5 : 0);
      const managerRating = 5.04 + Math.random() * 0.08;
      const selfRating = 3.9 + Math.random() * 0.25;
      monthlyData.push({
        month: month,
        learningActivities: Math.round(learningActivities),
        peerRating: Number(peerRating.toFixed(2)),
        managerRating: Number(managerRating.toFixed(3)),
        selfRating: Number(selfRating.toFixed(2))
      });
    });
    return monthlyData;
  }, []);
  return <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Learning Engagement</h1>
        <p className="text-muted-foreground mt-1">
          Track learning activity, participation, and engagement across your organization
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar showRoles={true} showCustomAttribute={true} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricCard title="Total Active Learners" value={metrics.totalLearners.toLocaleString()} change={{
        value: 15.3,
        type: "positive"
      }} icon={<Users className="h-5 w-5" />} onClick={() => handleCardClick("Total Active Learners")} />
        <MetricCard title="Learning Completions" value={metrics.courseCompletions.toLocaleString()} change={{
        value: 28.9,
        type: "positive"
      }} icon={<Award className="h-5 w-5" />} onClick={() => handleCardClick("Learning Completions")} />
        <MetricCard title="Learning Hours" value={`${metrics.learningHours.toLocaleString()}h`} change={{
        value: 12.4,
        type: "positive"
      }} icon={<Clock className="h-5 w-5" />} onClick={() => handleCardClick("Learning Hours")} />
        <MetricCard title="Learning Satisfaction" value="89%" change={{
        value: 4.2,
        type: "positive"
      }} icon={<Target className="h-5 w-5" />} onClick={() => handleCardClick("Learning Satisfaction")} />
        <MetricCard title="Assignments Created" value={(metrics.courseCompletions * 1.3).toLocaleString()} change={{
        value: 18.7,
        type: "positive"
      }} icon={<BookOpen className="h-5 w-5" />} onClick={() => handleCardClick("Assignments Created")} />
        <MetricCard title="Most Active Skill" value="JavaScript" change={{
        value: 23.4,
        type: "positive"
      }} icon={<Play className="h-5 w-5" />} onClick={() => handleCardClick("Most Active Skill")} />
      </div>

      {/* Learning Completions (In Period) vs. Previous Period */}
      <ChartCard title="Learning Completions (In Period) vs. Previous Period" subtitle="Aug 2025">
        <div className="space-y-6">
          {/* Summary Row */}
          <div className="grid grid-cols-3 gap-8 p-6 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Aug 31 2025</div>
              <div className="text-4xl font-bold">{currentVsPrevComparison.current.completions}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Jul 31 2025</div>
              <div className="text-4xl font-bold">{currentVsPrevComparison.previous.completions}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Change</div>
              <div className="text-4xl font-bold text-green-600">
                +{currentVsPrevComparison.current.completions - currentVsPrevComparison.previous.completions}
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Completions by H1 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Learning Completions (In Period) vs. Previous Period by H1</h4>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[{
                  category: 'Aug 31 2025',
                  current: currentVsPrevComparison.current.completions,
                  previous: 0
                }, {
                  category: 'Jul 31 2025',
                  current: 0,
                  previous: currentVsPrevComparison.previous.completions
                }]} margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value, name, props) => {
                    const isCurrentPeriod = props.payload.category === 'Aug 31 2025';
                    return [value, isCurrentPeriod ? 'Learning Completions (in Period)' : 'Previous Period'];
                  }} labelFormatter={label => label} contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} />
                    <Bar dataKey="current" fill="#3b82f6" name="Aug 31 2025" />
                    <Bar dataKey="previous" fill="#60a5fa" name="Previous Period" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="flex justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                    <span className="text-sm">Aug 31 2025</span>
                    <span className="font-semibold">{currentVsPrevComparison.current.completions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#60a5fa]"></div>
                    <span className="text-sm">Jul 31 2025</span>
                    <span className="font-semibold">{currentVsPrevComparison.previous.completions}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Completions by Job Role */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Learning Completions (In Period) vs. Previous Period by Job Role</h4>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roleComparisonData.map(role => ({
                  role: role.role,
                  current: role.currentPeriod.completions,
                  previous: role.previousPeriod.completions,
                  change: role.change
                }))} margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60
                }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} />
                    <Bar dataKey="current" fill="#3b82f6" name="Current Period" />
                    <Bar dataKey="previous" fill="#60a5fa" name="Previous Period" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="flex justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                    <span className="text-sm">Current Period (Aug 31 2025)</span>
                    <span className="font-semibold">{currentVsPrevComparison.current.completions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#60a5fa]"></div>
                    <span className="text-sm">Previous Period (Jul 31 2025)</span>
                    <span className="font-semibold">{currentVsPrevComparison.previous.completions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Learning Completions by Provider & Provider Usage Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Learning Completions (In Period) by Item & Provider" subtitle="Q3 2025">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Pie Chart */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={Object.entries(filteredLearningData.reduce((acc: Record<string, number>, item) => {
                  const provider = item.provider || 'Unknown';
                  if (!acc[provider]) {
                    acc[provider] = 0;
                  }
                  acc[provider] += item.completions;
                  return acc;
                }, {})).map(([provider, completions], index) => ({
                  name: provider,
                  value: completions as number,
                  fill: COLORS[index % COLORS.length]
                })).sort((a, b) => b.value - a.value)} cx="50%" cy="50%" outerRadius={120} fill="#8884d8" dataKey="value">
                    {Object.entries(filteredLearningData.reduce((acc: Record<string, number>, item) => {
                    const provider = item.provider || 'Unknown';
                    if (!acc[provider]) {
                      acc[provider] = 0;
                    }
                    acc[provider] += item.completions;
                    return acc;
                  }, {})).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} completions`, name]} contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Total Count */}
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground">Learning Completions (in Period)</div>
                <div className="text-3xl font-bold">
                  {filteredLearningData.reduce((sum, item) => sum + item.completions, 0)}
                </div>
              </div>
            </div>

            {/* Legend on the right side */}
            <div className="lg:w-64 space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Providers</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {Object.entries(filteredLearningData.reduce((acc: Record<string, number>, item) => {
                const provider = item.provider || 'Unknown';
                if (!acc[provider]) {
                  acc[provider] = 0;
                }
                acc[provider] += item.completions;
                return acc;
              }, {})).map(([provider, completions], index) => ({
                provider,
                completions: completions as number,
                index
              })).sort((a, b) => b.completions - a.completions).map(({
                provider,
                completions,
                index
              }) => <div key={provider} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{
                  backgroundColor: COLORS[index % COLORS.length]
                }} />
                    <span className="text-sm font-medium flex-1 truncate">{provider}</span>
                    <span className="text-sm text-muted-foreground">{completions}</span>
                  </div>)}
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Learning Provider Usage Trends" subtitle="Which providers are gaining momentum">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(() => {
            // Calculate provider usage trends from filtered data
            const currentPeriodData: Record<string, number> = {};
            const previousPeriodData: Record<string, number> = {};

            // Current period data from filtered results
            filteredLearningData.forEach(item => {
              const provider = item.provider || 'Unknown';
              if (!currentPeriodData[provider]) {
                currentPeriodData[provider] = 0;
              }
              currentPeriodData[provider] += item.completions;
            });

            // Previous period data (simulate previous period by using different date range)
            comprehensiveLearningData.filter(item => {
              const itemDate = new Date(item.date);
              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 12);
              const twelveMonthsAgo = new Date();
              twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 18);
              return itemDate >= twelveMonthsAgo && itemDate < sixMonthsAgo;
            }).forEach(item => {
              const provider = item.provider || 'Unknown';
              if (!previousPeriodData[provider]) {
                previousPeriodData[provider] = 0;
              }
              previousPeriodData[provider] += item.completions;
            });

            // Combine and calculate growth
            const allProviders = new Set([...Object.keys(currentPeriodData), ...Object.keys(previousPeriodData)]);
            return Array.from(allProviders).map(provider => {
              const current = currentPeriodData[provider] || 0;
              const previous = previousPeriodData[provider] || 0;
              const growth = previous > 0 ? Math.round((current - previous) / previous * 100) : 0;
              return {
                provider,
                currentPeriod: current,
                previousPeriod: previous,
                growth
              };
            }).filter(item => item.currentPeriod > 0 || item.previousPeriod > 0).sort((a, b) => b.currentPeriod - a.currentPeriod).slice(0, 10); // Show top 10 providers
          })()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="provider" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value: any, name: string) => {
              if (name === 'Current Period' || name === 'Previous Period') {
                return [`${value} completions`, name];
              }
              return [value, name];
            }} contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }} />
              <Bar dataKey="currentPeriod" fill="#3b82f6" name="Current Period" />
              <Bar dataKey="previousPeriod" fill="#60a5fa" name="Previous Period" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Trend of Learning Activities vs Average Ratings */}
      <ChartCard title="Trend of Learning Activities (In Period) vs. Average Peer Rating vs. Average Manager Rating vs. Average Self Rating" subtitle="Aug 2025">
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart data={activityRatingTrends} margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 100
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} fontSize={12} interval={0} />
              <YAxis yAxisId="left" orientation="left" domain={[0, 6000]} label={{
              value: 'Learning Activities',
              angle: -90,
              position: 'insideLeft'
            }} />
              <YAxis yAxisId="right" orientation="right" domain={[3, 5.5]} label={{
              value: 'Rating (1-5)',
              angle: 90,
              position: 'insideRight'
            }} />
              <Tooltip formatter={(value: any, name: string) => {
              if (name === 'learningActivities') {
                return [value?.toLocaleString(), 'Learning Activities (In Period)'];
              }
              return [value, name];
            }} labelFormatter={label => `Month: ${label}`} contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }} />
              
              {/* Learning Activities Line */}
              <Line yAxisId="left" type="monotone" dataKey="learningActivities" stroke="#1e40af" strokeWidth={3} dot={{
              fill: '#1e40af',
              strokeWidth: 2,
              r: 4
            }} name="Learning Activities (In Period)" />
              
              {/* Rating Lines */}
              <Line yAxisId="right" type="monotone" dataKey="peerRating" stroke="#3b82f6" strokeWidth={2} dot={{
              fill: '#3b82f6',
              strokeWidth: 2,
              r: 3
            }} name="Average Peer Rating" />
              
              <Line yAxisId="right" type="monotone" dataKey="managerRating" stroke="#60a5fa" strokeWidth={2} dot={{
              fill: '#60a5fa',
              strokeWidth: 2,
              r: 3
            }} name="Average Manager Rating" />
              
              <Line yAxisId="right" type="monotone" dataKey="selfRating" stroke="#93c5fd" strokeWidth={2} dot={{
              fill: '#93c5fd',
              strokeWidth: 2,
              r: 3
            }} name="Average Self Rating" />
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Legend and Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#1e40af]"></div>
                <span className="text-sm font-medium">Learning Activities (In Period)</span>
              </div>
              <div className="text-3xl font-bold text-[#1e40af]">5.44k</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                <span className="text-sm font-medium">Average Peer Rating</span>
              </div>
              <div className="text-3xl font-bold text-[#3b82f6]">3.83</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#60a5fa]"></div>
                <span className="text-sm font-medium">Average Manager Rating</span>
              </div>
              <div className="text-3xl font-bold text-[#60a5fa]">5.06</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#93c5fd]"></div>
                <span className="text-sm font-medium">Average Self Rating</span>
              </div>
              <div className="text-3xl font-bold text-[#93c5fd]">3.93</div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Engagement Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Learning Engagement Trends" subtitle={`Showing data for ${aggregatedMetrics.engagementTrends.length} periods`}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={aggregatedMetrics.engagementTrends} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }} />
              <Area type="monotone" dataKey="completions" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
              <Area type="monotone" dataKey="activeUsers" stackId="2" stroke="#60a5fa" fill="#60a5fa" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Content Modality Performance" subtitle={`Showing filtered content performance`}>
          <div className="space-y-4">
            {/* Show content type performance from filtered data */}
            {Object.entries(filteredLearningData.reduce((acc: any, item) => {
            const key = item.contentType;
            if (!acc[key]) {
              acc[key] = {
                type: key,
                usage: 0,
                completionRate: 0,
                avgRating: 0,
                count: 0
              };
            }
            acc[key].usage += item.learners;
            acc[key].completionRate += item.engagementRate;
            acc[key].avgRating += item.avgRating;
            acc[key].count += 1;
            return acc;
          }, {})).map(([key, modality]: [string, any], index) => {
            const avgCompletionRate = modality.completionRate / modality.count;
            const avgRating = modality.avgRating / modality.count;
            return <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{
                    backgroundColor: COLORS[index % COLORS.length]
                  }} />
                    <span className="font-medium">{modality.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{modality.usage.toLocaleString()} users</span>
                    <span>{Math.round(avgCompletionRate)}% completion</span>
                    <span>⭐ {avgRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="h-2 rounded-full" style={{
                  width: `${Math.min(100, avgCompletionRate)}%`,
                  backgroundColor: COLORS[index % COLORS.length]
                }} />
                </div>
              </div>;
          })}
          </div>
        </ChartCard>
      </div>

      {/* Trending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Trending Learning Topics" subtitle={`${filteredTrendingTopics.length} topics filtered`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredTrendingTopics} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 80
            }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }} />
                <Bar dataKey="learners" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Engagement Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-foreground">Monthly Active Learners</span>
                  <span className="text-sm font-semibold">81%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{
                  width: '81%'
                }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-foreground">Course Completion Rate</span>
                  <span className="text-sm font-semibold">63%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{
                  width: '63%'
                }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-foreground">Learning Hours Goal</span>
                  <span className="text-sm font-semibold">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{
                  width: '65%'
                }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Learning Time</span>
                <span className="font-medium">4.2h/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Most Popular Format</span>
                <span className="font-medium">
                  Course (78%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Peak Learning Day</span>
                <span className="font-medium">Tuesday</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Mobile Usage</span>
                <span className="font-medium">43%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Learning Velocity */}
      <ChartCard title="Learning Velocity by Job Role" subtitle={`Average learning hours per employee - ${roleComparisonData.length} roles shown`}>
        <div className="space-y-6">
          {roleComparisonData.map((role, index) => {
          const avgCurrentHours = role.currentPeriod.count > 0 ? role.currentPeriod.hours / role.currentPeriod.count : 0;

          // Calculate percentage based on max hours across all roles (for scaling the bars)
          const maxHours = Math.max(...roleComparisonData.map(r => r.currentPeriod.count > 0 ? r.currentPeriod.hours / r.currentPeriod.count : 0));
          const percentage = maxHours > 0 ? Math.round(avgCurrentHours / maxHours * 100) : 0;

          // Color mapping for different roles - blue variants
          const colors = ['bg-blue-500', 'bg-blue-600', 'bg-blue-400', 'bg-blue-700', 'bg-blue-300', 'bg-blue-800'];
          const color = colors[index % colors.length];
          return <div key={role.role}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-foreground">{role.role}</span>
                  <span className="text-sm font-semibold">{avgCurrentHours.toFixed(1)}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`${color} h-3 rounded-full transition-all duration-300`} style={{
                width: `${percentage}%`
              }} />
                </div>
              </div>;
        })}
        </div>
      </ChartCard>

      {/* New Analysis Charts to Answer All Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Learning Time by Skill Categories */}
        <ChartCard title="Learning Time by Skill Categories" subtitle="How participants spend time on different skills">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={(() => {
              // Calculate skill category hours from filtered data
              const skillCategories: Record<string, number> = {};
              filteredLearningData.forEach(item => {
                if (item.skills && Array.isArray(item.skills)) {
                  item.skills.forEach(skill => {
                    // Categorize skills
                    let category = 'Other';
                    if (['Python Programming', 'Java', 'Cloud Computing', 'Machine Learning', 'Data Analytics', 'Big Data Analysis', 'Business Intelligence'].includes(skill)) {
                      category = 'Technical Skills';
                    } else if (['Leadership', 'Innovation'].includes(skill)) {
                      category = 'Leadership';
                    } else if (['Project Management'].includes(skill)) {
                      category = 'Project Management';
                    } else if (['Data Visualization', 'Data Analytics'].includes(skill)) {
                      category = 'Data Analysis';
                    } else if (['Business Analysis'].includes(skill)) {
                      category = 'Communication';
                    }
                    if (!skillCategories[category]) {
                      skillCategories[category] = 0;
                    }
                    skillCategories[category] += item.hours || 0;
                  });
                }
              });
              return Object.entries(skillCategories).map(([name, value]) => ({
                name,
                value,
                hours: `${Math.round(value)}h`
              })).sort((a, b) => b.value - a.value).slice(0, 6); // Show top 6 categories
            })()} cx="50%" cy="50%" outerRadius={100} fill="hsl(var(--primary))" dataKey="value" label={({
              name,
              hours
            }) => `${name}: ${hours}`}>
                {[0, 1, 2, 3, 4, 5].map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={value => [`${value}h`, 'Learning Hours']} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Learning Satisfaction Trends */}
        <ChartCard title="Learning Satisfaction Over Time" subtitle="Participant satisfaction ratings">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={(() => {
            // Calculate satisfaction trends from filtered data by month
            const satisfactionByMonth: Record<string, {
              satisfaction: number;
              responses: number;
              count: number;
            }> = {};
            filteredLearningData.forEach(item => {
              const month = new Date(item.date).toLocaleDateString('en-US', {
                month: 'short'
              });
              if (!satisfactionByMonth[month]) {
                satisfactionByMonth[month] = {
                  satisfaction: 0,
                  responses: 0,
                  count: 0
                };
              }
              satisfactionByMonth[month].satisfaction += (item.avgRating || 4.2) * 20; // Convert 1-5 to percentage
              satisfactionByMonth[month].responses += item.learners || 0;
              satisfactionByMonth[month].count += 1;
            });
            return Object.entries(satisfactionByMonth).map(([month, data]) => ({
              month,
              satisfaction: Math.round(data.satisfaction / data.count),
              responses: data.responses
            })).sort((a, b) => {
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return months.indexOf(a.month) - months.indexOf(b.month);
            });
          })()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 95]} />
              <Tooltip formatter={(value, name) => [name === 'satisfaction' ? `${value}%` : value, name === 'satisfaction' ? 'Satisfaction Score' : 'Survey Responses']} contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }} />
              <Line type="monotone" dataKey="satisfaction" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Assignment vs Completion Tracking */}
        <ChartCard title="Learning Assignments vs Completions" subtitle="Assignment effectiveness tracking">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={(() => {
            // Calculate assignments vs completions from filtered data
            const assignmentsByMonth: Record<string, {
              assigned: number;
              completed: number;
            }> = {};
            filteredLearningData.forEach(item => {
              const month = new Date(item.date).toLocaleDateString('en-US', {
                month: 'short'
              });
              if (!assignmentsByMonth[month]) {
                assignmentsByMonth[month] = {
                  assigned: 0,
                  completed: 0
                };
              }

              // Estimate assignments as learners * average assignments per learner (1.5x)
              assignmentsByMonth[month].assigned += Math.round((item.learners || 0) * 1.5);
              assignmentsByMonth[month].completed += item.completions || 0;
            });
            return Object.entries(assignmentsByMonth).map(([month, data]) => ({
              month,
              assigned: data.assigned,
              completed: data.completed,
              rate: data.assigned > 0 ? Math.round(data.completed / data.assigned * 100) : 0
            })).sort((a, b) => {
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return months.indexOf(a.month) - months.indexOf(b.month);
            });
          })()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[60, 100]} />
              <Tooltip contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }} />
              <Bar yAxisId="left" dataKey="assigned" fill="#93c5fd" name="Assignments Created" />
              <Bar yAxisId="left" dataKey="completed" fill="#3b82f6" name="Completions" />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#1e40af" strokeWidth={3} name="Completion Rate %" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Skills Progression & Correlation Analysis */}
      <ChartCard title="Learning Impact on Skill Progression" subtitle="Correlation between learning activities and skill rating improvements">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={activityRatingTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[3, 6]} />
            <Tooltip formatter={(value, name) => {
            if (name === 'learningActivities') return [value, 'Learning Activities'];
            const nameStr = typeof name === 'string' ? name : String(name);
            return [value, nameStr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())];
          }} contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }} />
            <Bar yAxisId="left" dataKey="learningActivities" fill="#93c5fd" name="Learning Activities" />
            <Line yAxisId="right" type="monotone" dataKey="peerRating" stroke="#3b82f6" strokeWidth={2} name="Peer Rating" />
            <Line yAxisId="right" type="monotone" dataKey="managerRating" stroke="#60a5fa" strokeWidth={2} name="Manager Rating" />
            <Line yAxisId="right" type="monotone" dataKey="selfRating" stroke="#1e40af" strokeWidth={2} name="Self Rating" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2">Key Insights:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Strong correlation visible between learning activities spike (Aug 2025: 5,440 activities) and rating improvements</li>
            <li>• Manager ratings show consistent upward trend, indicating sustained skill development</li>
            <li>• Self and peer ratings demonstrate positive correlation with increased learning engagement</li>
          </ul>
        </div>
      </ChartCard>

      {/* Provider Satisfaction and Assignments Status - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Provider Satisfaction Analysis */}
        <ChartCard title="Learning Provider Satisfaction Ratings" subtitle="Which provider has the highest user satisfaction?">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(() => {
            // Calculate provider satisfaction from filtered data
            const providerStats: Record<string, {
              satisfaction: number;
              users: number;
              avgRating: number;
              count: number;
            }> = {};
            filteredLearningData.forEach(item => {
              const provider = item.provider || 'Unknown';
              if (!providerStats[provider]) {
                providerStats[provider] = {
                  satisfaction: 0,
                  users: 0,
                  avgRating: 0,
                  count: 0
                };
              }
              providerStats[provider].satisfaction += item.engagementRate || 75;
              providerStats[provider].users += item.learners || 0;
              providerStats[provider].avgRating += item.avgRating || 4.2;
              providerStats[provider].count += 1;
            });
            return Object.entries(providerStats).map(([provider, stats]) => ({
              provider,
              satisfaction: Math.round(stats.satisfaction / stats.count),
              users: stats.users,
              avgRating: +(stats.avgRating / stats.count).toFixed(1)
            })).filter(item => item.users > 0).sort((a, b) => b.satisfaction - a.satisfaction);
          })()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="provider" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[75, 95]} />
              <Tooltip content={({
              active,
              payload,
              label
            }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return <div className="bg-popover p-3 border border-border rounded-lg shadow-md">
                        <p className="font-semibold text-popover-foreground">{label}</p>
                        <div className="space-y-1 mt-2">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Satisfaction Score:</span> {data.satisfaction}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Average Rating:</span> {data.avgRating}★
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Total Users:</span> {data.users.toLocaleString()}
                          </p>
                        </div>
                      </div>;
              }
              return null;
            }} />
              <Bar dataKey="satisfaction" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-muted/20 rounded-lg">
            
          </div>
        </ChartCard>

        {/* Overdue Assignments Tracking */}
        <ChartCard title="Learning Assignments Status" subtitle="Assignment completion and overdue tracking">
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Total Assigned</div>
                <div className="text-2xl font-bold">1,720</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-2xl font-bold" style={{
                color: '#3b82f6'
              }}>1,456</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Overdue</div>
                <div className="text-2xl font-bold" style={{
                color: '#1e40af'
              }}>89</div>
              </div>
            </div>

            {/* Status Distribution Pie Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[{
                name: 'Completed',
                value: 84.7,
                count: 1456,
                color: '#3b82f6'
              }, {
                name: 'In Progress',
                value: 10.1,
                count: 175,
                color: '#93c5fd'
              }, {
                name: 'Overdue',
                value: 5.2,
                count: 89,
                color: '#1e40af'
              }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({
                name,
                value
              }) => `${name}: ${value}%`}>
                  {[{
                  name: 'Completed',
                  value: 84.7,
                  count: 1456,
                  color: '#3b82f6'
                }, {
                  name: 'In Progress',
                  value: 10.1,
                  count: 175,
                  color: '#93c5fd'
                }, {
                  name: 'Overdue',
                  value: 5.2,
                  count: 89,
                  color: '#1e40af'
                }].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value}% (${props.payload.count} assignments)`, name]} contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }} />
              </PieChart>
            </ResponsiveContainer>
            
            
          </div>
        </ChartCard>

      </div>

      {/* Completion Rate Analysis - New Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Organizational Completion Rate Breakdown */}
        <ChartCard title="Completion Rate by Department" subtitle="Which parts of the organization have highest/lowest completion rates?">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(() => {
            // Calculate completion rates by groups (departments) from filtered data
            const completionByGroup: Record<string, {
              totalLearners: number;
              totalCompletions: number;
              totalAssigned: number;
              totalHours: number;
              count: number;
            }> = {};
            filteredLearningData.forEach(item => {
              item.groups?.forEach(group => {
                if (!completionByGroup[group]) {
                  completionByGroup[group] = {
                    totalLearners: 0,
                    totalCompletions: 0,
                    totalAssigned: 0,
                    totalHours: 0,
                    count: 0
                  };
                }
                completionByGroup[group].totalLearners += item.learners;
                completionByGroup[group].totalCompletions += item.completions;
                completionByGroup[group].totalAssigned += Math.floor(item.learners * 1.2); // Estimate assignments
                completionByGroup[group].totalHours += item.hours;
                completionByGroup[group].count += 1;
              });
            });
            const departmentData = Object.entries(completionByGroup).map(([department, data]) => {
              const completionRate = data.totalAssigned > 0 ? data.totalCompletions / data.totalAssigned * 100 : 0;
              const avgDays = Math.max(7, Math.floor(data.totalHours / Math.max(data.totalCompletions, 1) * 2));
              return {
                department: department.replace(' Team', ''),
                // Clean team names
                completionRate: Math.round(Math.min(100, completionRate)),
                totalAssigned: data.totalAssigned,
                completed: data.totalCompletions,
                avgDays: Math.min(30, avgDays)
              };
            }).filter(item => item.totalAssigned > 0);

            // Add sample departments when filtered data is limited
            const sampleDepartments = [
              { department: 'Engineering', completionRate: 89, totalAssigned: 145, completed: 129, avgDays: 12 },
              { department: 'Product Management', completionRate: 85, totalAssigned: 78, completed: 66, avgDays: 15 },
              { department: 'Sales', completionRate: 82, totalAssigned: 234, completed: 192, avgDays: 18 },
              { department: 'Marketing', completionRate: 88, totalAssigned: 156, completed: 137, avgDays: 14 },
              { department: 'Customer Success', completionRate: 91, totalAssigned: 89, completed: 81, avgDays: 11 },
              { department: 'Operations', completionRate: 76, totalAssigned: 167, completed: 127, avgDays: 22 },
              { department: 'Finance', completionRate: 84, totalAssigned: 67, completed: 56, avgDays: 16 },
              { department: 'Human Resources', completionRate: 93, totalAssigned: 45, completed: 42, avgDays: 9 },
              { department: 'Legal', completionRate: 79, totalAssigned: 32, completed: 25, avgDays: 20 },
              { department: 'Data Analytics', completionRate: 87, totalAssigned: 98, completed: 85, avgDays: 13 }
            ];

            // Merge real data with sample data, prioritizing real data
            const existingDepts = new Set(departmentData.map(d => d.department.toLowerCase()));
            const additionalDepts = sampleDepartments.filter(dept => 
              !existingDepts.has(dept.department.toLowerCase())
            );

            const combinedData = [...departmentData, ...additionalDepts]
              .sort((a, b) => b.completionRate - a.completionRate)
              .slice(0, 10); // Top 10 departments

            return combinedData;
          })()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[70, 95]} />
              <Tooltip content={({
              active,
              payload,
              label
            }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return <div className="bg-popover p-4 border border-border rounded-lg shadow-lg">
                        <p className="font-semibold text-popover-foreground mb-2">{label} Department</p>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Completion Rate:</span> {data.completionRate}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Completed:</span> {data.completed}/{data.totalAssigned} assignments
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Avg Completion Time:</span> {data.avgDays} days
                          </p>
                        </div>
                      </div>;
              }
              return null;
            }} />
              <Bar dataKey="completionRate" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          
        </ChartCard>

        {/* Completion Rate Drivers */}
        <ChartCard title="What Drives Learning Completion?" subtitle="Key factors impacting completion rates">
          <div className="space-y-4">
            {/* Factor Analysis */}
            <div className="space-y-3">
              {[{
              factor: 'Manager Support',
              impact: 95,
              correlation: 0.87,
              description: 'Active manager engagement increases completion by 35%'
            }, {
              factor: 'Deadline Clarity',
              impact: 89,
              correlation: 0.82,
              description: 'Clear deadlines improve completion by 28%'
            }, {
              factor: 'Content Relevance',
              impact: 86,
              correlation: 0.79,
              description: 'Job-relevant content increases completion by 24%'
            }, {
              factor: 'Learning Path Length',
              impact: 72,
              correlation: -0.65,
              description: 'Shorter paths (< 5 modules) have higher completion'
            }, {
              factor: 'Time Allocation',
              impact: 83,
              correlation: 0.74,
              description: 'Dedicated learning time improves completion by 21%'
            }].map((item, index) => <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover-scale">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm font-medium text-foreground">{item.factor}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${item.correlation > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                        r={item.correlation}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{
                    width: `${item.impact}%`
                  }}></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-lg font-bold text-blue-600">{item.impact}%</div>
                    <div className="text-xs text-muted-foreground">Impact Score</div>
                  </div>
                </div>)}
            </div>
            
            {/* Key Recommendations */}
            
          </div>
        </ChartCard>

      </div>

      {/* Completion Rate Trends & Predictors - Full Width */}
      <ChartCard title="Completion Rate Trends & Predictive Factors" subtitle="Understanding what drives successful learning completion over time">
        <div className="space-y-6">
          
          {/* Multi-factor Trend Analysis */}
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={(() => {
            // Calculate completion factors from filtered data by month
            const factorsByMonth: Record<string, {
              completionRate: number;
              managerEngagement: number;
              contentRelevance: number;
              timeAllocation: number;
              deadlineClarity: number;
              count: number;
            }> = {};
            filteredLearningData.forEach(item => {
              const month = new Date(item.date).toLocaleDateString('en-US', {
                month: 'short'
              });
              if (!factorsByMonth[month]) {
                factorsByMonth[month] = {
                  completionRate: 0,
                  managerEngagement: 0,
                  contentRelevance: 0,
                  timeAllocation: 0,
                  deadlineClarity: 0,
                  count: 0
                };
              }

              // Calculate factors based on engagement rate and completion rate
              const completionRate = item.completions / item.learners * 100;
              const engagementRate = item.engagementRate;
              const rating = item.avgRating;

              // Derive other factors from available data
              factorsByMonth[month].completionRate += completionRate;
              factorsByMonth[month].managerEngagement += Math.min(100, engagementRate * 0.8 + (rating - 1) * 5);
              factorsByMonth[month].contentRelevance += Math.min(100, rating * 18 + Math.random() * 10);
              factorsByMonth[month].timeAllocation += Math.min(100, engagementRate * 0.7 + Math.random() * 20);
              factorsByMonth[month].deadlineClarity += Math.min(100, engagementRate * 0.75 + (rating - 1) * 8);
              factorsByMonth[month].count += 1;
            });
            return Object.entries(factorsByMonth).map(([month, data]) => ({
              month,
              completionRate: data.count > 0 ? Math.round(data.completionRate / data.count) : 78,
              managerEngagement: data.count > 0 ? Math.round(data.managerEngagement / data.count) : 65,
              contentRelevance: data.count > 0 ? Math.round(data.contentRelevance / data.count) : 72,
              timeAllocation: data.count > 0 ? Math.round(data.timeAllocation / data.count) : 58,
              deadlineClarity: data.count > 0 ? Math.round(data.deadlineClarity / data.count) : 70
            })).sort((a, b) => {
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return months.indexOf(a.month) - months.indexOf(b.month);
            });
          })()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" domain={[55, 90]} />
              <YAxis yAxisId="right" orientation="right" domain={[55, 90]} />
              <Tooltip content={({
              active,
              payload,
              label
            }) => {
              if (active && payload && payload.length) {
                return <div className="bg-popover p-4 border border-border rounded-lg shadow-lg">
                        <p className="font-semibold text-popover-foreground mb-2">{label} 2024</p>
                        <div className="space-y-1">
                          {payload.map((entry, index) => <div key={index} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{
                          backgroundColor: entry.color
                        }}></div>
                                <span className="text-sm">{entry.name}</span>
                              </div>
                              <span className="font-medium">{entry.value}%</span>
                            </div>)}
                        </div>
                      </div>;
              }
              return null;
            }} />
              <Line yAxisId="right" type="monotone" dataKey="completionRate" stroke="hsl(var(--primary))" strokeWidth={3} name="Completion Rate" />
              <Line yAxisId="left" type="monotone" dataKey="managerEngagement" stroke="hsl(var(--secondary))" strokeWidth={2} name="Manager Engagement" />
              <Line yAxisId="left" type="monotone" dataKey="contentRelevance" stroke="hsl(var(--accent))" strokeWidth={2} name="Content Relevance" />
              <Line yAxisId="left" type="monotone" dataKey="timeAllocation" stroke="#8884d8" strokeWidth={2} name="Time Allocation" />
              <Line yAxisId="left" type="monotone" dataKey="deadlineClarity" stroke="#82ca9d" strokeWidth={2} name="Deadline Clarity" />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Success Metrics Summary */}
          
        </div>
      </ChartCard>

      {/* Internal vs External Learning Adoption - Full Width */}
      <ChartCard title="Internal vs External Learning Adoption" subtitle="Learning source preference trends">
        <div className="space-y-6">
          {/* Visual Comparison with Icons */}
          <div className="grid grid-cols-2 gap-6">
            <div className="relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover-scale">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-400 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">External Learning</div>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">68%</div>
                <div className="text-sm text-blue-600/70 dark:text-blue-400/70">4,234 completions</div>
                
                {/* Progress Bar */}
                <div className="w-full bg-blue-200 dark:bg-blue-800/30 rounded-full h-2 mt-3">
                  <div className="bg-blue-400 h-2 rounded-full animate-fade-in" style={{
                  width: '68%'
                }}></div>
                </div>
              </div>
            </div>

            <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-800 hover-scale">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-500 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Internal Learning</div>
                <div className="text-4xl font-bold text-gray-600 dark:text-gray-400">32%</div>
                <div className="text-sm text-gray-600/70 dark:text-gray-400/70">1,987 completions</div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-800/30 rounded-full h-2 mt-3">
                  <div className="bg-gray-500 h-2 rounded-full animate-fade-in" style={{
                  width: '32%'
                }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          

          {/* Trend Chart with Enhanced Styling */}
          <div className="space-y-4">
            <div className="text-lg font-semibold text-foreground">Adoption Trends Over Time</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={[{
              month: 'Jan',
              external: 25,
              internal: 75,
              externalUsers: 1250,
              internalUsers: 3750
            }, {
              month: 'Feb',
              external: 28,
              internal: 72,
              externalUsers: 1400,
              internalUsers: 3600
            }, {
              month: 'Mar',
              external: 32,
              internal: 68,
              externalUsers: 1600,
              internalUsers: 3400
            }, {
              month: 'Apr',
              external: 36,
              internal: 64,
              externalUsers: 1800,
              internalUsers: 3200
            }, {
              month: 'May',
              external: 41,
              internal: 59,
              externalUsers: 2050,
              internalUsers: 2950
            }, {
              month: 'Jun',
              external: 45,
              internal: 55,
              externalUsers: 2250,
              internalUsers: 2750
            }, {
              month: 'Jul',
              external: 50,
              internal: 50,
              externalUsers: 2500,
              internalUsers: 2500
            }, {
              month: 'Aug',
              external: 55,
              internal: 45,
              externalUsers: 2750,
              internalUsers: 2250
            }, {
              month: 'Sep',
              external: 60,
              internal: 40,
              externalUsers: 3000,
              internalUsers: 2000
            }, {
              month: 'Oct',
              external: 64,
              internal: 36,
              externalUsers: 3200,
              internalUsers: 1800
            }, {
              month: 'Nov',
              external: 68,
              internal: 32,
              externalUsers: 3400,
              internalUsers: 1600
            }, {
              month: 'Dec',
              external: 72,
              internal: 28,
              externalUsers: 3600,
              internalUsers: 1400
            }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={({
                active,
                payload,
                label
              }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return <div className="bg-popover p-4 border border-border rounded-lg shadow-lg">
                          <p className="font-semibold text-popover-foreground mb-2">{label} 2024</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm">External Learning</span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{data.external}%</div>
                                <div className="text-xs text-muted-foreground">{data.externalUsers.toLocaleString()} users</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                                <span className="text-sm">Internal Learning</span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{data.internal}%</div>
                                <div className="text-xs text-muted-foreground">{data.internalUsers.toLocaleString()} users</div>
                              </div>
                            </div>
                          </div>
                        </div>;
                }
                return null;
              }} />
                <Line type="monotone" dataKey="external" stroke="#3b82f6" strokeWidth={3} dot={{
                fill: '#3b82f6',
                strokeWidth: 2,
                r: 4
              }} />
                <Line type="monotone" dataKey="internal" stroke="#1e40af" strokeWidth={3} dot={{
                fill: '#1e40af',
                strokeWidth: 2,
                r: 4
              }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Enhanced Legend with Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="font-medium">External Learning</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">68%</div>
                <div className="text-xs text-muted-foreground">Trending up</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-900 animate-pulse"></div>
                <span className="font-medium">Internal Learning</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-900">32%</div>
                <div className="text-xs text-muted-foreground">Stable</div>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      <DrillDownDialog isOpen={isDrillDownOpen} onClose={() => setIsDrillDownOpen(false)} data={drillDownData} onApplyFilter={() => {}} onViewDetails={() => {}} onDrillDownToRecords={handleDrillDownToRecords} />

      <RecordsListDialog isOpen={recordsDialogData.isOpen} onClose={closeRecordsDialog} title={recordsDialogData.title} records={recordsDialogData.records} category={recordsDialogData.category} />
    </div>;
}