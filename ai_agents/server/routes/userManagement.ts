import { Router } from 'express';
import { db } from '../db';
import { users, agentInteractions } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'user-management',
    agentCategory: 'admin-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/users', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_users');

    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const [updated] = await db.update(users).set({
      role,
      updatedAt: new Date(),
    }).where(eq(users.id, parseInt(id))).returning();

    res.json(updated);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'view_stats');

    const allUsers = await db.select().from(users);
    const stats = {
      total: allUsers.length,
      jobSeekers: allUsers.filter(u => u.role === 'job_seeker').length,
      recruiters: allUsers.filter(u => u.role === 'recruiter').length,
      admins: allUsers.filter(u => u.role === 'admin').length,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
