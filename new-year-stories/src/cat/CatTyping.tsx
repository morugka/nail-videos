import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import script from "./script.json";

// The cat "types" an ad for mum. Keystroke timeline + click track come from scripts/cat_typing.py
const SANS = "DejaVu Sans, Liberation Sans, sans-serif";

const textAt = (frame: number) => {
  let text = "";
  for (const k of script.frames) {
    if (k.f > frame) break;
    text = k.text;
  }
  return text;
};

export const CatTyping: React.FC = () => {
  const frame = useCurrentFrame();
  const text = textAt(frame);
  const typing = frame < script.end + 6;
  const cursorOn = typing || Math.floor(frame / 15) % 2 === 0;
  const cardIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const dots = ".".repeat((Math.floor(frame / 8) % 3) + 1);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video src={staticFile("cat/cat.mp4")} playbackRate={0.92} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      <Audio src={staticFile("cat/keys.wav")} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 }}>
        <div
          style={{
            width: 940,
            padding: "28px 40px 32px",
            borderRadius: 44,
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 14px 50px rgba(0,0,0,0.35)",
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * -40}px)`,
            fontFamily: SANS,
          }}
        >
          <div style={{ fontSize: 30, color: "#8a8a8e", marginBottom: 14 }}>
            {typing ? `кіт друкує${dots}` : "кіт надрукував"}
          </div>
          <div
            style={{
              fontSize: 50,
              lineHeight: 1.22,
              color: "#111",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              minHeight: 70,
            }}
          >
            {text}
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 58,
                marginLeft: 3,
                verticalAlign: "-10px",
                background: "#2b7cff",
                opacity: cursorOn ? 1 : 0,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
