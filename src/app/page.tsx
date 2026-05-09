import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <footer className="py-12 border-t border-border/40 bg-slate-50 dark:bg-slate-900/20">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">TripMind AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TripMind AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
