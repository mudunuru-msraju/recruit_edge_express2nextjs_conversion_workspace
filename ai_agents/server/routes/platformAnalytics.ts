import { Router } from 'express';
import { db } from '../db';
import { platformMetrics, agentInteractions, users, jobs, applications } from '@shared/schema';
import { desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'platform-analytics',
    agentCategory: 'admin-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/overview', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'view_overview');

    const allUsers = await db.select().from(users);
    const allJobs = await db.select().from(jobs);
    const allApplications = await db.select().from(applications);

    const overview = {
      totalUsers: allUsers.length,
      totalJobs: allJobs.length,
      totalApplications: allApplications.length,
      activeJobs: allJobs.filter(j => j.status === 'published').length,
    };

    res.json(overview);
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

router.get('/metrics', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'view_metrics');

    const metrics = await db
      .select()
      .from(platformMetrics)
      .orderBy(desc(platformMetrics.metricDate))
      .limit(30);

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

router.post('/metrics', async (req, res) => {
  try {
    const { metricType, metricDate, value } = req.body;
    if (!metricType || !metricDate || value === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [metric] = await db.insert(platformMetrics).values({
      metricType,
      metricDate: new Date(metricDate),
      value,
    }).returning();

    res.status(201).json(metric);
  } catch (error) {
    console.error('Error creating metric:', error);
    res.status(500).json({ error: 'Failed to create metric' });
  }
});

export default router;
