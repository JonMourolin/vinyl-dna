import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createDiscogsClient } from "@/lib/discogs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const consumerKey = process.env.DISCOGS_CONSUMER_KEY;
  const consumerSecret = process.env.DISCOGS_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    return NextResponse.json(
      { error: "Discogs credentials not configured" },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("discogs_access_token")?.value;
  const accessTokenSecret = cookieStore.get("discogs_access_token_secret")?.value;

  if (!accessToken || !accessTokenSecret) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const client = createDiscogsClient(
      consumerKey,
      consumerSecret,
      accessToken,
      accessTokenSecret
    );

    // Fetch wantlist (first 100 items)
    const wantlistResponse = await client.getWantlist(username, 1, 100);

    // Map wants to a format similar to collection releases
    const wants = wantlistResponse.wants.map((want: {
      id: number;
      rating: number;
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
    }) => ({
      id: want.id,
      rating: want.rating,
      basic_information: want.basic_information,
    }));

    return NextResponse.json({
      wants,
      total: wantlistResponse.pagination.items,
      username,
    });
  } catch (error) {
    console.error("Wantlist fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wantlist. It may be private." },
      { status: 500 }
    );
  }
}
