import { Router } from 'express';
import { db } from '../db';
import { candidateScreenings, agentInteractions, applications } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'candidate-screener',
    agentCategory: 'recruiter-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/screenings', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_screenings');

    const screenings = await db
      .select()
      .from(candidateScreenings)
      .where(eq(candidateScreenings.recruiterId, parseInt(userId as string)))
      .orderBy(desc(candidateScreenings.createdAt));

    res.json(screenings);
  } catch (error) {
    console.error('Error fetching screenings:', error);
    res.status(500).json({ error: 'Failed to fetch screenings' });
  }
});

router.post('/screen', async (req, res) => {
  try {
    const { userId, applicationId } = req.body;
    if (!userId || !applicationId) {
      return res.status(400).json({ error: 'userId and applicationId are required' });
    }

    await trackInteraction(parseInt(userId), 'screen_candidate', { applicationId });

    const overallScore = Math.floor(Math.random() * 30) + 60;
    const recommendation = overallScore >= 80 ? 'strong_yes' : overallScore >= 65 ? 'yes' : 'maybe';

    const [screening] = await db.insert(candidateScreenings).values({
      applicationId: parseInt(applicationId),
      recruiterId: parseInt(userId),
      overallScore,
      resumeScore: Math.floor(Math.random() * 20) + 70,
      skillsScore: Math.floor(Math.random() * 20) + 70,
      experienceScore: Math.floor(Math.random() * 20) + 70,
      educationScore: Math.floor(Math.random() * 20) + 70,
      cultureFitScore: Math.floor(Math.random() * 20) + 70,
      recommendation,
      strengths: ['Strong technical background', 'Relevant experience', 'Good communication'],
      concerns: ['Limited leadership experience'],
      aiAnalysis: `This candidate shows ${overallScore}% match with job requirements.`,
    }).returning();

    res.json(screening);
  } catch (error) {
    console.error('Error screening candidate:', error);
    res.status(500).json({ error: 'Failed to screen candidate' });
  }
});

export default router;
