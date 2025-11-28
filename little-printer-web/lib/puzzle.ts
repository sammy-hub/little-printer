import type { Puzzle } from "./types";

const PROMPT_PUZZLES: Puzzle[] = [
  {
    title: "Gratitude Trio",
    type: "prompt",
    content: "List 3 things you’re grateful for today:\n\n1)\n2)\n3)"
  },
  {
    title: "Tiny Time Capsule",
    type: "prompt",
    content:
      "Write 3 things future-you should remember about today:\n\n1)\n2)\n3)"
  },
  {
    title: "Kindness Quest",
    type: "prompt",
    content:
      "Plan 2 small acts of kindness:\n\n1) ____________________________\n2) ____________________________"
  }
];

function generateWordSearchPuzzle(): Puzzle {
  // Very small, printer-friendly word search.
  // Words: CAT, DOG, RAIN, SUN
  const grid = [
    "C A T X R A I N",
    "D O G S U N X X",
    "X X X X X X X X",
    "R A I N X X X X",
    "S U N X C A T X",
    "X X X X D O G X",
    "X X X X X X X X",
    "X X X X X X X X"
  ].join("\n");

  const content =
    grid + "\n\nFind: CAT, DOG, RAIN, SUN\n(Circling is encouraged.)";

  return {
    title: "Mini Word Search",
    type: "wordsearch",
    content
  };
}

export function getRandomPuzzle(): Puzzle {
  const roll = Math.random();
  if (roll < 0.4) {
    return generateWordSearchPuzzle();
  }
  const idx = Math.floor(Math.random() * PROMPT_PUZZLES.length);
  return PROMPT_PUZZLES[idx];
}