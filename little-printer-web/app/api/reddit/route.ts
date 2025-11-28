import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import type { RedditItem } from "@/lib/types";

export const runtime = "nodejs";

const parser = new Parser();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subsParam = searchParams.get("subs") ?? "";
  const limitParam = searchParams.get("limit") ?? "";
  const limit = Number(limitParam) > 0 ? Number(limitParam) : 2;

  const subStrings = subsParam
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const subs = subStrings.map((encoded) =>
    decodeURIComponent(encoded)
  ) as string[];

  if (!subs.length) {
    return NextResponse.json({ items: [] as RedditItem[] });
  }

  const results: RedditItem[] = [];

  await Promise.all(
    subs.map(async (sub) => {
      const url = `https://www.reddit.com/r/${sub}/.rss`;
      try {
        const feed = await parser.parseURL(url);
        const items = (feed.items || []).slice(0, limit);
        for (const item of items) {
          if (item.title) {
            results.push({
              title: item.title.trim(),
              subreddit: sub
            });
          }
        }
      } catch (err) {
        console.error("Reddit RSS error", sub, err);
      }
    })
  );

  return NextResponse.json({ items: results });
}