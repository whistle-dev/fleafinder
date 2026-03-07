import { NextResponse } from "next/server";

import { getCalendarDownload } from "@/lib/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const occurrenceId = searchParams.get("occurrence");

  if (!slug || !occurrenceId) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  const calendar = await getCalendarDownload(slug, occurrenceId);

  if (!calendar) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`
    }
  });
}
