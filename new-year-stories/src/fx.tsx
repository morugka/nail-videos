import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ease, GOLD, GOLD_DARK, GOLD_LIGHT, H, W } from "./theme";

// 0..1 progress of an element that starts appearing at `start`
export const useIn = (start: number, dur = 18) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

export const usePop = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping: 14, mass: 0.7 } });
};

// Fade + slide up + slight unblur
export const Appear: React.FC<{
  start: number;
  dur?: number;
  dy?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, dur = 18, dy = 40, children, style }) => {
  const p = useIn(start, dur);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * dy}px)`,
        filter: `blur(${(1 - p) * 6}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Lines: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split("\n").map((l, i, arr) => (
      <React.Fragment key={i}>
        {l}
        {i < arr.length - 1 ? <br /> : null}
      </React.Fragment>
    ))}
  </>
);

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

// Four-pointed twinkle
export const Sparkle: React.FC<{
  x: number;
  y: number;
  size: number;
  phase: number;
  color?: string;
}> = ({ x, y, size, phase, color = GOLD_LIGHT }) => {
  const frame = useCurrentFrame();
  const t = (Math.sin(frame / 9 + phase) + 1) / 2;
  const s = 0.3 + 0.7 * t * t;
  return (
    <svg
      width={size}
      height={size}
      viewBox="-10 -10 20 20"
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        transform: `scale(${s}) rotate(${frame * 0.6 + phase * 30}deg)`,
        opacity: 0.25 + 0.75 * t,
        filter: `drop-shadow(0 0 ${size / 4}px ${color})`,
      }}
    >
      <path d="M0 -10 Q1.2 -1.2 10 0 Q1.2 1.2 0 10 Q-1.2 1.2 -10 0 Q-1.2 -1.2 0 -10Z" fill={color} />
    </svg>
  );
};

const FLAKES = new Array(110).fill(0).map((_, i) => ({
  x: random(`x${i}`) * W,
  y: random(`y${i}`) * (H + 200),
  r: 2 + random(`r${i}`) * 6,
  speed: 1.2 + random(`s${i}`) * 2.6,
  sway: 10 + random(`w${i}`) * 30,
  phase: random(`p${i}`) * Math.PI * 2,
}));

const BOKEH = new Array(14).fill(0).map((_, i) => ({
  x: random(`bx${i}`) * W,
  y: random(`by${i}`) * H,
  r: 60 + random(`br${i}`) * 140,
  a: 0.05 + random(`ba${i}`) * 0.1,
  drift: (random(`bd${i}`) - 0.5) * 0.4,
}));

// Night-black backdrop with warm glow, out-of-focus lights and falling snow
export const Backdrop: React.FC<{ glowY?: number; snow?: number }> = ({
  glowY = 40,
  snow = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 85% 55% at 50% ${glowY}%, #2a1d12 0%, #120d0b 45%, #050405 100%)`,
        overflow: "hidden",
      }}
    >
      {BOKEH.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x - b.r + Math.sin(frame / 60 + i) * 20,
            top: b.y - b.r + frame * b.drift,
            width: b.r * 2,
            height: b.r * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)`,
            opacity: b.a,
            filter: "blur(18px)",
          }}
        />
      ))}
      {FLAKES.map((f, i) => {
        const y = ((f.y + frame * f.speed) % (H + 200)) - 100;
        const x = f.x + Math.sin(frame / 40 + f.phase) * f.sway;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: f.r,
              height: f.r,
              borderRadius: "50%",
              background: "#fffaf0",
              opacity: (0.25 + f.r / 12) * snow,
              filter: f.r > 6 ? "blur(2px)" : undefined,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 95% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Gold Christmas bauble hanging from the top edge, gently swinging
export const Ornament: React.FC<{
  x: number;
  string: number;
  size: number;
  phase?: number;
  dropAt?: number;
  tint?: string;
}> = ({ x, string, size, phase = 0, dropAt = 0, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - dropAt, fps, config: { damping: 9, mass: 0.9 } });
  const swing = Math.sin(frame / 22 + phase) * 4 + (1 - drop) * 10;
  const ball = tint
    ? `radial-gradient(circle at 34% 30%, #ffffffcc 0%, ${tint} 22%, #2a0509 100%)`
    : `radial-gradient(circle at 34% 30%, #fff8e6 0%, ${GOLD_LIGHT} 14%, ${GOLD} 42%, ${GOLD_DARK} 80%, #3a2a12 100%)`;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 0,
        transformOrigin: "50% 0%",
        transform: `translateY(${(drop - 1) * (string + size)}px) rotate(${swing}deg)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: -size / 2,
        width: size,
      }}
    >
      <div style={{ width: 2, height: string, background: `linear-gradient(${GOLD_DARK}, ${GOLD})` }} />
      <div
        style={{
          width: size * 0.26,
          height: size * 0.14,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, ${GOLD_DARK})`,
          marginBottom: -2,
        }}
      />
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: ball,
          boxShadow: `0 0 ${size * 0.5}px rgba(212,173,110,0.35)`,
        }}
      />
    </div>
  );
};
