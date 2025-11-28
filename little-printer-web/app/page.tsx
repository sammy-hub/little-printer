"use client";

import { useEffect, useState } from "react";
import PrintStrip from "@/components/PrintStrip";
import PrintControls from "@/components/PrintControls";
import SettingsPanel from "@/components/SettingsPanel";
import {
  DEFAULT_COMIC_FEEDS,
  DEFAULT_REDDIT_SUBS,
  DEFAULT_RSS_FEEDS,
  LOCAL_STORAGE_SETTINGS_KEY
} from "@/lib/constants";
import type {
  ComicItem,
  NewsItem,
  PrintBlock,
  RedditItem,
  Theme,
  UserSettings
} from "@/lib/types";

type RssResponse = { items: NewsItem[] };
type RedditResponse = { items: RedditItem[] };
type ComicsResponse = { items: ComicItem[] };
type QuoteResponse = { text: string; author?: string };
type PuzzleResponse = { puzzle: { title: string; content: string } };

const DEFAULT_SETTINGS: UserSettings = {
  theme: "cozy",
  modules: {
    news: true,
    reddit: true,
    comics: true,
    quotes: true,
    puzzle: true
  },
  rssFeeds: DEFAULT_RSS_FEEDS,
  comicFeeds: DEFAULT_COMIC_FEEDS,
  subreddits: DEFAULT_REDDIT_SUBS,
  stripLength: "medium"
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getLimits(stripLength: UserSettings["stripLength"]) {
  switch (stripLength) {
    case "short":
      return { news: 3, reddit: 2, comics: 1 };
    case "long":
      return { news: 6, reddit: 4, comics: 2 };
    case "medium":
    default:
      return { news: 4, reddit: 3, comics: 1 };
  }
}

export default function Page() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [blocks, setBlocks] = useState<PrintBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserSettings>;
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          modules: { ...DEFAULT_SETTINGS.modules, ...(parsed.modules ?? {}) }
        });
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    }
  }, []);

  // Persist settings
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_SETTINGS_KEY,
        JSON.stringify(settings)
      );
    } catch (err) {
      console.error("Failed to save settings", err);
    }
  }, [settings]);

  // Initial placeholder preview
  useEffect(() => {
    const sampleBlocks: PrintBlock[] = [
      {
        type: "news",
        items: [
          {
            title: "Your cozy daily strip is ready to print.",
            source: "Little Printer Web"
          }
        ]
      },
      {
        type: "quote",
        text: "Small rituals make days feel bigger.",
        author: "Unknown"
      }
    ];
    setBlocks(sampleBlocks);
  }, []);

  async function generateBlocks(): Promise<PrintBlock[]> {
    const { modules, rssFeeds, subreddits, comicFeeds, stripLength } = settings;
    const limits = getLimits(stripLength);

    const newsPromise =
      modules.news && rssFeeds.length > 0
        ? (async () => {
            const encodedFeeds = rssFeeds
              .map((f) => encodeURIComponent(f.trim()))
              .join(",");
            const res = await fetch(
              `/api/rss?feeds=${encodedFeeds}&limit=${limits.news}`
            );
            if (!res.ok) throw new Error("RSS fetch failed");
            const data = (await res.json()) as RssResponse;
            return data.items;
          })()
        : Promise.resolve<NewsItem[]>([]);

    const redditPromise =
      modules.reddit && subreddits.length > 0
        ? (async () => {
            const encodedSubs = subreddits
              .map((s) => encodeURIComponent(s.trim()))
              .join(",");
            const res = await fetch(
              `/api/reddit?subs=${encodedSubs}&limit=${limits.reddit}`
            );
            if (!res.ok) throw new Error("Reddit fetch failed");
            const data = (await res.json()) as RedditResponse;
            return data.items;
          })()
        : Promise.resolve<RedditItem[]>([]);

    const comicsPromise =
      modules.comics && comicFeeds.length > 0
        ? (async () => {
            const encodedFeeds = comicFeeds
              .map((f) => encodeURIComponent(f.trim()))
              .join(",");
            const res = await fetch(
              `/api/comics?feeds=${encodedFeeds}&limit=${limits.comics}`
            );
            if (!res.ok) throw new Error("Comics fetch failed");
            const data = (await res.json()) as ComicsResponse;
            return data.items;
          })()
        : Promise.resolve<ComicItem[]>([]);

    const quotePromise = modules.quotes
      ? (async () => {
          const res = await fetch("/api/quote");
          if (!res.ok) throw new Error("Quote fetch failed");
          return (await res.json()) as QuoteResponse;
        })()
      : Promise.resolve<QuoteResponse | null>(null);

    const puzzlePromise = modules.puzzle
      ? (async () => {
          const res = await fetch("/api/puzzle");
          if (!res.ok) throw new Error("Puzzle fetch failed");
          return (await res.json()) as PuzzleResponse;
        })()
      : Promise.resolve<PuzzleResponse | null>(null);

    let newsItems: NewsItem[] = [];
    let redditItems: RedditItem[] = [];
    let comicItems: ComicItem[] = [];
    let quote: QuoteResponse | null = null;
    let puzzle: PuzzleResponse | null = null;

    try {
      [newsItems, redditItems, comicItems, quote, puzzle] = await Promise.all([
        newsPromise,
        redditPromise,
        comicsPromise,
        quotePromise,
        puzzlePromise
      ]);
    } catch (err) {
      console.error("Error fetching content", err);
    }

    const blocks: PrintBlock[] = [];

    if (newsItems.length) {
      blocks.push({
        type: "news",
        items: shuffle(newsItems)
      });
    }

    if (redditItems.length) {
      blocks.push({
        type: "reddit",
        items: shuffle(redditItems)
      });
    }

    if (comicItems.length) {
      blocks.push({
        type: "comic",
        items: shuffle(comicItems)
      });
    }

    if (quote) {
      blocks.push({
        type: "quote",
        text: quote.text,
        author: quote.author
      });
    }

    if (puzzle) {
      blocks.push({
        type: "puzzle",
        title: puzzle.puzzle.title,
        content: puzzle.puzzle.content
      });
    }

    if (!blocks.length) {
      // Fallback “nothing loaded but the app still loves you”
      blocks.push({
        type: "quote",
        text: "No fresh content right now, but you still deserve a tiny print.",
        author: "Little Printer Web"
      });
    }

    return blocks;
  }

  async function handleGenerateAndPrint() {
    setIsLoading(true);
    try {
      const newBlocks = await generateBlocks();
      setBlocks(newBlocks);
      // Give React a tick to commit the DOM before printing
      await new Promise((resolve) => setTimeout(resolve, 150));
      window.print();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while generating the strip.");
    } finally {
      setIsLoading(false);
    }
  }

  const theme: Theme = settings.theme;

  return (
    <main>
      <div className="app-shell">
        <header className="app-header no-print">
          <div>
            <div className="app-title">
              <span>🧾</span> <span>Little Printer Web</span>
            </div>
            <div className="app-subtitle">
              Cozy daily strips for your thermal printer.
            </div>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={() => setSettingsOpen(true)}
          >
            ⚙️ Settings
          </button>
        </header>

        <PrintStrip blocks={blocks} theme={theme} />

        <PrintControls
          onGenerateAndPrint={handleGenerateAndPrint}
          isLoading={isLoading}
        />

        <SettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onChange={setSettings}
        />
      </div>
    </main>
  );
}