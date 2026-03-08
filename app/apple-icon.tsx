import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export const runtime = "nodejs";

const fleaLogoDataUrl = (() => {
  const logoPath = join(process.cwd(), "public", "flea-logo.png");
  const buffer = readFileSync(logoPath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
})();

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(155deg, #335405 0%, #466c0e 100%)",
      }}
    >
      <img
        src={fleaLogoDataUrl}
        alt=""
        width={135}
        height={135}
        style={{ objectFit: "contain" }}
      />
    </div>,
    size,
  );
}
