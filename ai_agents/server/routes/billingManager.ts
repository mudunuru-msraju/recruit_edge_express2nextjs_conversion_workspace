import { Router } from 'express';
import { db } from '../db';
import { subscriptions, payments, agentInteractions } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'billing-manager',
    agentCategory: 'admin-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/subscriptions', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_subscriptions');

    const subs = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
    res.json(subs);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_payments');

    const allPayments = await db.select().from(payments).orderBy(desc(payments.createdAt));
    res.json(allPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.get('/revenue', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'view_revenue');

    const allPayments = await db.select().from(payments).where(eq(payments.status, 'completed'));
    const totalRevenue = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      totalRevenue: totalRevenue / 100,
      currency: 'USD',
      monthlyRecurring: 5000,
      yearlyRecurring: 50000,
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ error: 'Failed to fetch revenue' });
  }
});

export default router;
