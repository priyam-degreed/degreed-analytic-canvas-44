import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Send, 
  Plus,
  X,
  Minimize2,
  Maximize2,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  ThumbsUp,
  ThumbsDown,
  BookmarkPlus,
  ExternalLink,
  Sparkles,
  Clock,
  Filter,
  TrendingUp,
  Users,
  Target,
  Award,
  BookOpen,
  Lightbulb,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateContextualResponse } from "@/data/aiConversations";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  visualization?: VisualizationData;
  suggestions?: string[];
  feedback?: "up" | "down" | null;
}

interface VisualizationData {
  id: string;
  type: "column" | "bar" | "line" | "pie" | "heatmap";
  title: string;
  metrics: string[];
  attributes: string[];
  filters: string[];
  data: any[];
  canModify?: boolean;
  saveOptions?: boolean;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const sampleQueries = [
  "What are the top 5 skills trending for 6 months period?",
  "Which content pathways have the highest completion rates?", 
  "Show me the skill gaps for our engineering team vs market demand",
  "How many learners are preparing for leadership roles?",
  "Show learning engagement by department over time",
  "What content has the highest satisfaction scores?"
];

const quickActions = [
  { icon: Search, label: "Search dashboards", query: "Show me learning engagement dashboards" },
  { icon: Plus, label: "Create visualization", query: "Create a chart showing course completion rates" },
  { icon: TrendingUp, label: "Answer a business question", query: "What is the learning completion rate by Pathway?" }
];

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle close - clear conversation and reset state
  const handleClose = () => {
    setChatMessages([]);
    setQuery("");
    setIsTyping(false);
    setIsMinimized(false);
    setShowSuggestions(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      // Initialize with welcome message
      setChatMessages([{
       id: '1',
       type: 'assistant',
       content: 'Hi there,\n\nHow can I help you?',
       timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const generateVisualization = (queryText: string): VisualizationData | null => {
    const lowerQuery = queryText.toLowerCase();
    
    // Search dashboards / learning engagement dashboards
    if (lowerQuery.includes("dashboard") && lowerQuery.includes("engagement")) {
      return {
        id: `viz-${Date.now()}`,
        type: "column",
        title: "Learning Engagement Dashboard Overview",
        metrics: ["Engagement Score", "Active Users", "Completion Rate"],
        attributes: ["Dashboard Type", "Usage Metrics"],
        filters: ["Active Dashboards", "Past 30 days"],
        data: [
          { name: "Skills Analytics", engagement: 89, users: 1247, completions: 78 },
          { name: "Learning Paths", engagement: 85, users: 2341, completions: 82 },
          { name: "Content Performance", engagement: 91, users: 987, completions: 76 },
          { name: "Team Progress", engagement: 87, users: 1654, completions: 84 },
          { name: "Competency Tracking", engagement: 83, users: 743, completions: 71 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // Top 5 skills trending for 6 months
    if (lowerQuery.includes("top") && lowerQuery.includes("skill") && lowerQuery.includes("month")) {
      return {
        id: `viz-${Date.now()}`,
        type: "column",
        title: "Top 5 Trending Skills - 6 Month Period",
        metrics: ["Growth %", "New Learners"],
        attributes: ["Skill Name", "Trend Period"],
        filters: ["Past 6 months", "Trending Skills"],
        data: [
          { name: "Generative AI", growth: 158, learners: 3247, trend: "up" },
          { name: "Cloud Security", growth: 134, learners: 2891, trend: "up" },
          { name: "DevOps", growth: 112, learners: 2543, trend: "up" },
          { name: "Data Analytics", growth: 98, learners: 2134, trend: "up" },
          { name: "Product Management", growth: 87, learners: 1876, trend: "up" }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // Content pathways completion rates
    if (lowerQuery.includes("completion") && (lowerQuery.includes("rate") || lowerQuery.includes("pathway"))) {
      return {
        id: `viz-${Date.now()}`,
        type: "bar",
        title: "Content Pathways - Completion Rates",
        metrics: ["Completion Rate %", "Total Enrollments"],
        attributes: ["Learning Pathway"],
        filters: ["Active Pathways", "Past 6 months"],
        data: [
          { name: "Digital Marketing Pro", rate: 84, learners: 756, completions: 635 },
          { name: "AI/ML Specialist", rate: 78, learners: 943, completions: 736 },
          { name: "Cloud Architecture", rate: 72, learners: 612, completions: 441 },
          { name: "Data Science Track", rate: 69, learners: 1234, completions: 851 },
          { name: "Software Engineering", rate: 67, learners: 1876, completions: 1257 },
          { name: "Leadership Development", rate: 61, learners: 543, completions: 331 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // Skill gaps for engineering team
    if (lowerQuery.includes("skill") && (lowerQuery.includes("gap") || lowerQuery.includes("engineer"))) {
      return {
        id: `viz-${Date.now()}`,
        type: "bar",
        title: "Engineering Team Skill Gaps vs Market Demand",
        metrics: ["Current Level %", "Market Demand %", "Gap"],
        attributes: ["Technical Skills"],
        filters: ["Engineering Department", "Market Analysis 2024"],
        data: [
          { name: "Kubernetes", current: 35, demand: 85, gap: 50 },
          { name: "Machine Learning", current: 42, demand: 78, gap: 36 },
          { name: "Microservices", current: 58, demand: 82, gap: 24 },
          { name: "Cloud Native", current: 61, demand: 79, gap: 18 },
          { name: "React/Vue", current: 74, demand: 81, gap: 7 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // Learners preparing for leadership roles
    if (lowerQuery.includes("leadership") || lowerQuery.includes("preparing")) {
      return {
        id: `viz-${Date.now()}`,
        type: "pie",
        title: "Learners Preparing for Leadership Roles",
        metrics: ["Learner Count", "Progress %"],
        attributes: ["Leadership Track", "Department"],
        filters: ["Active Leadership Programs"],
        data: [
          { name: "Middle Management", value: 312, progress: 67 },
          { name: "Team Lead Track", value: 189, progress: 78 },
          { name: "Senior Leadership", value: 98, progress: 45 },
          { name: "Executive Preparation", value: 47, progress: 34 },
          { name: "Cross-Functional Lead", value: 134, progress: 72 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // Learning engagement by department over time
    if (lowerQuery.includes("engagement") && (lowerQuery.includes("department") || lowerQuery.includes("time"))) {
      return {
        id: `viz-${Date.now()}`,
        type: "line",
        title: "Learning Engagement by Department - 6 Month Trend",
        metrics: ["Engagement Score (%)", "Active Learners", "Course Completions"],
        attributes: ["Department", "Month", "Engagement Rate"],
        filters: ["All Departments", "Past 6 months"],
        data: [
          { 
            month: "Apr 2024", 
            name: "Apr",
            engagement: 76,
            departments: "8 departments"
          },
          { 
            month: "May 2024", 
            name: "May",
            engagement: 79,
            departments: "8 departments"
          },
          { 
            month: "Jun 2024", 
            name: "Jun",
            engagement: 82,
            departments: "8 departments"
          },
          { 
            month: "Jul 2024", 
            name: "Jul",
            engagement: 85,
            departments: "8 departments"
          },
          { 
            month: "Aug 2024", 
            name: "Aug",
            engagement: 88,
            departments: "8 departments"
          },
          { 
            month: "Sep 2024", 
            name: "Sep",
            engagement: 91,
            departments: "8 departments"
          }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // Content satisfaction scores
    if (lowerQuery.includes("satisfaction") || lowerQuery.includes("content")) {
      return {
        id: `viz-${Date.now()}`,
        type: "column",
        title: "Content with Highest Satisfaction Scores",
        metrics: ["Satisfaction Score", "Review Count"],
        attributes: ["Content Type", "Rating"],
        filters: ["All Content", "Min 50 reviews"],
        data: [
          { name: "AI Ethics Course", rate: 4.8, reviews: 234, completions: 543 },
          { name: "Leadership Workshop", rate: 4.7, reviews: 189, completions: 412 },
          { name: "Data Visualization", rate: 4.6, reviews: 156, completions: 378 },
          { name: "Agile Masterclass", rate: 4.5, reviews: 298, completions: 672 },
          { name: "Cloud Fundamentals", rate: 4.4, reviews: 445, completions: 891 },
          { name: "UX Design Basics", rate: 4.3, reviews: 167, completions: 334 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    return null;
  };

  const generateResponse = (queryText: string): string => {
    const lowerQuery = queryText.toLowerCase();
    
    // Search dashboards / learning engagement dashboards
    if (lowerQuery.includes("dashboard") && lowerQuery.includes("engagement")) {
      return "Searching available learning engagement dashboards...\n\nHere's a column chart showing Learning Engagement Dashboard Overview.\n\nAvailable dashboards:\n• Content Performance leads with 91% engagement score\n• Skills Analytics shows strong usage (1,247 active users)\n• Team Progress dashboard has highest completion rate (84%)\n• 5 dashboards available with comprehensive learning metrics";
    }
    
    if (lowerQuery.includes("top") && lowerQuery.includes("skill") && lowerQuery.includes("month")) {
      return "Analyzing trending skills over the past 6 months...\n\nHere's a column chart showing the Top 5 Trending Skills.\n\nKey insights:\n• Generative AI leads with 158% growth and 3,247 new learners\n• Cloud Security shows strong demand with 134% growth\n• DevOps continues upward trend with 112% growth\n• All top skills show consistent upward trajectory";
    }
    
    if (lowerQuery.includes("completion") && lowerQuery.includes("rate")) {
      return "Creating new visualization...\n\nHere's a bar chart showing Content Pathways with Highest Completion Rates.\n\nKey insights:\n• Digital Marketing Pro pathway leads with 84% completion rate\n• AI/ML Specialist shows strong engagement at 78%\n• Leadership Development has room for improvement at 61%\n• Over 5,000 total learners across all pathways";
    }
    
    if (lowerQuery.includes("skill") && lowerQuery.includes("gap")) {
      return "Analyzing skill gaps for engineering team vs market demand...\n\nHere's a bar chart showing Engineering Team Skill Gaps.\n\nCritical findings:\n• Kubernetes shows the largest gap (50 point deficit)\n• Machine Learning skills need significant development (36 point gap)\n• React/Vue skills are well-aligned with market needs (7 point gap)\n• Recommend targeted training programs for top 3 gap areas";
    }
    
    if (lowerQuery.includes("leadership") || lowerQuery.includes("preparing")) {
      return "Analyzing leadership preparation programs...\n\nHere's a pie chart showing Learners Preparing for Leadership Roles.\n\nCurrent status:\n• 780 total learners actively engaged in leadership tracks\n• Middle Management track has highest enrollment (312 learners)\n• Team Lead track shows best progress at 78% completion\n• Executive preparation programs need additional support";
    }
    
    if (lowerQuery.includes("engagement") && (lowerQuery.includes("department") || lowerQuery.includes("time"))) {
      return "Creating new visualization...\n\nHere's a line chart showing Learning Engagement by Department Over Time.\n\nPositive trends identified:\n• All departments show consistent improvement\n• HR leads with 95% engagement score\n• Engineering shows strongest growth (78% to 94%)\n• 6-month average improvement: 16 percentage points";
    }
    
    if (lowerQuery.includes("satisfaction") || (lowerQuery.includes("content") && lowerQuery.includes("score"))) {
      return "Analyzing content satisfaction scores...\n\nHere's a column chart showing Content with Highest Satisfaction Scores.\n\nTop performing content:\n• AI Ethics Course leads with 4.8/5 rating (234 reviews)\n• Leadership Workshop maintains 4.7/5 score\n• All top content maintains 4.3+ satisfaction rating\n• Strong correlation between satisfaction and completion rates";
    }
    
    return "I can help you analyze learning data, create visualizations, and provide insights about skills, content performance, and learner engagement. What specific aspect would you like to explore?";
  };

  const getSuggestions = (queryText: string): string[] => {
    const lowerQuery = queryText.toLowerCase();
    const allSuggestions = [
      "Switch to a bar chart",
      "Break down by department",
      "Add time filter for last quarter", 
      "Show by learning pathway",
      "Compare with previous period",
      "Export to dashboard",
      "Save this visualization",
      "Drill down by role",
      "Add completion rate metric",
      "Filter by skill category"
    ];
    
    return allSuggestions.slice(0, 3);
  };

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user", 
      content: query,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsTyping(true);
    setShowSuggestions(false);

    // Simulate AI processing with realistic delay
    setTimeout(() => {
      // Use local response generation with specific query matching
      const responseContent = generateResponse(query);
      const visualization = generateVisualization(query);
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "assistant",
        content: responseContent,
        timestamp: new Date(),
        visualization,
        suggestions: visualization ? getSuggestions(query) : []
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (actionQuery: string) => {
    setQuery(actionQuery);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleChartTypeSwitch = (messageId: string, newType: "column" | "bar" | "line" | "pie") => {
    setChatMessages(prev => prev.map(message => {
      if (message.id === messageId && message.visualization) {
        return {
          ...message,
          visualization: {
            ...message.visualization,
            type: newType,
            title: newType === "pie" ? 
              message.visualization.title.replace("Column Chart", "Pie Chart").replace("Line Chart", "Pie Chart").replace("Bar Chart", "Pie Chart") :
              newType === "line" ? 
              message.visualization.title.replace("Bar Chart", "Line Chart").replace("Column Chart", "Line Chart").replace("Pie Chart", "Line Chart") :
              message.visualization.title
          }
        };
      }
      return message;
    }));
  };

  const handleShowTrend = (messageId: string) => {
    setChatMessages(prev => prev.map(message => {
      if (message.id === messageId && message.visualization) {
        const trendData = [
          { month: "Apr", value: 65, trend: "up" },
          { month: "May", value: 72, trend: "up" },
          { month: "Jun", value: 68, trend: "down" },
          { month: "Jul", value: 78, trend: "up" },
          { month: "Aug", value: 82, trend: "up" },
          { month: "Sep", value: 85, trend: "up" }
        ];
        
        return {
          ...message,
          visualization: {
            ...message.visualization,
            type: "line",
            title: message.visualization.title + " - 6 Month Trend",
            data: trendData,
            metrics: ["Trend Value", "Growth Direction"]
          }
        };
      }
      return message;
    }));
  };

  const handleDepartmentBreakdown = (messageId: string) => {
    setChatMessages(prev => prev.map(message => {
      if (message.id === messageId && message.visualization) {
        const deptData = [
          { name: "Engineering", value: 85, learners: 234 },
          { name: "Marketing", value: 78, learners: 156 },
          { name: "Sales", value: 72, learners: 189 },
          { name: "HR", value: 68, learners: 98 },
          { name: "Finance", value: 75, learners: 87 },
          { name: "Operations", value: 71, learners: 143 }
        ];
        
        return {
          ...message,
          visualization: {
            ...message.visualization,
            type: "bar", // Horizontal bar chart for department breakdown
            title: message.visualization.title.replace(/by Pathway|by Engineering|by Skills/gi, "by Department"),
            data: deptData,
            attributes: ["Department", "Learning Progress"],
            filters: [...message.visualization.filters, "Department Breakdown"]
          }
        };
      }
      return message;
    }));
  };

  const handleSaveVisualization = () => {
    toast({
      title: "Visualization Saved",
      description: "Your visualization has been saved to your dashboard library.",
    });
  };

  const handleOpenInAnalyze = () => {
    toast({
      title: "Opening in Analyze",
      description: "Redirecting to Analyze workspace with this visualization.",
    });
  };

  const handleFeedback = (messageId: string, feedbackType: "up" | "down") => {
    setChatMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        return {
          ...message,
          feedback: message.feedback === feedbackType ? null : feedbackType
        };
      }
      return message;
    }));
    
    toast({
      title: "Feedback Received",
      description: "Thank you for your feedback!",
      duration: 3000,
    });
  };

  const renderChart = (viz: VisualizationData) => {
    const maxValue = Math.max(...viz.data.map(d => Math.max(d.rate || 0, d.gap || 0, d.growth || 0, d.engagement || 0, d.learners/10 || 0, d.value || 0)));
    
    if (viz.type === "pie") {
      const total = viz.data.reduce((sum, item) => sum + (item.value || item.rate || item.growth || item.engagement || 50), 0);
      
      return (
        <div className="bg-white border rounded-lg p-4">
          <div className="h-48 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {viz.data.map((item, idx) => {
                  const value = item.value || item.rate || item.growth || item.engagement || 50;
                  const percentage = (value / total) * 100;
                  const angle = (percentage / 100) * 360;
                  const prevAngles = viz.data.slice(0, idx).reduce((sum, prevItem) => {
                    const prevValue = prevItem.value || prevItem.rate || prevItem.growth || prevItem.engagement || 50;
                    return sum + ((prevValue / total) * 360);
                  }, 0);
                  
                  const startAngle = prevAngles;
                  const endAngle = prevAngles + angle;
                  
                  const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                  
                  const largeArc = angle > 180 ? 1 : 0;
                  
                  const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
                  
                  return (
                    <path
                      key={idx}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={colors[idx % colors.length]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {viz.data.map((item, idx) => {
              const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <span className="text-gray-600 truncate">
                    {(item.name || item.month || `Item ${idx + 1}`).substring(0, 10)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    if (viz.type === "line") {
      return (
        <div className="bg-white border rounded-lg p-4">
          <div className="h-48 relative">
            <svg viewBox="0 0 400 160" className="w-full h-full">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: '#10b981', stopOpacity: 0}} />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line 
                  key={i}
                  x1="40" 
                  y1={20 + i * 30} 
                  x2="380" 
                  y2={20 + i * 30}
                  stroke="#f3f4f6" 
                  strokeWidth="1"
                />
              ))}
              
              {/* Line path */}
              <path
                d={viz.data.map((item, idx) => {
                  const x = 60 + idx * (280 / (viz.data.length - 1));
                  const value = item.value || item.trend || item.engagement || item.rate || 50;
                  const y = 140 - ((value / maxValue) * 100);
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                className="drop-shadow-sm"
              />
              
              {/* Area fill */}
              <path
                d={[
                  `M 60 140`,
                  ...viz.data.map((item, idx) => {
                    const x = 60 + idx * (280 / (viz.data.length - 1));
                    const value = item.value || item.trend || item.engagement || item.rate || 50;
                    const y = 140 - ((value / maxValue) * 100);
                    return `L ${x} ${y}`;
                  }),
                  `L ${60 + (viz.data.length - 1) * (280 / (viz.data.length - 1))} 140 Z`
                ].join(' ')}
                fill="url(#lineGradient)"
              />
              
              {/* Data points */}
              {viz.data.map((item, idx) => {
                const x = 60 + idx * (280 / (viz.data.length - 1));
                const value = item.value || item.trend || item.engagement || item.rate || 50;
                const y = 140 - ((value / maxValue) * 100);
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#10b981"
                    stroke="white"
                    strokeWidth="2"
                    className="hover:r-6 transition-all"
                  />
                );
              })}
              
              {/* Labels */}
              {viz.data.map((item, idx) => {
                const x = 60 + idx * (280 / (viz.data.length - 1));
                return (
                  <text
                    key={idx}
                    x={x}
                    y="155"
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {(item.name || item.month || `${idx + 1}`).substring(0, 3)}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      );
    }
    
    // Horizontal bar chart for "bar" type
    if (viz.type === "bar") {
      return (
        <div className="bg-white border rounded-lg p-4">
          <div className="h-48 flex flex-col justify-around gap-1">
            {viz.data.map((item, idx) => {
              let value = item.rate || item.gap || item.growth || item.engagement || item.learners/10 || item.value || 50;
              const width = Math.max((value / maxValue) * 260, 12);
              
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-gray-600 text-right truncate">
                    {(item.name || item.month || `Item ${idx + 1}`).substring(0, 10)}
                  </div>
                  <div className="flex-1 flex items-center">
                    <div 
                      className="h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-r-sm flex items-center justify-end pr-2 text-xs text-white font-medium transition-all duration-300 hover:opacity-80"
                      style={{ width: `${width}px` }}
                    >
                      <span className="text-xs">{Math.round(value)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    // Default vertical column chart  
    return (
      <div className="bg-white border rounded-lg p-4">
        <div className="h-48 flex items-end justify-around gap-1">
          {viz.data.map((item, idx) => {
            let value = item.rate || item.gap || item.growth || item.engagement || item.learners/10 || item.value || 50;
            const height = Math.max((value / maxValue) * 160, 12);
            
            return (
              <div key={idx} className="flex flex-col items-center flex-1 max-w-16">
                <div 
                  className="rounded-t-sm w-full mb-1 flex items-end justify-center text-xs text-white font-medium transition-all duration-300 hover:opacity-80 bg-gradient-to-r from-purple-500 to-purple-600"
                  style={{ height: `${height}px` }}
                >
                  <span className="text-xs mb-1">{Math.round(value)}</span>
                </div>
                <div className="text-xs text-center text-gray-600 leading-tight px-1">
                  {(item.name || item.month || `Item ${idx + 1}`).substring(0, 8)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVisualization = (message: ChatMessage) => {
    if (!message.visualization) return null;
    
    const viz = message.visualization;
    
    return (
      <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        {/* Visualization Header */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Creating new visualization...</span>
        </div>
        
        {/* Chart Details */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-2">{viz.title}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Metrics: {viz.metrics.join(", ")}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Attributes: {viz.attributes.join(", ")}</Badge>  
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Filters: {viz.filters.join(", ")}</Badge>
                </div>
              </div>
            </div>
            
            {/* 3-dot menu for save options */}
            {viz.saveOptions && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-sm"
                      onClick={handleSaveVisualization}
                    >
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-sm"
                      onClick={handleOpenInAnalyze}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Analyse
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Chart Rendering */}
          {renderChart(viz)}

          {/* Chart Controls */}
          {viz.canModify && (
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => handleChartTypeSwitch(message.id, viz.type === "pie" ? "column" : "pie")}
              >
                {viz.type === "pie" ? (
                  <>
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Switch to bar chart
                  </>
                ) : (
                  <>
                    <PieChart className="h-3 w-3 mr-1" />
                    Switch to pie chart
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => handleShowTrend(message.id)}
              >
                <LineChart className="h-3 w-3 mr-1" />
                Show trend
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => handleDepartmentBreakdown(message.id)}
              >
                <Users className="h-3 w-3 mr-1" />
                Break down by department
              </Button>
            </div>
          )}

          {/* Thumbs up/down only */}
          {viz.saveOptions && (
            <div className="flex justify-start items-center pt-2 border-t border-blue-200">
              <div className="flex gap-2">
                <Button 
                  variant={message.feedback === "up" ? "default" : "ghost"} 
                  size="sm" 
                  className={cn(
                    "text-xs h-7",
                    message.feedback === "up" && "bg-green-500 hover:bg-green-600 text-white"
                  )}
                  onClick={() => handleFeedback(message.id, "up")}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button 
                  variant={message.feedback === "down" ? "default" : "ghost"} 
                  size="sm" 
                  className={cn(
                    "text-xs h-7",
                    message.feedback === "down" && "bg-red-500 hover:bg-red-600 text-white"
                  )}
                  onClick={() => handleFeedback(message.id, "down")}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "fixed bottom-6 right-6 w-[480px] bg-white rounded-xl shadow-2xl border z-50 transition-all duration-300 animate-scale-in",
        isMinimized ? "h-16" : "h-[700px]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold">AI Analytics Assistant</span>
              <div className="text-xs text-blue-100">Powered by Degreed Intelligence</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex flex-col h-[calc(100%-64px)]">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.length === 1 && chatMessages[0].type === 'assistant' && (
                <div className="text-center space-y-4 py-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl text-gray-800">Welcome,</h3>
                    <h3 className="font-semibold text-xl text-gray-800">I am your Analytics Assistant</h3>
                  </div>
                  
                  <div className="grid gap-2">
                    {quickActions.map((action, idx) => (
                      <Button 
                        key={idx}
                        variant="outline" 
                        size="sm"
                        className="justify-start h-10 text-sm"
                        onClick={() => handleQuickAction(action.query)}
                      >
                        <action.icon className="h-4 w-4 mr-3" />
                        {action.label}
                      </Button>
                    ))}
                  </div>

                  {/* <div className="pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Answer a business question</p>
                    <div className="space-y-2">
                      {sampleQueries.slice(0, 2).map((sample, idx) => (
                        <button
                          key={idx}
                          className="block w-full text-left p-2 text-xs text-gray-600 hover:bg-gray-50 rounded border border-gray-200 transition-colors"
                          onClick={() => handleQuickAction(sample)}
                        >
                          {sample}
                        </button>
                      ))}
                    </div>
                  </div> */}
                </div>
              )}

              {chatMessages.map((message) => (
                <div key={message.id} className={cn("flex gap-3", message.type === "user" ? "justify-end" : "justify-start")}>
                  {message.type === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={cn("max-w-[85%] space-y-3", message.type === "user" ? "order-2" : "")}>
                    <div className={cn(
                      "p-3 rounded-lg text-sm whitespace-pre-wrap",
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-sm"
                        : "bg-gray-50 border rounded-bl-sm"
                    )}>
                      {message.content}
                    </div>
                    
                    {renderVisualization(message)}
                    
                    {/* {message.suggestions && message.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-medium">Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>
                  
                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center shrink-0 order-1 mt-1">
                      <span className="text-white font-medium text-xs">U</span>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-50 border p-3 rounded-lg rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                    placeholder="Ask here..."
                    className="pr-10"
                  />
                  {query && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-6 w-6 p-0"
                      onClick={() => setQuery("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Button 
                  onClick={handleSendQuery}
                  disabled={!query.trim()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 text-center mt-2">
                All assistants can make mistakes. Check before relying on these answers.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}