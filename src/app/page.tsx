"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const features = [
  { name: "Collection", desc: "Import & organize" },
  { name: "DNA", desc: "Discover patterns" },
  { name: "Compare", desc: "Match collections" },
  { name: "Search", desc: "Find records" },
  { name: "Trade", desc: "Exchange vinyl" },
  { name: "Stats", desc: "View analytics" },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* LEFT PANEL - Feature Grid */}
      <div className="lg:w-1/2 min-h-[40vh] lg:min-h-screen relative overflow-hidden bg-zinc-900 flex flex-col items-center justify-center p-6 lg:p-10">
        {/* Background subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 via-zinc-900 to-zinc-950" />

        <div className="relative z-10 w-full max-w-lg">
          {/* Main illustration displayed as grid */}
          <div className="relative mb-6">
            <Image
              src="/illustrations.png"
              alt="Vinyl collection features"
              width={800}
              height={400}
              className="w-full h-auto object-contain drop-shadow-xl"
              priority
            />
          </div>

          {/* Feature labels grid - matches illustration layout (3x2) */}
          <div className="grid grid-cols-3 gap-2 lg:gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center p-2 lg:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-default border border-transparent hover:border-[#e57373]/30"
              >
                <p className="text-xs lg:text-sm font-medium text-white/90 group-hover:text-[#e57373] transition-colors">
                  {feature.name}
                </p>
                <p className="text-[10px] lg:text-xs text-white/40 mt-0.5">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#e57373]/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-[#e57373]/5 rounded-full blur-xl" />
      </div>

      {/* RIGHT PANEL - Login/Form */}
      <div className="lg:w-1/2 min-h-[60vh] lg:min-h-screen flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-sm text-center">
          {/* Heading */}
          <h1
            className="text-3xl lg:text-4xl font-normal text-foreground mb-3"
            style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
          >
            Connect your collection
          </h1>

          <p className="text-muted-foreground mb-8">
            Sign in with your Discogs account to analyze your vinyl collection
            and discover your musical DNA.
          </p>

          {/* Main CTA */}
          <Button
            asChild
            size="lg"
            className="w-full h-12 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <a href="/api/auth/discogs" className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              </svg>
              Connect with Discogs
            </a>
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Permissions</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Permissions list */}
          <div className="space-y-3 mb-6">
            {["View your collection", "View your wantlist", "Read your profile info"].map(
              (permission) => (
                <div key={permission} className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-muted-foreground">{permission}</span>
                </div>
              )
            )}
          </div>

          {/* Create account link */}
          <p className="text-sm text-muted-foreground">
            Don&apos;t have a Discogs account?{" "}
            <a
              href="https://www.discogs.com/users/create"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2"
            >
              Create one free
            </a>
          </p>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Your data stays private. We never modify your collection.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Data via{" "}
              <a
                href="https://discogs.com"
                className="underline hover:text-muted-foreground/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discogs
              </a>
              . Not affiliated.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
