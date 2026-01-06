import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createDiscogsClient, createSimpleDiscogsClient } from "@/lib/discogs";

export async function GET(request: NextRequest) {
  const consumerKey = process.env.DISCOGS_CONSUMER_KEY;
  const consumerSecret = process.env.DISCOGS_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    return NextResponse.json(
      { error: "Discogs credentials not configured" },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "100", 10);

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    // Check if we have auth tokens (for private collections)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("discogs_access_token")?.value;
    const accessTokenSecret = cookieStore.get("discogs_access_token_secret")?.value;

    let releases;
    let total;
    let pages;

    if (accessToken && accessTokenSecret) {
      // Use authenticated client
      const client = createDiscogsClient(
        consumerKey,
        consumerSecret,
        accessToken,
        accessTokenSecret
      );

      const response = await client.getCollection(username, 0, page, perPage);
      releases = response.releases;
      total = response.pagination.items;
      pages = response.pagination.pages;
    } else {
      // Use simple client for public collections
      const client = createSimpleDiscogsClient(consumerKey, consumerSecret);

      const response = await client.getPublicCollection(username, 0, page, perPage);
      releases = response.releases;
      total = response.pagination.items;
      pages = response.pagination.pages;
    }

    return NextResponse.json({
      releases,
      total,
      page,
      pages,
      hasMore: page < pages,
    });
  } catch (error) {
    console.error("Collection fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
