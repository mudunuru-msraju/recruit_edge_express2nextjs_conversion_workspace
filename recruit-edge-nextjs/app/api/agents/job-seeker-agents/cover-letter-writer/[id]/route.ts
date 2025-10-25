import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agentCoverLetters } from '@/agents/cover-letter-writer/lib/schema';
import { 
  updateCoverLetterSchema,
  type UpdateCoverLetterData 
} from '@/agents/cover-letter-writer/lib/validation';
import { eq, and } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/cover-letter-writer/[id]
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid cover letter ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const [coverLetter] = await db
      .select()
      .from(agentCoverLetters)
      .where(
        and(
          eq(agentCoverLetters.id, id),
          eq(agentCoverLetters.userId, parseInt(userId))
        )
      );

    if (!coverLetter) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
    }

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Error fetching cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cover letter' },
      { status: 500 }
    );
  }
}

// PUT /api/agents/job-seeker-agents/cover-letter-writer/[id]
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid cover letter ID' }, { status: 400 });
    }

    const body = await request.json();
    
    const validationResult = updateCoverLetterSchema.safeParse({ id, ...body });
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const updateData = validationResult.data as UpdateCoverLetterData;
    const { id: letterId, ...updates } = updateData;

    const [updatedCoverLetter] = await db
      .update(agentCoverLetters)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(agentCoverLetters.id, letterId))
      .returning();

    if (!updatedCoverLetter) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
    }

    return NextResponse.json({ coverLetter: updatedCoverLetter });
  } catch (error) {
    console.error('Error updating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to update cover letter' },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/job-seeker-agents/cover-letter-writer/[id]
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid cover letter ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const [deletedCoverLetter] = await db
      .delete(agentCoverLetters)
      .where(
        and(
          eq(agentCoverLetters.id, id),
          eq(agentCoverLetters.userId, parseInt(userId))
        )
      )
      .returning();

    if (!deletedCoverLetter) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cover letter deleted successfully' });
  } catch (error) {
    console.error('Error deleting cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to delete cover letter' },
      { status: 500 }
    );
  }
}