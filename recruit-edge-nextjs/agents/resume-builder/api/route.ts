/**
 * Resume Builder Agent API Route
 * Self-contained API handler for all Resume Builder operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agentResumes, agentInteractions, resumeTemplates } from '../lib/schema';
import { validateCreateResume, validateUpdateResume } from '../lib/validation';
import { eq, and, desc } from 'drizzle-orm';
import { getDefaultTemplates, generateSessionId } from '../lib/utils';

// Mock user ID for development (replace with real authentication)
function getMockUserId(): number {
  return 1; // This should come from authentication in production
}

/**
 * GET /api/agents/job-seeker-agents/resume-builder
 * List all resumes for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const searchParams = request.nextUrl.searchParams;
    const resumeId = searchParams.get('id');

    // Get specific resume
    if (resumeId) {
      const resume = await db
        .select()
        .from(agentResumes)
        .where(and(eq(agentResumes.id, parseInt(resumeId)), eq(agentResumes.userId, userId)))
        .limit(1);

      if (resume.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Resume not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: resume[0]
      });
    }

    // Get all resumes for user
    const resumes = await db
      .select({
        id: agentResumes.id,
        title: agentResumes.title,
        template: agentResumes.template,
        updatedAt: agentResumes.updatedAt,
        createdAt: agentResumes.createdAt,
      })
      .from(agentResumes)
      .where(eq(agentResumes.userId, userId))
      .orderBy(desc(agentResumes.updatedAt));

    return NextResponse.json({
      success: true,
      data: {
        resumes,
        total: resumes.length
      }
    });

  } catch (error) {
    console.error('GET /resume-builder error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents/job-seeker-agents/resume-builder
 * Create a new resume
 */
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();

    // Validate request body
    const validation = validateCreateResume(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const resumeData = validation.data;

    // Create resume
    const [newResume] = await db
      .insert(agentResumes)
      .values({
        userId,
        title: resumeData.title,
        personalInfo: resumeData.personalInfo,
        summary: resumeData.summary,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        projects: resumeData.projects,
        certifications: resumeData.certifications,
        template: resumeData.template,
        isPublic: resumeData.isPublic,
        metadata: {},
      })
      .returning({ id: agentResumes.id });

    // Track interaction
    await db.insert(agentInteractions).values({
      userId,
      sessionId: generateSessionId(),
      messages: [{
        role: 'system',
        content: 'Resume created',
        timestamp: new Date().toISOString()
      }],
      metadata: { action: 'create_resume', resumeId: newResume.id }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newResume.id,
        message: 'Resume created successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('POST /resume-builder error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/agents/job-seeker-agents/resume-builder
 * Update an existing resume
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const searchParams = request.nextUrl.searchParams;
    const resumeId = searchParams.get('id');

    if (!resumeId) {
      return NextResponse.json(
        { success: false, error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = validateUpdateResume(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const resumeData = validation.data;

    // Check if resume exists and belongs to user
    const existingResume = await db
      .select()
      .from(agentResumes)
      .where(and(eq(agentResumes.id, parseInt(resumeId)), eq(agentResumes.userId, userId)))
      .limit(1);

    if (existingResume.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      );
    }

    // Update resume
    await db
      .update(agentResumes)
      .set({
        ...resumeData,
        updatedAt: new Date(),
      })
      .where(and(eq(agentResumes.id, parseInt(resumeId)), eq(agentResumes.userId, userId)));

    // Track interaction
    await db.insert(agentInteractions).values({
      userId,
      sessionId: generateSessionId(),
      messages: [{
        role: 'system',
        content: 'Resume updated',
        timestamp: new Date().toISOString()
      }],
      metadata: { action: 'update_resume', resumeId: parseInt(resumeId) }
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Resume updated successfully' }
    });

  } catch (error) {
    console.error('PUT /resume-builder error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agents/job-seeker-agents/resume-builder
 * Delete a resume
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const searchParams = request.nextUrl.searchParams;
    const resumeId = searchParams.get('id');

    if (!resumeId) {
      return NextResponse.json(
        { success: false, error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    // Check if resume exists and belongs to user
    const existingResume = await db
      .select()
      .from(agentResumes)
      .where(and(eq(agentResumes.id, parseInt(resumeId)), eq(agentResumes.userId, userId)))
      .limit(1);

    if (existingResume.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      );
    }

    // Delete resume
    await db
      .delete(agentResumes)
      .where(and(eq(agentResumes.id, parseInt(resumeId)), eq(agentResumes.userId, userId)));

    // Track interaction
    await db.insert(agentInteractions).values({
      userId,
      sessionId: generateSessionId(),
      messages: [{
        role: 'system',
        content: 'Resume deleted',
        timestamp: new Date().toISOString()
      }],
      metadata: { action: 'delete_resume', resumeId: parseInt(resumeId) }
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Resume deleted successfully' }
    });

  } catch (error) {
    console.error('DELETE /resume-builder error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export agent metadata for auto-discovery
export const agentConfig = {
  id: 'resume-builder',
  name: 'Resume Builder',
  category: 'job-seeker-agents',
  endpoints: [
    { method: 'GET', path: '/resumes', description: 'List user resumes' },
    { method: 'POST', path: '/resumes', description: 'Create a new resume' },
    { method: 'PUT', path: '/resumes', description: 'Update resume' },
    { method: 'DELETE', path: '/resumes', description: 'Delete resume' },
  ]
};