import { NextRequest, NextResponse } from 'next/server';
import { EvaluateAnswerSchema } from '@/agents/interview-prep/lib/validation';

// POST /api/agents/job-seeker-agents/interview-prep/ai/evaluate-answer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = EvaluateAnswerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { question, answer } = validationResult.data;

    // Mock AI evaluation (replace with actual AI service)
    const answerLength = answer.length;
    const questionType = determineQuestionType(question);
    
    // Basic scoring algorithm based on answer characteristics
    let baseScore = 70;
    
    // Length scoring
    if (answerLength > 200) baseScore += 10;
    if (answerLength < 50) baseScore -= 15;
    
    // Keyword scoring for different question types
    const keywords = getKeywordsForQuestionType(questionType);
    const foundKeywords = keywords.filter(keyword => 
      answer.toLowerCase().includes(keyword.toLowerCase())
    );
    baseScore += Math.min(foundKeywords.length * 3, 15);
    
    // Add some randomness to simulate AI evaluation
    const randomVariation = Math.floor(Math.random() * 10) - 5;
    const finalScore = Math.max(0, Math.min(100, baseScore + randomVariation));
    
    // Generate feedback based on score
    const evaluation = generateEvaluation(finalScore, questionType, answerLength, foundKeywords);

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}

function determineQuestionType(question: string): string {
  const lowercaseQuestion = question.toLowerCase();
  
  if (lowercaseQuestion.includes('tell me about a time') || 
      lowercaseQuestion.includes('describe a situation')) {
    return 'behavioral';
  }
  if (lowercaseQuestion.includes('how would you') || 
      lowercaseQuestion.includes('explain') ||
      lowercaseQuestion.includes('implement')) {
    return 'technical';
  }
  if (lowercaseQuestion.includes('write') || 
      lowercaseQuestion.includes('code') ||
      lowercaseQuestion.includes('algorithm')) {
    return 'coding';
  }
  if (lowercaseQuestion.includes('design') || 
      lowercaseQuestion.includes('architecture')) {
    return 'system_design';
  }
  return 'general';
}

function getKeywordsForQuestionType(questionType: string): string[] {
  const keywordMap: { [key: string]: string[] } = {
    behavioral: ['situation', 'action', 'result', 'challenge', 'team', 'solution', 'learned'],
    technical: ['implementation', 'approach', 'consider', 'optimize', 'performance', 'scalability'],
    coding: ['algorithm', 'complexity', 'optimization', 'edge case', 'testing'],
    system_design: ['scalability', 'reliability', 'availability', 'consistency', 'performance'],
    general: ['experience', 'skills', 'goals', 'motivation', 'growth'],
  };
  
  return keywordMap[questionType] || keywordMap.general;
}

function generateEvaluation(score: number, questionType: string, answerLength: number, foundKeywords: string[]): object {
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  if (score >= 85) {
    strengths.push('Excellent comprehensive answer');
    strengths.push('Strong structure and clarity');
  } else if (score >= 70) {
    strengths.push('Good overall response');
    strengths.push('Clear communication');
  } else {
    improvements.push('Consider providing more detailed examples');
  }
  
  if (answerLength > 200) {
    strengths.push('Detailed and thorough response');
  } else if (answerLength < 100) {
    improvements.push('Expand your answer with more specific details');
  }
  
  if (foundKeywords.length > 3) {
    strengths.push('Good use of relevant terminology');
  } else if (foundKeywords.length < 2) {
    improvements.push('Include more specific examples and terminology');
  }
  
  if (questionType === 'behavioral') {
    if (!foundKeywords.includes('situation') && !foundKeywords.includes('action')) {
      improvements.push('Use the STAR method (Situation, Task, Action, Result)');
    }
  }
  
  let feedback = `Your answer scored ${score}/100. `;
  
  if (score >= 85) {
    feedback += 'Excellent response! You demonstrated strong communication skills and provided comprehensive details.';
  } else if (score >= 70) {
    feedback += 'Good response overall. Consider adding more specific examples to strengthen your answer.';
  } else {
    feedback += 'There\'s room for improvement. Focus on providing more detailed examples and clearer structure.';
  }
  
  return {
    score,
    strengths,
    improvements,
    feedback,
  };
}