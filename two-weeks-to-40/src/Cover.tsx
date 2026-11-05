import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { DAYS } from "./days";

// Page style: black background, white serif capitals, gold hairline with a diamond,
// gold letter-spaced subtitle, one copper accent (like «ПЕЧЕ» on the feed)
export const SERIF = "Cormorant Garamond";
loadFont({
  family: SERIF,
  url: staticFile("fonts/Cormorant.ttf"),
  weight: "300 700",
});
loadFont({
  family: SERIF,
  url: staticFile("fonts/Cormorant-Italic.ttf"),
  weight: "300 700",
  style: "italic",
});

export const BLACK = "#0a0909";
export const WHITE = "#f3eee8";
export const GOLD = "#c9a36a";
export const COPPER =
  "linear-gradient(180deg, #e0a070 0%, #b8693a 55%, #8a4524 100%)";
const COUNTDOWN = DAYS.length - 1; // 14 days before the birthday

export const ease = Easing.bezier(0.33, 0, 0.2, 1);

export const GoldDivider: React.FC<{ width: number; progress: number }> = ({
  width,
  progress,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      width,
      opacity: progress,
    }}
  >
    <div
      style={{
        height: 2,
        flex: 1,
        background: `linear-gradient(90deg, transparent, ${GOLD})`,
        transform: `scaleX(${progress})`,
        transformOrigin: "right",
      }}
    />
    <div
      style={{
        width: 12,
        height: 12,
        background: GOLD,
        transform: `rotate(45deg) scale(${progress})`,
      }}
    />
    <div
      style={{
        height: 2,
        flex: 1,
        background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        transform: `scaleX(${progress})`,
        transformOrigin: "left",
      }}
    />
  </div>
);

const CopperNumber: React.FC<{
  n: number;
  size: number;
  style?: React.CSSProperties;
}> = ({ n, size, style }) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 500,
      lineHeight: 1,
      background: COPPER,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      ...style,
    }}
  >
    {n}
  </div>
);

// A dial of 14 nail tips: one fills in copper for every day that has passed
const NailDial: React.FC<{
  filled: number;
  progress: number;
  glow: number;
}> = ({ filled, progress, glow }) => {
  const ticks = COUNTDOWN;
  const r = 360;
  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1150,
        width: 0,
        height: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -520,
          top: -520,
          width: 1040,
          height: 1040,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(184,105,58,${0.18 + 0.1 * glow}) 0%, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -300,
          top: -300,
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: `1.5px solid ${GOLD}`,
          opacity: 0.45 * progress,
        }}
      />
      {Array.from({ length: ticks }).map((_, i) => {
        const angle = (i / ticks) * 360;
        const on = i < filled;
        const appear = interpolate(
          progress,
          [i / (ticks + 6), i / (ticks + 6) + 0.3],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -15,
              top: -r - 34,
              width: 30,
              height: 68,
              transformOrigin: `15px ${r + 34}px`,
              transform: `rotate(${angle}deg) scale(${appear})`,
              borderRadius: "50% 50% 42% 42% / 62% 62% 38% 38%",
              background: on ? COPPER : "transparent",
              border: on ? "none" : `2px solid ${GOLD}`,
              opacity: on ? 1 : 0.4,
              boxShadow: on
                ? `0 0 ${18 * glow}px rgba(224,160,112,0.5)`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
};

export const Cover: React.FC<{ index: number; animated: boolean }> = ({
  index,
  animated,
}) => {
  const day = DAYS[index];
  const current = useCurrentFrame();
  const frame = animated ? current : 1000;

  const appear = (start: number, len = 24) =>
    interpolate(frame, [start, start + len], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    });

  const label = appear(4);
  const divider = appear(18, 30);
  const theme = appear(30);
  const dial = appear(36, 60);
  const num = appear(60, 30);
  const glow = animated ? 0.5 + 0.5 * Math.sin(frame / 18) : 0.6;
  const zoom = animated ? 1 + frame * 0.0004 : 1;

  const capsTitle: React.CSSProperties = {
    fontSize: 92,
    fontWeight: 500,
    letterSpacing: 6,
    textTransform: "uppercase",
    color: WHITE,
    lineHeight: 1.05,
  };

  return (
    <AbsoluteFill
      style={{
        background: BLACK,
        fontFamily: SERIF,
        fontVariantNumeric: "lining-nums",
        overflow: "hidden",
      }}
    >
      {day.photo ? (
        <>
          {/* Photo fills the screen; it darkens under the title at the top */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 1920,
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile(day.photo)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${zoom})`,
                transformOrigin: "50% 60%",
              }}
            />
            <AbsoluteFill
              style={{
                background: `linear-gradient(180deg, rgba(10,9,9,0.92) 0%, rgba(10,9,9,0.8) 28%, transparent 52%, transparent 78%, rgba(10,9,9,0.75) 100%)`,
              }}
            />
          </div>
        </>
      ) : (
        <NailDial filled={index + 1} progress={dial} glow={glow} />
      )}

      {/* Title block, inside the story safe zone (UI covers ~250px at the top) */}
      <div
        style={{
          position: "absolute",
          top: day.photo ? 240 : 290,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          textShadow: day.photo ? "0 2px 18px rgba(0,0,0,0.85)" : "none",
        }}
      >
        {day.photo ? (
          <CopperNumber
            n={day.n}
            size={200}
            style={{ opacity: label, marginBottom: -10 }}
          />
        ) : null}
        <div
          style={{
            ...capsTitle,
            opacity: label,
            transform: `translateY(${(1 - label) * 24}px)`,
          }}
        >
          {day.label}
        </div>
        <div style={{ margin: "34px 0 30px" }}>
          <GoldDivider width={300} progress={divider} />
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            letterSpacing: 9,
            textTransform: "uppercase",
            color: GOLD,
            opacity: theme,
            transform: `translateY(${(1 - theme) * 16}px)`,
          }}
        >
          {day.theme}
        </div>
      </div>

      <Img
        src={staticFile("logo-km.png")}
        style={{
          position: "absolute",
          left: 540 - 70,
          top: 1585,
          width: 140,
          opacity: appear(70, 30) * 0.95,
          filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.8))",
        }}
      />

      {day.photo ? null : (
        <AbsoluteFill
          style={{
            alignItems: "center",
            top: 1150 - 180,
            height: 360,
            bottom: "auto",
          }}
        >
          <CopperNumber
            n={day.n}
            size={day.n >= 10 ? 330 : 360}
            style={{
              opacity: num,
              transform: `scale(${0.92 + 0.08 * num})`,
              height: 360,
              display: "flex",
              alignItems: "center",
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
