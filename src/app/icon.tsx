import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#67e8f9",
        color: "#020617",
        display: "flex",
        fontSize: 13,
        fontWeight: 900,
        height: "100%",
        justifyContent: "center",
        letterSpacing: "-0.06em",
        width: "100%",
      }}
    >
      PB
    </div>,
    size,
  );
}
