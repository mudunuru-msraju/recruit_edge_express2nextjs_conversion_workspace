import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { skillAnalyses } from '@/agents/skill-gap-analyzer/lib/schema';
import { 
  UpdateSkillAnalysisSchema,
  SkillAnalysisQuerySchema 
} from '@/agents/skill-gap-analyzer/lib/validation';
import { eq, and } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/skill-gap-analyzer/analyses/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const analysisId = parseInt(params.id, 10);
    if (isNaN(analysisId)) {
      return NextResponse.json({ error: 'Invalid analysis ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const queryResult = SkillAnalysisQuerySchema.safeParse({
      userId: searchParams.get('userId'),
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }

    const { userId } = queryResult.data;

    const [analysis] = await db
      .select()
      .from(skillAnalyses)
      .where(
        and(
          eq(skillAnalyses.id, analysisId),
          eq(skillAnalyses.userId, userId)
        )
      )
      .limit(1);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error fetching skill analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill analysis' },
      { status: 500 }
    );
  }
}

// PUT /api/agents/job-seeker-agents/skill-gap-analyzer/analyses/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const analysisId = parseInt(params.id, 10);
    if (isNaN(analysisId)) {
      return NextResponse.json({ error: 'Invalid analysis ID' }, { status: 400 });
    }

    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const validationResult = UpdateSkillAnalysisSchema.safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Verify ownership
    const [existingAnalysis] = await db
      .select()
      .from(skillAnalyses)
      .where(
        and(
          eq(skillAnalyses.id, analysisId),
          eq(skillAnalyses.userId, parseInt(userId))
        )
      )
      .limit(1);

    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Analysis not found or access denied' },
        { status: 404 }
      );
    }

    const [updatedAnalysis] = await db
      .update(skillAnalyses)
      .set({
        ...validationResult.data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(skillAnalyses.id, analysisId),
          eq(skillAnalyses.userId, parseInt(userId))
        )
      )
      .returning();

    return NextResponse.json({ success: true, analysis: updatedAnalysis });
  } catch (error) {
    console.error('Error updating skill analysis:', error);
    return NextResponse.json(
      { error: 'Failed to update skill analysis' },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/job-seeker-agents/skill-gap-analyzer/analyses/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const analysisId = parseInt(params.id, 10);
    if (isNaN(analysisId)) {
      return NextResponse.json({ error: 'Invalid analysis ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const queryResult = SkillAnalysisQuerySchema.safeParse({
      userId: searchParams.get('userId'),
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }

    const { userId } = queryResult.data;

    await db
      .delete(skillAnalyses)
      .where(
        and(
          eq(skillAnalyses.id, analysisId),
          eq(skillAnalyses.userId, userId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill analysis:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill analysis' },
      { status: 500 }
    );
  }
}