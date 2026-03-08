import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

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
        color: "#feb9f2",
        fontSize: 180,
        fontFamily: "Georgia",
      }}
    >
      FF
    </div>,
    size,
  );
}
