import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
  baseURL: "https://api.groq.com/openai/v1",
});

const GENERATE_PROMPT = `You are a world-class luxury travel consultant. 
Generate a detailed day-by-day travel itinerary based on the user's requirements.

You must reply ONLY with a valid JSON object matching this structure exactly:
{
  "title": "A catchy title for the trip",
  "summary": "A 2-sentence enticing summary of the experience",
  "estimatedCost": "Estimated total cost (e.g., $4,500)",
  "imageKeyword": "A highly specific descriptive keyword for high-quality destination photography (e.g. 'amalfi coast luxury', 'tokyo neon night', 'swiss alps chalet')",
  "tripSummary": {
    "bestTimeToVisit": "e.g. September to November",
    "expectedWeather": "e.g. Warm and sunny, 75°F",
    "travelStyle": "e.g. Luxury Backpacking, Wellness Retreat",
    "budgetLevel": "e.g. Premium, Budget, Moderate",
    "groupType": "e.g. Solo, Couples, Family of 4"
  },
  "days": [
    {
      "day": 1,
      "theme": "Cinematic Travel-Magazine Style Title (e.g. Arrival & Coastal Relaxation)",
      "activities": [
        {
          "time": "09:00 AM",
          "description": "Engaging description of the activity"
        }
      ],
      "food": [
        {
          "meal": "Lunch",
          "place": "Name of a highly-rated local restaurant or type of food"
        }
      ]
    }
  ]
}

CRITICAL RULES:
1. Make the 'theme' for each day cinematic, descriptive, and travel-magazine style (e.g., "Waterfalls & Tropical Trails"). AVOID generic titles like "Nature Day" or "Peaceful Places".
2. Ensure realistic times and logical geographical flow. Use STRICT 12-hour format with AM/PM for all times (e.g., "02:00 PM", never "14:00 PM" or "14:00"). Do NOT combine 24-hour and AM/PM.
3. Keep descriptions engaging but concise.`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ message: "OpenAI API key is missing." }, { status: 500 });
    }

    const body = await req.json();
    const { requirements } = body;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: GENERATE_PROMPT },
        { role: "user", content: `Requirements: ${JSON.stringify(requirements)}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiMessage = response.choices[0].message.content;
    const itinerary = JSON.parse(aiMessage || "{}");

    return NextResponse.json({ itinerary });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ message: "An error occurred during generation." }, { status: 500 });
  }
}
