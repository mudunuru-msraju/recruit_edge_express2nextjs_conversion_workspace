import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agentResumes } from '@/agents/resume-builder/lib/schema';
import { 
  updateResumeSchema, 
  type UpdateResumeData 
} from '@/agents/resume-builder/lib/validation';
import { eq } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/resume-builder/[id]
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid resume ID' }, { status: 400 });
    }

    const [resume] = await db
      .select()
      .from(agentResumes)
      .where(eq(agentResumes.id, id));

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

// PUT /api/agents/job-seeker-agents/resume-builder/[id]
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid resume ID' }, { status: 400 });
    }

    const body = await request.json();
    
    const validationResult = updateResumeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const updateData = validationResult.data as UpdateResumeData;

    const [updatedResume] = await db
      .update(agentResumes)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(agentResumes.id, id))
      .returning();

    if (!updatedResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ resume: updatedResume });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/job-seeker-agents/resume-builder/[id]
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid resume ID' }, { status: 400 });
    }

    const [deletedResume] = await db
      .delete(agentResumes)
      .where(eq(agentResumes.id, id))
      .returning();

    if (!deletedResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}