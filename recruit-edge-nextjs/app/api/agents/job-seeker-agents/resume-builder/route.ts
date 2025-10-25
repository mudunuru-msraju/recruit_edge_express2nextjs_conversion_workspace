import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agentResumes } from '@/agents/resume-builder/lib/schema';
import { 
  createResumeSchema, 
  updateResumeSchema, 
  type CreateResumeData 
} from '@/agents/resume-builder/lib/validation';
import { eq } from 'drizzle-orm';

// GET /api/agents/job-seeker-agents/resume-builder
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userResumes = await db
      .select()
      .from(agentResumes)
      .where(eq(agentResumes.userId, parseInt(userId)));

    return NextResponse.json({ resumes: userResumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

// POST /api/agents/job-seeker-agents/resume-builder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = createResumeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data as CreateResumeData;

    const [newResume] = await db
      .insert(agentResumes)
      .values({
        userId: body.userId, // from request body
        title: validatedData.title,
        personalInfo: validatedData.personalInfo,
        summary: validatedData.summary,
        experience: validatedData.experience || [],
        education: validatedData.education || [],
        skills: validatedData.skills || [],
        certifications: validatedData.certifications || [],
        projects: validatedData.projects || [],
        template: validatedData.template || 'modern',
        isPublic: validatedData.isPublic || false,
      })
      .returning();

    return NextResponse.json({ resume: newResume }, { status: 201 });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}

// PUT /api/agents/job-seeker-agents/resume-builder
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = updateResumeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { id, ...updateData } = body;

    const [updatedResume] = await db
      .update(agentResumes)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(agentResumes.id, parseInt(id)))
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

// DELETE /api/agents/job-seeker-agents/resume-builder
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
    }

    const [deletedResume] = await db
      .delete(agentResumes)
      .where(eq(agentResumes.id, parseInt(id)))
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