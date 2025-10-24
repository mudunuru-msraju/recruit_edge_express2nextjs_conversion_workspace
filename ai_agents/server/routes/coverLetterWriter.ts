import { Router } from 'express';
import { db } from '../db';
import { coverLetters, agentInteractions, resumes, jobs } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

const router = Router();

async function trackInteraction(userId: number, actionType: string, metadata?: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'cover-letter-writer',
    agentCategory: 'job-seeker-agents',
    sessionId: `session_${Date.now()}_${userId}`,
    messages: [],
    metadata: {
      type: actionType,
      data: metadata,
      timestamp: new Date().toISOString(),
    },
  });
}

router.get('/cover-letters', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await trackInteraction(parseInt(userId as string), 'list_cover_letters');

    const letters = await db
      .select()
      .from(coverLetters)
      .where(eq(coverLetters.userId, parseInt(userId as string)))
      .orderBy(desc(coverLetters.updatedAt));

    res.json(letters);
  } catch (error) {
    console.error('Error fetching cover letters:', error);
    res.status(500).json({ error: 'Failed to fetch cover letters' });
  }
});

router.get('/cover-letters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const [letter] = await db
      .select()
      .from(coverLetters)
      .where(
        and(
          eq(coverLetters.id, parseInt(id)),
          eq(coverLetters.userId, parseInt(userId as string))
        )
      );

    if (!letter) {
      return res.status(404).json({ error: 'Cover letter not found' });
    }

    res.json(letter);
  } catch (error) {
    console.error('Error fetching cover letter:', error);
    res.status(500).json({ error: 'Failed to fetch cover letter' });
  }
});

router.post('/cover-letters', async (req, res) => {
  try {
    const { userId, title, content, resumeId, jobId, companyName, jobTitle, tone } = req.body;

    if (!userId || !title || !content) {
      return res.status(400).json({ error: 'userId, title, and content are required' });
    }

    await trackInteraction(parseInt(userId), 'create_cover_letter', { title, companyName });

    const [newLetter] = await db
      .insert(coverLetters)
      .values({
        userId: parseInt(userId),
        title,
        content,
        resumeId: resumeId || null,
        jobId: jobId || null,
        companyName: companyName || null,
        jobTitle: jobTitle || null,
        tone: tone || 'professional',
      })
      .returning();

    res.status(201).json(newLetter);
  } catch (error) {
    console.error('Error creating cover letter:', error);
    res.status(500).json({ error: 'Failed to create cover letter' });
  }
});

router.put('/cover-letters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, title, content, tone } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const [updated] = await db
      .update(coverLetters)
      .set({
        title,
        content,
        tone,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(coverLetters.id, parseInt(id)),
          eq(coverLetters.userId, parseInt(userId))
        )
      )
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Cover letter not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating cover letter:', error);
    res.status(500).json({ error: 'Failed to update cover letter' });
  }
});

router.delete('/cover-letters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await db
      .delete(coverLetters)
      .where(
        and(
          eq(coverLetters.id, parseInt(id)),
          eq(coverLetters.userId, parseInt(userId as string))
        )
      );

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting cover letter:', error);
    res.status(500).json({ error: 'Failed to delete cover letter' });
  }
});

router.post('/ai/generate', async (req, res) => {
  try {
    const { userId, resumeId, jobTitle, companyName, tone } = req.body;

    await trackInteraction(parseInt(userId), 'ai_generate_cover_letter', { jobTitle, companyName });

    const generatedContent = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background and skills, I am confident I would be a valuable addition to your team.

Throughout my career, I have developed expertise that aligns well with the requirements of this role. I am particularly drawn to ${companyName} because of its reputation for innovation and commitment to excellence.

I would welcome the opportunity to discuss how my skills and experience can contribute to ${companyName}'s continued success. Thank you for considering my application.

Sincerely,
[Your Name]`;

    res.json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

export default router;
