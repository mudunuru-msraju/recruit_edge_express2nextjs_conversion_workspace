import { Router } from 'express';
import { db } from '../db';
import { offerLetters, agentInteractions } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'offer-letter-builder',
    agentCategory: 'recruiter-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/offers', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_offers');

    const offers = await db
      .select()
      .from(offerLetters)
      .where(eq(offerLetters.recruiterId, parseInt(userId as string)))
      .orderBy(desc(offerLetters.createdAt));

    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

router.post('/offers', async (req, res) => {
  try {
    const { userId, applicationId, candidateId, jobTitle, salary, content } = req.body;
    if (!userId || !applicationId || !candidateId || !jobTitle || !salary || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await trackInteraction(parseInt(userId), 'create_offer', { jobTitle });

    const [offer] = await db.insert(offerLetters).values({
      applicationId: parseInt(applicationId),
      recruiterId: parseInt(userId),
      candidateId: parseInt(candidateId),
      jobTitle,
      salary,
      content,
      status: 'draft',
    }).returning();

    res.status(201).json(offer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

router.post('/ai/generate', async (req, res) => {
  try {
    const { userId, jobTitle, companyName } = req.body;
    await trackInteraction(parseInt(userId), 'ai_generate_offer');

    const content = `Dear [Candidate Name],\n\nWe are pleased to offer you the position of ${jobTitle} at ${companyName}...\n\nWe look forward to welcoming you to our team!\n\nSincerely,\n[Your Name]`;

    res.json({ content });
  } catch (error) {
    console.error('Error generating offer:', error);
    res.status(500).json({ error: 'Failed to generate offer' });
  }
});

export default router;
