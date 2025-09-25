// Mock data for Skill Progression Dashboard

export interface SkillProgressionEntry {
  id: string;
  role: string;
  skillName: string;
  timePeriod: string;
  ratingLevel: number;
  ratingType: 'Self' | 'Peer' | 'Manager';
  employeeCount: number;
  avgRating: number;
  progressionPercent: number;
  skillGapToTarget: number;
  skillImportance: number;
  targetRating: number;
}

export interface SkillDistribution {
  timePeriod: string;
  role: string;
  skill: string;
  beginner: number;
  capable: number;
  intermediate: number;
  effective: number;
  experienced: number;
  advanced: number;
  distinguished: number;
  master: number;
  avgRating: number;
}

export interface SkillProgressionMetrics {
  totalEmployees: number;
  avgSkillRating: number;
  employeesAboveThreshold: number;
  progressionPercent: number;
  skillGapToTarget: number;
}

// Role options
export const roleOptions = [
  "Data Scientist",
  "Backend Engineer", 
  "Frontend Engineer",
  "Product Manager",
  "DevOps Engineer",
  "ML Engineer",
  "Software Architect",
  "UX Designer",
  "Technical Lead",
  "Engineering Manager"
];

// Skill options
export const skillOptions = [
  "SQL",
  "Python",
  "Machine Learning",
  "AI Tools",
  "React",
  "Node.js",
  "AWS",
  "Docker",
  "Kubernetes",
  "Data Analytics",
  "Product Strategy",
  "System Design",
  "Leadership",
  "Communication"
];

// Time period options
export const timePeriodOptions = [
  "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024",
  "Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", 
  "May 2024", "Jun 2024", "Jul 2024", "Aug 2024",
  "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024"
];

// Rating level options (1-8 scale)
export const ratingLevels = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Capable" },
  { value: 3, label: "Intermediate" },
  { value: 4, label: "Effective" },
  { value: 5, label: "Experienced" },
  { value: 6, label: "Advanced" },
  { value: 7, label: "Distinguished" },
  { value: 8, label: "Master" }
];

// Rating type options
export const ratingTypeOptions = ["Self", "Peer", "Manager"];

// Mock skill distribution data
export const skillDistributionData: SkillDistribution[] = [
  // Data Scientist - SQL progression
  { timePeriod: "Q1 2024", role: "Data Scientist", skill: "SQL", beginner: 40, capable: 25, intermediate: 20, effective: 10, experienced: 3, advanced: 2, distinguished: 0, master: 0, avgRating: 2.1 },
  { timePeriod: "Q2 2024", role: "Data Scientist", skill: "SQL", beginner: 30, capable: 30, intermediate: 25, effective: 10, experienced: 3, advanced: 2, distinguished: 0, master: 0, avgRating: 2.8 },
  { timePeriod: "Q3 2024", role: "Data Scientist", skill: "SQL", beginner: 20, capable: 25, intermediate: 30, effective: 15, experienced: 5, advanced: 4, distinguished: 1, master: 0, avgRating: 3.4 },
  { timePeriod: "Q4 2024", role: "Data Scientist", skill: "SQL", beginner: 15, capable: 20, intermediate: 25, effective: 20, experienced: 10, advanced: 7, distinguished: 2, master: 1, avgRating: 4.1 },
  
  // Data Scientist - Python progression
  { timePeriod: "Q1 2024", role: "Data Scientist", skill: "Python", beginner: 25, capable: 30, intermediate: 25, effective: 15, experienced: 3, advanced: 2, distinguished: 0, master: 0, avgRating: 2.7 },
  { timePeriod: "Q2 2024", role: "Data Scientist", skill: "Python", beginner: 20, capable: 25, intermediate: 30, effective: 15, experienced: 7, advanced: 3, distinguished: 0, master: 0, avgRating: 3.2 },
  { timePeriod: "Q3 2024", role: "Data Scientist", skill: "Python", beginner: 15, capable: 20, intermediate: 25, effective: 20, experienced: 12, advanced: 6, distinguished: 2, master: 0, avgRating: 3.8 },
  { timePeriod: "Q4 2024", role: "Data Scientist", skill: "Python", beginner: 10, capable: 15, intermediate: 25, effective: 25, experienced: 15, advanced: 8, distinguished: 2, master: 0, avgRating: 4.3 },
  
  // Data Scientist - Machine Learning progression
  { timePeriod: "Q1 2024", role: "Data Scientist", skill: "Machine Learning", beginner: 50, capable: 30, intermediate: 15, effective: 4, experienced: 1, advanced: 0, distinguished: 0, master: 0, avgRating: 1.8 },
  { timePeriod: "Q2 2024", role: "Data Scientist", skill: "Machine Learning", beginner: 40, capable: 35, intermediate: 18, effective: 5, experienced: 2, advanced: 0, distinguished: 0, master: 0, avgRating: 2.1 },
  { timePeriod: "Q3 2024", role: "Data Scientist", skill: "Machine Learning", beginner: 30, capable: 30, intermediate: 25, effective: 10, experienced: 4, advanced: 1, distinguished: 0, master: 0, avgRating: 2.6 },
  { timePeriod: "Q4 2024", role: "Data Scientist", skill: "Machine Learning", beginner: 25, capable: 25, intermediate: 25, effective: 15, experienced: 7, advanced: 3, distinguished: 0, master: 0, avgRating: 3.1 },

  // Backend Engineer - SQL progression
  { timePeriod: "Q1 2024", role: "Backend Engineer", skill: "SQL", beginner: 20, capable: 30, intermediate: 30, effective: 15, experienced: 4, advanced: 1, distinguished: 0, master: 0, avgRating: 2.9 },
  { timePeriod: "Q2 2024", role: "Backend Engineer", skill: "SQL", beginner: 15, capable: 25, intermediate: 35, effective: 18, experienced: 5, advanced: 2, distinguished: 0, master: 0, avgRating: 3.3 },
  { timePeriod: "Q3 2024", role: "Backend Engineer", skill: "SQL", beginner: 10, capable: 20, intermediate: 30, effective: 25, experienced: 10, advanced: 4, distinguished: 1, master: 0, avgRating: 3.9 },
  { timePeriod: "Q4 2024", role: "Backend Engineer", skill: "SQL", beginner: 8, capable: 15, intermediate: 27, effective: 28, experienced: 15, advanced: 6, distinguished: 1, master: 0, avgRating: 4.2 },

  // Backend Engineer - Node.js progression
  { timePeriod: "Q1 2024", role: "Backend Engineer", skill: "Node.js", beginner: 15, capable: 25, intermediate: 35, effective: 20, experienced: 4, advanced: 1, distinguished: 0, master: 0, avgRating: 3.1 },
  { timePeriod: "Q2 2024", role: "Backend Engineer", skill: "Node.js", beginner: 10, capable: 20, intermediate: 30, effective: 25, experienced: 10, advanced: 4, distinguished: 1, master: 0, avgRating: 3.7 },
  { timePeriod: "Q3 2024", role: "Backend Engineer", skill: "Node.js", beginner: 8, capable: 15, intermediate: 25, effective: 30, experienced: 15, advanced: 6, distinguished: 1, master: 0, avgRating: 4.1 },
  { timePeriod: "Q4 2024", role: "Backend Engineer", skill: "Node.js", beginner: 5, capable: 12, intermediate: 23, effective: 30, experienced: 20, advanced: 8, distinguished: 2, master: 0, avgRating: 4.5 },

  // Frontend Engineer - React progression
  { timePeriod: "Q1 2024", role: "Frontend Engineer", skill: "React", beginner: 10, capable: 20, intermediate: 40, effective: 25, experienced: 4, advanced: 1, distinguished: 0, master: 0, avgRating: 3.3 },
  { timePeriod: "Q2 2024", role: "Frontend Engineer", skill: "React", beginner: 8, capable: 15, intermediate: 35, effective: 30, experienced: 8, advanced: 3, distinguished: 1, master: 0, avgRating: 3.8 },
  { timePeriod: "Q3 2024", role: "Frontend Engineer", skill: "React", beginner: 5, capable: 12, intermediate: 25, effective: 35, experienced: 15, advanced: 6, distinguished: 2, master: 0, avgRating: 4.3 },
  { timePeriod: "Q4 2024", role: "Frontend Engineer", skill: "React", beginner: 3, capable: 10, intermediate: 22, effective: 35, experienced: 20, advanced: 8, distinguished: 2, master: 0, avgRating: 4.7 },

  // Product Manager - Product Strategy progression
  { timePeriod: "Q1 2024", role: "Product Manager", skill: "Product Strategy", beginner: 30, capable: 35, intermediate: 25, effective: 8, experienced: 2, advanced: 0, distinguished: 0, master: 0, avgRating: 2.3 },
  { timePeriod: "Q2 2024", role: "Product Manager", skill: "Product Strategy", beginner: 25, capable: 30, intermediate: 30, effective: 12, experienced: 3, advanced: 0, distinguished: 0, master: 0, avgRating: 2.7 },
  { timePeriod: "Q3 2024", role: "Product Manager", skill: "Product Strategy", beginner: 20, capable: 25, intermediate: 30, effective: 18, experienced: 5, advanced: 2, distinguished: 0, master: 0, avgRating: 3.2 },
  { timePeriod: "Q4 2024", role: "Product Manager", skill: "Product Strategy", beginner: 15, capable: 20, intermediate: 30, effective: 25, experienced: 8, advanced: 2, distinguished: 0, master: 0, avgRating: 3.6 },
];

// Mock skill progression entries
export const skillProgressionEntries: SkillProgressionEntry[] = skillDistributionData.map((item, index) => ({
  id: `sp-${index}`,
  role: item.role,
  skillName: item.skill,
  timePeriod: item.timePeriod,
  ratingLevel: Math.round(item.avgRating),
  ratingType: ['Self', 'Peer', 'Manager'][index % 3] as 'Self' | 'Peer' | 'Manager',
  employeeCount: Math.floor(Math.random() * 50) + 20,
  avgRating: item.avgRating,
  progressionPercent: Math.random() * 30 + 5, // 5-35% progression
  skillGapToTarget: Math.max(0, 6 - item.avgRating), // Target rating of 6
  skillImportance: Math.random() * 10 + 1, // 1-10 importance scale
  targetRating: 6
}));

// Mock bubble chart data for priority view
export const priorityViewData = skillOptions.map(skill => ({
  skill,
  importance: Math.random() * 10 + 1,
  avgRating: Math.random() * 4 + 2, // 2-6 rating
  employeeCount: Math.floor(Math.random() * 100) + 20,
  changeVsLastQuarter: (Math.random() - 0.5) * 2, // -1 to +1
}));

// Calculate overall metrics
export const skillProgressionMetrics: SkillProgressionMetrics = {
  totalEmployees: 247,
  avgSkillRating: 3.4,
  employeesAboveThreshold: 68, // % above advanced (6+)
  progressionPercent: 15.2,
  skillGapToTarget: 2.6
};

// Heatmap data (skill vs time)
export const heatmapData = skillOptions.slice(0, 8).map(skill => {
  const skillData: any = { skill };
  timePeriodOptions.slice(0, 4).forEach(period => {
    skillData[period] = Math.random() * 4 + 2; // 2-6 rating
  });
  return skillData;
});