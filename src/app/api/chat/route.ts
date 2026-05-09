import { NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

// Optional: if you don't have an API key locally, this won't crash at build time
const openai = new OpenAI({
  apiKey: apiKey || "dummy",
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are a world-class luxury travel consultant for TripMind AI. 
Your goal is to gather the following 5 pieces of information from the user to plan their trip:
1. Destination
2. Budget
3. Number of Travelers
4. Number of Days
5. Travel Style / Preferences (e.g. relaxing, adventure, food)

Be extremely polite, premium, and concise. Ask smart follow-up questions, ONE at a time.
Once you have collected ALL 5 pieces of information, you MUST reply EXACTLY with this format:
READY_TO_GENERATE: {"destination": "...", "budget": "...", "travelers": "...", "days": "...", "preferences": "..."}

Do not say anything else after READY_TO_GENERATE.`;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error("Missing API Key: Neither GROQ_API_KEY nor OPENAI_API_KEY is configured.");
      return NextResponse.json(
        { message: "API configuration error. Please ensure GROQ_API_KEY is set in your Vercel deployment." }, 
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiMessage = response.choices[0].message;

    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error("Groq API Error in /api/chat:", error);
    
    // Provide a more meaningful error message instead of a generic one
    const errorDetail = error?.error?.message || error.message || "Unknown error";
    
    return NextResponse.json({ 
      message: "Failed to communicate with AI service.",
      error: errorDetail
    }, { status: 500 });
  }
}
