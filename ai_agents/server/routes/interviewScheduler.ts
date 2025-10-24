import { Router } from 'express';
import { db } from '../db';
import { interviewSchedules, agentInteractions } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'interview-scheduler',
    agentCategory: 'recruiter-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/schedules', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_schedules');

    const schedules = await db
      .select()
      .from(interviewSchedules)
      .where(eq(interviewSchedules.interviewerId, parseInt(userId as string)))
      .orderBy(desc(interviewSchedules.scheduledAt));

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

router.post('/schedules', async (req, res) => {
  try {
    const { userId, applicationId, candidateId, scheduledAt, duration, interviewType, meetingLink } = req.body;
    if (!userId || !applicationId || !candidateId || !scheduledAt || !duration || !interviewType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await trackInteraction(parseInt(userId), 'create_schedule', { applicationId });

    const [schedule] = await db.insert(interviewSchedules).values({
      applicationId: parseInt(applicationId),
      interviewerId: parseInt(userId),
      candidateId: parseInt(candidateId),
      scheduledAt: new Date(scheduledAt),
      duration: parseInt(duration),
      interviewType,
      meetingLink: meetingLink || null,
      status: 'scheduled',
    }).returning();

    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

export default router;
