import { NextResponse } from "next/server";
import { getRandomPuzzle } from "@/lib/puzzle";

export const runtime = "nodejs";

export async function GET() {
  const puzzle = getRandomPuzzle();
  return NextResponse.json({ puzzle });
}