import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewQuestions } from '@/agents/interview-prep/lib/schema';
import { CreateInterviewQuestionSchema } from '@/agents/interview-prep/lib/validation';
import { eq } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/interview-prep/sessions/[id]/questions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = parseInt(params.id, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
    }

    const questions = await db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.sessionId, sessionId))
      .orderBy(interviewQuestions.createdAt);

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching session questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session questions' },
      { status: 500 }
    );
  }
}

// POST /api/agents/job-seeker-agents/interview-prep/sessions/[id]/questions
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = parseInt(params.id, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = CreateInterviewQuestionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const [newQuestion] = await db
      .insert(interviewQuestions)
      .values({
        ...validationResult.data,
        sessionId,
      })
      .returning();

    return NextResponse.json({ id: newQuestion.id, question: newQuestion });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}