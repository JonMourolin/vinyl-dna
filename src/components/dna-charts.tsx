"use client";

import { useMemo } from "react";
import { Disc3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DiscogsRelease } from "@/lib/discogs";

interface DNAChartsProps {
  releases: DiscogsRelease[];
}

// Velvet theme color palette (coral/pink tones)
const COLORS = [
  "#E8786B", // Coral (primary)
  "#D4657A", // Rose pink
  "#B85A7A", // Dusty rose
  "#9A4F6E", // Mauve
  "#E89A8B", // Peach
  "#C76D6D", // Terracotta
  "#A66B7A", // Muted plum
  "#7D4F5A", // Dark rose
];

// Keywords for oddities detection
const ODDITY_PATTERNS = {
  testPressing: /test\s*press/i,
  promo: /promo|white\s*label/i,
  limited: /limited|numbered/i,
};

// Keywords for repress detection
const REPRESS_PATTERN = /reissue|re-issue|remaster|repress|re-press|2nd\s*press|second\s*press|180\s*g/i;

function analyzeCollection(releases: DiscogsRelease[]) {
  const genres: Record<string, number> = {};
  const styles: Record<string, number> = {};
  const decades: Record<string, number> = {};
  const labels: Record<string, number> = {};
  const formats: Record<string, number> = {};
  const years: Record<number, number> = {};

  let testPressings = 0;
  let promos = 0;
  let limited = 0;
  let represses = 0;

  releases.forEach((release) => {
    const info = release.basic_information;

    const formatDescriptions = info.formats
      ?.flatMap((f) => [f.name, ...(f.descriptions || [])])
      .join(" ") || "";

    if (ODDITY_PATTERNS.testPressing.test(formatDescriptions)) testPressings++;
    if (ODDITY_PATTERNS.promo.test(formatDescriptions)) promos++;
    if (ODDITY_PATTERNS.limited.test(formatDescriptions)) limited++;
    if (REPRESS_PATTERN.test(formatDescriptions)) represses++;

    info.genres?.forEach((genre) => {
      genres[genre] = (genres[genre] || 0) + 1;
    });

    info.styles?.forEach((style) => {
      styles[style] = (styles[style] || 0) + 1;
    });

    if (info.year && info.year > 1900) {
      const decade = Math.floor(info.year / 10) * 10;
      const decadeLabel = `${decade}s`;
      decades[decadeLabel] = (decades[decadeLabel] || 0) + 1;
      years[info.year] = (years[info.year] || 0) + 1;
    }

    info.labels?.forEach((label) => {
      if (label.name && label.name !== "Not On Label") {
        labels[label.name] = (labels[label.name] || 0) + 1;
      }
    });

    info.formats?.forEach((format) => {
      formats[format.name] = (formats[format.name] || 0) + 1;
    });
  });

  const sortByCount = (obj: Record<string, number>, limit = 10) =>
    Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name, value]) => ({ name, value }));

  const sortDecades = (obj: Record<string, number>) =>
    Object.entries(obj)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => ({ name, value }));

  return {
    genres: sortByCount(genres, 8),
    styles: sortByCount(styles, 15),
    decades: sortDecades(decades),
    labels: sortByCount(labels, 10),
    formats: sortByCount(formats, 5),
    totalReleases: releases.length,
    uniqueGenres: Object.keys(genres).length,
    uniqueLabels: Object.keys(labels).length,
    yearRange: {
      min: Math.min(...Object.keys(years).map(Number).filter(y => y > 1900)),
      max: Math.max(...Object.keys(years).map(Number)),
    },
    oddities: { testPressings, promos, limited },
    represses,
  };
}

export function DNACharts({ releases }: DNAChartsProps) {
  const analysis = useMemo(() => analyzeCollection(releases), [releases]);

  if (releases.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No releases found in your collection to analyze.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Genre & Era Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Genre DNA</CardTitle>
            <CardDescription>
              Your collection&apos;s genre breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {(() => {
                  // Square root scale: compresses high values, expands low values
                  const maxSqrt = Math.sqrt(Math.max(...analysis.genres.map((g) => g.value)));
                  const radarData = analysis.genres.map((g) => ({
                    genre: g.name,
                    value: Math.round((Math.sqrt(g.value) / maxSqrt) * 100),
                    actualPercent: Math.round((g.value / analysis.totalReleases) * 100),
                    count: g.value,
                  }));
                  return (
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <defs>
                        <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                        </radialGradient>
                      </defs>
                      <PolarGrid stroke="var(--border)" strokeOpacity={0.5} />
                      <PolarAngleAxis
                        dataKey="genre"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Genre"
                        dataKey="value"
                        stroke="var(--chart-1)"
                        fill="url(#radarGradient)"
                        strokeWidth={2}
                      />
                      <Tooltip
                        cursor={false}
                        contentStyle={{
                          background: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          color: "var(--popover-foreground)",
                        }}
                        content={({ active, payload }) => {
                          if (!active || !payload?.[0]) return null;
                          const data = payload[0].payload;
                          return (
                            <div style={{
                              background: "var(--popover)",
                              border: "1px solid var(--border)",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}>
                              <p style={{ color: "var(--popover-foreground)", margin: 0, fontWeight: 500 }}>
                                {data.genre}
                              </p>
                              <p style={{ color: "var(--chart-1)", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                                <strong>{data.actualPercent}%</strong> ({data.count} <Disc3 className="w-3 h-3 inline" />)
                              </p>
                            </div>
                          );
                        }}
                      />
                    </RadarChart>
                  );
                })()}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Decade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Era Distribution</CardTitle>
            <CardDescription>When your music was released</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysis.decades}>
                  <defs>
                    <linearGradient id="eraGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={false}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.[0]) return null;
                      return (
                        <div style={{
                          background: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}>
                          <p style={{ color: "var(--popover-foreground)", margin: 0, fontWeight: 500 }}>
                            {label}
                          </p>
                          <p style={{ color: "var(--chart-1)", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                            {payload[0].value} <Disc3 className="w-3 h-3" />
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#eraGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Style Breakdown - moved here after Genre & Era */}
      <Card>
        <CardHeader>
          <CardTitle>Style Breakdown</CardTitle>
          <CardDescription>
            More specific sub-genres in your collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis.styles.map((style, index) => (
              <span
                key={style.name}
                className="px-3 py-1.5 rounded-full text-sm font-medium border"
                style={{
                  backgroundColor: `${COLORS[index % COLORS.length]}15`,
                  color: COLORS[index % COLORS.length],
                  borderColor: `${COLORS[index % COLORS.length]}30`,
                }}
              >
                {style.name} ({style.value})
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Labels & Oddities */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Labels */}
        <Card>
          <CardHeader>
            <CardTitle>Top Labels</CardTitle>
            <CardDescription>Your most collected labels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.labels.slice(0, 8).map((label, index) => (
                <div key={label.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground truncate max-w-[120px] sm:max-w-[200px]">
                      {label.name}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      {label.value} <Disc3 className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(label.value / analysis.labels[0].value) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Oddities & Pressings */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Oddities & Pressings</CardTitle>
            <CardDescription>
              Rare formats and pressing breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
              {[
                { label: "Originals", value: analysis.totalReleases - analysis.represses, colorVar: "--chart-4" },
                { label: "Represses", value: analysis.represses, colorVar: "--chart-5" },
                { label: "Limited", value: analysis.oddities.limited, colorVar: "--chart-3" },
                { label: "Promos", value: analysis.oddities.promos, colorVar: "--chart-2" },
                { label: "Test Press", value: analysis.oddities.testPressings, colorVar: "--chart-1" },
              ]
                .sort((a, b) => b.value - a.value)
                .map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-lg border aspect-square ${index === 4 ? "col-span-2 sm:col-span-1" : ""}`}
                    style={{
                      backgroundColor: `oklch(from var(${item.colorVar}) l c h / 0.1)`,
                      borderColor: `oklch(from var(${item.colorVar}) l c h / 0.2)`,
                    }}
                  >
                    <p className="text-2xl md:text-3xl font-bold" style={{ color: `var(${item.colorVar})` }}>
                      {item.value}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2 text-center whitespace-nowrap">{item.label}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
