"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* LEFT PANEL - Visual/Brand (full bleed) */}
      <div
        className="lg:w-1/2 min-h-[40vh] lg:min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/2117243/pexels-photo-2117243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* RIGHT PANEL - Login/Form */}
      <div className="lg:w-1/2 min-h-[60vh] lg:min-h-screen flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-sm text-center">
          {/* Heading */}
          <h1
            className="text-3xl lg:text-4xl font-normal text-gray-900 mb-3"
            style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
          >
            Connect your collection
          </h1>

          <p className="text-gray-500 mb-8">
            Sign in with your Discogs account to analyze your vinyl collection
            and discover your musical DNA.
          </p>

          {/* Main CTA */}
          <Button
            asChild
            size="lg"
            className="w-full h-12 text-base font-medium rounded-lg bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all duration-200 shadow-sm hover:shadow-md"
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
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Permissions</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Permissions list */}
          <div className="space-y-3 mb-6">
            {["View your collection", "View your wantlist", "Read your profile info"].map(
              (permission) => (
                <div key={permission} className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-amber-600"
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
                  <span className="text-sm text-gray-600">{permission}</span>
                </div>
              )
            )}
          </div>

          {/* Create account link */}
          <p className="text-sm text-gray-500">
            Don&apos;t have a Discogs account?{" "}
            <a
              href="https://www.discogs.com/users/create"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              Create one free
            </a>
          </p>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Your data stays private. We never modify your collection.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Data via{" "}
              <a
                href="https://discogs.com"
                className="underline hover:text-gray-600"
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
