import { Router } from 'express';
import { db } from '../db';
import { auditLogs, agentInteractions } from '@shared/schema';
import { desc, eq } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'audit-logger',
    agentCategory: 'admin-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/logs', async (req, res) => {
  try {
    const { userId, eventType } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_logs');

    let query = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100);

    if (eventType) {
      query = query.where(eq(auditLogs.eventType, eventType as any));
    }

    const logs = await query;
    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

router.post('/logs', async (req, res) => {
  try {
    const { userId, eventType, entityType, entityId, action, changes, ipAddress } = req.body;
    if (!eventType || !action) {
      return res.status(400).json({ error: 'eventType and action are required' });
    }

    const [log] = await db.insert(auditLogs).values({
      userId: userId ? parseInt(userId) : null,
      eventType,
      entityType: entityType || null,
      entityId: entityId ? parseInt(entityId) : null,
      action,
      changes: changes || {},
      ipAddress: ipAddress || null,
    }).returning();

    res.status(201).json(log);
  } catch (error) {
    console.error('Error creating audit log:', error);
    res.status(500).json({ error: 'Failed to create audit log' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'view_stats');

    const logs = await db.select().from(auditLogs);
    const stats = {
      totalEvents: logs.length,
      todayEvents: logs.filter(l => {
        const today = new Date();
        const logDate = new Date(l.createdAt);
        return logDate.toDateString() === today.toDateString();
      }).length,
      eventTypes: {
        user_login: logs.filter(l => l.eventType === 'user_login').length,
        user_created: logs.filter(l => l.eventType === 'user_created').length,
        payment_processed: logs.filter(l => l.eventType === 'payment_processed').length,
      },
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
