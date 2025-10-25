import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewSessions } from '@/agents/interview-prep/lib/schema';
import { 
  UpdateInterviewSessionSchema,
  InterviewSessionQuerySchema 
} from '@/agents/interview-prep/lib/validation';
import { eq, and } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/interview-prep/sessions/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = parseInt(params.id, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const queryResult = InterviewSessionQuerySchema.safeParse({
      userId: searchParams.get('userId'),
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.errors },
        { status: 400 }
      );
    }

    const { userId } = queryResult.data;

    const [session] = await db
      .select()
      .from(interviewSessions)
      .where(
        and(
          eq(interviewSessions.id, sessionId),
          eq(interviewSessions.userId, userId)
        )
      )
      .limit(1);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching interview session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview session' },
      { status: 500 }
    );
  }
}

// PUT /api/agents/job-seeker-agents/interview-prep/sessions/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = parseInt(params.id, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
    }

    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const validationResult = UpdateInterviewSessionSchema.safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Verify ownership
    const [existingSession] = await db
      .select()
      .from(interviewSessions)
      .where(
        and(
          eq(interviewSessions.id, sessionId),
          eq(interviewSessions.userId, parseInt(userId))
        )
      )
      .limit(1);

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    const [updatedSession] = await db
      .update(interviewSessions)
      .set({
        ...validationResult.data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(interviewSessions.id, sessionId),
          eq(interviewSessions.userId, parseInt(userId))
        )
      )
      .returning();

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error('Error updating interview session:', error);
    return NextResponse.json(
      { error: 'Failed to update interview session' },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/job-seeker-agents/interview-prep/sessions/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = parseInt(params.id, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const queryResult = InterviewSessionQuerySchema.safeParse({
      userId: searchParams.get('userId'),
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.errors },
        { status: 400 }
      );
    }

    const { userId } = queryResult.data;

    await db
      .delete(interviewSessions)
      .where(
        and(
          eq(interviewSessions.id, sessionId),
          eq(interviewSessions.userId, userId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting interview session:', error);
    return NextResponse.json(
      { error: 'Failed to delete interview session' },
      { status: 500 }
    );
  }
}