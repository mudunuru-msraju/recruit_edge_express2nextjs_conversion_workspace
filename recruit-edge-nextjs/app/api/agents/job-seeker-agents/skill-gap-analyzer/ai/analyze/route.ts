import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeSkillsSchema } from '@/agents/skill-gap-analyzer/lib/validation';

// POST /api/agents/job-seeker-agents/skill-gap-analyzer/ai/analyze
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = AnalyzeSkillsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    const { jobDescription, currentSkills } = validationResult.data;

    // Mock AI analysis - extract skills from job description
    const skillKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
      'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET', 'PHP', 'Laravel',
      'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'GCP', 'Git', 'Linux', 'CI/CD', 'REST', 'GraphQL',
      'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind', 'Webpack', 'Vite',
      'Testing', 'Jest', 'Cypress', 'Selenium', 'Agile', 'Scrum', 'DevOps'
    ];

    // Extract required skills from job description
    const description = jobDescription.toLowerCase();
    const requiredSkills = skillKeywords.filter(skill => 
      description.includes(skill.toLowerCase())
    );

    // Add some common skills if none found
    if (requiredSkills.length === 0) {
      requiredSkills.push('Communication', 'Problem Solving', 'Teamwork', 'Time Management');
    }

    // Calculate match score
    const matchingSkills = currentSkills.filter(skill =>
      requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
    );
    const matchScore = Math.round((matchingSkills.length / requiredSkills.length) * 100);

    // Generate suggestions based on missing skills
    const missingSkills = requiredSkills.filter(req =>
      !currentSkills.some(current => current.toLowerCase() === req.toLowerCase())
    );

    const suggestions = [
      ...missingSkills.slice(0, 3).map(skill => `Consider learning ${skill} to meet job requirements`),
      'Focus on building projects that demonstrate your skills',
      'Consider getting relevant certifications',
      'Practice coding challenges and technical interviews',
      'Build a portfolio showcasing your abilities'
    ].slice(0, 5);

    return NextResponse.json({
      requiredSkills,
      matchScore,
      suggestions,
    });
  } catch (error) {
    console.error('Error analyzing skills:', error);
    return NextResponse.json(
      { error: 'Failed to analyze skills' },
      { status: 500 }
    );
  }
}