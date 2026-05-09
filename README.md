# TripMind AI

TripMind AI is a production-ready AI-powered travel planning and lead management platform built for modern travel agencies. It features a conversational AI interface to gather client preferences, generates beautiful personalized itineraries using OpenAI, and seamlessly manages leads in a drag-and-drop Kanban CRM dashboard.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, shadcn/ui
- **Backend/API:** Next.js Route Handlers
- **Database:** Supabase (PostgreSQL)
- **AI Integration:** OpenAI API (GPT-4o)
- **PDF Export:** jsPDF

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   Rename `.env.example` to `.env.local` and add your API keys:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   \`\`\`

3. **Supabase Database Setup**
   Run the SQL commands found in `supabase/schema.sql` in your Supabase project's SQL Editor to create the `travel_leads` table and configure Row Level Security (RLS).

4. **Run the Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Deployment to Vercel
1. Push the code to a GitHub repository.
2. Import the project into Vercel.
3. Add the environment variables in the Vercel dashboard.
4. Deploy!
