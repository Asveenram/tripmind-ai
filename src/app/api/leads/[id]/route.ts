import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    console.log(`Updating lead ${id} status to:`, status);

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;

    const { data, error } = await supabase
      .from('travel_leads')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ message: "Error updating lead", error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Lead updated successfully", data });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
}
