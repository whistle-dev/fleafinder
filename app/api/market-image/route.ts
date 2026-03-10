import { NextResponse } from "next/server";

import { supabaseUrl } from "@/lib/supabase/config";

const ALLOWED_HOSTS = new Set([
  "kbhloppetorv.dk",
  "www.kbhloppetorv.dk",
  "impro.usercontent.one",
  "verasvintage.dk",
  "www.verasvintage.dk",
  "files.guidedanmark.org",
  "detgroenneloppemarked.dk",
  "www.detgroenneloppemarked.dk",
  "loppemarkedibella.dk",
  "www.loppemarkedibella.dk",
  "static.wixstatic.com",
  "brugbyen.nu",
  "www.brugbyen.nu",
  "brugbyen.kk.dk",
  "kulturhusetislandsbrygge.kk.dk",
  "kulturogfritidoe.kk.dk",
  "i0.wp.com",
  "loppelinda.dk",
  "www.loppelinda.dk"
]);

if (supabaseUrl) {
  try {
    ALLOWED_HOSTS.add(new URL(supabaseUrl).hostname);
  } catch {}
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let remoteUrl: URL;

  try {
    remoteUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (remoteUrl.protocol !== "https:" || !ALLOWED_HOSTS.has(remoteUrl.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  const response = await fetch(remoteUrl.toString(), {
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "User-Agent": "Mozilla/5.0 (compatible; FleaFinder/1.0; +https://fleafinder.app)"
    },
    next: { revalidate: 60 * 60 * 24 }
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Image fetch failed" }, { status: 404 });
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";

  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }

  const bytes = await response.arrayBuffer();

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"
    }
  });
}
