import { NextRequest, NextResponse } from 'next/server';
import { generateCoverLetterSchema } from '@/agents/cover-letter-writer/lib/validation';

// POST /api/agents/job-seeker-agents/cover-letter-writer/ai/generate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = generateCoverLetterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const {
      companyName,
      jobTitle,
      jobDescription,
      recipientName,
      recipientTitle,
      tone,
      keywords,
      customInstructions
    } = validationResult.data;

    // Simulate AI generation - in production, this would call actual AI services
    const greeting = recipientName 
      ? `Dear ${recipientName}${recipientTitle ? `, ${recipientTitle}` : ''}`
      : 'Dear Hiring Manager';

    const toneAdjustments = {
      professional: {
        opening: "I am writing to express my strong interest in the",
        closing: "I would welcome the opportunity to discuss how my experience and skills can contribute to your team. Thank you for your consideration."
      },
      enthusiastic: {
        opening: "I am excited to apply for the",
        closing: "I am eager to bring my passion and skills to your team and would love the opportunity to discuss how I can contribute to your continued success!"
      },
      creative: {
        opening: "I was thrilled to discover the",
        closing: "I believe my unique perspective and creative approach would be a valuable addition to your team. I look forward to the possibility of contributing to your innovative work."
      }
    };

    const selectedTone = toneAdjustments[tone as keyof typeof toneAdjustments] || toneAdjustments.professional;

    // Generate sample content based on provided data
    const generatedContent = `${greeting},

${selectedTone.opening} ${jobTitle} position at ${companyName}. ${jobDescription ? 'After reviewing the job description, I am confident that my background aligns well with your requirements.' : 'My background and experience make me an ideal candidate for this role.'}

With my experience in relevant technologies and my passion for delivering high-quality solutions, I believe I would be a valuable addition to your team. ${keywords && keywords.length > 0 ? `My expertise includes ${keywords.slice(0, 3).join(', ')}, which directly aligns with your needs.` : ''}

${customInstructions ? `Additionally, ${customInstructions}` : 'Throughout my career, I have consistently demonstrated the ability to work collaboratively while delivering results that exceed expectations.'}

${selectedTone.closing}

Sincerely,
[Your Name]`;

    return NextResponse.json({ 
      generatedContent,
      suggestions: [
        'Consider adding specific examples of your achievements',
        'Include metrics to quantify your impact where possible',
        'Tailor the content further based on the company\'s values and culture'
      ]
    });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}