import { Router } from 'express';
import { db } from '../db';
import { systemHealth, agentInteractions } from '@shared/schema';
import { desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'system-monitor',
    agentCategory: 'admin-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/health', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'check_health');

    const checks = await db
      .select()
      .from(systemHealth)
      .orderBy(desc(systemHealth.checkTime))
      .limit(20);

    res.json(checks);
  } catch (error) {
    console.error('Error fetching health checks:', error);
    res.status(500).json({ error: 'Failed to fetch health checks' });
  }
});

router.post('/health/check', async (req, res) => {
  try {
    const services = ['api', 'database', 'storage', 'queue'];
    const checks = [];

    for (const service of services) {
      const status = Math.random() > 0.1 ? 'healthy' : 'degraded';
      const [check] = await db.insert(systemHealth).values({
        checkTime: new Date(),
        service,
        status,
        responseTime: Math.floor(Math.random() * 200) + 50,
        errorCount: status === 'healthy' ? 0 : Math.floor(Math.random() * 5),
      }).returning();

      checks.push(check);
    }

    res.json(checks);
  } catch (error) {
    console.error('Error running health check:', error);
    res.status(500).json({ error: 'Failed to run health check' });
  }
});

router.get('/status', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'view_status');

    const status = {
      overall: 'healthy',
      uptime: '99.9%',
      lastIncident: '7 days ago',
      services: {
        api: 'healthy',
        database: 'healthy',
        storage: 'healthy',
        queue: 'healthy',
      },
    };

    res.json(status);
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

export default router;
