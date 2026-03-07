import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512
};

export const contentType = "image/png";

export default function Icon() {
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
            "radial-gradient(circle at 25% 25%, #ffb57d 0, #ffb57d 22%, transparent 23%), linear-gradient(140deg, #17352e 0%, #1f5d55 50%, #f3ecdd 100%)",
          color: "#f3ecdd",
          fontSize: 180,
          fontFamily: "Georgia"
        }}
      >
        FF
      </div>
    ),
    size
  );
}
