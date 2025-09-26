// Mock employee data for drill-down functionality

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  skillRating: number;
  ratingType: 'Self' | 'Peer' | 'Manager';
  skill?: string;
  period?: string;
  progressionRate?: number;
  email: string;
  joinDate: string;
}

// Generate mock employees with realistic data
const generateEmployees = (): Employee[] => {
  const roles = ["Data Scientist", "Backend Engineer", "Frontend Engineer", "Product Manager", "DevOps Engineer", "ML Engineer", "Software Architect", "UX Designer"];
  const departments = ["Engineering", "Product", "Data Science", "Design", "DevOps"];
  const skills = ["Python", "React", "Node.js", "Machine Learning", "Data Analysis", "UI/UX Design", "Cloud Infrastructure", "Product Strategy"];
  const ratingTypes: ('Self' | 'Peer' | 'Manager')[] = ['Self', 'Peer', 'Manager'];
  const periods = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"];
  
  const employees: Employee[] = [];
  
  const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Cameron", "Drew", "Sage", "Quinn", "Reese", "Jamie", "Blake", "Parker", "Rowan", "Skylar", "Ember", "River", "Phoenix"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas"];

  for (let i = 0; i < 200; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const skill = skills[Math.floor(Math.random() * skills.length)];
    const ratingType = ratingTypes[Math.floor(Math.random() * ratingTypes.length)];
    const period = periods[Math.floor(Math.random() * periods.length)];
    
    // Generate realistic skill ratings
    let baseRating = Math.random() * 8 + 1; // 1-8 scale
    
    // Make Self and Peer ratings slightly more progressive over time
    if (ratingType === 'Self' || ratingType === 'Peer') {
      const periodIndex = periods.indexOf(period);
      baseRating = Math.min(8, baseRating + (periodIndex * 0.3));
    }
    
    employees.push({
      id: `emp-${i + 1}`,
      name: `${firstName} ${lastName}`,
      role,
      department,
      skillRating: Math.round(baseRating * 10) / 10, // Round to 1 decimal
      ratingType,
      skill,
      period,
      progressionRate: Math.random() * 30 + 5, // 5-35% progression rate
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      joinDate: `20${20 + Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    });
  }
  
  return employees;
};

export const mockEmployees = generateEmployees();

// Helper functions to get filtered employee data for drill-down
export const getEmployeesAboveRating = (threshold: number, ratingTypes?: string[], roles?: string[], skills?: string[]): Employee[] => {
  return mockEmployees.filter(emp => {
    const meetsRating = emp.skillRating >= threshold;
    const meetsRatingType = !ratingTypes || ratingTypes.length === 0 || ratingTypes.includes(emp.ratingType);
    const meetsRole = !roles || roles.length === 0 || roles.includes(emp.role);
    const meetsSkill = !skills || skills.length === 0 || (emp.skill && skills.includes(emp.skill));
    
    return meetsRating && meetsRatingType && meetsRole && meetsSkill;
  });
};

export const getEmployeesByRole = (roles: string[], ratingTypes?: string[], skills?: string[]): Employee[] => {
  return mockEmployees.filter(emp => {
    const meetsRole = roles.includes(emp.role);
    const meetsRatingType = !ratingTypes || ratingTypes.length === 0 || ratingTypes.includes(emp.ratingType);
    const meetsSkill = !skills || skills.length === 0 || (emp.skill && skills.includes(emp.skill));
    
    return meetsRole && meetsRatingType && meetsSkill;
  });
};

export const getEmployeesWithProgression = (minProgressionRate: number, ratingTypes?: string[], roles?: string[], skills?: string[]): Employee[] => {
  return mockEmployees.filter(emp => {
    const meetsProgression = (emp.progressionRate || 0) >= minProgressionRate;
    const meetsRatingType = !ratingTypes || ratingTypes.length === 0 || ratingTypes.includes(emp.ratingType);
    const meetsRole = !roles || roles.length === 0 || roles.includes(emp.role);
    const meetsSkill = !skills || skills.length === 0 || (emp.skill && skills.includes(emp.skill));
    
    return meetsProgression && meetsRatingType && meetsRole && meetsSkill;
  });
};

export const getAllEmployees = (ratingTypes?: string[], roles?: string[], skills?: string[]): Employee[] => {
  return mockEmployees.filter(emp => {
    const meetsRatingType = !ratingTypes || ratingTypes.length === 0 || ratingTypes.includes(emp.ratingType);
    const meetsRole = !roles || roles.length === 0 || roles.includes(emp.role);
    const meetsSkill = !skills || skills.length === 0 || (emp.skill && skills.includes(emp.skill));
    
    return meetsRatingType && meetsRole && meetsSkill;
  });
};