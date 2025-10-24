import { Router } from 'express';
import { db } from '../db';
import { contentFlags, agentInteractions } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'content-moderator',
    agentCategory: 'admin-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/flags', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_flags');

    const flags = await db
      .select()
      .from(contentFlags)
      .orderBy(desc(contentFlags.createdAt));

    res.json(flags);
  } catch (error) {
    console.error('Error fetching flags:', error);
    res.status(500).json({ error: 'Failed to fetch flags' });
  }
});

router.post('/flags', async (req, res) => {
  try {
    const { userId, contentType, contentId, reason, description } = req.body;
    if (!userId || !contentType || !contentId || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await trackInteraction(parseInt(userId), 'create_flag', { contentType, contentId });

    const [flag] = await db.insert(contentFlags).values({
      reporterId: parseInt(userId),
      contentType,
      contentId: parseInt(contentId),
      reason,
      description: description || null,
      status: 'pending',
    }).returning();

    res.status(201).json(flag);
  } catch (error) {
    console.error('Error creating flag:', error);
    res.status(500).json({ error: 'Failed to create flag' });
  }
});

router.put('/flags/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, status, reviewNotes } = req.body;

    const [updated] = await db.update(contentFlags).set({
      status,
      reviewerId: parseInt(userId),
      reviewNotes,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(contentFlags.id, parseInt(id))).returning();

    res.json(updated);
  } catch (error) {
    console.error('Error reviewing flag:', error);
    res.status(500).json({ error: 'Failed to review flag' });
  }
});

export default router;
