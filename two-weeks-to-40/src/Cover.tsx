import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { DAYS } from "./days";

const SERIF = "Cormorant Garamond";
loadFont({ family: SERIF, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" });
loadFont({
  family: SERIF,
  url: staticFile("fonts/Cormorant-Italic.ttf"),
  weight: "300 700",
  style: "italic",
});

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const COUNTDOWN = DAYS.length - 1; // 14 days before the birthday

// Dusk to dawn: the palette slowly warms as the birthday gets closer
const BG_TOP = ["#1d0f1f", "#4a2a45", "#c98f6e"];
const BG_BOTTOM = ["#3a1b33", "#a0566a", "#f1d3a8"];
const SUN = ["#b0607a", "#e39a7c", "#fff1d6"];
const INK = ["#f4e9e4", "#fbefe6", "#3b2129"];
const ACCENT = ["#d9a7b8", "#f2c39c", "#5e2f2c"];

export const Cover: React.FC<{ index: number; animated: boolean }> = ({
  index,
  animated,
}) => {
  const day = DAYS[index];
  const isBirthday = index === COUNTDOWN;
  const t = index / COUNTDOWN;
  const current = useCurrentFrame();
  const frame = animated ? current : 1000;

  const stops = [0, 0.55, 1];
  const c = (palette: string[]) => interpolateColors(t, stops, palette);
  // Text flips from light to dark once the background is bright enough
  const light = t < 0.66;
  const ink = light ? INK[0] : INK[2];
  const accent = light ? ACCENT[1] : ACCENT[2];

  const appear = (start: number, len = 24) =>
    interpolate(frame, [start, start + len], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    });

  const num = appear(4, 30);
  const label = appear(22);
  const theme = appear(38);
  const dots = appear(54, 30);
  // The sun sits low on day 14 and rises a little each day
  const sunY = interpolate(t, [0, 1], [1560, 900]) - (animated ? frame * 0.35 : 0);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${c(BG_TOP)} 0%, ${c(BG_BOTTOM)} 100%)`,
        overflow: "hidden",
        fontFamily: SERIF,
        fontVariantNumeric: "lining-nums",
        color: ink,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 540 - 650,
          top: sunY - 650,
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c(SUN)} 0%, transparent 62%)`,
          opacity: 0.55 + 0.25 * t,
        }}
      />

      {/* Content stays inside the story safe zone (UI covers ~250px top, ~300px bottom) */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "300px 90px 340px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: accent,
            opacity: label,
            marginBottom: 10,
          }}
        >
          {isBirthday ? "день 15 із 15" : `день ${index + 1} із 15`}
        </div>

        <div
          style={{
            fontSize: 560,
            fontWeight: 300,
            lineHeight: 0.95,
            opacity: num,
            transform: `translateY(${(1 - num) * 60}px) scale(${0.94 + 0.06 * num})`,
          }}
        >
          {day.n}
        </div>

        <div
          style={{
            fontSize: 64,
            letterSpacing: 10,
            textTransform: "uppercase",
            fontWeight: 500,
            opacity: label,
            transform: `translateY(${(1 - label) * 20}px)`,
          }}
        >
          {day.label}
        </div>

        <div
          style={{
            width: 320 * theme,
            height: 2,
            background: accent,
            margin: "56px 0 50px",
            opacity: 0.8,
          }}
        />

        <div
          style={{
            fontSize: 96,
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.08,
            opacity: theme,
            transform: `translateY(${(1 - theme) * 24}px)`,
          }}
        >
          {day.theme}
        </div>
      </AbsoluteFill>

      {/* Progress: one dot per day of the series */}
      <div
        style={{
          position: "absolute",
          bottom: 360,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 22,
          opacity: dots,
        }}
      >
        {DAYS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: `2px solid ${ink}`,
              background: i <= index ? ink : "transparent",
              opacity: i <= index ? 0.95 : 0.4,
              transform: `scale(${interpolate(dots, [i / 20, i / 20 + 0.3], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })})`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
