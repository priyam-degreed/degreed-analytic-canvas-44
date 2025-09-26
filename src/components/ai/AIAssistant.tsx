import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
  MoreVertical,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber, formatPercentage, formatRating, formatChartValue } from "@/lib/formatters";
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
  type: "column" | "bar" | "line" | "pie" | "heatmap" | "treemap";
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

// Enhanced NLP sample queries based on the business questions
const sampleQueries = [
  "Which part of the organization has the highest and lowest completion rate on assigned learning?",
  "What's driving the completion rate on assigned learning?",
  "How many learning assignments are past due?",
  "Are users developing skills that are endorsed?",
  "How are users developing their skills?",
  "Which category of learning has the highest completion rate?",
  "Which learning provider has gained the most user satisfaction?",
  "Show completion rate by Org Unit for last 90 days",
  "What are the top 5 skills trending for 6 months period?",
  "Show learning engagement by job role over time"
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
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [visualizationToSave, setVisualizationToSave] = useState<VisualizationData | null>(null);
  const [visualizationName, setVisualizationName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle close - clear conversation and reset state
  const handleClose = () => {
    setChatMessages([]);
    setQuery("");
    setIsTyping(false);
    setIsMinimized(false);
    setShowSuggestions(false);
    onClose();
  };

  // Handle reset - clear conversation and start new chat
  const handleReset = () => {
    setChatMessages([]);
    setQuery("");
    setIsTyping(false);
    setShowSuggestions(false);
    // Re-initialize with welcome message
    setTimeout(() => {
      setChatMessages([{
        id: '1',
        type: 'assistant',
        content: 'Hi there,\n\nHow can I help you?',
        timestamp: new Date()
      }]);
    }, 100);
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

  // Enhanced NLP parsing and data model mapping
  const parseNLQuery = (queryText: string) => {
    const lowerQuery = queryText.toLowerCase();
    
    // Data model mapping from NLP objectives
    const dataModel = {
      facts: {
        'assignments completed': 'assignmentsCompleted',
        'assignments assigned': 'assignmentsAssigned', 
        'assignments past due': 'assignmentsPastDue',
        'completion rate': 'completionRate',
        'endorsed skill events': 'endorsedSkillEvents',
        'skill development events': 'skillDevelopmentEvents',
        'endorsed skill %': 'endorsedSkillPercent',
        'satisfaction score': 'satisfactionScore',
        'avg satisfaction': 'avgSatisfaction'
      },
      attributes: {
        'org unit': 'orgUnit',
        'organization': 'orgUnit',
        'role': 'role',
        'job role': 'role',
        'region': 'region',
        'provider': 'provider',
        'category': 'category',
        'skill': 'skill',
        'development method': 'developmentMethod',
        'assignment status': 'assignmentStatus',
        'time': 'time'
      }
    };
    
    return { lowerQuery, dataModel };
  };

  const generateVisualization = (queryText: string): VisualizationData | null => {
    const { lowerQuery, dataModel } = parseNLQuery(queryText);
    
    // Primary NLP questions from business requirements
    
    // 1. "Which part of the organization has the highest and lowest completion rate on assigned learning?"
    if ((lowerQuery.includes("organization") || lowerQuery.includes("org")) && 
        lowerQuery.includes("completion rate") && 
        (lowerQuery.includes("highest") || lowerQuery.includes("lowest"))) {
      return {
        id: `viz-${Date.now()}`,
        type: "bar",
        title: "Learning Completion Rate by Organization Unit",
        metrics: ["Completion Rate %", "Assignments Completed", "Total Assignments"],
        attributes: ["Organization Unit", "Job Role Category"],
        filters: ["Assigned Learning", "All Org Units", "Last 90 Days"],
        data: [
          { name: "Product Design", rate: 89.2, completed: 125, assigned: 140, employees: 45, avgTime: "3.2 weeks" },
          { name: "Engineering", rate: 76.4, completed: 267, assigned: 349, employees: 156, avgTime: "4.1 weeks" },
          { name: "Marketing", rate: 72.8, completed: 91, assigned: 125, employees: 38, avgTime: "2.8 weeks" },
          { name: "Data Science", rate: 68.5, completed: 87, assigned: 127, employees: 41, avgTime: "5.2 weeks" },
          { name: "Sales", rate: 64.2, completed: 108, assigned: 168, employees: 62, avgTime: "3.9 weeks" },
          { name: "IT Operations", rate: 58.7, completed: 76, assigned: 129, employees: 34, avgTime: "6.1 weeks" },
          { name: "HR", rate: 54.3, completed: 43, assigned: 79, employees: 28, avgTime: "4.7 weeks" },
          { name: "Finance", rate: 47.2, completed: 59, assigned: 125, employees: 45, avgTime: "7.3 weeks" }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // 2. "What's driving the completion rate on assigned learning?"
    if (lowerQuery.includes("driving") && lowerQuery.includes("completion rate")) {
      return {
        id: `viz-${Date.now()}`,
        type: "heatmap",
        title: "Key Drivers of Learning Completion Rate",
        metrics: ["Correlation Score", "Impact Magnitude", "Frequency"],
        attributes: ["Driver Category", "Impact Direction"],
        filters: ["All Learning Types", "Statistical Significance > 95%"],
        data: [
          { name: "Manager Support", impact: 92.4, frequency: 2847, correlation: 0.78, type: "positive", description: "Strong manager engagement" },
          { name: "Video-Based Content", impact: 84.7, frequency: 1934, correlation: 0.71, type: "positive", description: "Interactive video format" },
          { name: "Clear Deadlines", impact: 79.3, frequency: 2341, correlation: 0.65, type: "positive", description: "Specific due dates" },
          { name: "Bite-sized Modules", impact: 76.8, frequency: 1567, correlation: 0.62, type: "positive", description: "15-30 min sessions" },
          { name: "Mobile Accessibility", impact: 73.2, frequency: 1243, correlation: 0.58, type: "positive", description: "Mobile-friendly content" },
          { name: "Text-Heavy Content", impact: -67.4, frequency: 892, correlation: -0.54, type: "negative", description: "Document-based learning" },
          { name: "Long Sessions", impact: -59.8, frequency: 567, correlation: -0.48, type: "negative", description: ">2 hour sessions" },
          { name: "No Reminders", impact: -71.2, frequency: 743, correlation: -0.61, type: "negative", description: "Lack of notifications" }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // 3. "How many learning assignments are past due?"
    if (lowerQuery.includes("past due") || (lowerQuery.includes("assignments") && lowerQuery.includes("due"))) {
      return {
        id: `viz-${Date.now()}`,
        type: "line",
        title: "Past Due Learning Assignments - 12 Month Trend",
        metrics: ["Past Due Count", "Total Assignments", "Past Due Rate %"],
        attributes: ["Month", "Assignment Status"],
        filters: ["Past Due Status", "All Departments", "12 Month View"],
        data: [
          { name: "Oct 2023", month: "Oct 2023", value: 287, total: 3421, percentage: 8.4, newAssignments: 425 },
          { name: "Nov 2023", month: "Nov 2023", value: 245, total: 3298, percentage: 7.4, newAssignments: 398 },
          { name: "Dec 2023", month: "Dec 2023", value: 198, total: 2987, percentage: 6.6, newAssignments: 287 },
          { name: "Jan 2024", month: "Jan 2024", value: 234, total: 3567, percentage: 6.6, newAssignments: 456 },
          { name: "Feb 2024", month: "Feb 2024", value: 189, total: 3234, percentage: 5.8, newAssignments: 398 },  
          { name: "Mar 2024", month: "Mar 2024", value: 267, total: 3789, percentage: 7.0, newAssignments: 523 },
          { name: "Apr 2024", month: "Apr 2024", value: 198, total: 3456, percentage: 5.7, newAssignments: 467 },
          { name: "May 2024", month: "May 2024", value: 312, total: 4012, percentage: 7.8, newAssignments: 601 },
          { name: "Jun 2024", month: "Jun 2024", value: 278, total: 3876, percentage: 7.2, newAssignments: 543 },
          { name: "Jul 2024", month: "Jul 2024", value: 245, total: 3654, percentage: 6.7, newAssignments: 489 },
          { name: "Aug 2024", month: "Aug 2024", value: 289, total: 3923, percentage: 7.4, newAssignments: 578 },
          { name: "Sep 2024", month: "Sep 2024", value: 198, total: 3567, percentage: 5.5, newAssignments: 445 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // 4. "Are users developing skills that are endorsed?"
    if ((lowerQuery.includes("skills") && lowerQuery.includes("endorsed")) || 
        lowerQuery.includes("endorsed skill")) {
      return {
        id: `viz-${Date.now()}`,
        type: "column",
        title: "Skills Development vs Endorsement Analysis",
        metrics: ["Endorsement Rate %", "Development Events", "Endorsed Events"],
        attributes: ["Skill Category", "Development Method"],
        filters: ["Active Skills", "All Users", "Current Quarter"],
        data: [
          { name: "Communication", rate: 84.6, events: 1247, endorsed: 1055, category: "Soft Skills", endorsers: 324 },
          { name: "Leadership", rate: 81.2, events: 892, endorsed: 724, category: "Management", endorsers: 267 },
          { name: "AI/ML", rate: 78.4, events: 1567, endorsed: 1228, category: "Technical", endorsers: 412 },
          { name: "Data Analytics", rate: 75.8, events: 1134, endorsed: 859, category: "Technical", endorsers: 298 },
          { name: "Cloud Computing", rate: 72.3, events: 1021, endorsed: 738, category: "Technical", endorsers: 245 },
          { name: "Project Management", rate: 69.7, events: 743, endorsed: 518, category: "Management", endorsers: 189 },
          { name: "UX Design", rate: 66.4, events: 567, endorsed: 376, category: "Creative", endorsers: 134 },
          { name: "Cybersecurity", rate: 63.8, events: 456, endorsed: 291, category: "Technical", endorsers: 98 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // 5. "How are users developing their skills?"  
    if (lowerQuery.includes("how") && lowerQuery.includes("developing") && lowerQuery.includes("skills")) {
      return {
        id: `viz-${Date.now()}`,
        type: "pie",
        title: "Skill Development Methods - Current Distribution", 
        metrics: ["Usage Count", "Percentage of Total", "Avg Completion Rate"],
        attributes: ["Development Method", "Content Format"],
        filters: ["Active Development", "All Skills", "Past 6 Months"],
        data: [
          { name: "Online Courses", value: 3247, percentage: 45.2, completion: 78.4, avgDuration: "2.4 weeks" },
          { name: "Learning Paths", value: 2156, percentage: 30.0, completion: 82.1, avgDuration: "6.1 weeks" },
          { name: "Hands-on Projects", value: 892, percentage: 12.4, completion: 89.7, avgDuration: "4.2 weeks" },
          { name: "Mentoring Sessions", value: 534, percentage: 7.4, completion: 94.1, avgDuration: "8.3 weeks" },
          { name: "Workshops", value: 267, percentage: 3.7, completion: 87.3, avgDuration: "0.5 weeks" },  
          { name: "Peer Learning", value: 93, percentage: 1.3, completion: 91.2, avgDuration: "3.1 weeks" }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // 6. "Which category of learning has the highest completion rate?"
    if (lowerQuery.includes("category") && lowerQuery.includes("completion rate") && lowerQuery.includes("highest")) {
      return {
        id: `viz-${Date.now()}`,
        type: "column",
        title: "Learning Completion Rate by Category - Performance Ranking",
        metrics: ["Completion Rate %", "Total Enrollments", "Successful Completions"],
        attributes: ["Learning Category", "Content Provider"],
        filters: ["All Categories", "Active Learning", "Min 100 Enrollments"],
        data: [
          { name: "Leadership & Management", rate: 91.3, enrollments: 1247, completions: 1138, avgRating: 4.6, providers: 8 },
          { name: "Professional Skills", rate: 87.9, enrollments: 2341, completions: 2057, avgRating: 4.4, providers: 12 },
          { name: "Technical Skills", rate: 84.7, enrollments: 3156, completions: 2673, avgRating: 4.3, providers: 15 },
          { name: "Communication", rate: 82.1, enrollments: 892, completions: 732, avgRating: 4.5, providers: 6 },
          { name: "Digital Literacy", rate: 79.4, enrollments: 1567, completions: 1244, avgRating: 4.2, providers: 9 },
          { name: "Data & Analytics", rate: 76.3, enrollments: 1876, completions: 1431, avgRating: 4.1, providers: 7 },
          { name: "Sales & Marketing", rate: 73.8, enrollments: 743, completions: 548, avgRating: 4.0, providers: 5 },
          { name: "Compliance", rate: 68.5, enrollments: 1234, completions: 845, avgRating: 3.8, providers: 4 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // 7. "Which learning provider has gained the most user satisfaction?"
    if (lowerQuery.includes("provider") && lowerQuery.includes("satisfaction")) {
      return {
        id: `viz-${Date.now()}`,
        type: "bar",
        title: "Learning Provider Satisfaction - Trending Performance",
        metrics: ["Current Rating", "Review Count", "Rating Change"],
        attributes: ["Learning Provider", "Content Categories"],
        filters: ["Active Providers", "Min 100 Reviews", "Past 12 Months"],
        data: [
          { name: "LinkedIn Learning", rate: 4.73, reviews: 2847, change: 0.34, trend: "up", categories: 12, completions: 89.2 },
          { name: "Pluralsight", rate: 4.68, reviews: 1934, change: 0.41, trend: "up", categories: 8, completions: 85.7 },
          { name: "Coursera", rate: 4.52, reviews: 3421, change: 0.18, trend: "up", categories: 15, completions: 78.3 },
          { name: "Udemy Business", rate: 4.31, reviews: 2156, change: 0.07, trend: "up", categories: 20, completions: 72.1 },
          { name: "SuccessFactors", rate: 4.19, reviews: 1567, change: -0.08, trend: "down", categories: 6, completions: 76.8 },
          { name: "Internal Training", rate: 3.94, reviews: 892, change: 0.03, trend: "stable", categories: 4, completions: 81.4 },
          { name: "MindTools", rate: 3.87, reviews: 534, change: -0.12, trend: "down", categories: 3, completions: 69.3 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // Enhanced existing queries with better data and structure
    
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
        type: "pie",
        title: "Top Skills Distribution - 6 Month Analysis",
        metrics: ["New Learner Count", "Growth Percentage", "Market Demand"],
        attributes: ["Skill Category", "Trend Direction", "Industry Relevance"],
        filters: ["Past 6 months", "Trending Skills", "Growth > 50%"],
        data: [
          { name: "Generative AI", value: 3247, percentage: 42.8, growth: 158, demandScore: 9.2 },
          { name: "Cloud Security", value: 2109, percentage: 27.8, growth: 134, demandScore: 8.7 },
          { name: "DevOps Tools", value: 1456, percentage: 19.2, growth: 112, demandScore: 8.3 },
          { name: "Data Analytics", value: 567, percentage: 7.5, growth: 98, demandScore: 7.9 },
          { name: "Product Strategy", value: 203, percentage: 2.7, growth: 87, demandScore: 7.2 }
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
        filters: ["Engineering Job Role", "Market Analysis 2024"],
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
        title: "Leadership Development Distribution",
        metrics: ["Learner Count", "Progress %", "Program Type"],
        attributes: ["Leadership Track", "Job Role", "Seniority Level"],
        filters: ["Active Leadership Programs", "All Departments"],
        data: [
          { name: "Emerging Leaders", value: 428, percentage: 54.8, progress: 72, departments: 8 },
          { name: "Team Leads", value: 189, percentage: 24.2, progress: 85, departments: 6 },
          { name: "Senior Managers", value: 98, percentage: 12.5, progress: 63, departments: 5 },
          { name: "Executive Track", value: 47, percentage: 6.0, progress: 41, departments: 3 },
          { name: "Cross-Functional", value: 19, percentage: 2.4, progress: 89, departments: 4 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    // Learning engagement by job role over time
    if (lowerQuery.includes("engagement") && (lowerQuery.includes("job role") || lowerQuery.includes("time"))) {
      return {
        id: `viz-${Date.now()}`,
        type: "line",
        title: "Learning Engagement by Job Role - 6 Month Trend",
        metrics: ["Engagement Score (%)", "Active Learners", "Course Completions"],
        attributes: ["Job Role", "Month", "Engagement Rate"],
        filters: ["All Job Roles", "Past 6 months"],
        data: [
          { 
            month: "Apr 2024", 
            name: "Apr",
            engagement: 76,
            jobRoles: "8 job roles"
          },
          { 
            month: "May 2024", 
            name: "May",
            engagement: 79,
            jobRoles: "8 job roles"
          },
          { 
            month: "Jun 2024", 
            name: "Jun",
            engagement: 82,
            jobRoles: "8 job roles"
          },
          { 
            month: "Jul 2024", 
            name: "Jul",
            engagement: 85,
            jobRoles: "8 job roles"
          },
          { 
            month: "Aug 2024", 
            name: "Aug",
            engagement: 88,
            jobRoles: "8 job roles"
          },
          { 
            month: "Sep 2024", 
            name: "Sep",
            engagement: 91,
            jobRoles: "8 job roles"
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
    const { lowerQuery } = parseNLQuery(queryText);
    
    // Enhanced NLP responses for business questions
    
    // 1. Organization completion rate analysis
    if ((lowerQuery.includes("organization") || lowerQuery.includes("org")) && 
        lowerQuery.includes("completion rate")) {
      return "Analyzing completion rates across organizational units...\n\nHere's a bar chart showing Completion Rate for Assigned Learning by Org Unit.\n\nKey findings:\n• **Highest**: Associate UI Engineers (100% completion rate)\n• **Strong performers**: Web Designers (60.7%), Civil Engineers (57.9%)\n• **Needs attention**: Database Administrators (33.3% completion rate)\n• **Recommendation**: Focus improvement efforts on IT Operations and Analytics units\n\nThe data shows significant variation across roles, suggesting targeted interventions may be needed.";
    }
    
    // 2. Completion rate drivers analysis  
    if (lowerQuery.includes("driving") && lowerQuery.includes("completion rate")) {
      return "Analyzing key drivers of learning completion rates...\n\nHere's a breakdown showing what impacts completion rates most.\n\n**Positive drivers:**\n• Assignment status 'Completed' (+85% impact)\n• Video-based learning content (+72% impact) \n• SuccessFactors as provider (+68% impact)\n• Assigned recommendations (+65% impact)\n\n**Negative drivers:**\n• Pending assignment status (-43% impact)\n• Course-type content (-38% impact)\n• Dismissed assignments (-52% impact)\n\n**Recommendation**: Prioritize video content and ensure clear assignment workflows to maximize completion rates.";
    }
    
    // 3. Past due assignments tracking
    if (lowerQuery.includes("past due") || (lowerQuery.includes("assignments") && lowerQuery.includes("due"))) {
      return "Tracking past due learning assignments over time...\n\nHere's a line chart showing Past Due Learning Assignments Trend.\n\n**Current status:**\n• **198 assignments** currently past due (September 2024)\n• **6.1%** of total assignments are past due\n• **Improvement**: Down from 8.1% peak in May 2024\n\n**Trends:**\n• Peak overdue period was May 2024 (312 assignments, 8.1%)\n• Recent improvement shows better assignment management\n• Average past due rate: 7.0% over 12 months\n\n**Recommendation**: Continue current intervention strategies that reduced past due rates since May.";
    }
    
    // 4. Endorsed skills development
    if (lowerQuery.includes("endorsed skill")) {
      return "Analyzing endorsed skills development patterns...\n\nHere's a column chart showing Endorsed Skills Development Analysis.\n\n**Performance by category:**\n• **Communication** leads with 82.1% endorsement rate\n• **AI/ML skills** show strong endorsement at 78.4%\n• **Data Analytics** maintains solid 71.8% rate\n• **Project Management** needs attention at 58.9%\n\n**Total activity**: 5,604 skill development events with 4,026 endorsed\n**Overall endorsement rate**: 71.8%\n\n**Recommendation**: Focus improvement efforts on Project Management skill development to increase endorsement rates.";
    }
    
    // 5. Skill development methods
    if (lowerQuery.includes("how") && lowerQuery.includes("developing") && lowerQuery.includes("skills")) {
      return "Analyzing how users are developing their skills...\n\nHere's a pie chart showing Skill Development Methods Distribution.\n\n**Most popular methods:**\n• **Online Courses** (42.1% of activity, 2,847 users)\n• **Learning Paths** (28.6% of activity, 1,934 users)\n• **Projects** (13.2% of activity, 892 users)\n\n**Highest completion rates:**\n• Mentoring: 94.1% completion\n• Coaching: 91.2% completion  \n• Workshops: 87.3% completion\n\n**Insight**: While online courses are most popular, personalized methods like mentoring and coaching show highest completion rates.\n\n**Recommendation**: Balance scale (online courses) with high-impact personal development methods.";
    }
    
    // 6. Learning category completion rates
    if (lowerQuery.includes("category") && lowerQuery.includes("completion rate") && lowerQuery.includes("highest")) {
      return "Comparing completion rates across learning categories...\n\nHere's a column chart showing Learning Completion Rate by Category.\n\n**Top performing categories:**\n• **Leadership Skills**: 89.4% completion (1,115/1,247 enrollments)\n• **Technical Skills**: 84.7% completion (1,983/2,341 enrollments) \n• **Communication**: 82.1% completion (732/892 enrollments)\n\n**Categories needing attention:**\n• **Compliance**: 68.5% completion (388/567 enrollments)\n• **Sales & Marketing**: 71.2% completion (529/743 enrollments)\n\n**Recommendation**: Apply successful strategies from Leadership and Technical categories to improve Compliance and Sales training completion rates.";
    }
    
    // 7. Provider satisfaction analysis
    if (lowerQuery.includes("provider") && lowerQuery.includes("satisfaction")) {
      return "Analyzing learning provider satisfaction trends...\n\nHere's a bar chart showing Learning Provider Satisfaction Scores.\n\n**Top performing providers:**\n• **LinkedIn Learning**: 4.7/5 rating (+0.3 improvement, 1,247 reviews)\n• **Pluralsight**: 4.4/5 rating (+0.4 improvement, 743 reviews)\n• **Coursera**: 4.5/5 rating (+0.2 improvement, 2,341 reviews)\n\n**Declining satisfaction:**\n• **SuccessFactors**: 4.2/5 rating (-0.1 decline, 892 reviews)\n• **Internal Training**: 3.9/5 rating (stable, 567 reviews)\n\n**Recommendation**: LinkedIn Learning and Pluralsight show strongest satisfaction gains. Consider expanding partnerships with top-performing providers.";
    }
    
    // Enhanced existing responses
    
    // Search dashboards / learning engagement dashboards
    if (lowerQuery.includes("dashboard") && lowerQuery.includes("engagement")) {
      return "Searching available learning engagement dashboards...\n\nHere's a column chart showing Learning Engagement Dashboard Overview.\n\nAvailable dashboards:\n• Content Performance leads with 91% engagement score\n• Skills Analytics shows strong usage (1,247 active users)\n• Team Progress dashboard has highest completion rate (84%)\n• 5 dashboards available with comprehensive learning metrics";
    }
    
    if (lowerQuery.includes("top") && lowerQuery.includes("skill") && lowerQuery.includes("month")) {
      return "Analyzing trending skills over the past 6 months...\n\nHere's a pie chart showing the Top 5 Trending Skills Distribution.\n\nKey insights:\n• Generative AI dominates with 42.8% of new learners (3,247 people)\n• Cloud Security captures 27.8% market share (2,109 learners)\n• DevOps Tools growing rapidly at 19.2% (1,456 learners)\n• Data Analytics and Product Strategy round out top 5\n• Clear concentration in AI/Cloud technologies driving learning trends";
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
    
    if (lowerQuery.includes("engagement") && (lowerQuery.includes("job role") || lowerQuery.includes("time"))) {
      return "Creating new visualization...\n\nHere's a line chart showing Learning Engagement by Job Role Over Time.\n\nPositive trends identified:\n• All job roles show consistent improvement\n• HR leads with 95% engagement score\n• Engineering shows strongest growth (78% to 94%)\n• 6-month average improvement: 16 percentage points";
    }
    
    if (lowerQuery.includes("satisfaction") || (lowerQuery.includes("content") && lowerQuery.includes("score"))) {
      return "Analyzing content satisfaction score distribution...\n\nHere's a pie chart showing Content Satisfaction Score Distribution.\n\n**Performance breakdown:**\n• **Excellent content** (4.5-5.0 stars): 41.2% of all reviews (1,456 reviews)\n• **Good content** (4.0-4.4 stars): 33.6% distribution (1,187 reviews)\n• **Average content** (3.5-3.9 stars): 17.9% of content (634 reviews)\n• **Poor content** (<3.5 stars): Only 7.3% combined\n\n**Insight**: Over 74% of content achieves good to excellent satisfaction ratings, indicating strong content quality across the platform.";
    }
    
    return "I can help you analyze learning data, create visualizations, and provide insights about skills, content performance, and learner engagement. What specific aspect would you like to explore?";
  };

  // Enhanced suggestions based on chart type and context
  const getSuggestions = (queryText: string): string[] => {
    const { lowerQuery } = parseNLQuery(queryText);
    
    // Context-aware suggestions based on query type
    if (lowerQuery.includes("completion rate")) {
      return [
        "Break down by region",
        "Filter to last 90 days", 
        "Add time comparison vs previous quarter",
        "Switch to heatmap view",
        "Show by provider",
        "Save as 'Completion Rate Analysis'"
      ];
    }
    
    if (lowerQuery.includes("past due")) {
      return [
        "Filter to Region = APAC",
        "Add assignment status breakdown",
        
        "Compare with previous year",
        "Show by learning category",
        "Save as 'Past Due Tracking'"
      ];
    }
    
    if (lowerQuery.includes("endorsed skill")) {
      return [
        "Break down by org unit",
        "Filter to technical skills only",
        "Switch to treemap",
        "Add development method filter", 
        "Show skill progression timeline",
        "Save as 'Skills Endorsement Analysis'"
      ];
    }
    
    if (lowerQuery.includes("satisfaction")) {
      return [
        "Filter to Providers = Coursera, Udemy",
        "Add 95% confidence intervals",
        "Switch to scatter plot",
        "Compare satisfaction vs completion rate",
        "Show by content category",
        "Save as 'Provider Satisfaction Review'"
      ];
    }
    
    // Default context-aware suggestions
    const contextSuggestions = [
      "Switch to treemap",
      "Break down by org unit", 
      "Add time comparison",
      "Filter by region",
      "Show by category",
      "Switch to heatmap",
      "Add previous period comparison",
      "Filter to top performers only",
      "Save this insight",
      "Analyse this data further"
    ];
    
    // Return 3-4 most relevant suggestions
    return contextSuggestions.slice(0, Math.floor(Math.random() * 2) + 3);
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

  // Enhanced chart type switching with more options
  const handleChartTypeSwitch = (messageId: string, newType: "column" | "bar" | "line" | "pie" | "heatmap" | "treemap") => {
    setChatMessages(prev => prev.map(message => {
      if (message.id === messageId && message.visualization) {
        let updatedData = message.visualization.data;
        const title = message.visualization.title.toLowerCase();
        
        // Generate contextual data for pie charts based on query type
        if (newType === "pie") {
          if (title.includes("completion rate") && title.includes("organization")) {
            // Pie chart for completion rate by org segments
            updatedData = [
              { name: "High Performers", value: 35.2, percentage: 35.2, orgs: 8, avgRate: 89.4 },
              { name: "Good Performers", value: 28.7, percentage: 28.7, orgs: 12, avgRate: 76.8 },
              { name: "Average Performers", value: 22.1, percentage: 22.1, orgs: 15, avgRate: 63.2 },
              { name: "Need Improvement", value: 14.0, percentage: 14.0, orgs: 9, avgRate: 48.6 }
            ];
          } else if (title.includes("past due")) {
            // Pie chart for past due by status
            updatedData = [
              { name: "1-7 days overdue", value: 45.2, percentage: 45.2, count: 89, total: 198 },
              { name: "8-30 days overdue", value: 32.8, percentage: 32.8, count: 65, total: 198 },
              { name: "31-60 days overdue", value: 15.7, percentage: 15.7, count: 31, total: 198 },
              { name: "60+ days overdue", value: 6.3, percentage: 6.3, count: 13, total: 198 }
            ];
          } else if (title.includes("satisfaction") || title.includes("provider")) {
            // Pie chart for satisfaction distribution
            updatedData = [
              { name: "Highly Satisfied (4.5-5.0)", value: 42.3, percentage: 42.3, count: 2847, providers: 4 },
              { name: "Satisfied (4.0-4.4)", value: 31.7, percentage: 31.7, count: 2134, providers: 3 },
              { name: "Neutral (3.5-3.9)", value: 18.4, percentage: 18.4, count: 1238, providers: 2 },
              { name: "Dissatisfied (3.0-3.4)", value: 7.6, percentage: 7.6, count: 512, providers: 1 }
            ];
          } else if (title.includes("endorsed") || title.includes("skills")) {
            // Pie chart for skill endorsement categories
            updatedData = [
              { name: "Technical Skills", value: 38.4, percentage: 38.4, events: 1547, endorsed: 1228 },
              { name: "Soft Skills", value: 26.2, percentage: 26.2, events: 1056, endorsed: 894 },
              { name: "Leadership Skills", value: 19.7, percentage: 19.7, events: 794, endorsed: 659 },
              { name: "Domain Expertise", value: 15.7, percentage: 15.7, events: 632, endorsed: 521 }
            ];
          } else {
            // Default pie chart data
            updatedData = message.visualization.data.slice(0, 6);
          }
        } else if (newType === "heatmap") {
          // Generate heatmap data for any chart type
          if (title.includes("completion rate")) {
            updatedData = [
              { name: "Manager Support", impact: 92.4, type: "positive", correlation: 0.78, frequency: 2847 },
              { name: "Clear Deadlines", impact: 84.7, type: "positive", correlation: 0.71, frequency: 1934 },
              { name: "Video Content", impact: 79.3, type: "positive", correlation: 0.65, frequency: 2341 },
              { name: "Mobile Access", impact: 73.2, type: "positive", correlation: 0.58, frequency: 1567 },
              { name: "Text-Heavy Content", impact: -67.4, type: "negative", correlation: -0.54, frequency: 892 },
              { name: "Long Sessions", impact: -59.8, type: "negative", correlation: -0.48, frequency: 567 }
            ];
          } else {
            updatedData = message.visualization.data.map((item, idx) => ({
              ...item,
              impact: (item.value || item.rate || 50) + (Math.random() * 20 - 10),
              type: idx < 3 ? "positive" : "negative",
              correlation: (Math.random() * 0.6) + 0.2,
              frequency: Math.floor(Math.random() * 2000) + 500
            }));
          }
        }
        
        return {
          ...message,
          visualization: {
            ...message.visualization,
            type: newType,
            title: newType === "pie" ? 
              message.visualization.title.replace(/Column Chart|Line Chart|Bar Chart|Analysis|Trend/gi, "Distribution") :
              newType === "line" ? 
              message.visualization.title.replace(/Bar Chart|Column Chart|Pie Chart|Analysis/gi, "Trend Analysis") :
              newType === "heatmap" ?
              message.visualization.title.replace(/Chart|Analysis|Distribution/gi, "Impact Analysis") :
              newType === "treemap" ?
              message.visualization.title.replace(/Chart|Analysis/gi, "Hierarchy View") :
              message.visualization.title,
            data: updatedData
          }
        };
      }
      return message;
    }));
  };

  const handleShowTrend = (messageId: string) => {
    setChatMessages(prev => prev.map(message => {
      if (message.id === messageId && message.visualization) {
        // Generate contextual trend data based on the original query/title
        const title = message.visualization.title.toLowerCase();
        let trendData;
        
        if (title.includes("completion rate") && title.includes("organization")) {
          // Org completion rate trend
          trendData = [
            { month: "Apr", name: "Apr", value: 67.2, total: 3456, completed: 2322 },
            { month: "May", name: "May", value: 71.8, total: 3678, completed: 2641 },
            { month: "Jun", name: "Jun", value: 69.4, total: 3523, completed: 2445 },
            { month: "Jul", name: "Jul", value: 74.1, total: 3789, completed: 2808 },
            { month: "Aug", name: "Aug", value: 76.8, total: 3912, completed: 3005 },
            { month: "Sep", name: "Sep", value: 79.2, total: 4021, completed: 3185 }
          ];
        } else if (title.includes("past due") || title.includes("due")) {
          // Past due assignments trend  
          trendData = [
            { month: "Apr", name: "Apr", value: 234, rate: 6.8, total: 3456 },
            { month: "May", name: "May", value: 298, rate: 8.1, total: 3678 },
            { month: "Jun", name: "Jun", value: 267, rate: 7.6, total: 3523 },
            { month: "Jul", name: "Jul", value: 189, rate: 5.0, total: 3789 },
            { month: "Aug", name: "Aug", value: 156, rate: 4.0, total: 3912 },
            { month: "Sep", name: "Sep", value: 198, rate: 4.9, total: 4021 }
          ];
        } else if (title.includes("satisfaction") || title.includes("provider")) {
          // Provider satisfaction trend
          trendData = [
            { month: "Apr", name: "Apr", value: 4.12, reviews: 1234, providers: 8 },
            { month: "May", name: "May", value: 4.18, reviews: 1356, providers: 8 },
            { month: "Jun", name: "Jun", value: 4.23, reviews: 1445, providers: 9 },
            { month: "Jul", name: "Jul", value: 4.31, reviews: 1523, providers: 9 },
            { month: "Aug", name: "Aug", value: 4.38, reviews: 1634, providers: 10 },
            { month: "Sep", name: "Sep", value: 4.45, reviews: 1756, providers: 10 }
          ];
        } else if (title.includes("endorsed") || title.includes("skills")) {
          // Skills endorsement trend
          trendData = [
            { month: "Apr", name: "Apr", value: 68.4, events: 934, endorsed: 639 },
            { month: "May", name: "May", value: 70.2, events: 1067, endorsed: 749 },
            { month: "Jun", name: "Jun", value: 72.8, events: 1189, endorsed: 865 },
            { month: "Jul", name: "Jul", value: 75.1, events: 1278, endorsed: 960 },
            { month: "Aug", name: "Aug", value: 77.3, events: 1345, endorsed: 1040 },
            { month: "Sep", name: "Sep", value: 79.6, events: 1423, endorsed: 1133 }
          ];
        } else if (title.includes("engagement")) {
          // Learning engagement trend
          trendData = [
            { month: "Apr", name: "Apr", value: 76.2, active: 2847, sessions: 15680 },
            { month: "May", name: "May", value: 79.4, active: 2934, sessions: 16234 },
            { month: "Jun", name: "Jun", value: 82.1, active: 3021, sessions: 17456 },
            { month: "Jul", name: "Jul", value: 85.3, active: 3189, sessions: 18672 },
            { month: "Aug", name: "Aug", value: 88.7, active: 3267, sessions: 19834 },
            { month: "Sep", name: "Sep", value: 91.2, active: 3345, sessions: 21045 }
          ];
        } else {
          // Default generic trend
          trendData = [
            { month: "Apr", name: "Apr", value: 65.0, metric: 1234 },
            { month: "May", name: "May", value: 68.4, metric: 1345 },
            { month: "Jun", name: "Jun", value: 71.2, metric: 1456 },
            { month: "Jul", name: "Jul", value: 74.8, metric: 1567 },
            { month: "Aug", name: "Aug", value: 78.1, metric: 1678 },
            { month: "Sep", name: "Sep", value: 82.3, metric: 1789 }
          ];
        }
        
        return {
          ...message,
          visualization: {
            ...message.visualization,
            type: "line",
            title: message.visualization.title + " - 6 Month Trend",
            data: trendData,
            metrics: ["Trend Value", "Growth Direction", "Period Analysis"]
          }
        };
      }
      return message;
    }));
  };

  const handleJobRoleBreakdown = (messageId: string) => {
    setChatMessages(prev => prev.map(message => {
      if (message.id === messageId && message.visualization) {
        // Generate contextual job role data based on the original query/title
        const title = message.visualization.title.toLowerCase();
        let roleData;
        
        if (title.includes("completion rate") && title.includes("organization")) {
          // Job role completion rates for learning assignments
          roleData = [
            { name: "Senior Engineers", rate: 92.4, value: 92.4, completed: 165, assigned: 178, avgTime: "2.1 weeks" },
            { name: "Product Managers", rate: 88.7, value: 88.7, completed: 134, assigned: 151, avgTime: "2.8 weeks" },
            { name: "Data Scientists", rate: 85.3, value: 85.3, completed: 97, assigned: 113, avgTime: "3.2 weeks" },
            { name: "UX Designers", rate: 82.1, value: 82.1, completed: 89, assigned: 108, avgTime: "2.4 weeks" },
            { name: "Marketing Specialists", rate: 78.9, value: 78.9, completed: 126, assigned: 160, avgTime: "3.6 weeks" },
            { name: "Sales Representatives", rate: 74.2, value: 74.2, completed: 98, assigned: 132, avgTime: "4.1 weeks" },
            { name: "HR Coordinators", rate: 69.8, value: 69.8, completed: 67, assigned: 96, avgTime: "4.8 weeks" },
            { name: "Finance Analysts", rate: 65.4, value: 65.4, completed: 78, assigned: 119, avgTime: "5.2 weeks" }
          ];
        } else if (title.includes("past due") || title.includes("due")) {
          // Job role past due assignments breakdown
          roleData = [
            { name: "Finance Analysts", value: 47, rate: 47, pastDue: 47, total: 119, percentage: 39.5 },
            { name: "HR Coordinators", value: 34, rate: 34, pastDue: 34, total: 96, percentage: 35.4 },
            { name: "Sales Representatives", value: 28, rate: 28, pastDue: 28, total: 132, percentage: 21.2 },
            { name: "Marketing Specialists", value: 23, rate: 23, pastDue: 23, total: 160, percentage: 14.4 },
            { name: "UX Designers", value: 19, rate: 19, pastDue: 19, total: 108, percentage: 17.6 },
            { name: "Data Scientists", value: 16, rate: 16, pastDue: 16, total: 113, percentage: 14.2 },
            { name: "Product Managers", value: 12, rate: 12, pastDue: 12, total: 151, percentage: 7.9 },
            { name: "Senior Engineers", value: 8, rate: 8, pastDue: 8, total: 178, percentage: 4.5 }
          ];
        } else if (title.includes("satisfaction") || title.includes("provider")) {
          // Job role satisfaction with learning providers
          roleData = [
            { name: "Data Scientists", value: 4.67, rate: 4.67, rating: 4.67, reviews: 234, providers: 8 },
            { name: "Senior Engineers", value: 4.52, rate: 4.52, rating: 4.52, reviews: 298, providers: 6 },
            { name: "Product Managers", value: 4.41, rate: 4.41, rating: 4.41, reviews: 189, providers: 7 },
            { name: "UX Designers", value: 4.33, rate: 4.33, rating: 4.33, reviews: 156, providers: 5 },
            { name: "Marketing Specialists", value: 4.18, rate: 4.18, rating: 4.18, reviews: 167, providers: 6 },
            { name: "Sales Representatives", value: 3.94, rate: 3.94, rating: 3.94, reviews: 134, providers: 4 },
            { name: "HR Coordinators", value: 3.87, rate: 3.87, rating: 3.87, reviews: 98, providers: 4 },
            { name: "Finance Analysts", value: 3.72, rate: 3.72, rating: 3.72, reviews: 89, providers: 3 }
          ];
        } else if (title.includes("endorsed") || title.includes("skills")) {
          // Job role skill endorsement rates
          roleData = [
            { name: "Senior Engineers", value: 89.4, rate: 89.4, events: 456, endorsed: 408, topSkill: "System Design" },
            { name: "Data Scientists", value: 86.7, rate: 86.7, events: 398, endorsed: 345, topSkill: "Machine Learning" },
            { name: "Product Managers", value: 82.3, rate: 82.3, events: 278, endorsed: 229, topSkill: "Strategy" },
            { name: "UX Designers", value: 78.9, rate: 78.9, events: 189, endorsed: 149, topSkill: "Design Systems" },
            { name: "Marketing Specialists", value: 74.2, rate: 74.2, events: 234, endorsed: 174, topSkill: "Digital Marketing" },
            { name: "Sales Representatives", value: 69.8, rate: 69.8, events: 167, endorsed: 117, topSkill: "Negotiation" },
            { name: "Finance Analysts", value: 65.4, rate: 65.4, events: 145, endorsed: 95, topSkill: "Financial Modeling" },
            { name: "HR Coordinators", value: 61.2, rate: 61.2, events: 123, endorsed: 75, topSkill: "People Management" }
          ];
        } else if (title.includes("engagement")) {
          // Job role learning engagement levels
          roleData = [
            { name: "Data Scientists", value: 94.2, rate: 94.2, sessions: 1845, hours: 234, courses: 12 },
            { name: "Senior Engineers", value: 91.8, rate: 91.8, sessions: 2134, hours: 298, courses: 15 },
            { name: "Product Managers", value: 88.4, rate: 88.4, sessions: 1567, hours: 189, courses: 11 },
            { name: "UX Designers", value: 85.7, rate: 85.7, sessions: 1234, hours: 156, courses: 9 },
            { name: "Marketing Specialists", value: 82.1, rate: 82.1, sessions: 1398, hours: 167, courses: 10 },
            { name: "Sales Representatives", value: 78.3, rate: 78.3, sessions: 1087, hours: 134, courses: 8 },
            { name: "Finance Analysts", value: 74.6, rate: 74.6, sessions: 934, hours: 89, courses: 6 },
            { name: "HR Coordinators", value: 71.2, rate: 71.2, sessions: 798, hours: 98, courses: 7 }
          ];
        } else {
          // Default job role breakdown
          roleData = [
            { name: "Engineering", value: 85.2, rate: 85.2, learners: 234, performance: "High" },
            { name: "Product", value: 82.4, rate: 82.4, learners: 156, performance: "High" },
            { name: "Data Science", value: 79.1, rate: 79.1, learners: 189, performance: "Good" },
            { name: "Design", value: 76.8, rate: 76.8, learners: 98, performance: "Good" },
            { name: "Marketing", value: 73.5, rate: 73.5, learners: 167, performance: "Average" },
            { name: "Sales", value: 69.2, rate: 69.2, learners: 143, performance: "Average" },
            { name: "Finance", value: 65.9, rate: 65.9, learners: 87, performance: "Needs Attention" },
            { name: "Operations", value: 62.6, rate: 62.6, learners: 123, performance: "Needs Attention" }
          ];
        }
        
        return {
          ...message,
          visualization: {
            ...message.visualization,
            type: "bar", // Horizontal bar chart for job role breakdown
            title: message.visualization.title.replace(/by Pathway|by Engineering|by Skills|by Organization|by Category/gi, "by Job Role"),
            data: roleData,
            attributes: ["Job Role", "Performance Metric", "Details"],
            filters: [...message.visualization.filters, "Job Role Breakdown"]
          }
        };
      }
      return message;
    }));
  };

  const handleSaveVisualization = (visualization?: VisualizationData) => {
    if (visualization) {
      setVisualizationToSave(visualization);
      setVisualizationName(visualization.title);
      setShowSaveDialog(true);
    }
  };

  const handleConfirmSave = () => {
    toast({
      title: "Visualization Saved",
      description: `"${visualizationName}" has been saved to your dashboard library.`,
    });
    setShowSaveDialog(false);
    setVisualizationToSave(null);
    setVisualizationName("");
  };

  const handleCancelSave = () => {
    setShowSaveDialog(false);
    setVisualizationToSave(null);
    setVisualizationName("");
  };

  const handleOpenInAnalyze = (visualization?: VisualizationData) => {
    if (visualization) {
      // Navigate to dashboard builder with the visualization data
      navigate('/dashboard-builder', {
        state: {
          importedVisualization: {
            id: Date.now(),
            componentType: "visualization",
            name: visualization.title,
            type: visualization.type,
            description: `${visualization.metrics.join(", ")} analysis`,
            config: visualization
          }
        }
      });
      
      toast({
        title: "Opening in Dashboard Builder",
        description: "Redirecting to Dashboard Builder with this visualization.",
      });
    }
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

  // Enhanced chart rendering with more chart types and GoodData-like styling
  const renderChart = (viz: VisualizationData) => {
    const maxValue = Math.max(...viz.data.map(d => Math.max(d.rate || 0, d.gap || 0, d.growth || 0, d.engagement || 0, d.learners/10 || 0, d.value || 0, d.impact || 0)));
    
    // Heatmap for driver analysis
    if (viz.type === "heatmap") {
      return (
        <div className="bg-white border rounded-lg p-4">
          <div className="space-y-3">
            {viz.data.map((item, idx) => {
              const impact = Math.abs(item.impact || item.rate || 50);
              const isPositive = (item.type === "positive") || (item.impact || item.rate || 0) > 0;
              const intensity = Math.min(impact / 100, 1);
              
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-32 sm:w-40 text-xs text-gray-600 text-left flex-shrink-0">
                    <div className="chart-legend break-words overflow-hidden" 
                         style={{ 
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical',
                           lineHeight: '1.2em',
                           maxHeight: '2.4em'
                         }}
                         title={item.name || `Item ${idx + 1}`}>
                      {item.name || `Item ${idx + 1}`}
                    </div>
                  </div>
                  <div className="flex-1 flex items-center min-w-0">
                    <div 
                      className={`h-6 flex items-center justify-center text-xs font-semibold transition-all duration-300 hover:opacity-80 rounded-sm ${
                        isPositive 
                          ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
                          : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                      }`}
                      style={{ 
                        width: `${Math.max(intensity * 160, 20)}px`,
                        opacity: Math.max(intensity, 0.3)
                      }}
                    >
                      <span className="text-xs chart-value">
                        {isPositive ? '+' : ''}{Math.round(item.impact || item.rate || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 text-xs text-gray-500 text-right chart-value">
                    {Math.floor((item.frequency || item.count || Math.random() * 1000 + 100)/100)}k
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-gray-500 flex justify-between chart-legend">
            <span>📈 Positive Impact</span>
            <span>📉 Negative Impact</span>
          </div>
        </div>
      );
    }
    
    
    // Treemap for hierarchical data
    if (viz.type === "treemap") {
      const total = viz.data.reduce((sum, item) => sum + (item.value || item.rate || item.growth || 50), 0);
      
      return (
        <div className="bg-white border rounded-lg p-4">
          <div className="h-48 grid grid-cols-4 grid-rows-3 gap-1">
            {viz.data.slice(0, 12).map((item, idx) => {
              const value = item.value || item.rate || item.growth || 50;
              const percentage = (value / total) * 100;
              const colors = ["bg-purple-500", "bg-blue-500", "bg-cyan-500", "bg-green-500", "bg-yellow-500", "bg-red-500"];
              const name = item.name || `Item ${idx + 1}`;
              const isLarge = idx < 2;
              
              return (
                <div 
                  key={idx}
                  className={`${colors[idx % colors.length]} rounded text-white p-1.5 flex flex-col justify-between transition-all hover:opacity-80 min-h-0`}
                  style={{ 
                    gridRow: isLarge ? 'span 2' : 'span 1',
                    gridColumn: isLarge ? 'span 2' : 'span 1'
                  }}
                >
                  <div className={`font-medium leading-tight break-words ${isLarge ? 'text-xs' : 'text-[10px]'}`}>
                    <div className="overflow-hidden" 
                         style={{ 
                           display: '-webkit-box',
                           WebkitLineClamp: isLarge ? 3 : 2,
                           WebkitBoxOrient: 'vertical',
                           lineHeight: '1.1em',
                           maxHeight: isLarge ? '3.3em' : '2.2em'
                         }}
                         title={name}>
                      {name}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className={`font-bold ${isLarge ? 'text-lg' : 'text-sm'}`}>
                      {Math.round(value)}
                    </div>
                    <div className={`opacity-90 ${isLarge ? 'text-xs' : 'text-[10px]'}`}>
                      {Math.round(percentage)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    if (viz.type === "pie") {
      const total = viz.data.reduce((sum, item) => sum + (item.value || item.rate || item.growth || item.engagement || 50), 0);
      
      return (
        <div className="bg-white border rounded-lg p-4">
          <div className="h-48 flex items-center justify-center relative">
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
                  
                  // Calculate label position (outside the slice)
                  const midAngle = (startAngle + endAngle) / 2;
                  const labelRadius = 52; // Outside the pie
                  const labelX = 50 + labelRadius * Math.cos((midAngle * Math.PI) / 180);
                  const labelY = 50 + labelRadius * Math.sin((midAngle * Math.PI) / 180);
                  
                  return (
                    <g key={idx}>
                      <path
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={colors[idx % colors.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            {viz.data.map((item, idx) => {
              const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
              const percentage = item.percentage || ((item.value || item.rate || item.growth || item.engagement || 50) / total * 100);
              const name = item.name || item.month || `Item ${idx + 1}`;
              return (
                <div key={idx} className="flex items-start gap-2 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-sm shrink-0 mt-0.5"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-600 text-xs leading-tight">
                      <div className="chart-legend break-words overflow-hidden" 
                           style={{ 
                             display: '-webkit-box',
                             WebkitLineClamp: 2,
                             WebkitBoxOrient: 'vertical',
                             lineHeight: '1.2em',
                             maxHeight: '2.4em'
                           }}
                           title={name}>
                        {name}
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs chart-value mt-1">
                      {typeof percentage === 'number' ? percentage.toFixed(1) : percentage}%
                    </div>
                  </div>
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
          <div className="h-56 relative">
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
              </svg>
            </div>
            
            {/* X-axis labels with proper spacing */}
            <div className="flex justify-between items-center px-8 pt-2">
              {viz.data.map((item, idx) => {
                const label = (item.name || item.month || `${idx + 1}`);
                return (
                  <div key={idx} className="text-center min-w-0 flex-1 px-1">
                    <div className="text-xs text-gray-600 font-medium chart-legend break-words overflow-hidden"
                         style={{ 
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical',
                           lineHeight: '1.1em',
                           maxHeight: '2.2em'
                         }}
                         title={label}>
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
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
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-24 sm:w-32 text-xs text-gray-600 text-right shrink-0">
                    <div className="chart-legend break-words overflow-hidden text-right" 
                         style={{ 
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical',
                           lineHeight: '1.2em',
                           maxHeight: '2.4em'
                         }}
                         title={item.name || item.month || `Item ${idx + 1}`}>
                      {(item.name || item.month || `Item ${idx + 1}`)}
                    </div>
                  </div>
                  <div className="flex-1 flex items-center min-w-0">
                    <div 
                      className="h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-r-sm flex items-center justify-end pr-2 text-xs text-white chart-value transition-all duration-300 hover:opacity-80"
                      style={{ width: `${width}px` }}
                    >
                      <span className="text-xs">{formatNumber(value)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    // Default vertical column chart with hover tooltips
    return (
      <div className="bg-white border rounded-lg p-4 relative">
        <div className="h-48 flex items-end justify-around gap-1 relative" id="chart-container">
          {viz.data.map((item, idx) => {
            let value = item.rate || item.gap || item.growth || item.engagement || item.learners/10 || item.value || 50;
            const height = Math.max((value / maxValue) * 160, 12);
            
              return (
                <div 
                  key={idx} 
                  className="flex flex-col items-center flex-1 relative group"
                  style={{ minWidth: '48px', maxWidth: '72px' }}
                  onMouseEnter={(e) => {
                    const tooltip = document.getElementById('tooltip');
                    const tooltipContent = document.getElementById('tooltip-content');
                    
                     if (tooltip && tooltipContent) {
                       const title = viz.title.toLowerCase();
                       let tooltipHtml = `<div class="font-semibold">${item.name}</div>`;
                       
                       if (title.includes("completion rate")) {
                         tooltipHtml += `<div>Completion Rate: ${formatPercentage(item.rate || item.value || 0)}</div>`;
                         tooltipHtml += `<div>Completed: ${formatNumber(item.completed || 0)}</div>`;
                         tooltipHtml += `<div>Total Assigned: ${formatNumber(item.assigned || item.total || 0)}</div>`;
                         if (item.avgTime) tooltipHtml += `<div>Avg Time: ${item.avgTime}</div>`;
                       } else if (title.includes("past due")) {
                         tooltipHtml += `<div>Past Due Count: ${formatNumber(item.value || 0)}</div>`;
                         tooltipHtml += `<div>Past Due Rate: ${formatPercentage(item.rate || item.percentage || 0)}</div>`;
                         tooltipHtml += `<div>Total Assignments: ${formatNumber(item.total || 0)}</div>`;
                       } else if (title.includes("satisfaction") || title.includes("provider")) {
                         tooltipHtml += `<div>Rating: ${formatRating(item.rate || item.value || 0)}</div>`;
                         tooltipHtml += `<div>Reviews: ${formatNumber(item.reviews || 0)}</div>`;
                         tooltipHtml += `<div>Change: ${item.change && item.change > 0 ? '+' : ''}${formatNumber(item.change || 0)}</div>`;
                       } else if (title.includes("endorsed") || title.includes("skills")) {
                         tooltipHtml += `<div>Endorsement Rate: ${formatPercentage(item.rate || item.value || 0)}</div>`;
                         tooltipHtml += `<div>Development Events: ${formatNumber(item.events || 0)}</div>`;
                         tooltipHtml += `<div>Endorsed Events: ${formatNumber(item.endorsed || 0)}</div>`;
                       } else if (title.includes("engagement")) {
                         tooltipHtml += `<div>Engagement Score: ${formatPercentage(item.rate || item.value || 0)}</div>`;
                         tooltipHtml += `<div>Active Users: ${formatNumber(item.users || item.active || 0)}</div>`;
                         tooltipHtml += `<div>Sessions: ${formatNumber(item.sessions || 0)}</div>`;
                       } else {
                         tooltipHtml += `<div>Value: ${formatNumber(item.rate || item.value || 0)}</div>`;
                         tooltipHtml += `<div>Details: ${formatNumber(item.completed || item.learners || item.count || 0)}</div>`;
                       }
                      
                      tooltipContent.innerHTML = tooltipHtml;
                      tooltip.style.opacity = '1';
                      
                      // Position tooltip
                      const rect = e.currentTarget.getBoundingClientRect();
                      const container = document.getElementById('chart-container')?.getBoundingClientRect();
                      if (container) {
                        tooltip.style.left = `${rect.left - container.left + rect.width/2 - 96}px`;
                        tooltip.style.top = `${rect.top - container.top - 10}px`;
                        tooltip.style.transform = 'translateY(-100%)';
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.getElementById('tooltip');
                    if (tooltip) tooltip.style.opacity = '0';
                  }}
                >
                  <div 
                    className="rounded-t-sm w-full mb-1 flex items-end justify-center text-xs text-white font-semibold transition-all duration-300 hover:opacity-90 hover:scale-105 bg-gradient-to-r from-purple-500 to-purple-600 cursor-pointer"
                    style={{ height: `${height}px` }}
                  >
                    <span className="text-xs mb-1">{formatNumber(value)}</span>
                  </div>
                  <div className="text-xs text-center text-gray-600 leading-tight px-1 w-full mt-1">
                    <div className="chart-legend break-words overflow-hidden" 
                         style={{ 
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical',
                           lineHeight: '1.1em',
                           maxHeight: '2.2em',
                           wordBreak: 'break-word'
                         }}
                         title={item.name || item.month || `Item ${idx + 1}`}>
                      {(item.name || item.month || `Item ${idx + 1}`)}
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
        
        {/* Tooltip */}
        <div id="tooltip" className="absolute bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none opacity-0 transition-opacity duration-200 z-10 min-w-48">
          <div id="tooltip-content"></div>
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
                      onClick={() => handleSaveVisualization(viz)}
                    >
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-sm"
                      onClick={() => handleOpenInAnalyze(viz)}
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

          {/* Enhanced Chart Controls - GoodData-like interactions */}
          {viz.canModify && (
            <div className="space-y-3">
              {/* Chart Type Switcher */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => handleChartTypeSwitch(message.id, viz.type === "column" ? "bar" : "column")}
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  {viz.type === "column" ? "Switch to bar" : "Switch to column"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => handleChartTypeSwitch(message.id, viz.type === "line" ? "pie" : "line")}
                >
                  {viz.type === "line" ? <PieChart className="h-3 w-3 mr-1" /> : <LineChart className="h-3 w-3 mr-1" />}
                  {viz.type === "line" ? "Pie chart" : "Line chart"}
                </Button>
              </div>
              
              {/* Slice & Breakdown Actions */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => handleJobRoleBreakdown(message.id)}
                >
                  <Users className="h-3 w-3 mr-1" />
                  Break down by job role
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => handleShowTrend(message.id)}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Show trend
                </Button>
              </div>
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
        onClick={handleClose}
      />
      
      {/* Modal - Centered when open, bottom-right when minimized */}
      <div 
        className={cn(
          "fixed bg-white rounded-xl shadow-2xl border z-50 transition-all duration-300 overflow-hidden",
          isMinimized 
            ? "bottom-6 right-6 w-80 h-16" 
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[650px] max-w-[90vw] max-h-[90vh]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold">AI Analytics Assistant</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={handleReset}
              title="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
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

      {/* Save Visualization Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-left text-foreground">Name your Visualisation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Give your new visualization a new descriptive name, so it's easier to find it later on.
            </p>
            <div className="space-y-2">
              <Label htmlFor="viz-name" className="text-foreground text-sm font-medium">
                NAME
              </Label>
              <Input
                id="viz-name"
                value={visualizationName}
                onChange={(e) => setVisualizationName(e.target.value)}
                placeholder="Enter visualization name..."
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelSave}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSave}
                disabled={!visualizationName.trim()}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}