import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agentCoverLetters } from '@/agents/cover-letter-writer/lib/schema';
import { 
  createCoverLetterSchema,
  type CreateCoverLetterData 
} from '@/agents/cover-letter-writer/lib/validation';
import { eq, desc } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/cover-letter-writer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userCoverLetters = await db
      .select()
      .from(agentCoverLetters)
      .where(eq(agentCoverLetters.userId, parseInt(userId)))
      .orderBy(desc(agentCoverLetters.updatedAt));

    return NextResponse.json({ coverLetters: userCoverLetters });
  } catch (error) {
    console.error('Error fetching cover letters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cover letters' },
      { status: 500 }
    );
  }
}

// POST /api/agents/job-seeker-agents/cover-letter-writer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = createCoverLetterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data as CreateCoverLetterData;

    const [newCoverLetter] = await db
      .insert(agentCoverLetters)
      .values({
        userId: validatedData.userId,
        resumeId: validatedData.resumeId,
        jobId: validatedData.jobId,
        title: validatedData.title,
        content: validatedData.content,
        recipientName: validatedData.recipientName,
        recipientTitle: validatedData.recipientTitle,
        companyName: validatedData.companyName,
        jobTitle: validatedData.jobTitle,
        tone: validatedData.tone,
      })
      .returning();

    return NextResponse.json({ coverLetter: newCoverLetter }, { status: 201 });
  } catch (error) {
    console.error('Error creating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to create cover letter' },
      { status: 500 }
    );
  }
}