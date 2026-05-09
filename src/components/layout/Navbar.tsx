import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-border/40">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">TripMind AI</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#workflow" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            How it Works
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="hidden sm:inline-flex">Dashboard</Button>
          </Link>
          <Link href="/planner">
            <Button className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
              Start Planning
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
