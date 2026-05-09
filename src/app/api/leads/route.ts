import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming lead payload:", JSON.stringify(body, null, 2));

    const { customerName, email, destination, budget, travelers, tripDays, preferences, itinerary, aiSummary } = body;

    // STEP 3: Normalize preferences to a flat string array
    let normalizedPreferences: string[] = [];
    if (Array.isArray(preferences)) {
      normalizedPreferences = preferences.flat().filter(p => typeof p === 'string' && p.trim() !== '');
    } else if (typeof preferences === 'string') {
      normalizedPreferences = [preferences];
    }

    console.log("Normalized preferences:", normalizedPreferences);

    const { data, error } = await supabase
      .from('travel_leads')
      .insert([
        {
          customer_name: customerName,
          email: email || null,
          destination: destination || "Unknown",
          budget: budget || null,
          travelers: travelers || null,
          trip_days: tripDays || null,
          preferences: normalizedPreferences,
          itinerary,
          ai_summary: aiSummary || null,
          status: 'New Inquiry'
        }
      ])
      .select();

    if (error) {
      console.error("Supabase insert error details:", JSON.stringify(error, null, 2));
      return NextResponse.json({ 
        message: "Error saving lead to Supabase", 
        error: error.message,
        details: error 
      }, { status: 500 });
    }

    console.log("Lead saved successfully:", data);
    return NextResponse.json({ message: "Lead saved successfully", data });
  } catch (error: any) {
    console.error("Critical server error in /api/leads:", error);
    return NextResponse.json({ 
      message: "A critical server error occurred", 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('travel_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase select error:", error);
      return NextResponse.json({ message: "Error fetching leads" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
