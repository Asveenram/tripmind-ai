"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Map } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl opacity-50" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-3xl opacity-50" />
      </div>

      <div className="container px-4 md:px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background/50 backdrop-blur-sm mb-8"
        >
          <Sparkles className="h-4 w-4 text-primary mr-2" />
          <span className="text-muted-foreground">The future of travel planning is here</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
        >
          Plan <span className="gradient-text">Smarter Trips</span> with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
        >
          AI-powered itinerary generation and travel lead management for modern travel agencies. Turn inquiries into bookings in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/planner" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full text-base h-14 px-8 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all group">
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full text-base h-14 px-8 bg-background/50 backdrop-blur-sm">
              Explore CRM
              <Map className="ml-2 h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="w-full max-w-5xl mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="rounded-2xl border bg-background shadow-2xl overflow-hidden glass">
            <div className="h-12 border-b flex items-center px-4 bg-muted/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
            </div>
            <div className="p-8 aspect-[16/9] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
              <div className="grid grid-cols-3 gap-6 w-full h-full opacity-60">
                <div className="space-y-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                  <div className="h-24 bg-white dark:bg-slate-800 rounded-xl shadow-sm" />
                  <div className="h-24 bg-white dark:bg-slate-800 rounded-xl shadow-sm" />
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                  <div className="h-32 bg-white dark:bg-slate-800 rounded-xl shadow-sm" />
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                  <div className="h-24 bg-white dark:bg-slate-800 rounded-xl shadow-sm" />
                  <div className="h-40 bg-white dark:bg-slate-800 rounded-xl shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
