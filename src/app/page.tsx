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
        className="absolute inset-0 bg-gradient-to-br from-[#606080] via-[#ca1400] to-[#212121]"
        aria-hidden="true"
      />
    ),
  }
);

export default function Home() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 md:p-10">
      {/* Full-page shader background */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <ShaderGradientBackground />
      </div>

      {/* Centered login card */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl p-8">
          {/* Heading */}
          <h1
            className="text-2xl lg:text-3xl font-normal text-foreground mb-2 text-center"
            style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
          >
            Connect your collection
          </h1>

          <p className="text-sm text-muted-foreground mb-8 text-center">
            Sign in with your Discogs account to analyze your vinyl collection
            and discover your musical DNA.
          </p>

          {/* Main CTA */}
          <Button
            asChild
            size="lg"
            className="w-full h-12 text-base font-medium rounded-lg bg-[#ca1400]/70 text-white hover:bg-[#ca1400]/85 backdrop-blur-sm transition-all duration-200"
          >
            <a href="/api/auth/discogs">
              Connect with Discogs
            </a>
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Permissions</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Permissions list */}
          <div className="space-y-3 mb-6">
            {["View your collection", "View your wantlist", "Read your profile info"].map(
              (permission) => (
                <div key={permission} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
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
        </div>

        {/* Footer outside card */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/80">
            Your data stays private. We never modify your collection.
          </p>
          <p className="text-xs text-white/80 mt-1">
            Data via{" "}
            <a
              href="https://discogs.com"
              className="underline hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discogs
            </a>
            . Not affiliated.
          </p>
        </div>
      </div>
    </main>
  );
}
