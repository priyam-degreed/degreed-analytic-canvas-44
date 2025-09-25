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
  date: Date;
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

// Role-specific skill mapping
export const roleSkillMapping: Record<string, string[]> = {
  "Data Scientist": ["SQL", "Python", "Machine Learning", "AI Tools", "Data Analytics", "Statistics", "R", "Tableau"],
  "Backend Engineer": ["SQL", "Python", "Node.js", "Java", "AWS", "Docker", "Kubernetes", "System Design"],
  "Frontend Engineer": ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Vue.js", "Angular", "Web Performance"],
  "Product Manager": ["Product Strategy", "Analytics", "Communication", "Leadership", "Market Research", "User Research", "Roadmapping", "Stakeholder Management"],
  "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "CI/CD", "Infrastructure", "Monitoring", "Security", "Automation"],
  "ML Engineer": ["Python", "Machine Learning", "AI Tools", "MLOps", "Deep Learning", "TensorFlow", "PyTorch", "Data Pipeline"],
  "Software Architect": ["System Design", "Architecture", "Leadership", "Technical Strategy", "Microservices", "Scalability", "Security", "Code Review"],
  "UX Designer": ["Design Systems", "User Research", "Prototyping", "Figma", "Adobe Creative", "Information Architecture", "Usability Testing", "Visual Design"],
  "Technical Lead": ["Leadership", "Code Review", "Mentoring", "System Design", "Project Management", "Technical Strategy", "Team Building", "Architecture"],
  "Engineering Manager": ["Leadership", "People Management", "Strategic Planning", "Budget Management", "Process Improvement", "Team Development", "Communication", "Performance Management"]
};

// All unique skills across roles
export const skillOptions = Array.from(new Set(Object.values(roleSkillMapping).flat())).sort();

// Time period options with fiscal structure
export interface FiscalPeriod {
  fiscalYear: string;
  quarter: string;
  month?: string;
  value: string;
  label: string;
}

export const timePeriodOptions: FiscalPeriod[] = [
  // FY24
  { fiscalYear: "FY24", quarter: "Q1", month: "Jan", value: "FY24-Q1-Jan", label: "FY24 Q1 Jan" },
  { fiscalYear: "FY24", quarter: "Q1", month: "Feb", value: "FY24-Q1-Feb", label: "FY24 Q1 Feb" },
  { fiscalYear: "FY24", quarter: "Q1", month: "Mar", value: "FY24-Q1-Mar", label: "FY24 Q1 Mar" },
  { fiscalYear: "FY24", quarter: "Q2", month: "Apr", value: "FY24-Q2-Apr", label: "FY24 Q2 Apr" },
  { fiscalYear: "FY24", quarter: "Q2", month: "May", value: "FY24-Q2-May", label: "FY24 Q2 May" },
  { fiscalYear: "FY24", quarter: "Q2", month: "Jun", value: "FY24-Q2-Jun", label: "FY24 Q2 Jun" },
  { fiscalYear: "FY24", quarter: "Q3", month: "Jul", value: "FY24-Q3-Jul", label: "FY24 Q3 Jul" },
  { fiscalYear: "FY24", quarter: "Q3", month: "Aug", value: "FY24-Q3-Aug", label: "FY24 Q3 Aug" },
  { fiscalYear: "FY24", quarter: "Q3", month: "Sep", value: "FY24-Q3-Sep", label: "FY24 Q3 Sep" },
  { fiscalYear: "FY24", quarter: "Q4", month: "Oct", value: "FY24-Q4-Oct", label: "FY24 Q4 Oct" },
  { fiscalYear: "FY24", quarter: "Q4", month: "Nov", value: "FY24-Q4-Nov", label: "FY24 Q4 Nov" },
  { fiscalYear: "FY24", quarter: "Q4", month: "Dec", value: "FY24-Q4-Dec", label: "FY24 Q4 Dec" },
  // FY25
  { fiscalYear: "FY25", quarter: "Q1", month: "Jan", value: "FY25-Q1-Jan", label: "FY25 Q1 Jan" },
  { fiscalYear: "FY25", quarter: "Q1", month: "Feb", value: "FY25-Q1-Feb", label: "FY25 Q1 Feb" },
  { fiscalYear: "FY25", quarter: "Q1", month: "Mar", value: "FY25-Q1-Mar", label: "FY25 Q1 Mar" },
  { fiscalYear: "FY25", quarter: "Q2", month: "Apr", value: "FY25-Q2-Apr", label: "FY25 Q2 Apr" },
  { fiscalYear: "FY25", quarter: "Q2", month: "May", value: "FY25-Q2-May", label: "FY25 Q2 May" },
  { fiscalYear: "FY25", quarter: "Q2", month: "Jun", value: "FY25-Q2-Jun", label: "FY25 Q2 Jun" },
  
  // Quarterly rollups
  { fiscalYear: "FY24", quarter: "Q1", value: "FY24-Q1", label: "FY24 Q1" },
  { fiscalYear: "FY24", quarter: "Q2", value: "FY24-Q2", label: "FY24 Q2" },
  { fiscalYear: "FY24", quarter: "Q3", value: "FY24-Q3", label: "FY24 Q3" },
  { fiscalYear: "FY24", quarter: "Q4", value: "FY24-Q4", label: "FY24 Q4" },
  { fiscalYear: "FY25", quarter: "Q1", value: "FY25-Q1", label: "FY25 Q1" },
  { fiscalYear: "FY25", quarter: "Q2", value: "FY25-Q2", label: "FY25 Q2" },
  
  // Yearly rollups
  { fiscalYear: "FY24", quarter: "", value: "FY24", label: "FY24" },
  { fiscalYear: "FY25", quarter: "", value: "FY25", label: "FY25" }
];

// Simple period labels for backward compatibility
export const periodLabels = ["FY24-Q1", "FY24-Q2", "FY24-Q3", "FY24-Q4", "FY25-Q1", "FY25-Q2"];

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

// Generate comprehensive mock data for all roles and skills
function generateSkillDistributionData(): SkillDistribution[] {
  const data: SkillDistribution[] = [];
  const periods = [
    { period: "FY24-Q1", date: new Date(2023, 9, 15) },   // Oct 15, 2023
    { period: "FY24-Q2", date: new Date(2024, 0, 15) },   // Jan 15, 2024  
    { period: "FY24-Q3", date: new Date(2024, 3, 15) },   // Apr 15, 2024
    { period: "FY24-Q4", date: new Date(2024, 6, 15) },   // Jul 15, 2024
    { period: "FY25-Q1", date: new Date(2024, 9, 15) },   // Oct 15, 2024
    { period: "FY25-Q2", date: new Date(2025, 0, 15) },   // Jan 15, 2025
  ];
  
  Object.entries(roleSkillMapping).forEach(([role, skills]) => {
    skills.forEach(skill => {
      periods.forEach(({ period, date }, periodIndex) => {
        // Generate broader range of skill levels including higher ratings
        const baseSkillLevel = Math.random() * 4 + 2; // Base level 2-6
        const progression = periodIndex * 0.3; // Gradual improvement
        const randomVariation = (Math.random() - 0.5) * 2; // -1 to +1 variation
        const avgRating = Math.max(1, Math.min(8, baseSkillLevel + progression + randomVariation));
        
        // Generate distribution based on average rating
        const distribution = generateRatingDistribution(avgRating);
        
        data.push({
          timePeriod: period,
          date,
          role,
          skill,
          ...distribution,
          avgRating: Math.round(avgRating * 10) / 10
        });
      });
    });
  });
  
  return data;
}

function generateRatingDistribution(avgRating: number) {
  // Create realistic distribution around the average with better high-level representation
  const total = 100;
  const center = Math.round(avgRating);
  
  const distribution = {
    beginner: 0,
    capable: 0,
    intermediate: 0,
    effective: 0,
    experienced: 0,
    advanced: 0,
    distinguished: 0,
    master: 0
  };
  
  // Generate normal-ish distribution around center with better spread
  const ratings = ['beginner', 'capable', 'intermediate', 'effective', 'experienced', 'advanced', 'distinguished', 'master'];
  
  for (let i = 0; i < total; i++) {
    const random = Math.random();
    let selectedRating;
    
    // Better distribution logic to ensure higher ratings are represented
    if (avgRating >= 6) {
      // For high average ratings, bias towards higher levels
      if (random < 0.2) {
        selectedRating = center - 2;
      } else if (random < 0.4) {
        selectedRating = center - 1;
      } else if (random < 0.7) {
        selectedRating = center;
      } else if (random < 0.9) {
        selectedRating = center + 1;
      } else {
        selectedRating = center + 1; // Extra weight to higher ratings
      }
    } else if (avgRating >= 4) {
      // For medium ratings, normal distribution
      if (random < 0.3) {
        selectedRating = center - 1;
      } else if (random < 0.7) {
        selectedRating = center;
      } else {
        selectedRating = center + 1;
      }
    } else {
      // For lower ratings, slight bias upward
      if (random < 0.4) {
        selectedRating = center;
      } else if (random < 0.7) {
        selectedRating = center + 1;
      } else {
        selectedRating = center + 2;
      }
    }
    
    // Add some controlled randomness
    selectedRating += Math.floor((Math.random() - 0.3) * 2); // Slight upward bias
    selectedRating = Math.max(0, Math.min(7, selectedRating));
    
    distribution[ratings[selectedRating] as keyof typeof distribution]++;
  }
  
  return distribution;
}

export const skillDistributionData: SkillDistribution[] = generateSkillDistributionData();

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

// Generate heatmap data based on actual skill distribution data
export function generateHeatmapData(filteredData: SkillDistribution[]) {
  const skills = Array.from(new Set(filteredData.map(d => d.skill)));
  const periods = Array.from(new Set(filteredData.map(d => d.timePeriod)));
  
  return skills.map(skill => {
    const skillData: any = { skill };
    periods.forEach(period => {
      const data = filteredData.find(d => d.skill === skill && d.timePeriod === period);
      skillData[period] = data?.avgRating || 0;
    });
    return skillData;
  });
}

// Generate bubble chart data based on filtered data
export function generateBubbleData(filteredData: SkillDistribution[]) {
  const skillStats = new Map();
  
  filteredData.forEach(entry => {
    if (!skillStats.has(entry.skill)) {
      skillStats.set(entry.skill, {
        skill: entry.skill,
        totalRating: 0,
        count: 0,
        employeeCount: 0,
        importance: Math.random() * 10 + 1
      });
    }
    
    const stats = skillStats.get(entry.skill);
    stats.totalRating += entry.avgRating;
    stats.count++;
    stats.employeeCount += Math.floor(Math.random() * 50) + 20;
  });
  
  return Array.from(skillStats.values()).map(stats => ({
    skill: stats.skill,
    importance: stats.importance,
    avgRating: stats.count > 0 ? stats.totalRating / stats.count : 0,
    employeeCount: stats.count > 0 ? Math.floor(stats.employeeCount / stats.count) : 0,
    changeVsLastQuarter: (Math.random() - 0.5) * 2
  }));
}