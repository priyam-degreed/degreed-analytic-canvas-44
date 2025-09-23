// Comprehensive LXP Mock Data for Degreed Analytics Platform

// Learning Engagement Data
export const learningEngagementData = {
  totalLearners: 15420,
  activeUsersThisWeek: 8934,
  courseCompletions: {
    thisQuarter: 3847,
    lastQuarter: 2985,
    change: 28.9
  },
  learningHours: {
    total: 12847,
    thisMonth: 2045,
    avgPerLearner: 4.2
  },
  engagementTrends: [
    { date: "2024-07", completions: 892, hours: 3420, activeUsers: 7234 },
    { date: "2024-08", completions: 1045, hours: 3890, activeUsers: 7892 },
    { date: "2024-09", completions: 1234, hours: 4201, activeUsers: 8934 }
  ],
  contentModalities: [
    { type: "Articles", usage: 4521, completionRate: 78, avgRating: 4.2 },
    { type: "Videos", usage: 3892, completionRate: 85, avgRating: 4.5 },
    { type: "Pathways", usage: 2156, completionRate: 67, avgRating: 4.3 },
    { type: "Assessments", usage: 1734, completionRate: 92, avgRating: 3.9 },
    { type: "Podcasts", usage: 1223, completionRate: 74, avgRating: 4.1 }
  ],
  trendingTopics: [
    { topic: "Artificial Intelligence", learners: 2340, growth: 145 },
    { topic: "Cloud Computing", learners: 1987, growth: 89 },
    { topic: "Data Science", learners: 1765, growth: 67 },
    { topic: "Cybersecurity", learners: 1543, growth: 123 },
    { topic: "Agile Methodology", learners: 1432, growth: 56 }
  ]
};

// Learning Overview Data (for backward compatibility)
export const learningOverviewData = {
  completions: {
    current: 381,
    previous: 294,
    change: 87
  },
  completionsByRole: [
    { role: "Developer", current: 111, previous: 108, change: 3 },
    { role: "SDET", current: 136, previous: 69, change: 67 },
    { role: "Unknown", current: 93, previous: 70, change: 23 },
    { role: "Product Manager", current: 21, previous: 18, change: 3 },
    { role: "Data Scientist", current: 18, previous: 15, change: 3 },
    { role: "Data Analyst", current: 12, previous: 9, change: 3 }
  ],
  learningDuration: {
    total: 1521,
    byRole: [
      { role: "Unknown", hours: 558 },
      { role: "SDET", hours: 228 },
      { role: "Developer", hours: 207 },
      { role: "Software Engineer", hours: 120 },
      { role: "Data Scientist", hours: 113 },
      { role: "Accounts Admin", hours: 64.9 },
      { role: "Automatisation", hours: 36.6 },
      { role: "Web Designer", hours: 34 },
      { role: "Data Analyst", hours: 26.2 }
    ]
  }
};

// Engagement Data (for backward compatibility)
export const engagementData = {
  monthlyCompletions: [
    { month: "Sep", completions: 111 },
    { month: "Oct", completions: 108 },
    { month: "Nov", completions: 128 },
    { month: "Dec", completions: 158 },
    { month: "Jan", completions: 160 },
    { month: "Feb", completions: 197 },
    { month: "Mar", completions: 204 },
    { month: "Apr", completions: 232 },
    { month: "May", completions: 240 },
    { month: "Jun", completions: 264 },
    { month: "Jul", completions: 294 },
    { month: "Aug", completions: 381 }
  ],
  skillsDuration: [
    { skill: "Unknown", duration: 1033, change: -778 },
    { skill: "CSS/HTML", duration: 160, change: 160 },
    { skill: "Test Skills", duration: 231, change: -154 },
    { skill: "iOS Mobile Apps", duration: 145, change: 45 },
    { skill: "Quality Assurance", duration: 128, change: 28 },
    { skill: "Communication", duration: 95, change: -25 },
    { skill: "Cloud Computing", duration: 87, change: 87 },
    { skill: "Java Programming", duration: 78, change: 8 }
  ],
  satisfaction: {
    likes: 12,
    dislikes: 9,
    totalRatings: 21
  }
};

// Skills Adoption Data (for backward compatibility)
export const skillsAdoptionData = {
  skillPlanEngagement: [
    { month: "Oct", percentage: 0 },
    { month: "Nov", percentage: 10 },
    { month: "Dec", percentage: 20 },
    { month: "Jan", percentage: 30 },
    { month: "Feb", percentage: 40 },
    { month: "Mar", percentage: 37 },
    { month: "Apr", percentage: 35 },
    { month: "May", percentage: 38 },
    { month: "Jun", percentage: 42 },
    { month: "Jul", percentage: 45 },
    { month: "Aug", percentage: 48 },
    { month: "Sep", percentage: 52 }
  ],
  endorsedSkills: {
    skillPlans: 674,
    totalSkills: 520
  },
  skillFollowing: {
    usersFollowing: 1310,
    totalUsers: 14400,
    focusSkills: 302
  }
};

// Skill Growth & Development Data
export const skillGrowthData = {
  topSkillsGained: [
    { skill: "Python Programming", learners: 1234, averageGrowth: 2.3, marketDemand: 95 },
    { skill: "Machine Learning", learners: 987, averageGrowth: 2.8, marketDemand: 92 },
    { skill: "Cloud Architecture", learners: 876, averageGrowth: 2.1, marketDemand: 88 },
    { skill: "Project Management", learners: 765, averageGrowth: 1.9, marketDemand: 76 },
    { skill: "Data Visualization", learners: 654, averageGrowth: 2.4, marketDemand: 81 }
  ],
  skillAssessments: [
    { month: "Jul", totalAssessments: 892, avgScore: 73.2 },
    { month: "Aug", totalAssessments: 1034, avgScore: 75.8 },
    { month: "Sep", totalAssessments: 1187, avgScore: 77.4 }
  ],
  skillDecayAlerts: [
    { skill: "Java Programming", affectedUsers: 234, lastActivity: "45 days", urgency: "high" },
    { skill: "SQL Database", affectedUsers: 189, lastActivity: "38 days", urgency: "medium" },
    { skill: "React Framework", affectedUsers: 156, lastActivity: "52 days", urgency: "high" }
  ],
  skillGaps: [
    { department: "Engineering", skill: "Kubernetes", current: 23, required: 78, gap: 55 },
    { department: "Data Science", skill: "MLOps", current: 12, required: 45, gap: 33 },
    { department: "Product", skill: "User Research", current: 34, required: 56, gap: 22 },
    { department: "Marketing", skill: "Analytics", current: 18, required: 32, gap: 14 }
  ]
};

// Content Performance Data
export const contentPerformanceData = {
  topPerformingContent: [
    { title: "Introduction to AI Ethics", completions: 2341, rating: 4.8, feedback: 89 },
    { title: "Cloud Security Fundamentals", completions: 1987, rating: 4.6, feedback: 76 },
    { title: "Agile Leadership Pathway", completions: 1756, rating: 4.7, feedback: 82 },
    { title: "Data Science for Beginners", completions: 1543, rating: 4.5, feedback: 71 },
    { title: "Digital Marketing Strategy", completions: 1432, rating: 4.4, feedback: 68 }
  ],
  contentByModality: [
    { modality: "Video Courses", usage: 45.2, satisfaction: 4.5, roi: 3.2 },
    { modality: "Interactive Pathways", usage: 28.7, satisfaction: 4.3, roi: 2.8 },
    { modality: "Articles & Blogs", usage: 15.6, satisfaction: 4.1, roi: 2.1 },
    { modality: "Podcasts", usage: 7.8, satisfaction: 4.2, roi: 1.9 },
    { modality: "Virtual Labs", usage: 2.7, satisfaction: 4.7, roi: 4.1 }
  ],
  learnerFeedback: {
    totalRatings: 15678,
    averageRating: 4.3,
    npsScore: 67,
    feedbackDistribution: {
      "5 stars": 52.3,
      "4 stars": 28.7,
      "3 stars": 12.4,
      "2 stars": 4.2,
      "1 star": 2.4
    }
  }
};

// Career Development Data
export const careerDevelopmentData = {
  internalMobilityReadiness: [
    { role: "Senior Developer", readyCandidates: 45, totalEmployees: 120, readinessPercent: 37.5 },
    { role: "Team Lead", readyCandidates: 23, totalEmployees: 80, readinessPercent: 28.8 },
    { role: "Product Manager", readyCandidates: 18, totalEmployees: 45, readinessPercent: 40.0 },
    { role: "Data Scientist", readyCandidates: 12, totalEmployees: 35, readinessPercent: 34.3 }
  ],
  certificationsAchieved: [
    { certification: "AWS Cloud Practitioner", achievers: 234, value: 4200 },
    { certification: "Scrum Master", achievers: 189, value: 3500 },
    { certification: "Google Analytics", achievers: 156, value: 2800 },
    { certification: "Salesforce Admin", achievers: 134, value: 4800 },
    { certification: "PMP Certification", achievers: 98, value: 6200 }
  ],
  learnerPathways: [
    { pathway: "Software Engineering Career Track", followers: 1234, completionRate: 67 },
    { pathway: "Data Science Professional Path", followers: 987, completionRate: 72 },
    { pathway: "Leadership Development Journey", followers: 876, completionRate: 59 },
    { pathway: "Digital Marketing Specialist", followers: 654, completionRate: 81 },
    { pathway: "Cybersecurity Expert Track", followers: 543, completionRate: 63 }
  ],
  skillProgressionData: [
    { skill: "Leadership", beginner: 45, intermediate: 67, advanced: 23, expert: 8 },
    { skill: "Python", beginner: 123, intermediate: 89, advanced: 45, expert: 12 },
    { skill: "Project Management", beginner: 78, intermediate: 102, advanced: 34, expert: 15 },
    { skill: "Data Analysis", beginner: 89, intermediate: 67, advanced: 28, expert: 9 }
  ]
};

// AI-Generated Insights for LXP
export const aiInsightsData = [
  {
    type: "trend",
    title: "AI Learning Surge Detected",
    description: "145% increase in AI-related content consumption this month. Recommend expanding AI curriculum offerings.",
    confidence: 0.94,
    impact: "high",
    metrics: ["Learning Hours", "Course Completions"],
    affectedUsers: 2340
  },
  {
    type: "skill_gap",
    title: "Critical Kubernetes Skills Gap",
    description: "Engineering team shows 70% gap in Kubernetes expertise vs. market demand. Immediate action recommended.",
    confidence: 0.91,
    impact: "high",
    metrics: ["Skill Assessments", "Job Market Data"],
    affectedUsers: 234
  },
  {
    type: "engagement",
    title: "Video Content Outperforming",
    description: "Video-based learning shows 23% higher completion rates and 15% better satisfaction scores than other formats.",
    confidence: 0.88,
    impact: "medium",
    metrics: ["Completion Rates", "User Satisfaction"],
    affectedUsers: 8934
  },
  {
    type: "career_development",
    title: "Leadership Pipeline Strong",
    description: "40% of product managers are ready for senior roles, indicating healthy internal mobility prospects.",
    confidence: 0.89,
    impact: "high",
    metrics: ["Skill Assessments", "Career Readiness"],
    affectedUsers: 18
  },
  {
    type: "anomaly",
    title: "Unusual Podcast Engagement",
    description: "Cybersecurity podcasts showing 340% engagement spike - investigate for content optimization opportunities.",
    confidence: 0.76,
    impact: "medium",
    metrics: ["Content Engagement", "Time Spent"],
    affectedUsers: 456
  },
  {
    type: "prediction",
    title: "Q4 Learning Forecast",
    description: "Based on current trends, expect 4,200+ course completions next quarter (+15% vs Q3).",
    confidence: 0.82,
    impact: "medium",
    metrics: ["Historical Trends", "Seasonal Patterns"],
    affectedUsers: 15420
  }
];

// Strategic Overview Data (Enhanced)
export const strategicOverviewData = {
  topSkills: [
    { name: "Leadership", users: 182, selfRating: 4.2, marketDemand: 89 },
    { name: "Data Visualization", users: 171, selfRating: 3.8, marketDemand: 76 },
    { name: "Project Management", users: 158, selfRating: 4.1, marketDemand: 82 },
    { name: "Business Intelligence", users: 147, selfRating: 3.9, marketDemand: 71 },
    { name: "Python Programming", users: 134, selfRating: 4.3, marketDemand: 95 },
    { name: "Data Analytics", users: 109, selfRating: 4.0, marketDemand: 88 },
    { name: "Innovation", users: 105, selfRating: 3.7, marketDemand: 65 },
    { name: "Java", users: 103, selfRating: 4.1, marketDemand: 78 },
    { name: "Business Analysis", users: 97, selfRating: 3.9, marketDemand: 73 },
    { name: "Big Data Analysis", users: 89, selfRating: 3.8, marketDemand: 91 }
  ],
  expertSkills: [
    { name: "Product Management", expertRatings: 45, growthRate: 12.3 },
    { name: "Python", expertRatings: 40, growthRate: 18.7 },
    { name: "Leadership", expertRatings: 35, growthRate: 8.9 },
    { name: "Machine Learning", expertRatings: 30, growthRate: 25.4 },
    { name: "Data Analytics", expertRatings: 25, growthRate: 15.6 },
    { name: "Design Thinking", expertRatings: 15, growthRate: 22.1 },
    { name: "Software Development", expertRatings: 10, growthRate: 11.2 }
  ],
  totalSkills: 588,
  totalUsers: 15420,
  activeSkillPlans: 1287,
  certificationProgress: 234
};

// Sample conversation starters for AI Assistant
export const conversationStarters = [
  {
    category: "Learning Analytics",
    questions: [
      "What are the top 5 skills trending in Q3?",
      "Which content pathways have the highest completion rates?",
      "Show me learning engagement by department",
      "What's the average learning velocity this month?"
    ]
  },
  {
    category: "Skill Development", 
    questions: [
      "Show me the skill gaps for our engineering team vs market demand",
      "Which skills have the highest decay rates?",
      "What certifications are most valuable for career growth?",
      "Identify skills with the biggest learning-to-expertise gap"
    ]
  },
  {
    category: "Career Insights",
    questions: [
      "How many learners are preparing for leadership roles?",
      "What's the internal mobility readiness across departments?",
      "Show me the most successful learning pathways",
      "Which roles have the highest skill development activity?"
    ]
  },
  {
    category: "Content Performance",
    questions: [
      "What content has the highest satisfaction scores?",
      "Compare video vs article engagement rates",
      "Show me trending topics by learner demographics",
      "Which learning formats deliver the best ROI?"
    ]
  }
];

// Dashboard Filters (Enhanced)
export const dashboardFilters = {
  timeperiods: ["Last 7 days", "Last 30 days", "Last quarter", "Last 6 months", "Last year", "Custom range"],
  departments: ["All Departments", "Engineering", "Product", "Data Science", "QA", "Design", "Marketing", "Sales", "HR"],
  roles: ["All Roles", "Developer", "SDET", "Product Manager", "Data Scientist", "Data Analyst", "Designer", "Team Lead"],
  skills: ["All Skills", "Leadership", "Python", "Data Analytics", "Project Management", "Machine Learning", "Cloud Computing"],
  learnerPersonas: ["All Learners", "New Hires", "High Performers", "Skill Gap Focus", "Leadership Track", "Technical Track"],
  contentTypes: ["All Content", "Videos", "Articles", "Pathways", "Assessments", "Podcasts", "Virtual Labs"]
};