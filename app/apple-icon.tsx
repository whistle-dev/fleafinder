import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 30%, #ffd39e 0, #ffd39e 24%, transparent 25%), linear-gradient(155deg, #17352e 0%, #1f5d55 55%, #f3ecdd 100%)",
          color: "#f3ecdd",
          fontSize: 64,
          fontFamily: "Georgia"
        }}
      >
        FF
      </div>
    ),
    size
  );
}
