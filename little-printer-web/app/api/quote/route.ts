import { NextResponse } from "next/server";
import { getRandomQuote } from "@/lib/quotes";

export const runtime = "nodejs";

export async function GET() {
  const quote = getRandomQuote();
  return NextResponse.json(quote);
}