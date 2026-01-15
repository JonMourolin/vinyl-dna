"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const ShaderGradientBackground = dynamic(
  () =>
    import("@/components/shader-gradient-background").then(
      (mod) => mod.ShaderGradientBackground
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#803d2f] via-[#ca0043] to-[#212121]"
        aria-hidden="true"
      />
    ),
  }
);

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* LEFT PANEL - Visual/Brand (full bleed) */}
      <div className="lg:w-1/2 min-h-[40vh] lg:min-h-screen relative overflow-hidden bg-black">
        <ShaderGradientBackground />
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
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
