import { NextRequest, NextResponse } from 'next/server';
import { GenerateQuestionsSchema } from '@/agents/interview-prep/lib/validation';

// POST /api/agents/job-seeker-agents/interview-prep/ai/generate-questions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = GenerateQuestionsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { interviewType, difficulty, targetRole, count } = validationResult.data;

    // Mock AI-generated questions (replace with actual AI service)
    const questionTemplates = {
      behavioral: [
        "Tell me about a time when you had to work under pressure.",
        "Describe a situation where you had to resolve a conflict with a colleague.",
        "Give me an example of when you went above and beyond for a customer.",
        "Tell me about a time when you made a mistake and how you handled it.",
        "Describe a challenging project you worked on and how you overcame obstacles.",
      ],
      technical: [
        "Explain the difference between REST and GraphQL APIs.",
        "How would you optimize a slow-running database query?",
        "What are the principles of object-oriented programming?",
        "Describe how you would implement caching in a web application.",
        "Explain the concept of microservices architecture.",
      ],
      coding: [
        "Write a function to reverse a string without using built-in methods.",
        "Implement a function to find the longest palindrome in a string.",
        "Write code to merge two sorted arrays.",
        "Implement a binary search algorithm.",
        "Write a function to detect cycles in a linked list.",
      ],
      case_study: [
        "How would you design a social media platform for 100 million users?",
        "Analyze the business case for entering a new market.",
        "Design a pricing strategy for a new SaaS product.",
        "How would you approach reducing customer churn by 20%?",
        "Analyze the competitive landscape for our product.",
      ],
      system_design: [
        "Design a URL shortening service like bit.ly.",
        "How would you design a chat application like WhatsApp?",
        "Design a distributed cache system.",
        "How would you design a ride-sharing app like Uber?",
        "Design a content delivery network (CDN).",
      ],
      general: [
        "Why are you interested in this position?",
        "What are your strengths and weaknesses?",
        "Where do you see yourself in 5 years?",
        "Why are you leaving your current job?",
        "What motivates you in your work?",
      ],
    };

    const templates = questionTemplates[interviewType] || questionTemplates.general;
    const selectedQuestions = templates
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map((question) => ({
        question: targetRole 
          ? question.replace(/\b(position|role|job)\b/gi, targetRole)
          : question,
        interviewType,
        difficulty,
      }));

    return NextResponse.json(selectedQuestions);
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}