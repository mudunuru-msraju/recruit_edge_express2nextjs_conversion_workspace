import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { skillGaps } from '@/agents/skill-gap-analyzer/lib/schema';
import { eq } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/skill-gap-analyzer/analyses/[id]/gaps
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

    const gaps = await db
      .select()
      .from(skillGaps)
      .where(eq(skillGaps.analysisId, analysisId))
      .orderBy(skillGaps.priority, skillGaps.createdAt);

    return NextResponse.json(gaps);
  } catch (error) {
    console.error('Error fetching skill gaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill gaps' },
      { status: 500 }
    );
  }
}