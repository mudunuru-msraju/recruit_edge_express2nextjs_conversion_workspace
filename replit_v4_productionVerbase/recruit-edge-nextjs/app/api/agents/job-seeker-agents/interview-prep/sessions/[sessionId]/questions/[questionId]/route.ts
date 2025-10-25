import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewQuestions } from '@/agents/interview-prep/lib/schema';
import { UpdateInterviewQuestionSchema } from '@/agents/interview-prep/lib/validation';
import { eq } from 'drizzle-orm';

// PUT /api/agents/job-seeker-agents/interview-prep/sessions/[sessionId]/questions/[questionId]
export async function PUT(
  request: NextRequest,
  { params }: { params: { sessionId: string; questionId: string } }
) {
  try {
    const questionId = parseInt(params.questionId, 10);
    if (isNaN(questionId)) {
      return NextResponse.json({ error: 'Invalid question ID' }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = UpdateInterviewQuestionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const [updatedQuestion] = await db
      .update(interviewQuestions)
      .set({
        ...validationResult.data,
        updatedAt: new Date(),
      })
      .where(eq(interviewQuestions.id, questionId))
      .returning();

    if (!updatedQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, question: updatedQuestion });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}