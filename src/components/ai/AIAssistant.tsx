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
        title: "Completion Rate for Assigned Learning by Org Unit",
        metrics: ["Completion Rate %", "Assignments Completed", "Assignments Assigned"],
        attributes: ["Org Unit", "Job Role"],
        filters: ["Assigned Learning", "All Org Units", "Current Period"],
        data: [
          { name: "Associate UI Engineer", rate: 100.0, completed: 45, assigned: 45, orgUnit: "Product Design" },
          { name: "Web Designer", rate: 60.7, completed: 17, assigned: 28, orgUnit: "Product Design" },
          { name: "Civil Engineer", rate: 57.9, completed: 22, assigned: 38, orgUnit: "Infrastructure" },
          { name: "Mobile Developer", rate: 55.4, completed: 31, assigned: 56, orgUnit: "Engineering" },
          { name: "Software Engineer", rate: 50.0, completed: 89, assigned: 178, orgUnit: "Engineering" },
          { name: "Content Creator", rate: 47.8, completed: 11, assigned: 23, orgUnit: "Marketing" },
          { name: "Data Analyst", rate: 41.9, completed: 18, assigned: 43, orgUnit: "Analytics" },
          { name: "Database Administrator", rate: 33.3, completed: 12, assigned: 36, orgUnit: "IT Operations" }
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
        title: "Drivers of Learning Completion Rate",
        metrics: ["Impact on Completion Rate", "Frequency", "Correlation"],
        attributes: ["Driver Category", "Impact Type"],
        filters: ["All Learning Items", "Assignment Status", "Recommendation Type"],
        data: [
          { name: "Assignment Status: Completed", impact: 85, frequency: 1247, type: "positive" },
          { name: "Learning Type: Video", impact: 72, frequency: 892, type: "positive" },
          { name: "Provider: SuccessFactors", impact: 68, frequency: 743, type: "positive" },
          { name: "Recommendation: Assigned", impact: 65, frequency: 1543, type: "positive" },
          { name: "Assignment Status: Pending", impact: -43, frequency: 2341, type: "negative" },
          { name: "Learning Type: Course", impact: -38, frequency: 1876, type: "negative" },
          { name: "Assignment Status: Dismissed", impact: -52, frequency: 234, type: "negative" },
          { name: "Learning Type: Pathway", impact: -29, frequency: 567, type: "negative" }
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
        title: "Past Due Learning Assignments Trend",
        metrics: ["Past Due Count", "Total Assignments", "Past Due %"],
        attributes: ["Time Period", "Assignment Status"],
        filters: ["Past Due Status", "12 Month Period"],
        data: [
          { name: "Jan", month: "Jan 2024", value: 234, total: 3421, percentage: 6.8 },
          { name: "Feb", month: "Feb 2024", value: 189, total: 3156, percentage: 6.0 },  
          { name: "Mar", month: "Mar 2024", value: 267, total: 3634, percentage: 7.3 },
          { name: "Apr", month: "Apr 2024", value: 198, total: 3298, percentage: 6.0 },
          { name: "May", month: "May 2024", value: 312, total: 3876, percentage: 8.1 },
          { name: "Jun", month: "Jun 2024", value: 278, total: 3567, percentage: 7.8 },
          { name: "Jul", month: "Jul 2024", value: 245, total: 3421, percentage: 7.2 },
          { name: "Aug", month: "Aug 2024", value: 289, total: 3698, percentage: 7.8 },
          { name: "Sep", month: "Sep 2024", value: 198, total: 3234, percentage: 6.1 }
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
        title: "Endorsed Skills Development Analysis",
        metrics: ["Endorsed Skill %", "Skill Development Events", "Endorsed Events"],
        attributes: ["Skill Category", "Development Method"],
        filters: ["Active Skills", "All Users", "Current Quarter"],
        data: [
          { name: "AI/ML", rate: 78.4, events: 1247, endorsed: 978, category: "Technical" },
          { name: "Leadership", rate: 65.2, events: 892, endorsed: 582, category: "Soft Skills" },
          { name: "Data Analytics", rate: 71.8, events: 1134, endorsed: 814, category: "Technical" },
          { name: "Project Management", rate: 58.9, events: 567, endorsed: 334, category: "Management" },
          { name: "Communication", rate: 82.1, events: 743, endorsed: 610, category: "Soft Skills" },
          { name: "Cloud Computing", rate: 69.3, events: 1021, endorsed: 708, category: "Technical" }
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
        title: "Skill Development Methods Distribution", 
        metrics: ["Usage Count", "% of Total", "Completion Rate"],
        attributes: ["Development Method", "Skill Category"],
        filters: ["Active Development", "All Skills"],
        data: [
          { name: "Online Courses", value: 2847, percentage: 42.1, completion: 78.4 },
          { name: "Learning Paths", value: 1934, percentage: 28.6, completion: 82.1 },
          { name: "Projects", value: 892, percentage: 13.2, completion: 65.7 },
          { name: "Coaching", value: 567, percentage: 8.4, completion: 91.2 },
          { name: "Workshops", value: 312, percentage: 4.6, completion: 87.3 },  
          { name: "Mentoring", value: 213, percentage: 3.1, completion: 94.1 }
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
        title: "Learning Completion Rate by Category",
        metrics: ["Completion Rate %", "Total Enrollments", "Completions"],
        attributes: ["Learning Category", "Provider"],
        filters: ["All Categories", "Active Learning"],
        data: [
          { name: "Leadership Skills", rate: 89.4, enrollments: 1247, completions: 1115 },
          { name: "Technical Skills", rate: 84.7, enrollments: 2341, completions: 1983 },
          { name: "Communication", rate: 82.1, enrollments: 892, completions: 732 },
          { name: "Project Management", rate: 78.9, enrollments: 1134, completions: 895 },
          { name: "Data & Analytics", rate: 76.3, enrollments: 1876, completions: 1431 },
          { name: "Sales & Marketing", rate: 71.2, enrollments: 743, completions: 529 },
          { name: "Compliance", rate: 68.5, enrollments: 567, completions: 388 }
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
        title: "Learning Provider Satisfaction Scores",
        metrics: ["Avg Satisfaction", "Review Count", "Satisfaction Change"],
        attributes: ["Learning Provider", "Content Type"],
        filters: ["Active Providers", "Min 50 reviews"],
        data: [
          { name: "LinkedIn Learning", rate: 4.7, reviews: 1247, change: 0.3, trend: "up" },
          { name: "Coursera", rate: 4.5, reviews: 2341, change: 0.2, trend: "up" },
          { name: "Udemy", rate: 4.3, reviews: 1876, change: 0.1, trend: "up" },
          { name: "SuccessFactors", rate: 4.2, reviews: 892, change: -0.1, trend: "down" },
          { name: "Pluralsight", rate: 4.4, reviews: 743, change: 0.4, trend: "up" },
          { name: "Internal Training", rate: 3.9, reviews: 567, change: 0.0, trend: "stable" }
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
        title: "Learners Preparing for Leadership Roles",
        metrics: ["Learner Count", "Progress %"],
        attributes: ["Leadership Track", "Job Role"],
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
    
    if (lowerQuery.includes("engagement") && (lowerQuery.includes("job role") || lowerQuery.includes("time"))) {
      return "Creating new visualization...\n\nHere's a line chart showing Learning Engagement by Job Role Over Time.\n\nPositive trends identified:\n• All job roles show consistent improvement\n• HR leads with 95% engagement score\n• Engineering shows strongest growth (78% to 94%)\n• 6-month average improvement: 16 percentage points";
    }
    
    if (lowerQuery.includes("satisfaction") || (lowerQuery.includes("content") && lowerQuery.includes("score"))) {
      return "Analyzing content satisfaction scores...\n\nHere's a column chart showing Content with Highest Satisfaction Scores.\n\nTop performing content:\n• AI Ethics Course leads with 4.8/5 rating (234 reviews)\n• Leadership Workshop maintains 4.7/5 score\n• All top content maintains 4.3+ satisfaction rating\n• Strong correlation between satisfaction and completion rates";
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
        return {
          ...message,
          visualization: {
            ...message.visualization,
            type: newType,
            title: newType === "pie" ? 
              message.visualization.title.replace(/Column Chart|Line Chart|Bar Chart|Analysis|Trend/gi, "Pie Chart") :
              newType === "line" ? 
              message.visualization.title.replace(/Bar Chart|Column Chart|Pie Chart|Analysis/gi, "Line Chart") :
              newType === "heatmap" ?
              message.visualization.title.replace(/Chart|Analysis/gi, "Heatmap") :
              newType === "treemap" ?
              message.visualization.title.replace(/Chart|Analysis/gi, "Treemap") :
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

  const handleJobRoleBreakdown = (messageId: string) => {
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
            type: "bar", // Horizontal bar chart for job role breakdown
            title: message.visualization.title.replace(/by Pathway|by Engineering|by Skills/gi, "by Job Role"),
            data: deptData,
            attributes: ["Job Role", "Learning Progress"],
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
          <div className="space-y-2">
            {viz.data.map((item, idx) => {
              const impact = Math.abs(item.impact || item.rate || 50);
              const isPositive = (item.type === "positive") || (item.impact || item.rate || 0) > 0;
              const intensity = Math.min(impact / 100, 1);
              
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-48 text-xs text-gray-600 text-left truncate">
                    {item.name || `Item ${idx + 1}`}
                  </div>
                  <div className="flex-1 flex items-center">
                    <div 
                      className={`h-6 flex items-center justify-center text-xs font-medium transition-all duration-300 hover:opacity-80 ${
                        isPositive 
                          ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
                          : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                      }`}
                      style={{ 
                        width: `${Math.max(intensity * 200, 20)}px`,
                        opacity: Math.max(intensity, 0.3)
                      }}
                    >
                      {isPositive ? '+' : ''}{Math.round(item.impact || item.rate || 0)}
                    </div>
                  </div>
                  <div className="w-16 text-xs text-gray-500 text-right">
                    {item.frequency || item.count || Math.round(Math.random() * 1000 + 100)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-gray-500 flex justify-between">
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
              
              return (
                <div 
                  key={idx}
                  className={`${colors[idx % colors.length]} rounded text-white p-2 flex flex-col justify-between transition-all hover:opacity-80`}
                  style={{ 
                    gridRow: idx < 2 ? 'span 2' : 'span 1',
                    gridColumn: idx < 2 ? 'span 2' : 'span 1'
                  }}
                >
                  <div className="text-xs font-medium leading-tight">
                    {(item.name || `Item ${idx + 1}`).substring(0, 12)}
                  </div>
                  <div className="text-lg font-bold">{Math.round(value)}</div>
                  <div className="text-xs opacity-90">{Math.round(percentage)}%</div>
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
      
      {/* Modal - Centered on screen */}
      <div 
        className={cn(
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-xl shadow-2xl border z-50 transition-all duration-200",
          isMinimized ? "h-16" : "h-[700px]"
        )}
        style={{ 
          bottom: '24px', 
          right: '88px', // Positioned to the left of sticky icon
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
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