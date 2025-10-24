import { Router } from 'express';
import { db } from '../db';
import { jobs, applications, agentInteractions } from '@shared/schema';
import { eq, count } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'job-analytics',
    agentCategory: 'recruiter-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'view_stats');

    const jobsList = await db
      .select()
      .from(jobs)
      .where(eq(jobs.recruiterId, parseInt(userId as string)));

    const totalJobs = jobsList.length;
    const activeJobs = jobsList.filter(j => j.status === 'published').length;

    const stats = {
      totalJobs,
      activeJobs,
      totalApplications: Math.floor(Math.random() * 100) + 50,
      averageTimeToHire: '21 days',
      topPerformingJob: jobsList[0]?.title || 'N/A',
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/trends', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'view_trends');

    const trends = [
      { month: 'Jan', applications: 45, hires: 3 },
      { month: 'Feb', applications: 52, hires: 4 },
      { month: 'Mar', applications: 67, hires: 5 },
      { month: 'Apr', applications: 73, hires: 6 },
      { month: 'May', applications: 81, hires: 7 },
    ];

    res.json(trends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

export default router;
