import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewSessions } from '@/agents/interview-prep/lib/schema';
import { 
  CreateInterviewSessionSchema, 
  InterviewSessionQuerySchema 
} from '@/agents/interview-prep/lib/validation';
import { eq, desc } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/interview-prep/sessions
export async function GET(request: NextRequest) {
  try {
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

    const sessions = await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, userId))
      .orderBy(desc(interviewSessions.createdAt));

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching interview sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview sessions' },
      { status: 500 }
    );
  }
}

// POST /api/agents/job-seeker-agents/interview-prep/sessions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = CreateInterviewSessionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { numberOfQuestions, ...sessionData } = validationResult.data;

    const [session] = await db
      .insert(interviewSessions)
      .values({
        ...sessionData,
        metadata: { numberOfQuestions },
      })
      .returning();

    return NextResponse.json({ id: session.id, session });
  } catch (error) {
    console.error('Error creating interview session:', error);
    return NextResponse.json(
      { error: 'Failed to create interview session' },
      { status: 500 }
    );
  }
}