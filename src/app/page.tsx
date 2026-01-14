"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* LEFT PANEL - Floating Constellation */}
      <div className="lg:w-1/2 min-h-[40vh] lg:min-h-screen relative overflow-hidden bg-zinc-900">
        {/* Animated background gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#e57373]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-[#e57373]/10 rounded-full blur-2xl animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-zinc-700/30 rounded-full blur-xl animate-pulse [animation-delay:2s]" />
        </div>

        {/* Floating illustrations */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main floating illustration */}
          <div className="relative animate-float">
            <Image
              src="/illustrations.png"
              alt="Vinyl collection analysis"
              width={600}
              height={300}
              className="w-[85%] max-w-lg mx-auto h-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Small decorative floating vinyl elements */}
          <div className="absolute top-16 right-12 w-12 h-12 opacity-20 animate-float-slow">
            <div className="w-full h-full rounded-full border-2 border-white/40">
              <div className="absolute inset-1/3 rounded-full bg-[#e57373]/60" />
            </div>
          </div>
          <div className="absolute bottom-20 left-8 w-8 h-8 opacity-15 animate-float-reverse">
            <div className="w-full h-full rounded-full border border-white/30">
              <div className="absolute inset-1/3 rounded-full bg-[#e57373]/40" />
            </div>
          </div>
          <div className="absolute top-1/3 left-6 w-6 h-6 opacity-10 animate-float-slow">
            <div className="w-full h-full rounded-full border border-white/20" />
          </div>
        </div>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(1deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes float-reverse {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(15px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float-slow 8s ease-in-out infinite;
          }
          .animate-float-reverse {
            animation: float-reverse 7s ease-in-out infinite;
          }
        `}</style>
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
