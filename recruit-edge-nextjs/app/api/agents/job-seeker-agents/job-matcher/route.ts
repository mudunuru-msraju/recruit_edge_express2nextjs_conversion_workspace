import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agentJobMatches } from '@/agents/job-matcher/lib/schema';
import { 
  analyzeJobMatchSchema,
  type AnalyzeJobMatchData 
} from '@/agents/job-matcher/lib/validation';
import { eq, desc } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/job-matcher
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userJobMatches = await db
      .select()
      .from(agentJobMatches)
      .where(eq(agentJobMatches.userId, parseInt(userId)))
      .orderBy(desc(agentJobMatches.matchScore));

    return NextResponse.json({ matches: userJobMatches });
  } catch (error) {
    console.error('Error fetching job matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job matches' },
      { status: 500 }
    );
  }
}

// POST /api/agents/job-seeker-agents/job-matcher (analyze endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = analyzeJobMatchSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { userId, jobId, resumeId } = validationResult.data as AnalyzeJobMatchData;

    // Simulate AI analysis - in production, this would call actual AI services
    const matchScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
    const experienceMatch = Math.floor(Math.random() * 20) + 80;
    const locationMatch = Math.floor(Math.random() * 30) + 70;
    const salaryMatch = Math.floor(Math.random() * 25) + 75;
    const cultureFit = Math.floor(Math.random() * 30) + 70;

    const skillsMatch = {
      matched: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      missing: ['Python', 'Machine Learning'],
      additional: ['Next.js', 'GraphQL']
    };

    const strengths = [
      'Strong technical skills in modern web technologies',
      'Relevant experience in similar roles',
      'Good cultural fit based on company values'
    ];

    const weaknesses = [
      'Missing some specialized skills mentioned in job requirements',
      'Could benefit from more experience in data science tools'
    ];

    const aiSummary = `You're a ${matchScore}% match for this position. Your strong background in web development and experience with React/Node.js aligns well with the requirements. Consider developing skills in Python and Machine Learning to strengthen your profile further.`;

    const [newMatch] = await db
      .insert(agentJobMatches)
      .values({
        userId,
        jobId,
        resumeId,
        matchScore,
        skillsMatch,
        experienceMatch,
        locationMatch,
        salaryMatch,
        cultureFit,
        aiSummary,
        strengths,
        weaknesses,
        isBookmarked: false,
        isApplied: false,
      })
      .returning();

    return NextResponse.json({ match: newMatch }, { status: 201 });
  } catch (error) {
    console.error('Error analyzing job match:', error);
    return NextResponse.json(
      { error: 'Failed to analyze job match' },
      { status: 500 }
    );
  }
}