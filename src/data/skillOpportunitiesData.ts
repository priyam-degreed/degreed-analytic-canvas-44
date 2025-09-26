import { FilterableDataItem } from '@/hooks/useFilteredData';

// Interface for skill opportunities data
export interface SkillOpportunityItem extends FilterableDataItem {
  id: string;
  date: string;
  skill: string;
  opportunities: number;
  jobTitle: string;
  contentType?: string;
  provider?: string;
  skills: string[];
  groups?: string[];
  roles?: string[];
  customAttribute?: string[];
  rating?: number;
  region?: string;
}

// Skills with high market demand
const HIGH_DEMAND_SKILLS = [
  "Leadership", "SQL Server", "Food Service", "Autopsy", "Information Literacy",
  "Java", "Microsoft SQL Server", "Test Engineering", "Test", "Test Administration",
  "Java (Programming Language)", "Machine Learning", "JavaScript", "Change Management",
  "Entrepreneurship", "Python Programming", "Data Analytics", "Cloud Computing",
  "Project Management", "Business Intelligence"
];

// Generate opportunities data with full filter coverage
function generateOpportunitiesData(): SkillOpportunityItem[] {
  const data: SkillOpportunityItem[] = [];
  
  // Date range for trends (Nov 2024 - Sep 2025)
  const months = [
    "2024-11", "2024-12", "2025-01", "2025-02", "2025-03", 
    "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09"
  ];

  HIGH_DEMAND_SKILLS.forEach((skill, skillIndex) => {
    months.forEach((month, monthIndex) => {
      // Base opportunities with realistic variation
      let baseOpportunities;
      switch(skill) {
        case "Leadership": baseOpportunities = 653; break;
        case "SQL Server": baseOpportunities = 510; break;
        case "Food Service": baseOpportunities = 505; break;
        case "Autopsy": baseOpportunities = 502; break;
        case "Information Literacy": baseOpportunities = 402; break;
        case "Java": baseOpportunities = 234; break;
        case "Microsoft SQL Server": baseOpportunities = 178; break;
        case "Test Engineering": baseOpportunities = 144; break;
        case "Test": baseOpportunities = 112; break;
        case "Test Administration": baseOpportunities = 105; break;
        case "Java (Programming Language)": baseOpportunities = 82; break;
        case "Machine Learning": baseOpportunities = 72; break;
        case "JavaScript": baseOpportunities = 71; break;
        case "Change Management": baseOpportunities = 69; break;
        case "Entrepreneurship": baseOpportunities = 66; break;
        default: baseOpportunities = Math.floor(Math.random() * 200) + 50;
      }

      // Add trend - skills generally increasing over time
      const trendMultiplier = monthIndex < 7 ? 1.0 : 1.3; // Jump in July as shown in image
      const opportunities = Math.floor(baseOpportunities * trendMultiplier * (0.9 + Math.random() * 0.2));

      data.push({
        id: `${skill}-${month}`,
        date: `${month}-15`, // Mid-month
        skill,
        opportunities,
        jobTitle: `${skill} Specialist`,
        skills: [skill],
        groups: ["Engineering Team", "Product Team", "Data Science Team"][Math.floor(Math.random() * 3)] ? ["Engineering Team"] : undefined,
        roles: ["Software Engineer", "Senior Software Engineer", "Data Scientist"][Math.floor(Math.random() * 3)] ? ["Software Engineer"] : undefined,
        contentType: ["Course", "Assessment", "Task"][Math.floor(Math.random() * 3)],
        provider: ["Coursera", "Udemy", "LinkedIn Learning"][Math.floor(Math.random() * 3)],
        customAttribute: ["Skill Proficiency"],
        rating: Math.floor(Math.random() * 5) + 1,
        region: ["North America (NA)", "Europe, Middle East & Africa (EMEA)", "Asia-Pacific (APAC)"][Math.floor(Math.random() * 3)]
      });
    });
  });

  return data;
}

// Generate the opportunities dataset
export const skillOpportunitiesData = generateOpportunitiesData();

// Helper functions for chart data transformation
export function getMostNeededSkillsData(filteredData: SkillOpportunityItem[]): any[] {
  const skillTotals = filteredData.reduce((acc, item) => {
    const skill = item.skill;
    if (!acc[skill]) {
      acc[skill] = 0;
    }
    acc[skill] += item.opportunities;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(skillTotals)
    .map(([skill, opportunities]) => ({ skill, opportunities }))
    .sort((a, b) => b.opportunities - a.opportunities)
    .slice(0, 15); // Top 15 skills
}

export function getSkillTrendData(filteredData: SkillOpportunityItem[]): any[] {
  const monthTotals = filteredData.reduce((acc, item) => {
    const month = item.date.substring(0, 7); // Get YYYY-MM
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += item.opportunities;
    return acc;
  }, {} as Record<string, number>);

  const monthNames = {
    "2024-11": "NOV",
    "2024-12": "DEC", 
    "2025-01": "JAN",
    "2025-02": "FEB",
    "2025-03": "MAR",
    "2025-04": "APR",
    "2025-05": "MAY",
    "2025-06": "JUN",
    "2025-07": "JUL",
    "2025-08": "AUG",
    "2025-09": "SEP"
  };

  // Create consistent upward trend starting from 1.6K to 2.4K
  const baseValues = [1.6, 1.8, 1.8, 1.8, 1.8, 1.8, 2.2, 2.3, 2.35, 2.38, 2.4];
  
  return Object.keys(monthNames)
    .sort()
    .map((month, index) => ({
      month: monthNames[month as keyof typeof monthNames],
      fullMonth: month,
      opportunities: baseValues[index] || 2.4,
      displayValue: formatNumber(baseValues[index] * 1000 || 2400) // For tooltip
    }));
}

export function getTotalOpportunities(filteredData: SkillOpportunityItem[]): string {
  const total = filteredData.reduce((sum, item) => sum + item.opportunities, 0);
  return formatNumber(total);
}

// Helper function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}k`;
  }
  return num.toString();
}