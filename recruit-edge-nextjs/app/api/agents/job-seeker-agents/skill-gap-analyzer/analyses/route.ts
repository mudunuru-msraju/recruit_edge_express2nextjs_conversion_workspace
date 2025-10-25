import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { skillAnalyses, skillGaps } from '@/agents/skill-gap-analyzer/lib/schema';
import { 
  CreateSkillAnalysisSchema, 
  SkillAnalysisQuerySchema 
} from '@/agents/skill-gap-analyzer/lib/validation';
import { eq, desc } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/skill-gap-analyzer/analyses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryResult = SkillAnalysisQuerySchema.safeParse({
      userId: searchParams.get('userId'),
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.issues },
        { status: 400 }
      );
    }

    const { userId } = queryResult.data;

    const analyses = await db
      .select()
      .from(skillAnalyses)
      .where(eq(skillAnalyses.userId, userId))
      .orderBy(desc(skillAnalyses.createdAt));

    return NextResponse.json(analyses);
  } catch (error) {
    console.error('Error fetching skill analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill analyses' },
      { status: 500 }
    );
  }
}

// POST /api/agents/job-seeker-agents/skill-gap-analyzer/analyses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = CreateSkillAnalysisSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Calculate basic match score
    const matchCount = data.currentSkills.filter((skill: string) =>
      data.requiredSkills.some((req: string) => req.toLowerCase() === skill.toLowerCase())
    ).length;
    const overallScore = Math.round((matchCount / data.requiredSkills.length) * 100);

    const [analysis] = await db
      .insert(skillAnalyses)
      .values({
        ...data,
        overallScore,
        summary: `You match ${matchCount} out of ${data.requiredSkills.length} required skills (${overallScore}%)`,
      })
      .returning();

    // Create skill gaps for missing skills
    const missingSkills = data.requiredSkills.filter((req: string) =>
      !data.currentSkills.some((current: string) => current.toLowerCase() === req.toLowerCase())
    );

    for (const skillName of missingSkills) {
      await db.insert(skillGaps).values({
        analysisId: analysis.id,
        skillName,
        priority: 'high',
        category: 'technical',
        currentLevel: 'none',
        requiredLevel: 'intermediate',
        isCompleted: false,
      });
    }

    return NextResponse.json({ id: analysis.id, analysis });
  } catch (error) {
    console.error('Error creating skill analysis:', error);
    return NextResponse.json(
      { error: 'Failed to create skill analysis' },
      { status: 500 }
    );
  }
}