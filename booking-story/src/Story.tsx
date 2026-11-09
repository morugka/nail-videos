import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const cormorant = "Cormorant Garamond";
loadFont({
  family: cormorant,
  url: staticFile("fonts/Cormorant.ttf"),
  weight: "300 700",
});

export const GOLD = "#c9a36a";
const GOLD_DEEP = "#d9b97f";
const INK = "#f4f0ea";

export const FPS = 30;
export const DURATION = 390;

const ease = Easing.bezier(0.33, 0, 0.2, 1);

// 0..1 between two frames, eased
const prog = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const GoldDivider: React.FC<{ width: number; progress: number }> = ({
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

// Black backdrop with a faint drifting light, like the studio shots on the page
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / DURATION;
  const x = 30 + 25 * Math.sin(t * Math.PI * 1.2);
  const y = 28 + 10 * Math.cos(t * Math.PI);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 55% at ${x}% ${y}%, rgba(255,255,255,0.07), transparent 70%),
            radial-gradient(ellipse 80% 50% at ${100 - x}% 85%, rgba(201,163,106,0.06), transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "screen" }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed={frame % 6}
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, 0, 30);
  return (
    <div
      style={{
        position: "absolute",
        top: 210,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: p,
      }}
    >
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 500,
          fontSize: 76,
          color: GOLD,
          letterSpacing: -10,
          lineHeight: 1,
          paddingRight: 10,
        }}
      >
        KM
      </div>
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: 8,
          color: INK,
          opacity: 0.85,
        }}
      >
        NAIL ARTIST
      </div>
    </div>
  );
};

// Thin gold clock face whose hands keep running
const Clock: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = prog(frame, 8, 50);
  const R = 105;
  const C = 2 * Math.PI * R;
  const minute = frame * 3.2;
  const hour = 300 + frame * 0.27;
  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        width={260}
        height={260}
        viewBox="-130 -130 260 260"
        style={{ overflow: "visible" }}
      >
        <circle
          r={R + 14}
          fill="none"
          stroke={GOLD}
          strokeOpacity={0.25 * draw}
          strokeWidth={1}
        />
        <circle
          r={R}
          fill="none"
          stroke={GOLD}
          strokeWidth={2}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - draw)}
          transform="rotate(-90)"
        />
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            y1={-R + 10}
            y2={-R + (i % 3 === 0 ? 26 : 18)}
            stroke={GOLD}
            strokeWidth={i % 3 === 0 ? 3 : 1.5}
            opacity={prog(frame, 20 + i * 2, 30 + i * 2)}
            transform={`rotate(${i * 30})`}
          />
        ))}
        <g opacity={prog(frame, 36, 56)}>
          <line
            y2={-55}
            stroke={GOLD_DEEP}
            strokeWidth={4}
            strokeLinecap="round"
            transform={`rotate(${hour})`}
          />
          <line
            y2={-82}
            stroke={GOLD_DEEP}
            strokeWidth={2.5}
            strokeLinecap="round"
            transform={`rotate(${minute})`}
          />
          <circle r={6} fill={GOLD_DEEP} />
        </g>
      </svg>
    </div>
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const big = prog(frame, 30, 62);
  const line = prog(frame, 56, 84);
  const sub = prog(frame, 66, 92);
  return (
    <div
      style={{
        position: "absolute",
        top: 690,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
      }}
    >
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 500,
          fontSize: 104,
          lineHeight: 1.02,
          letterSpacing: 4 + (1 - big) * 16,
          textAlign: "center",
          color: INK,
          opacity: big,
          filter: `blur(${(1 - big) * 8}px)`,
        }}
      >
        ЗАПИСУЙТЕСЬ
        <br />
        ЗАЗДАЛЕГІДЬ
      </div>
      <GoldDivider width={360} progress={line} />
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 600,
          fontSize: 36,
          letterSpacing: 10,
          color: GOLD,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 12}px)`,
        }}
      >
        ЩОБ ОБРАТИ ЗРУЧНИЙ ЧАС
      </div>
    </div>
  );
};

const POINTS = [
  "Ви обираєте день, а не те, що лишилось",
  "Наступний візит — одразу після процедури",
  "Вечори та вихідні розбирають першими",
];

const Points: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 1110,
        left: 120,
        right: 120,
        display: "flex",
        flexDirection: "column",
        gap: 44,
      }}
    >
      {POINTS.map((text, i) => {
        const p = prog(frame, 100 + i * 28, 124 + i * 28);
        return (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              opacity: p,
              transform: `translateX(${(1 - p) * -30}px)`,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                flexShrink: 0,
                background: GOLD,
                transform: "rotate(45deg)",
              }}
            />
            <div
              style={{
                fontFamily: cormorant,
                fontWeight: 500,
                fontSize: 40,
                lineHeight: 1.2,
                color: INK,
              }}
            >
              {text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CTA_AT = 200;

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, CTA_AT, CTA_AT + 28);
  // a light sweep across the button every couple of seconds
  const sweep = ((frame - CTA_AT - 30) % 70) / 70;
  return (
    <div
      style={{
        position: "absolute",
        top: 1450,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        opacity: p,
        transform: `scale(${0.95 + 0.05 * p})`,
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "26px 54px",
          border: `1.5px solid ${GOLD}`,
          background: "transparent",
          fontFamily: cormorant,
          fontWeight: 600,
          fontSize: 36,
          letterSpacing: 6,
          color: GOLD_DEEP,
        }}
      >
        НАПИШІТЬ «ЗАПИС» У DIRECT
        {frame > CTA_AT + 30 ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 140,
              left: `${-20 + sweep * 140}%`,
              background:
                "linear-gradient(100deg, transparent, rgba(232,207,159,0.25), transparent)",
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export const BookingStory: React.FC = () => {
  return (
    <AbsoluteFill>
      <Backdrop />
      <Logo />
      <Clock />
      <Title />
      <Points />
      <Cta />
    </AbsoluteFill>
  );
};
