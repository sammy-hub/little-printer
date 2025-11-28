import type { Quote } from "./types";

export const QUOTES: Quote[] = [
  {
    text: "Be kind, for everyone you meet is fighting a hard battle.",
    author: "Ian Maclaren"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "No rain, no flowers.",
    author: "Unknown"
  },
  {
    text: "One day or day one. You decide.",
    author: "Unknown"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese proverb"
  },
  {
    text: "Small steps still move you forward.",
    author: "Unknown"
  }
];

export function getRandomQuote(): Quote {
  const idx = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[idx];
}