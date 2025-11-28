import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import type { ComicItem } from "@/lib/types";

export const runtime = "nodejs";

const parser = new Parser();

function extractImageUrl(item: any): string | null {
  // 1) enclosure url
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url as string;
  }

  // 2) content / content:encoded with img src
  const html =
    (item["content:encoded"] as string | undefined) ??
    (item.content as string | undefined);

  if (html) {
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const feedsParam = searchParams.get("feeds") ?? "";
  const limitParam = searchParams.get("limit") ?? "";
  const limit = Number(limitParam) > 0 ? Number(limitParam) : 1;

  const feedStrings = feedsParam
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const feedUrls = feedStrings.map((encoded) =>
    decodeURIComponent(encoded)
  ) as string[];

  if (!feedUrls.length) {
    return NextResponse.json({ items: [] as ComicItem[] });
  }

  const results: ComicItem[] = [];

  await Promise.all(
    feedUrls.map(async (feedUrl) => {
      try {
        const feed = await parser.parseURL(feedUrl);
        const items = (feed.items || []).slice(0, limit);
        for (const item of items) {
          const imageUrl = extractImageUrl(item);
          if (imageUrl) {
            results.push({
              imageUrl,
              title: item.title || undefined
            });
          }
        }
      } catch (err) {
        console.error("Comic feed error", feedUrl, err);
      }
    })
  );

  return NextResponse.json({ items: results });
}