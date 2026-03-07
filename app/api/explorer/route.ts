import { NextResponse } from "next/server";

import { getExplorerSnapshot } from "@/lib/data";
import { serializeFilters } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = serializeFilters({
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    date: searchParams.get("date") ?? undefined,
    view: searchParams.get("view") ?? undefined
  });
  const snapshot = await getExplorerSnapshot(filters);
  return NextResponse.json(snapshot);
}
