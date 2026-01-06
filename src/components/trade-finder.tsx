"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DiscogsRelease } from "@/lib/discogs";

interface TradeFinderProps {
  myUsername: string;
  myCollection: DiscogsRelease[];
  isLoading: boolean;
}

interface WantlistItem {
  id: number;
  basic_information: {
    id: number;
    master_id: number;
    title: string;
    year: number;
    thumb: string;
    artists: Array<{ name: string; id: number }>;
    genres: string[];
    styles: string[];
  };
}

interface TradeOpportunity {
  release: DiscogsRelease;
  matchedWant: WantlistItem;
}

interface TradeResult {
  friendUsername: string;
  youCanOffer: TradeOpportunity[];
  theyCanOffer: TradeOpportunity[];
}

function TradeCard({ opportunity }: { opportunity: TradeOpportunity }) {
  const info = opportunity.release.basic_information;
  return (
    <a
      href={`https://www.discogs.com/release/${info.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="flex gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all hover:scale-[1.02]">
        {info.thumb ? (
          <img
            src={info.thumb}
            alt={info.title}
            className="w-14 h-14 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded bg-muted flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{info.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {info.artists?.map((a) => a.name).join(", ")} {info.year ? `• ${info.year}` : ""}
          </p>
          <div className="flex gap-1 mt-1">
            {info.genres?.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
        <svg
          className="w-5 h-5 text-green-500 flex-shrink-0 self-center"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      </div>
    </a>
  );
}

export function TradeFinder({
  myUsername,
  myCollection,
  isLoading: myCollectionLoading,
}: TradeFinderProps) {
  const [friendUsername, setFriendUsername] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TradeResult | null>(null);

  const handleSearch = async () => {
    if (!friendUsername.trim()) return;
    if (friendUsername.toLowerCase() === myUsername.toLowerCase()) {
      setError("You can't trade with yourself!");
      return;
    }

    setSearching(true);
    setError(null);

    try {
      // Fetch friend's wantlist
      const wantlistResponse = await fetch(
        `/api/wantlist/${encodeURIComponent(friendUsername)}`
      );

      if (!wantlistResponse.ok) {
        const errorData = await wantlistResponse.json();
        throw new Error(errorData.error || "Failed to fetch wantlist");
      }

      const wantlistData = await wantlistResponse.json();
      const friendWants: WantlistItem[] = wantlistData.wants;

      // Fetch friend's collection for reverse matching
      const collectionResponse = await fetch(
        `/api/collection?username=${encodeURIComponent(friendUsername)}`
      );

      let friendCollection: DiscogsRelease[] = [];
      if (collectionResponse.ok) {
        const collectionData = await collectionResponse.json();
        friendCollection = collectionData.releases || [];
      }

      // Find what you can offer (your collection items that match their wantlist)
      const friendWantMasterIds = new Set(
        friendWants.map((w) => w.basic_information.master_id).filter(Boolean)
      );

      const youCanOffer: TradeOpportunity[] = myCollection
        .filter((r) => friendWantMasterIds.has(r.basic_information.master_id))
        .map((release) => ({
          release,
          matchedWant: friendWants.find(
            (w) => w.basic_information.master_id === release.basic_information.master_id
          )!,
        }));

      // For reverse matching, we'd need our own wantlist
      // For now, show what they have that might interest us (from their collection)
      // This is a simplified version - ideally we'd fetch our own wantlist
      const theyCanOffer: TradeOpportunity[] = [];

      setResult({
        friendUsername,
        youCanOffer,
        theyCanOffer,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to find trade opportunities"
      );
    } finally {
      setSearching(false);
    }
  };

  if (myCollectionLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade Finder</CardTitle>
          <CardDescription>Loading your collection first...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Trade Finder
          </CardTitle>
          <CardDescription>
            Find records you own that a friend wants. Enter their Discogs username
            to discover trade opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter friend's Discogs username"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              disabled={searching}
              className="max-w-xs"
            />
            <Button
              onClick={handleSearch}
              disabled={searching || !friendUsername.trim()}
            >
              {searching ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Searching...
                </>
              ) : (
                "Find Trades"
              )}
            </Button>
          </div>

          {error && <p className="text-sm text-destructive mt-3">{error}</p>}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Trade Opportunities with {result.friendUsername}
              {result.youCanOffer.length > 0 && (
                <Badge variant="default" className="bg-green-500">
                  {result.youCanOffer.length} matches
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Records you have that {result.friendUsername} wants
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.youCanOffer.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground">
                  No trade opportunities found. You don't have any records that{" "}
                  {result.friendUsername} wants.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Their wantlist may be private or empty.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  You have {result.youCanOffer.length} record
                  {result.youCanOffer.length !== 1 ? "s" : ""} that{" "}
                  {result.friendUsername} is looking for:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                  {result.youCanOffer.map((opportunity) => (
                    <TradeCard
                      key={opportunity.release.instance_id}
                      opportunity={opportunity}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
