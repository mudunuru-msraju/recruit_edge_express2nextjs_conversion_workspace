/**
 * Resume Builder API Routes
 * Handles all resume CRUD operations and AI features
 * 
 * ⚠️ SECURITY WARNING - DEVELOPMENT ONLY ⚠️
 * 
 * This implementation accepts userId from request parameters which allows
 * any user to impersonate another user by changing the userId value.
 * 
 * REQUIRED BEFORE PRODUCTION:
 * 1. Implement Auth.js with Google OAuth
 * 2. Add authentication middleware (requireAuth)
 * 3. Get userId from req.userId (authenticated session) NOT from request params
 * 4. Remove all userId parameters from client API calls
 * 
 * See server/routes/SECURITY_WARNING.md for complete details.
 */

import { Router } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db.js';
import { resumes, agentInteractions } from '../../shared/schema.js';

const router = Router();

/**
 * Get all resumes for a user
 * GET /api/agents/resume-builder/resumes
 */
router.get('/resumes', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, parseInt(userId)))
      .orderBy(desc(resumes.updatedAt));

    res.json(userResumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

/**
 * Get a single resume by ID
 * GET /api/agents/resume-builder/resumes/:id?userId={userId}
 */
router.get('/resumes/:id', async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const [resume] = await db
      .select()
      .from(resumes)
      .where(
        and(
          eq(resumes.id, resumeId),
          eq(resumes.userId, parseInt(userId))
        )
      )
      .limit(1);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found or access denied' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

/**
 * Create a new resume
 * POST /api/agents/resume-builder/resumes
 */
router.post('/resumes', async (req, res) => {
  try {
    const {
      userId,
      title,
      personalInfo,
      summary,
      experience,
      education,
      skills,
      projects,
      certifications,
      template,
      metadata
    } = req.body;

    if (!userId || !personalInfo) {
      return res.status(400).json({ error: 'userId and personalInfo are required' });
    }

    const [newResume] = await db
      .insert(resumes)
      .values({
        userId: parseInt(userId),
        title: title || 'Untitled Resume',
        personalInfo,
        summary: summary || '',
        experience: experience || [],
        education: education || [],
        skills: skills || [],
        projects: projects || [],
        certifications: certifications || [],
        template: template || 'modern',
        metadata: metadata || {},
      })
      .returning();

    // Track interaction
    await trackInteraction(
      parseInt(userId),
      'resume_created',
      { resumeId: newResume.id, title: newResume.title }
    );

    res.status(201).json({ id: newResume.id, success: true, resume: newResume });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

/**
 * Update an existing resume
 * PUT /api/agents/resume-builder/resumes/:id
 */
router.put('/resumes/:id', async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    const {
      userId,
      title,
      personalInfo,
      summary,
      experience,
      education,
      skills,
      projects,
      certifications,
      template,
      metadata
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // First verify ownership
    const [existingResume] = await db
      .select()
      .from(resumes)
      .where(
        and(
          eq(resumes.id, resumeId),
          eq(resumes.userId, parseInt(userId))
        )
      )
      .limit(1);

    if (!existingResume) {
      return res.status(404).json({ error: 'Resume not found or access denied' });
    }

    // Update only if user owns the resume
    const [updatedResume] = await db
      .update(resumes)
      .set({
        title,
        personalInfo,
        summary,
        experience,
        education,
        skills,
        projects,
        certifications,
        template,
        metadata,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(resumes.id, resumeId),
          eq(resumes.userId, parseInt(userId))
        )
      )
      .returning();

    // Track interaction
    await trackInteraction(
      parseInt(userId),
      'resume_updated',
      { resumeId: updatedResume.id, title: updatedResume.title }
    );

    res.json({ success: true, resume: updatedResume });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

/**
 * Delete a resume
 * DELETE /api/agents/resume-builder/resumes/:id
 */
router.delete('/resumes/:id', async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const [deletedResume] = await db
      .delete(resumes)
      .where(
        and(
          eq(resumes.id, resumeId),
          eq(resumes.userId, parseInt(userId))
        )
      )
      .returning();

    if (!deletedResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Track interaction
    await trackInteraction(
      parseInt(userId),
      'resume_deleted',
      { resumeId, title: deletedResume.title }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

/**
 * Get interaction history for Resume Builder agent
 * GET /api/agents/resume-builder/history
 */
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const history = await db
      .select()
      .from(agentInteractions)
      .where(
        and(
          eq(agentInteractions.userId, parseInt(userId)),
          eq(agentInteractions.agentSlug, 'resume-builder')
        )
      )
      .orderBy(desc(agentInteractions.createdAt))
      .limit(50);

    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

/**
 * Save an interaction to history
 * POST /api/agents/resume-builder/history
 */
router.post('/history', async (req, res) => {
  try {
    const { userId, type, data, sessionId } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ error: 'userId and type are required' });
    }

    await trackInteraction(
      parseInt(userId),
      type,
      data,
      sessionId
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving interaction:', error);
    res.status(500).json({ error: 'Failed to save interaction' });
  }
});

/**
 * AI: Generate professional summary
 * POST /api/agents/resume-builder/ai/generate-summary
 */
router.post('/ai/generate-summary', async (req, res) => {
  try {
    const { personalInfo, experience, education, skills } = req.body;

    // Mock AI response for now (implement real AI later)
    const summary = generateMockSummary(personalInfo, experience, skills);

    res.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

/**
 * AI: Improve job description
 * POST /api/agents/resume-builder/ai/improve-description
 */
router.post('/ai/improve-description', async (req, res) => {
  try {
    const { description } = req.body;

    // Mock AI response for now
    const improved = `Enhanced: ${description}. Demonstrated strong leadership and achieved measurable results through strategic planning and execution.`;

    res.json({ improved });
  } catch (error) {
    console.error('Error improving description:', error);
    res.status(500).json({ error: 'Failed to improve description' });
  }
});

/**
 * AI: Extract ATS keywords
 * POST /api/agents/resume-builder/ai/extract-keywords
 */
router.post('/ai/extract-keywords', async (req, res) => {
  try {
    const { jobDescription } = req.body;

    // Mock keyword extraction
    const keywords = [
      'JavaScript', 'React', 'Node.js', 'TypeScript',
      'Leadership', 'Team Management', 'Agile',
      'Problem Solving', 'Communication'
    ];

    res.json({ keywords });
  } catch (error) {
    console.error('Error extracting keywords:', error);
    res.status(500).json({ error: 'Failed to extract keywords' });
  }
});

/**
 * Export resume as PDF
 * POST /api/agents/resume-builder/export/pdf
 */
router.post('/export/pdf', async (req, res) => {
  try {
    // Mock PDF export - implement real PDF generation later
    res.status(501).json({ 
      error: 'PDF export not yet implemented',
      message: 'Feature coming soon. Please use the browser print function for now.'
    });
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
});

/**
 * Export resume as DOCX
 * POST /api/agents/resume-builder/export/docx
 */
router.post('/export/docx', async (req, res) => {
  try {
    // Mock DOCX export - implement real DOCX generation later
    res.status(501).json({ 
      error: 'DOCX export not yet implemented',
      message: 'Feature coming soon.'
    });
  } catch (error) {
    console.error('Error exporting DOCX:', error);
    res.status(500).json({ error: 'Failed to export DOCX' });
  }
});

/**
 * Get available templates
 * GET /api/agents/resume-builder/templates
 */
router.get('/templates', async (req, res) => {
  try {
    const templates = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and contemporary design',
        preview: '/templates/modern-preview.png'
      },
      {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional professional format',
        preview: '/templates/classic-preview.png'
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Eye-catching and unique',
        preview: '/templates/creative-preview.png'
      }
    ];

    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

/**
 * Helper function to track interactions
 */
async function trackInteraction(
  userId: number,
  type: string,
  data: any,
  sessionId?: string
) {
  try {
    const session = sessionId || `session_${Date.now()}_${userId}`;
    
    await db.insert(agentInteractions).values({
      userId,
      agentSlug: 'resume-builder',
      agentCategory: 'job-seeker-agents',
      sessionId: session,
      messages: [{
        role: 'system',
        content: `Action: ${type}`,
        timestamp: new Date().toISOString()
      }],
      metadata: {
        type,
        data,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error tracking interaction:', error);
  }
}

/**
 * Helper function to generate mock summary
 */
function generateMockSummary(
  personalInfo: any,
  experience: any[],
  skills: string[]
): string {
  const yearsOfExperience = experience?.length * 2 || 0;
  const topSkills = skills?.slice(0, 5).join(', ') || 'various technologies';
  
  return `Results-driven professional with ${yearsOfExperience}+ years of experience in the tech industry. Expertise in ${topSkills}. Proven track record of delivering high-quality solutions and driving business growth through innovative problem-solving and strategic thinking.`;
}

export default router;
