import { Navbar } from "@/components/layout/Navbar";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { supabase } from "@/lib/supabase";

// We disable caching to ensure the dashboard always shows the latest leads
export const revalidate = 0;

export default async function DashboardPage() {
  let initialLeads = [];

  try {
    // Direct Supabase query instead of absolute fetch loopback for better reliability
    const { data, error } = await supabase
      .from('travel_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    initialLeads = data || [];
  } catch (error) {
    console.error("Failed to fetch leads from Supabase:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 container px-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Travel CRM</h1>
          <p className="text-muted-foreground mt-1">Manage your incoming inquiries and active trips.</p>
        </div>
        <div className="flex-1 min-h-[600px]">
          <KanbanBoard initialLeads={initialLeads} />
        </div>
      </main>
    </div>
  );
}
