import { Router } from 'express';
import { db } from '../db';
import { jobs, agentInteractions } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'job-description-generator',
    agentCategory: 'recruiter-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: { type: actionType, data: metadata, timestamp: new Date().toISOString() },
  });
}

router.get('/jobs', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await trackInteraction(parseInt(userId as string), 'list_jobs');

    const jobsList = await db
      .select()
      .from(jobs)
      .where(eq(jobs.recruiterId, parseInt(userId as string)))
      .orderBy(desc(jobs.updatedAt));

    res.json(jobsList);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const { userId, title, description, requirements, skills, location, employmentType } = req.body;
    if (!userId || !title || !description) {
      return res.status(400).json({ error: 'userId, title, and description are required' });
    }

    await trackInteraction(parseInt(userId), 'create_job', { title });

    const [newJob] = await db.insert(jobs).values({
      recruiterId: parseInt(userId),
      title,
      description,
      requirements: requirements || [],
      skills: skills || [],
      location: location || null,
      employmentType: employmentType || 'full_time',
      status: 'draft',
    }).returning();

    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.post('/ai/generate', async (req, res) => {
  try {
    const { userId, jobTitle, companyName } = req.body;
    await trackInteraction(parseInt(userId), 'ai_generate_description', { jobTitle });

    const description = `We are seeking a talented ${jobTitle} to join our team at ${companyName}. This role offers an exciting opportunity to work on cutting-edge projects...`;
    const requirements = ['3+ years of experience', 'Strong communication skills', 'Team player'];
    const skills = ['JavaScript', 'React', 'Node.js'];

    res.json({ description, requirements, skills });
  } catch (error) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: 'Failed to generate description' });
  }
});

router.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await db.delete(jobs).where(
      and(eq(jobs.id, parseInt(id)), eq(jobs.recruiterId, parseInt(userId as string)))
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
