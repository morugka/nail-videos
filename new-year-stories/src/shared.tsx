import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const cinzel = "Cinzel";
export const cormorant = "Cormorant Garamond";
loadFont({ family: cinzel, url: staticFile("fonts/Cinzel.ttf"), weight: "400 900" });
loadFont({ family: cormorant, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" });
loadFont({
  family: cormorant,
  url: staticFile("fonts/Cormorant-Italic.ttf"),
  weight: "300 700",
  style: "italic",
});

export const GOLD = "#c9a36a";
export const GOLD_LIGHT = "#f1d9a6";
export const IVORY = "#f2ece2";
export const MUTED = "rgba(242,236,226,0.45)";

export const ease = Easing.bezier(0.33, 0, 0.2, 1);

// 0..1 progress between two frames, clamped and eased
export const reveal = (frame: number, start: number, length = 18) =>
  interpolate(frame, [start, start + length], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// Fades the whole story out over its last frames
export const useOutro = (frames = 10) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - frames, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const GoldDivider: React.FC<{ width: number; progress: number }> = ({
  width,
  progress,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
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
        width: 14,
        height: 14,
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

// Small spaced-out gold label above a heading
export const Kicker: React.FC<{ text: string; progress: number }> = ({
  text,
  progress,
}) => (
  <div
    style={{
      fontFamily: cormorant,
      fontWeight: 600,
      fontSize: 38,
      letterSpacing: 12 + (1 - progress) * 14,
      color: GOLD,
      textTransform: "uppercase",
      opacity: progress,
    }}
  >
    {text}
  </div>
);

// Night background: warm glow and slowly falling gold dust
export const Backdrop: React.FC<{ glowY?: number; seed?: string }> = ({
  glowY = 40,
  seed = "dust",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const flakes = new Array(70).fill(0).map((_, i) => {
    const size = 3 + random(`${seed}-s-${i}`) * 9;
    const speed = 0.6 + random(`${seed}-v-${i}`) * 1.6;
    const y = (random(`${seed}-y-${i}`) * (height + 100) + frame * speed) % (height + 100) - 50;
    const x =
      random(`${seed}-x-${i}`) * width +
      Math.sin(frame / 40 + i) * 18 * random(`${seed}-w-${i}`);
    const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(frame / 18 + i * 1.7));
    return { size, x, y, opacity: twinkle * (0.25 + random(`${seed}-o-${i}`) * 0.6) };
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 85% 55% at 50% ${glowY}%, #2a1d10 0%, #120c07 45%, #050403 100%)`,
      }}
    >
      {flakes.map((f, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: f.x,
            top: f.y,
            width: f.size,
            height: f.size,
            borderRadius: "50%",
            background: GOLD_LIGHT,
            opacity: f.opacity,
            boxShadow: `0 0 ${f.size * 2}px ${GOLD}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Four-point sparkle star
export const Sparkle: React.FC<{
  x: number;
  y: number;
  size: number;
  progress: number;
}> = ({ x, y, size, progress }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      opacity: progress,
      transform: `scale(${progress}) rotate(${progress * 45}deg)`,
      filter: `drop-shadow(0 0 12px ${GOLD})`,
    }}
  >
    <path
      d="M50 0 C54 38 62 46 100 50 C62 54 54 62 50 100 C46 62 38 54 0 50 C38 46 46 38 50 0 Z"
      fill={GOLD_LIGHT}
    />
  </svg>
);
