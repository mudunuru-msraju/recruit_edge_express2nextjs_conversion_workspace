import { Router } from 'express';
import { db } from '../db';
import { talentPipeline, agentInteractions } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'talent-pipeline',
    agentCategory: 'recruiter-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/candidates', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_candidates');

    const candidates = await db
      .select()
      .from(talentPipeline)
      .where(eq(talentPipeline.recruiterId, parseInt(userId as string)))
      .orderBy(desc(talentPipeline.updatedAt));

    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

router.post('/candidates', async (req, res) => {
  try {
    const { userId, candidateId, stage, source, tags, rating } = req.body;
    if (!userId || !candidateId || !stage) {
      return res.status(400).json({ error: 'userId, candidateId, and stage are required' });
    }

    await trackInteraction(parseInt(userId), 'add_candidate', { candidateId });

    const [candidate] = await db.insert(talentPipeline).values({
      recruiterId: parseInt(userId),
      candidateId: parseInt(candidateId),
      stage,
      source: source || null,
      tags: tags || [],
      rating: rating || null,
    }).returning();

    res.status(201).json(candidate);
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ error: 'Failed to add candidate' });
  }
});

router.put('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, rating, notes } = req.body;

    const [updated] = await db.update(talentPipeline).set({
      stage,
      rating,
      notes,
      updatedAt: new Date(),
    }).where(eq(talentPipeline.id, parseInt(id))).returning();

    res.json(updated);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

export default router;
