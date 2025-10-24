/**
 * Skill Gap Analyzer Utility Functions
 */

import { Priority, SkillLevel, SkillGap } from '../types';

export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };
  return colors[priority];
}

export function getSkillLevelLabel(level: SkillLevel): string {
  const labels: Record<SkillLevel, string> = {
    none: 'None',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  };
  return labels[level];
}

export function calculateMatchScore(currentSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 100;
  
  const matches = currentSkills.filter(skill =>
    requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
  ).length;
  
  return Math.round((matches / requiredSkills.length) * 100);
}

export function groupGapsByPriority(gaps: SkillGap[]): Record<Priority, SkillGap[]> {
  return gaps.reduce((acc, gap) => {
    if (!acc[gap.priority]) {
      acc[gap.priority] = [];
    }
    acc[gap.priority].push(gap);
    return acc;
  }, {} as Record<Priority, SkillGap[]>);
}
