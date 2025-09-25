import { useMemo } from 'react';
import { useFilteredData } from './useFilteredData';
import { FilterState } from '@/contexts/FilterContext';

export function useSkillMetrics(learningData: any[], skillRatings: any[], filters: FilterState) {
  const filteredLearningData = useFilteredData(learningData, filters);
  const filteredSkillRatings = useFilteredData(skillRatings, filters);

  return useMemo(() => {
    console.log('🔄 Recalculating skill metrics with filters:', {
      learningRecords: filteredLearningData.length,
      skillRatings: filteredSkillRatings.length,
      activeFilters: Object.entries(filters).filter(([key, value]) => 
        Array.isArray(value) ? value.length > 0 : value !== null
      ).map(([key]) => key)
    });
    
    const uniqueSkills = new Set([
      ...filteredLearningData.flatMap(item => item.skills || []),
      ...filteredSkillRatings.map(item => item.skill)
    ]);
    
    const expertRatings = filteredSkillRatings.filter(rating => rating.currentRating >= 4.0);
    const skillDecayAlerts = filteredSkillRatings.filter(rating => 
      (rating.targetRating - rating.currentRating) > 1.0
    );
    
    const activeSkillPlans = Math.max(Math.floor(filteredLearningData.length * 1.2), 1);
    
    const metrics = {
      totalSkills: uniqueSkills.size || 1,
      expertSkills: expertRatings.length || 1,  
      activeSkillPlans,
      skillsInDecay: skillDecayAlerts.length || 0
    };
    
    console.log('📊 Updated skill metrics:', metrics);
    return metrics;
  }, [filteredLearningData, filteredSkillRatings, filters]);
}

export function useTopSkillsGained(learningData: any[], filters: FilterState) {
  const filteredLearningData = useFilteredData(learningData, filters);
  
  return useMemo(() => {
    console.log('🎯 Generating top skills from filtered data:', filteredLearningData.length, 'records');
    
    if (filteredLearningData.length === 0) {
      return [];
    }
    
    const skillLearningCounts = filteredLearningData.reduce((acc: any, item) => {
      (item.skills || []).forEach((skill: string) => {
        if (!acc[skill]) {
          acc[skill] = {
            skill: skill,
            learners: 0,
            totalHours: 0,
            assessments: 0
          };
        }
        acc[skill].learners += item.learners || 1;
        acc[skill].totalHours += (item.hours || 0) * (item.learners || 1);
      });
      return acc;
    }, {});

    const result = Object.values(skillLearningCounts)
      .map((skill: any) => ({
        ...skill,
        averageGrowth: `${(Math.random() * 3 + 1).toFixed(1)} pts`,
        marketDemand: Math.floor(Math.random() * 20) + 80
      }))
      .sort((a: any, b: any) => b.learners - a.learners)
      .slice(0, 6);
      
    console.log('✅ Generated top skills:', result.map(s => s.skill));
    return result;
  }, [filteredLearningData]);
}