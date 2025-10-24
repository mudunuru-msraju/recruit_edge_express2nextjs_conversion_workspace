/**
 * Interview Prep API Routes
 * 
 * ⚠️ SECURITY WARNING - DEVELOPMENT ONLY ⚠️
 * See server/routes/SECURITY_WARNING.md for complete details.
 */

import { Router } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db.js';
import { interviewSessions, interviewQuestions, agentInteractions } from '../../shared/schema.js';

const router = Router();

// Helper function to track interactions
async function trackInteraction(userId: number, actionType: string, metadata: any) {
  await db.insert(agentInteractions).values({
    userId,
    agentSlug: 'interview-prep',
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

/**
 * Get all sessions for a user
 * GET /api/agents/interview-prep/sessions?userId={userId}
 */
router.get('/sessions', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const sessions = await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, parseInt(userId)))
      .orderBy(desc(interviewSessions.createdAt));

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

/**
 * Get a single session by ID
 * GET /api/agents/interview-prep/sessions/:id?userId={userId}
 */
router.get('/sessions/:id', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const [session] = await db
      .select()
      .from(interviewSessions)
      .where(
        and(
          eq(interviewSessions.id, sessionId),
          eq(interviewSessions.userId, parseInt(userId))
        )
      )
      .limit(1);

    if (!session) {
      return res.status(404).json({ error: 'Session not found or access denied' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

/**
 * Create a new session
 * POST /api/agents/interview-prep/sessions
 */
router.post('/sessions', async (req, res) => {
  try {
    const {
      userId,
      title,
      interviewType,
      difficulty,
      targetRole,
      targetCompany,
      numberOfQuestions = 5,
    } = req.body;

    if (!userId || !title || !interviewType) {
      return res.status(400).json({ error: 'userId, title, and interviewType are required' });
    }

    const [session] = await db
      .insert(interviewSessions)
      .values({
        userId: parseInt(userId),
        title,
        interviewType,
        difficulty: difficulty || null,
        targetRole: targetRole || null,
        targetCompany: targetCompany || null,
        metadata: { numberOfQuestions },
      })
      .returning();

    await trackInteraction(parseInt(userId), 'session_created', {
      sessionId: session.id,
      title: session.title,
      interviewType: session.interviewType,
    });

    res.json({ id: session.id, session });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

/**
 * Update a session
 * PUT /api/agents/interview-prep/sessions/:id
 */
router.put('/sessions/:id', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { userId, title, score, feedback, duration } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Verify ownership
    const [existingSession] = await db
      .select()
      .from(interviewSessions)
      .where(
        and(
          eq(interviewSessions.id, sessionId),
          eq(interviewSessions.userId, parseInt(userId))
        )
      )
      .limit(1);

    if (!existingSession) {
      return res.status(404).json({ error: 'Session not found or access denied' });
    }

    const [updatedSession] = await db
      .update(interviewSessions)
      .set({
        title: title || existingSession.title,
        score: score !== undefined ? score : existingSession.score,
        feedback: feedback !== undefined ? feedback : existingSession.feedback,
        duration: duration !== undefined ? duration : existingSession.duration,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(interviewSessions.id, sessionId),
          eq(interviewSessions.userId, parseInt(userId))
        )
      )
      .returning();

    await trackInteraction(parseInt(userId), 'session_updated', {
      sessionId: updatedSession.id,
      title: updatedSession.title,
    });

    res.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

/**
 * Delete a session
 * DELETE /api/agents/interview-prep/sessions/:id?userId={userId}
 */
router.delete('/sessions/:id', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await db
      .delete(interviewSessions)
      .where(
        and(
          eq(interviewSessions.id, sessionId),
          eq(interviewSessions.userId, parseInt(userId))
        )
      );

    await trackInteraction(parseInt(userId), 'session_deleted', { sessionId });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

/**
 * Get questions for a session
 * GET /api/agents/interview-prep/sessions/:sessionId/questions
 */
router.get('/sessions/:sessionId/questions', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    
    const questions = await db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.sessionId, sessionId))
      .orderBy(interviewQuestions.createdAt);

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

/**
 * Create a question for a session
 * POST /api/agents/interview-prep/sessions/:sessionId/questions
 */
router.post('/sessions/:sessionId/questions', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const { question, interviewType, difficulty, userAnswer } = req.body;

    if (!question || !interviewType) {
      return res.status(400).json({ error: 'question and interviewType are required' });
    }

    const [newQuestion] = await db
      .insert(interviewQuestions)
      .values({
        sessionId,
        question,
        interviewType,
        difficulty: difficulty || null,
        userAnswer: userAnswer || null,
      })
      .returning();

    res.json({ id: newQuestion.id, question: newQuestion });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

/**
 * Update a question
 * PUT /api/agents/interview-prep/sessions/:sessionId/questions/:questionId
 */
router.put('/sessions/:sessionId/questions/:questionId', async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const { userAnswer, evaluation, timeSpent } = req.body;

    const [updatedQuestion] = await db
      .update(interviewQuestions)
      .set({
        userAnswer: userAnswer !== undefined ? userAnswer : undefined,
        evaluation: evaluation !== undefined ? evaluation : undefined,
        timeSpent: timeSpent !== undefined ? timeSpent : undefined,
        updatedAt: new Date(),
      })
      .where(eq(interviewQuestions.id, questionId))
      .returning();

    res.json({ success: true, question: updatedQuestion });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

/**
 * AI: Generate questions (Mock implementation)
 * POST /api/agents/interview-prep/ai/generate-questions
 */
router.post('/ai/generate-questions', async (req, res) => {
  try {
    const { interviewType, difficulty, targetRole, count = 5 } = req.body;

    // Mock AI-generated questions
    const mockQuestions = Array.from({ length: count }, (_, i) => ({
      question: `Sample ${interviewType} question ${i + 1} for ${targetRole || 'role'}`,
      interviewType,
      difficulty: difficulty || 'medium',
    }));

    res.json(mockQuestions);
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

/**
 * AI: Evaluate answer (Mock implementation)
 * POST /api/agents/interview-prep/ai/evaluate-answer
 */
router.post('/ai/evaluate-answer', async (req, res) => {
  try {
    const { question, answer } = req.body;

    // Mock evaluation
    const mockEvaluation = {
      score: Math.floor(Math.random() * 30) + 70,
      strengths: ['Clear communication', 'Good structure'],
      improvements: ['Add more specific examples', 'Elaborate on key points'],
      feedback: 'Good answer overall. Consider providing more concrete examples to strengthen your response.',
    };

    res.json(mockEvaluation);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

/**
 * Get interaction history
 * GET /api/agents/interview-prep/history?userId={userId}
 */
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const history = await db
      .select()
      .from(agentInteractions)
      .where(
        and(
          eq(agentInteractions.userId, parseInt(userId)),
          eq(agentInteractions.agentSlug, 'interview-prep')
        )
      )
      .orderBy(desc(agentInteractions.createdAt))
      .limit(50);

    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
