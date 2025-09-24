import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Target,
  Award,
  Brain,
  Activity,
  Zap,
  Building,
  LineChart,
  PieChart,
  Database
} from "lucide-react";

export interface SearchResult {
  id: string;
  type: "dashboard" | "visualization" | "insight" | "metric";
  title: string;
  description: string;
  category: string;
  path: string;
  relevance?: number;
  icon: any;
  tags: string[];
  synonyms: string[];
}

export const searchData: SearchResult[] = [
  // Dashboards
  {
    id: "learning-engagement",
    type: "dashboard",
    title: "Learning Engagement",
    description: "Comprehensive dashboard showing learner activity, course completions, and engagement metrics across all programs",
    category: "Learning Analytics",
    path: "/dashboards/learning-engagement",
    icon: Users,
    tags: ["engagement", "learning", "activity", "completion", "participation"],
    synonyms: ["learner engagement", "student activity", "course participation", "learning activity", "user engagement"]
  },
  {
    id: "skill-insights",
    type: "dashboard", 
    title: "Skill Insights",
    description: "Track skill development, gaps analysis, and competency progression across teams and individuals",
    category: "Skills Analytics",
    path: "/dashboards/skill-insights",
    icon: Brain,
    tags: ["skills", "competencies", "gaps", "development", "progress"],
    synonyms: ["skill analysis", "competency tracking", "skill gaps", "talent development", "capabilities"]
  },
  {
    id: "content-performance",
    type: "dashboard",
    title: "Content Performance",
    description: "Analyze content usage, ratings, completion rates, and effectiveness across all learning materials",
    category: "Content Analytics", 
    path: "/dashboards/content-performance",
    icon: BookOpen,
    tags: ["content", "performance", "ratings", "usage", "effectiveness"],
    synonyms: ["course performance", "material effectiveness", "content analytics", "learning materials", "curriculum analysis"]
  },
  {
    id: "career-development",
    type: "dashboard",
    title: "Career Development",
    description: "Monitor internal mobility readiness, certification progress, and career pathway advancement",
    category: "Career Analytics",
    path: "/dashboards/career-development", 
    icon: Award,
    tags: ["career", "development", "mobility", "certifications", "pathways"],
    synonyms: ["career progression", "professional development", "advancement", "career paths", "internal mobility"]
  },
  {
    id: "engagement-overview",
    type: "dashboard",
    title: "Engagement Overview", 
    description: "High-level view of learner engagement patterns, satisfaction scores, and interaction trends",
    category: "Overview",
    path: "/dashboards/engagement-overview",
    icon: Activity,
    tags: ["overview", "engagement", "satisfaction", "trends", "patterns"],
    synonyms: ["engagement summary", "learner overview", "engagement dashboard", "interaction overview"]
  },
  
  // Analytics Pages
  {
    id: "strategic-overview",
    type: "dashboard",
    title: "Strategic Overview",
    description: "Executive-level insights into learning ROI, strategic initiatives, and organizational impact",
    category: "Strategic",
    path: "/overview/strategic",
    icon: Target,
    tags: ["strategic", "executive", "roi", "impact", "initiatives"],
    synonyms: ["executive dashboard", "strategic analysis", "leadership insights", "organizational impact"]
  },
  {
    id: "skill-tracker",
    type: "dashboard", 
    title: "Skill Tracker",
    description: "Detailed skill progression tracking with competency mapping and development recommendations",
    category: "Skills Analysis",
    path: "/analysis/skill-tracker",
    icon: TrendingUp,
    tags: ["skills", "tracking", "progression", "competency", "development"],
    synonyms: ["skill monitoring", "competency tracker", "skill development", "talent tracker"]
  },
  {
    id: "skills-adoption", 
    type: "dashboard",
    title: "Skills Adoption",
    description: "Track adoption rates of new skills and competencies across different departments and roles",
    category: "Skills",
    path: "/skills/adoption", 
    icon: Zap,
    tags: ["adoption", "skills", "departments", "roles", "uptake"],
    synonyms: ["skill uptake", "competency adoption", "skill implementation", "new skills"]
  },

  // Metrics & Visualizations
  {
    id: "completion-rates",
    type: "metric",
    title: "Course Completion Rates",
    description: "Track completion percentages across courses, programs, and learning paths",
    category: "Learning Metrics",
    path: "/metrics",
    icon: PieChart,
    tags: ["completion", "rates", "courses", "programs", "progress"],
    synonyms: ["finish rates", "course completion", "program completion", "learning completion"]
  },
  {
    id: "skill-gaps",
    type: "insight",
    title: "Skill Gap Analysis", 
    description: "Identify critical skill gaps and recommend targeted learning interventions",
    category: "Skills Insights",
    path: "/analyses",
    icon: Target,
    tags: ["gaps", "analysis", "skills", "interventions", "recommendations"],
    synonyms: ["skill shortages", "competency gaps", "missing skills", "skill deficits"]
  },
  {
    id: "engagement-trends",
    type: "visualization",
    title: "Engagement Trends",
    description: "Visual representation of engagement patterns over time with predictive insights",
    category: "Engagement Analytics",
    path: "/dashboards/learning-engagement",
    icon: LineChart,
    tags: ["trends", "engagement", "patterns", "time", "predictions"],
    synonyms: ["engagement patterns", "activity trends", "participation trends", "user trends"]
  },
  {
    id: "learning-impact",
    type: "insight",
    title: "Learning Impact Measurement",
    description: "Measure the business impact and ROI of learning programs and initiatives",
    category: "Impact Analysis", 
    path: "/analyses",
    icon: TrendingUp,
    tags: ["impact", "roi", "measurement", "business", "programs"],
    synonyms: ["learning roi", "training impact", "program effectiveness", "business results"]
  }
];

// AI-powered similarity matching function
export function calculateSimilarity(query: string, result: SearchResult): number {
  const queryLower = query.toLowerCase().trim();
  const words = queryLower.split(/\s+/).filter(word => word.length > 1);
  
  if (words.length === 0) return 0;
  
  let score = 0;
  const maxScore = 95;
  
  // Exact title match gets highest score
  if (result.title.toLowerCase() === queryLower) {
    return maxScore;
  }
  
  // Title contains exact query
  if (result.title.toLowerCase().includes(queryLower)) {
    score += 30;
  }
  
  // Individual word matching in title (higher weight)
  words.forEach(word => {
    if (result.title.toLowerCase().includes(word)) {
      score += 20;
    }
  });
  
  // Description matching  
  if (result.description.toLowerCase().includes(queryLower)) {
    score += 15;
  }
  
  words.forEach(word => {
    if (result.description.toLowerCase().includes(word)) {
      score += 8;
    }
  });
  
  // Tag matching with higher weight
  result.tags.forEach(tag => {
    if (tag.toLowerCase() === queryLower) {
      score += 25;
    }
    if (tag.toLowerCase().includes(queryLower)) {
      score += 15;
    }
    words.forEach(word => {
      if (tag.toLowerCase().includes(word)) {
        score += 12;
      }
    });
  });
  
  // Synonym matching (handles typos and alternative terms)
  result.synonyms.forEach(synonym => {
    if (synonym.toLowerCase() === queryLower) {
      score += 25;
    }
    if (synonym.toLowerCase().includes(queryLower)) {
      score += 18;
    }
    words.forEach(word => {
      if (synonym.toLowerCase().includes(word)) {
        score += 15;
      }
    });
  });
  
  // Category matching
  if (result.category.toLowerCase().includes(queryLower)) {
    score += 12;
  }
  
  words.forEach(word => {
    if (result.category.toLowerCase().includes(word)) {
      score += 8;
    }
  });
  
  // Boost based on type relevance (prioritize dashboards)
  const typeBoosts = {
    dashboard: 10,
    metric: 5, 
    visualization: 4,
    insight: 4
  };
  score += typeBoosts[result.type] || 0;
  
  return Math.min(score, maxScore);
}

export function searchWithAI(query: string, limit: number = 10): SearchResult[] {
  if (!query.trim() || query.trim().length < 2) return [];
  
  const results = searchData.map(item => ({
    ...item,
    relevance: calculateSimilarity(query, item)
  }));
  
  // Filter results with relevance > 10 for better matching
  return results
    .filter(item => item.relevance > 10)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

export const recentSearches = [
  "skill gaps engineering team",
  "learning completion rates", 
  "content performance Q3",
  "leadership development trends",
  "career progression analytics"
];

export const suggestedQueries = [
  { query: "engagement trends", icon: TrendingUp, category: "Analytics" },
  { query: "skill gaps analysis", icon: Target, category: "Skills" },
  { query: "completion rates by department", icon: BarChart3, category: "Metrics" },
  { query: "content satisfaction scores", icon: BookOpen, category: "Content" },
  { query: "career development pathways", icon: Award, category: "Career" },
  { query: "learning impact measurement", icon: Activity, category: "Impact" }
];