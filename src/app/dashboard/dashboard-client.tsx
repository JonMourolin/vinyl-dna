"use client";

import { useEffect, useState, useCallback } from "react";
import { Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DNACharts } from "@/components/dna-charts";
import { FriendCompare } from "@/components/friend-compare";
import { Recommendations } from "@/components/recommendations";
import Link from "next/link";
import type { DiscogsRelease } from "@/lib/discogs";

interface DashboardClientProps {
  username: string;
  avatarUrl?: string;
  expectedTotal?: number;
}

interface CollectionData {
  releases: DiscogsRelease[];
  total: number;
}

interface CachedCollection {
  data: CollectionData;
  timestamp: number;
  username: string;
}

const COLLECTION_CACHE_KEY = "deepcogs_collection";
const COLLECTION_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function loadCollectionFromCache(username: string, expectedTotal?: number): CollectionData | null {
  try {
    const cached = localStorage.getItem(COLLECTION_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp, username: cachedUsername }: CachedCollection = JSON.parse(cached);

    // Invalidate if different user
    if (cachedUsername !== username) return null;

    // Invalidate if TTL expired
    if (Date.now() - timestamp > COLLECTION_CACHE_TTL) return null;

    // Invalidate if collection size changed (if we know expected total)
    if (expectedTotal !== undefined && data.total !== expectedTotal) return null;

    return data;
  } catch {
    return null;
  }
}

function saveCollectionToCache(data: CollectionData, username: string): void {
  try {
    const cached: CachedCollection = {
      data,
      timestamp: Date.now(),
      username,
    };
    localStorage.setItem(COLLECTION_CACHE_KEY, JSON.stringify(cached));
  } catch {
    // localStorage might be full or disabled
  }
}

type TabValue = "dna" | "compare" | "discover";

// Icons as components
const DNAIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

const CompareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const DiscoverIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export function DashboardClient({ username, avatarUrl, expectedTotal }: DashboardClientProps) {
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("dna");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchPage = useCallback(async (page: number, existingReleases: DiscogsRelease[] = []) => {
    const response = await fetch(`/api/collection?username=${username}&page=${page}`);
    if (!response.ok) {
      throw new Error("Failed to fetch collection");
    }
    const data = await response.json();
    return {
      releases: [...existingReleases, ...data.releases],
      total: data.total,
      hasMore: data.hasMore,
      page: data.page,
    };
  }, [username]);

  const fetchCollection = useCallback(async (bypassCache = false) => {
    // Try cache first (unless bypassing)
    if (!bypassCache) {
      const cached = loadCollectionFromCache(username, expectedTotal);
      if (cached) {
        setCollection(cached);
        setFromCache(true);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      setFromCache(false);
      let allReleases: DiscogsRelease[] = [];
      let currentPageNum = 1;
      let hasMore = true;
      let total = 0;

      while (hasMore) {
        const result = await fetchPage(currentPageNum, allReleases);
        allReleases = result.releases;
        total = result.total;
        hasMore = result.hasMore;
        currentPageNum = result.page + 1;
        setLoadedCount(allReleases.length);
      }

      const collectionData = { releases: allReleases, total };
      setCollection(collectionData);
      saveCollectionToCache(collectionData, username);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load collection");
    } finally {
      setLoading(false);
    }
  }, [fetchPage, username, expectedTotal]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  // Calculate stats from collection
  const stats = collection ? calculateStats(collection.releases) : null;

  const navItems = [
    { id: "dna" as const, label: "DNA", icon: DNAIcon },
    { id: "compare" as const, label: "Compare", icon: CompareIcon },
    { id: "discover" as const, label: "Discover", icon: DiscoverIcon },
  ];

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed h-screen z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo + Mobile close button */}
        <div className="h-[85px] px-6 border-b border-sidebar-border relative flex items-center justify-center">
          <Link href="/" className="block text-5xl font-display text-sidebar-foreground text-center">
            deepcogs
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* User */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
            <Avatar className="w-9 h-9">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={username} />}
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{username}</p>
              <p className="text-xs text-muted-foreground">
                {loading
                  ? expectedTotal
                    ? `Loading ${loadedCount}/${expectedTotal}...`
                    : `Loading ${loadedCount}...`
                  : `${collection?.total || 0} releases`}
                {fromCache && !loading && (
                  <span className="text-muted-foreground/70"> (cached)</span>
                )}
              </p>
              {loading && expectedTotal && (
                <Progress
                  value={(loadedCount / expectedTotal) * 100}
                  className="h-1 mt-1"
                />
              )}
            </div>
            {!loading && (
              <button
                onClick={() => fetchCollection(true)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                title="Refresh collection"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
            Navigation
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            asChild
          >
            <Link href="/api/auth/logout">
              <LogoutIcon />
              Sign out
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 lg:ml-64 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-10 h-[85px] flex items-center">
          <div className="px-4 md:px-8">
            <div className="flex items-center gap-4">
              {/* Mobile hamburger menu */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              >
                <MenuIcon />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                  {activeTab === "dna" && "Collection DNA"}
                  {activeTab === "compare" && "Compare Collections"}
                  {activeTab === "discover" && "Discover New Music"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
                  {activeTab === "dna" && "Analyze the patterns in your vinyl collection"}
                  {activeTab === "compare" && "Find overlaps and trade opportunities with friends"}
                  {activeTab === "discover" && "Get personalized recommendations based on your taste"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 min-w-0 overflow-hidden">
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="py-4">
                <p className="text-red-700">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* DNA Tab */}
          {activeTab === "dna" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total"
                  value={loading ? "-" : String(collection?.total || 0)}
                  loading={loading}
                  icon={<Disc3 className="w-3 h-3" />}
                />
                <StatCard
                  label="Top Genre"
                  value={loading ? "-" : stats?.topGenre || "N/A"}
                  sublabel={stats?.topGenrePercent ? `${stats.topGenrePercent}%` : undefined}
                  loading={loading}
                />
                <StatCard
                  label="Top Decade"
                  value={loading ? "-" : stats?.topDecade || "N/A"}
                  sublabel={stats?.topDecadePercent ? `${stats.topDecadePercent}%` : undefined}
                  loading={loading}
                />
                <StatCard
                  label="Top Label"
                  value={loading ? "-" : stats?.topLabel || "N/A"}
                  sublabel={stats?.topLabelCount ? <>{stats.topLabelCount} <Disc3 className="w-3 h-3 inline" /></> : undefined}
                  loading={loading}
                />
              </div>

              {/* Charts */}
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-card">
                      <CardHeader>
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-48 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : collection ? (
                <DNACharts releases={collection.releases} />
              ) : (
                <Card className="bg-card">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No collection data available. Add some records on Discogs first!
                    </p>
                    <Button className="mt-4" asChild>
                      <a
                        href="https://www.discogs.com/user/collection"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Go to Discogs Collection
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Compare Tab */}
          {activeTab === "compare" && (
            <div className="space-y-6">
              <FriendCompare
                myUsername={username}
                myCollection={collection?.releases || []}
                isLoading={loading}
              />
            </div>
          )}

          {/* Discover Tab */}
          {activeTab === "discover" && (
            <div className="space-y-6">
              <Recommendations
                releases={collection?.releases || []}
                isLoading={loading}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Stat Card Component - Compact version
function StatCard({
  label,
  value,
  sublabel,
  loading,
  icon,
}: {
  label: string;
  value: string;
  sublabel?: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-gradient-to-br from-card to-card/50 rounded-lg px-3 py-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-primary flex items-center gap-1">{label}{icon}</p>
        {sublabel && !loading && (
          <span className="text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            {sublabel}
          </span>
        )}
      </div>
      {loading ? (
        <Skeleton className="h-5 w-16" />
      ) : (
        <p className="text-lg font-bold text-foreground truncate">{value}</p>
      )}
    </div>
  );
}

// Helper function to calculate stats
function calculateStats(releases: DiscogsRelease[]) {
  if (!releases.length) return null;

  // Genre stats
  const genreCounts: Record<string, number> = {};
  releases.forEach((r) => {
    r.basic_information.genres?.forEach((g) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });
  const topGenreEntry = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
  const topGenre = topGenreEntry?.[0] || "N/A";
  const topGenrePercent = topGenreEntry
    ? Math.round((topGenreEntry[1] / releases.length) * 100)
    : 0;

  // Decade stats
  const decadeCounts: Record<string, number> = {};
  releases.forEach((r) => {
    const year = r.basic_information.year;
    if (year && year > 1900) {
      const decade = `${Math.floor(year / 10) * 10}s`;
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
    }
  });
  const topDecadeEntry = Object.entries(decadeCounts).sort((a, b) => b[1] - a[1])[0];
  const topDecade = topDecadeEntry?.[0] || "N/A";
  const topDecadePercent = topDecadeEntry
    ? Math.round((topDecadeEntry[1] / releases.length) * 100)
    : 0;

  // Label stats
  const labelCounts: Record<string, number> = {};
  releases.forEach((r) => {
    r.basic_information.labels?.forEach((l) => {
      labelCounts[l.name] = (labelCounts[l.name] || 0) + 1;
    });
  });
  const topLabelEntry = Object.entries(labelCounts).sort((a, b) => b[1] - a[1])[0];
  const topLabel = topLabelEntry?.[0] || "N/A";
  const topLabelCount = topLabelEntry?.[1] || 0;

  return {
    topGenre,
    topGenrePercent,
    topDecade,
    topDecadePercent,
    topLabel,
    topLabelCount,
  };
}
