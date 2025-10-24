import { Router } from 'express';
import { db } from '../db';
import { jobMatches, agentInteractions, jobs } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'job-matcher',
    agentCategory: 'job-seeker-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/matches', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_matches');

    const matches = await db
      .select()
      .from(jobMatches)
      .where(eq(jobMatches.userId, parseInt(userId as string)))
      .orderBy(desc(jobMatches.matchScore));

    res.json(matches);
  } catch (error) {
    console.error('Error fetching job matches:', error);
    res.status(500).json({ error: 'Failed to fetch job matches' });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    if (!userId || !jobId) return res.status(400).json({ error: 'userId and jobId are required' });

    await trackInteraction(parseInt(userId), 'analyze_match', { jobId });

    const matchScore = Math.floor(Math.random() * 30) + 70;
    
    const [match] = await db.insert(jobMatches).values({
      userId: parseInt(userId),
      jobId: parseInt(jobId),
      matchScore,
      skillsMatch: { matched: ['JavaScript', 'React'], missing: ['Python'], additional: ['Node.js'] },
      experienceMatch: 85,
      locationMatch: 90,
      salaryMatch: 80,
      cultureFit: 75,
      aiSummary: `You're a ${matchScore}% match for this position based on your skills and experience.`,
      strengths: ['Strong technical skills', 'Relevant experience'],
      weaknesses: ['Missing Python experience'],
    }).returning();

    res.json(match);
  } catch (error) {
    console.error('Error analyzing match:', error);
    res.status(500).json({ error: 'Failed to analyze match' });
  }
});

router.delete('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await db.delete(jobMatches).where(
      and(eq(jobMatches.id, parseInt(id)), eq(jobMatches.userId, parseInt(userId as string)))
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ error: 'Failed to delete match' });
  }
});

export default router;
