/**
 * Skill Gap Analyzer API Routes
 * 
 * ⚠️ SECURITY WARNING - DEVELOPMENT ONLY ⚠️
 * See server/routes/SECURITY_WARNING.md for complete details.
 */

import { Router } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db.js';
import { skillAnalyses, skillGaps, agentInteractions } from '../../shared/schema.js';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'skill-gap-analyzer',
    agentCategory: 'job-seeker-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: {
      type: actionType,
      data: metadata,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Get all analyses for a user
 * GET /api/agents/skill-gap-analyzer/analyses?userId={userId}
 */
router.get('/analyses', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const analyses = await db
      .select()
      .from(skillAnalyses)
      .where(eq(skillAnalyses.userId, parseInt(userId)))
      .orderBy(desc(skillAnalyses.createdAt));

    res.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

/**
 * Get a single analysis by ID
 * GET /api/agents/skill-gap-analyzer/analyses/:id?userId={userId}
 */
router.get('/analyses/:id', async (req, res) => {
  try {
    const analysisId = parseInt(req.params.id);
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const [analysis] = await db
      .select()
      .from(skillAnalyses)
      .where(
        and(
          eq(skillAnalyses.id, analysisId),
          eq(skillAnalyses.userId, parseInt(userId))
        )
      )
      .limit(1);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found or access denied' });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

/**
 * Create a new skill analysis
 * POST /api/agents/skill-gap-analyzer/analyses
 */
router.post('/analyses', async (req, res) => {
  try {
    const {
      userId,
      resumeId,
      targetRole,
      targetCompany,
      jobDescription,
      currentSkills,
      requiredSkills,
    } = req.body;

    if (!userId || !targetRole || !currentSkills || !requiredSkills) {
      return res.status(400).json({ 
        error: 'userId, targetRole, currentSkills, and requiredSkills are required' 
      });
    }

    // Calculate basic match score
    const matchCount = currentSkills.filter((skill: string) =>
      requiredSkills.some((req: string) => req.toLowerCase() === skill.toLowerCase())
    ).length;
    const overallScore = Math.round((matchCount / requiredSkills.length) * 100);

    const [analysis] = await db
      .insert(skillAnalyses)
      .values({
        userId: parseInt(userId),
        resumeId: resumeId || null,
        targetRole,
        targetCompany: targetCompany || null,
        jobDescription: jobDescription || null,
        currentSkills,
        requiredSkills,
        overallScore,
        summary: `You match ${matchCount} out of ${requiredSkills.length} required skills (${overallScore}%)`,
      })
      .returning();

    // Create skill gaps for missing skills
    const missingSkills = requiredSkills.filter((req: string) =>
      !currentSkills.some((current: string) => current.toLowerCase() === req.toLowerCase())
    );

    for (const skillName of missingSkills) {
      await db.insert(skillGaps).values({
        analysisId: analysis.id,
        skillName,
        priority: 'high',
        category: 'technical',
        currentLevel: 'none',
        requiredLevel: 'intermediate',
        isCompleted: false,
      });
    }

    await trackInteraction(parseInt(userId), 'analysis_created', {
      analysisId: analysis.id,
      targetRole,
      overallScore,
    });

    res.json({ id: analysis.id, analysis });
  } catch (error) {
    console.error('Error creating analysis:', error);
    res.status(500).json({ error: 'Failed to create analysis' });
  }
});

/**
 * Update an analysis
 * PUT /api/agents/skill-gap-analyzer/analyses/:id
 */
router.put('/analyses/:id', async (req, res) => {
  try {
    const analysisId = parseInt(req.params.id);
    const { userId, overallScore, summary } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(skillAnalyses)
      .where(
        and(
          eq(skillAnalyses.id, analysisId),
          eq(skillAnalyses.userId, parseInt(userId))
        )
      )
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: 'Analysis not found or access denied' });
    }

    const [updated] = await db
      .update(skillAnalyses)
      .set({
        overallScore: overallScore !== undefined ? overallScore : existing.overallScore,
        summary: summary !== undefined ? summary : existing.summary,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(skillAnalyses.id, analysisId),
          eq(skillAnalyses.userId, parseInt(userId))
        )
      )
      .returning();

    res.json({ success: true, analysis: updated });
  } catch (error) {
    console.error('Error updating analysis:', error);
    res.status(500).json({ error: 'Failed to update analysis' });
  }
});

/**
 * Delete an analysis
 * DELETE /api/agents/skill-gap-analyzer/analyses/:id?userId={userId}
 */
router.delete('/analyses/:id', async (req, res) => {
  try {
    const analysisId = parseInt(req.params.id);
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await db
      .delete(skillAnalyses)
      .where(
        and(
          eq(skillAnalyses.id, analysisId),
          eq(skillAnalyses.userId, parseInt(userId))
        )
      );

    await trackInteraction(parseInt(userId), 'analysis_deleted', { analysisId });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({ error: 'Failed to delete analysis' });
  }
});

/**
 * Get skill gaps for an analysis
 * GET /api/agents/skill-gap-analyzer/analyses/:analysisId/gaps
 */
router.get('/analyses/:analysisId/gaps', async (req, res) => {
  try {
    const analysisId = parseInt(req.params.analysisId);
    
    const gaps = await db
      .select()
      .from(skillGaps)
      .where(eq(skillGaps.analysisId, analysisId))
      .orderBy(skillGaps.priority, skillGaps.createdAt);

    res.json(gaps);
  } catch (error) {
    console.error('Error fetching skill gaps:', error);
    res.status(500).json({ error: 'Failed to fetch skill gaps' });
  }
});

/**
 * Update a skill gap
 * PUT /api/agents/skill-gap-analyzer/analyses/:analysisId/gaps/:gapId
 */
router.put('/analyses/:analysisId/gaps/:gapId', async (req, res) => {
  try {
    const gapId = parseInt(req.params.gapId);
    const { isCompleted, notes, currentLevel } = req.body;

    const [updatedGap] = await db
      .update(skillGaps)
      .set({
        isCompleted: isCompleted !== undefined ? isCompleted : undefined,
        completedAt: isCompleted ? new Date() : undefined,
        notes: notes !== undefined ? notes : undefined,
        currentLevel: currentLevel !== undefined ? currentLevel : undefined,
        updatedAt: new Date(),
      })
      .where(eq(skillGaps.id, gapId))
      .returning();

    res.json({ success: true, gap: updatedGap });
  } catch (error) {
    console.error('Error updating skill gap:', error);
    res.status(500).json({ error: 'Failed to update skill gap' });
  }
});

/**
 * AI: Analyze skills (Mock implementation)
 * POST /api/agents/skill-gap-analyzer/ai/analyze
 */
router.post('/ai/analyze', async (req, res) => {
  try {
    const { jobDescription, currentSkills } = req.body;

    // Mock AI analysis
    const mockAnalysis = {
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
      matchScore: 75,
      suggestions: [
        'Focus on learning Docker for containerization',
        'Strengthen PostgreSQL database skills',
      ],
    };

    res.json(mockAnalysis);
  } catch (error) {
    console.error('Error analyzing skills:', error);
    res.status(500).json({ error: 'Failed to analyze skills' });
  }
});

/**
 * Get interaction history
 * GET /api/agents/skill-gap-analyzer/history?userId={userId}
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
          eq(agentInteractions.agentSlug, 'skill-gap-analyzer')
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

export default router;
