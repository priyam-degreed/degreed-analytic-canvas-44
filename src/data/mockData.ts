// Mock data based on the Visier dashboards analyzed

export const strategicOverviewData = {
  topSkills: [
    { name: "Leadership", users: 182, selfRating: 4.2 },
    { name: "Data Visualization", users: 171, selfRating: 3.8 },
    { name: "Project Management", users: 158, selfRating: 4.1 },
    { name: "Business Intelligence", users: 147, selfRating: 3.9 },
    { name: "Python (Programming)", users: 134, selfRating: 4.3 },
    { name: "Data Analytics", users: 109, selfRating: 4.0 },
    { name: "Innovation", users: 105, selfRating: 3.7 },
    { name: "Java", users: 103, selfRating: 4.1 },
    { name: "Business Analysis", users: 97, selfRating: 3.9 },
    { name: "Big Data Analysis", users: 89, selfRating: 3.8 }
  ],
  expertSkills: [
    { name: "Product Management", expertRatings: 45 },
    { name: "Python", expertRatings: 40 },
    { name: "Leadership", expertRatings: 35 },
    { name: "Test", expertRatings: 30 },
    { name: "Data Analytics", expertRatings: 25 },
    { name: "Design", expertRatings: 15 },
    { name: "Software Development", expertRatings: 10 },
    { name: "HTML", expertRatings: 9 },
    { name: "Java", expertRatings: 9 }
  ],
  totalSkills: 588,
  totalUsers: 3260
};

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

export const aiInsightsData = [
  {
    type: "trend",
    title: "Learning Completion Surge",
    description: "29% increase in learning completions this quarter, driven primarily by Developer and SDET roles.",
    confidence: 0.92,
    impact: "high"
  },
  {
    type: "skill_gap",
    title: "Python Skills Gap Identified", 
    description: "40% of users have Python on their profile but only 15% show expert-level proficiency.",
    confidence: 0.87,
    impact: "medium"
  },
  {
    type: "engagement",
    title: "Skill Plan Adoption Rising",
    description: "52% of users now following at least one skill plan, up from 37% last quarter.",
    confidence: 0.94,
    impact: "high"
  },
  {
    type: "recommendation",
    title: "Focus on Cloud Computing",
    description: "Cloud Computing skills show 87 hours of recent learning activity - consider expanding offerings.",
    confidence: 0.78,
    impact: "medium"
  }
];

export const dashboardFilters = {
  timeperiods: ["Last 7 days", "Last 30 days", "Last quarter", "Last 6 months", "Last year"],
  departments: ["All Departments", "Engineering", "Product", "Data Science", "QA", "Design"],
  roles: ["All Roles", "Developer", "SDET", "Product Manager", "Data Scientist", "Data Analyst"],
  skills: ["All Skills", "Leadership", "Python", "Data Analytics", "Project Management"]
};