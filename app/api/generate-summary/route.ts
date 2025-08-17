import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    const { transcript, prompt } = await request.json();

    if (!transcript || !prompt) {
      return NextResponse.json(
        { error: 'Transcript and prompt are required' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are a professional meeting notes summarizer. Create clear, structured summaries based on the user's specific instructions."
        },
        {
          role: "user",
          content: `Please summarize the following transcript according to these instructions: "${prompt}"\n\nTranscript:\n${transcript}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content || 'No summary generated';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
