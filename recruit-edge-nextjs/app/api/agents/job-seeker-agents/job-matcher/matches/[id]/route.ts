import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agentJobMatches } from '@/agents/job-matcher/lib/schema';
import { 
  updateJobMatchSchema,
  type UpdateJobMatchData 
} from '@/agents/job-matcher/lib/validation';
import { eq, and } from 'drizzle-orm';

// PUT /api/agents/job-seeker-agents/job-matcher/matches/[id]
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const body = await request.json();
    
    const validationResult = updateJobMatchSchema.safeParse({ id, ...body });
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const updateData = validationResult.data as UpdateJobMatchData;
    const { id: matchId, ...updates } = updateData;

    const [updatedMatch] = await db
      .update(agentJobMatches)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(agentJobMatches.id, matchId))
      .returning();

    if (!updatedMatch) {
      return NextResponse.json({ error: 'Job match not found' }, { status: 404 });
    }

    return NextResponse.json({ match: updatedMatch });
  } catch (error) {
    console.error('Error updating job match:', error);
    return NextResponse.json(
      { error: 'Failed to update job match' },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/job-seeker-agents/job-matcher/matches/[id]
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const [deletedMatch] = await db
      .delete(agentJobMatches)
      .where(
        and(
          eq(agentJobMatches.id, id),
          eq(agentJobMatches.userId, parseInt(userId))
        )
      )
      .returning();

    if (!deletedMatch) {
      return NextResponse.json({ error: 'Job match not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job match deleted successfully' });
  } catch (error) {
    console.error('Error deleting job match:', error);
    return NextResponse.json(
      { error: 'Failed to delete job match' },
      { status: 500 }
    );
  }
}