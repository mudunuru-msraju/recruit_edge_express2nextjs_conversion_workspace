import { Router } from 'express';
import { db } from '../db';
import { salaryResearch, agentInteractions } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'salary-negotiator',
    agentCategory: 'job-seeker-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/research', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_research');

    const research = await db
      .select()
      .from(salaryResearch)
      .where(eq(salaryResearch.userId, parseInt(userId as string)))
      .orderBy(desc(salaryResearch.createdAt));

    res.json(research);
  } catch (error) {
    console.error('Error fetching salary research:', error);
    res.status(500).json({ error: 'Failed to fetch salary research' });
  }
});

router.post('/research', async (req, res) => {
  try {
    const { userId, jobTitle, location, experienceLevel, industry } = req.body;
    if (!userId || !jobTitle || !location) {
      return res.status(400).json({ error: 'userId, jobTitle, and location are required' });
    }

    await trackInteraction(parseInt(userId), 'create_research', { jobTitle, location });

    const baseMin = 80000;
    const baseMax = 150000;
    const median = (baseMin + baseMax) / 2;

    const [newResearch] = await db.insert(salaryResearch).values({
      userId: parseInt(userId),
      jobTitle,
      location,
      experienceLevel: experienceLevel || 'mid',
      industry: industry || null,
      salaryRange: { min: baseMin, max: baseMax, median, currency: 'USD' },
      marketData: { percentile25: baseMin, percentile50: median, percentile75: baseMax * 0.85, percentile90: baseMax },
      benefits: ['Health Insurance', '401k Matching', 'PTO', 'Remote Work'],
      negotiationTips: [
        { category: 'Research', tip: 'Know your market value before negotiations' },
        { category: 'Timing', tip: 'Wait for the offer before discussing salary' },
        { category: 'Value', tip: 'Highlight your unique skills and achievements' },
      ],
      sources: ['Glassdoor', 'Levels.fyi', 'Bureau of Labor Statistics'],
    }).returning();

    res.status(201).json(newResearch);
  } catch (error) {
    console.error('Error creating salary research:', error);
    res.status(500).json({ error: 'Failed to create salary research' });
  }
});

router.delete('/research/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await db.delete(salaryResearch).where(
      and(eq(salaryResearch.id, parseInt(id)), eq(salaryResearch.userId, parseInt(userId as string)))
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting research:', error);
    res.status(500).json({ error: 'Failed to delete research' });
  }
});

export default router;
