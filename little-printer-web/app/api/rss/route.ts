import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import type { NewsItem } from "@/lib/types";

export const runtime = "nodejs";

const parser = new Parser();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const feedsParam = searchParams.get("feeds") ?? "";
  const limitParam = searchParams.get("limit") ?? "";
  const limit = Number(limitParam) > 0 ? Number(limitParam) : 3;

  const feedStrings = feedsParam
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const feedUrls = feedStrings.map((encoded) =>
    decodeURIComponent(encoded)
  ) as string[];

  if (!feedUrls.length) {
    return NextResponse.json({ items: [] as NewsItem[] });
  }

  const results: NewsItem[] = [];

  await Promise.all(
    feedUrls.map(async (feedUrl) => {
      try {
        const feed = await parser.parseURL(feedUrl);
        const source =
          feed.title ||
          (() => {
            try {
              return new URL(feedUrl).hostname;
            } catch {
              return "Unknown";
            }
          })();

        const items = (feed.items || []).slice(0, limit);
        for (const item of items) {
          if (item.title) {
            results.push({
              title: item.title.trim(),
              source
            });
          }
        }
      } catch (err) {
        console.error("RSS feed error", feedUrl, err);
      }
    })
  );

  return NextResponse.json({ items: results });
}