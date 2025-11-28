export type Theme = "cozy" | "minimal" | "playful";

export type UserSettings = {
  theme: Theme;
  modules: {
    news: boolean;
    reddit: boolean;
    comics: boolean;
    quotes: boolean;
    puzzle: boolean;
  };
  rssFeeds: string[];
  comicFeeds: string[];
  subreddits: string[];
  stripLength: "short" | "medium" | "long";
};

export type NewsItem = {
  title: string;
  source: string;
};

export type RedditItem = {
  title: string;
  subreddit: string;
};

export type ComicItem = {
  imageUrl: string;
  title?: string;
};

export type Quote = {
  text: string;
  author?: string;
};

export type Puzzle = {
  title: string;
  type: "prompt" | "wordsearch";
  content: string; // ASCII, preformatted
};

export type PrintBlock =
  | { type: "header"; text: string }
  | { type: "news"; items: NewsItem[] }
  | { type: "reddit"; items: RedditItem[] }
  | { type: "comic"; items: ComicItem[] }
  | { type: "quote"; text: string; author?: string }
  | { type: "puzzle"; title: string; content: string }
  | { type: "footer"; text: string };