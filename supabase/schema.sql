-- Supabase Database Schema for TripMind AI

-- 1. Create the travel_leads table
CREATE TABLE IF NOT EXISTS public.travel_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    email TEXT,
    destination TEXT NOT NULL,
    budget TEXT,
    travelers TEXT,
    trip_days INTEGER,
    preferences TEXT[],
    itinerary JSONB, -- Store the structured day-by-day itinerary
    ai_summary TEXT, -- Store any high-level AI notes
    status TEXT NOT NULL DEFAULT 'New Inquiry', -- Kanban status
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add Row Level Security (RLS) policies
-- Note: For a production app with authentication, you would restrict these policies based on auth.uid().
-- For this setup, assuming a backend server (Next.js API routes) uses the Service Role Key,
-- or we allow anonymous inserts if inquiries are submitted publicly.
ALTER TABLE public.travel_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (if the frontend creates leads directly without a backend, though Next.js API is safer)
CREATE POLICY "Allow anonymous inserts" ON public.travel_leads
    FOR INSERT WITH CHECK (true);

-- Allow authenticated/anonymous reads (for the dashboard - typically you'd restrict this to authenticated users only)
CREATE POLICY "Allow public reads" ON public.travel_leads
    FOR SELECT USING (true);

CREATE POLICY "Allow public updates" ON public.travel_leads
    FOR UPDATE USING (true);

-- 3. Create an updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Attach trigger to the travel_leads table
CREATE TRIGGER travel_leads_updated_at
    BEFORE UPDATE ON public.travel_leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
