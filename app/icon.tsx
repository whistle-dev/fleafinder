import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export const runtime = "nodejs";

const fleaLogoDataUrl = (() => {
  const logoPath = join(process.cwd(), "public", "flea-logo.png");
  const buffer = readFileSync(logoPath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
})();

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(140deg, #335405 0%, #466c0e 100%)",
      }}
    >
      <img
        src={fleaLogoDataUrl}
        alt=""
        width={384}
        height={384}
        style={{ objectFit: "contain" }}
      />
    </div>,
    size,
  );
}
