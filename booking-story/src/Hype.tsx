import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Backdrop,
  cormorant,
  GOLD,
  GOLD_DEEP,
  GoldDivider,
  INK,
  Logo,
  prog,
} from "./Story";

export const HYPE_DURATION = 330;

const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - 14,
    fps,
    config: { damping: 11, mass: 0.8 },
  });
  // soft glow that keeps breathing once the word is in
  const glow = frame > 40 ? 0.5 + 0.5 * Math.sin((frame - 40) / 9) : 0;
  const line = prog(frame, 40, 66);
  const sub = prog(frame, 50, 76);
  return (
    <div
      style={{
        position: "absolute",
        top: 470,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 600,
          fontSize: 158,
          lineHeight: 1,
          letterSpacing: 8,
          color: INK,
          opacity: Math.min(1, pop * 1.4),
          transform: `scale(${interpolate(pop, [0, 1], [1.25, 1])})`,
          textShadow: `0 0 ${30 + 30 * glow}px rgba(201,163,106,${0.18 + 0.22 * glow})`,
        }}
      >
        ДІВЧАТА!
      </div>
      <GoldDivider width={360} progress={line} />
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 600,
          fontSize: 38,
          letterSpacing: 12,
          color: GOLD,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 12}px)`,
        }}
      >
        ВАЖЛИВО ПРО ЗАПИС
      </div>
    </div>
  );
};

const Message: React.FC = () => {
  const frame = useCurrentFrame();
  const lines = [
    "Вільних вікон стає все менше —",
    "встигніть забронювати свій час,",
    "поки є з чого обрати",
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: 840,
        left: 80,
        right: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      {lines.map((text, i) => {
        const p = prog(frame, 84 + i * 14, 106 + i * 14);
        return (
          <div
            key={text}
            style={{
              fontFamily: cormorant,
              fontWeight: 500,
              fontSize: 50,
              lineHeight: 1.2,
              textAlign: "center",
              color: INK,
              opacity: p,
              transform: `translateY(${(1 - p) * 18}px)`,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};

// Thin gold lightning bolt inside a ring
const Bolt: React.FC<{ draw: number; flicker: number }> = ({
  draw,
  flicker,
}) => {
  const path = "M 8 -46 L -20 6 L 2 6 L -8 46 L 22 -8 L 0 -8 Z";
  return (
    <svg width={150} height={150} viewBox="-75 -75 150 150">
      <circle
        r={66}
        fill="none"
        stroke={GOLD}
        strokeWidth={1.5}
        strokeDasharray={415}
        strokeDashoffset={415 * (1 - draw)}
        transform="rotate(-90)"
      />
      <path
        d={path}
        fill={`rgba(217,185,127,${0.85 * flicker})`}
        stroke={GOLD_DEEP}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeDasharray={260}
        strokeDashoffset={260 * (1 - draw)}
        style={{
          filter: `drop-shadow(0 0 ${14 * flicker}px rgba(232,207,159,0.8))`,
        }}
      />
    </svg>
  );
};

const NoPower: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 150;
  const draw = prog(frame, start, start + 26);
  // the bolt flickers on like a lamp, then stays lit
  const f = frame - start - 24;
  const flicker =
    f < 0
      ? 0
      : f < 14
        ? ([0, 1, 0.2, 1, 0, 0.6, 1][Math.floor(f / 2)] ?? 1)
        : 1;
  const title = prog(frame, start + 20, start + 46);
  const sub = prog(frame, start + 36, start + 60);
  return (
    <div
      style={{
        position: "absolute",
        top: 1110,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
      }}
    >
      <Bolt draw={draw} flicker={flicker} />
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 600,
          fontSize: 52,
          letterSpacing: 4,
          color: INK,
          opacity: title,
          transform: `translateY(${(1 - title) * 14}px)`,
        }}
      >
        ПРАЦЮЮ НАВІТЬ БЕЗ СВІТЛА
      </div>
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 500,
          fontSize: 40,
          color: INK,
          opacity: 0.8 * sub,
        }}
      >
        відключення не скасують ваш манікюр
      </div>
    </div>
  );
};

const Next: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, 236, 260);
  const nudge = frame > 260 ? 10 * Math.max(0, Math.sin((frame - 260) / 5)) : 0;
  return (
    <div
      style={{
        position: "absolute",
        top: 1530,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        opacity: p,
      }}
    >
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: 8,
          color: GOLD,
        }}
      >
        ДЕТАЛІ — ДАЛІ
      </div>
      <div
        style={{
          fontFamily: cormorant,
          fontSize: 48,
          color: GOLD,
          transform: `translateX(${nudge}px)`,
        }}
      >
        →
      </div>
    </div>
  );
};

export const HypeStory: React.FC = () => {
  return (
    <AbsoluteFill>
      <Backdrop />
      <Logo />
      <Headline />
      <Message />
      <NoPower />
      <Next />
    </AbsoluteFill>
  );
};
