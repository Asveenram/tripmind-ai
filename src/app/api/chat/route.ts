import { NextResponse } from "next/server";
import OpenAI from "openai";

// Optional: if you don't have an API key locally, this won't crash at build time
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
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
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ message: "OpenAI API key is missing. Please configure it in .env.local." }, { status: 500 });
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
    console.error("OpenAI Error:", error);
    return NextResponse.json({ message: "An error occurred during chat." }, { status: 500 });
  }
}
