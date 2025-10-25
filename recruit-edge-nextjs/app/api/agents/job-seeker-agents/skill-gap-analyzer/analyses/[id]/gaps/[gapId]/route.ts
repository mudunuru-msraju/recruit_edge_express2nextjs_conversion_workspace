import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { skillGaps } from '@/agents/skill-gap-analyzer/lib/schema';
import { UpdateSkillGapSchema } from '@/agents/skill-gap-analyzer/lib/validation';
import { eq } from 'drizzle-orm';

// PUT /api/agents/job-seeker-agents/skill-gap-analyzer/analyses/[id]/gaps/[gapId]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; gapId: string }> }
) {
  try {
    const params = await context.params;
    const gapId = parseInt(params.gapId, 10);
    if (isNaN(gapId)) {
      return NextResponse.json({ error: 'Invalid gap ID' }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = UpdateSkillGapSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;
    const setData: any = {
      ...updateData,
      updatedAt: new Date(),
    };

    // If marking as completed, set completion timestamp
    if (updateData.isCompleted === true) {
      setData.completedAt = new Date();
    } else if (updateData.isCompleted === false) {
      setData.completedAt = null;
    }

    const [updatedGap] = await db
      .update(skillGaps)
      .set(setData)
      .where(eq(skillGaps.id, gapId))
      .returning();

    if (!updatedGap) {
      return NextResponse.json(
        { error: 'Skill gap not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, gap: updatedGap });
  } catch (error) {
    console.error('Error updating skill gap:', error);
    return NextResponse.json(
      { error: 'Failed to update skill gap' },
      { status: 500 }
    );
  }
}