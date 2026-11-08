import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";

const cinzel = "Cinzel";
const cormorant = "Cormorant Garamond";
loadFont({ family: cinzel, url: staticFile("fonts/Cinzel.ttf"), weight: "400 900" });
loadFont({ family: cormorant, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" });
loadFont({
  family: cormorant,
  url: staticFile("fonts/Cormorant-Italic.ttf"),
  weight: "300 700",
  style: "italic",
});

export const GOLD = "#c9a36a";
const GOLD_LIGHT = "#e8cf9f";
const IVORY = "#f2ece2";
const WINE = "#5c1322";

export const FPS = 30;
export const DURATION = 420;

const ease = Easing.bezier(0.33, 0, 0.2, 1);

// 0..1 between two frames, eased
const prog = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// December 2026 starts on a Tuesday
const MONTH = "ГРУДЕНЬ";
const FIRST_WEEKDAY = 1; // 0 = Monday
const DAYS = 31;
const WEEKDAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"];
// Days left open at the end of the animation
const FREE_DAYS = [2, 8, 15, 21];

const FILL_FROM = 120;
const FILL_TO = 250;

// Holidays and weekends book out first, the rest in a shuffled order
const fillOrder = (() => {
  const busy = Array.from({ length: DAYS }, (_, i) => i + 1).filter(
    (d) => !FREE_DAYS.includes(d),
  );
  const weight = (d: number) => {
    const weekday = (FIRST_WEEKDAY + d - 1) % 7;
    let w = random(`day-${d}`);
    if (d >= 19) w -= 1.2;
    if (weekday >= 4) w -= 0.6;
    return w;
  };
  return busy.sort((a, b) => weight(a) - weight(b));
})();

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

// Dark velvet backdrop with a slowly drifting wine-coloured glow
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / DURATION;
  const x = 30 + 25 * Math.sin(t * Math.PI * 1.2);
  const y = 28 + 10 * Math.cos(t * Math.PI);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0507" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 55% at ${x}% ${y}%, rgba(110,20,38,0.75), transparent 70%),
            radial-gradient(ellipse 80% 50% at ${100 - x}% 85%, rgba(80,12,26,0.65), transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{ opacity: 0.22, mixBlendMode: "overlay" }}>
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
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Frame: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, 0, 40);
  return (
    <AbsoluteFill
      style={{
        margin: 44,
        border: `1.5px solid rgba(201,163,106,${0.45 * p})`,
        width: 1080 - 88,
        height: 1920 - 88,
      }}
    />
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
          color: IVORY,
          opacity: 0.85,
        }}
      >
        NAIL ARTIST
      </div>
    </div>
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const small = prog(frame, 14, 40);
  const big = prog(frame, 24, 56);
  const line = prog(frame, 44, 72);
  return (
    <div
      style={{
        position: "absolute",
        top: 370,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 600,
          fontSize: 36,
          letterSpacing: 16,
          color: IVORY,
          opacity: small,
          transform: `translateY(${(1 - small) * 16}px)`,
        }}
      >
        ЗАПИС НА
      </div>
      <div
        style={{
          fontFamily: cinzel,
          fontSize: 132,
          lineHeight: 1,
          color: GOLD_LIGHT,
          letterSpacing: 10 + (1 - big) * 30,
          opacity: big,
          filter: `blur(${(1 - big) * 10}px)`,
          textShadow: "0 0 40px rgba(201,163,106,0.25)",
        }}
      >
        {MONTH}
      </div>
      <div
        style={{
          fontFamily: cormorant,
          fontStyle: "italic",
          fontSize: 46,
          color: IVORY,
          opacity: line,
          marginTop: 6,
        }}
      >
        відкрито
      </div>
      <div style={{ marginTop: 10 }}>
        <GoldDivider width={420} progress={line} />
      </div>
    </div>
  );
};

const CELL = 108;
const GAP = 14;

const DayCell: React.FC<{ day: number; index: number }> = ({ day, index }) => {
  const frame = useCurrentFrame();
  const appear = prog(frame, 64 + index * 1.2, 84 + index * 1.2);
  const isFree = FREE_DAYS.includes(day);
  const order = fillOrder.indexOf(day);
  const fillAt =
    FILL_FROM + (order / Math.max(1, fillOrder.length - 1)) * (FILL_TO - FILL_FROM);
  const filled = isFree ? 0 : prog(frame, fillAt, fillAt + 10);
  // free days start to glow once the rest are taken
  const glow = isFree ? prog(frame, FILL_TO - 10, FILL_TO + 20) : 0;
  const pulse = glow * (0.75 + 0.25 * Math.sin((frame - FILL_TO) / 7));

  return (
    <div
      style={{
        width: CELL,
        height: CELL,
        position: "relative",
        opacity: appear,
        transform: `translateY(${(1 - appear) * 14}px)`,
        border: `1.5px solid rgba(201,163,106,${0.28 + 0.62 * glow})`,
        boxShadow: glow
          ? `0 0 ${28 * pulse}px rgba(232,207,159,${0.45 * pulse}), inset 0 0 ${18 * pulse}px rgba(232,207,159,${0.2 * pulse})`
          : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(145deg, ${WINE}, #2d0710)`,
          transform: `scale(${filled})`,
          opacity: filled,
        }}
      />
      <div
        style={{
          position: "relative",
          fontFamily: cormorant,
          fontWeight: 500 + Math.round(glow * 2) * 100,
          fontSize: 50,
          color: isFree
            ? glow > 0.5
              ? GOLD_LIGHT
              : IVORY
            : `rgba(242,236,226,${1 - 0.65 * filled})`,
        }}
      >
        {day}
      </div>
      {/* gold strike-through on a booked day */}
      <div
        style={{
          position: "absolute",
          width: 80,
          height: 2,
          background: GOLD,
          opacity: 0.7 * filled,
          transform: `rotate(-45deg) scaleX(${filled})`,
        }}
      />
    </div>
  );
};

const Calendar: React.FC = () => {
  const frame = useCurrentFrame();
  const head = prog(frame, 58, 80);
  const cells: (number | null)[] = [
    ...Array<null>(FIRST_WEEKDAY).fill(null),
    ...Array.from({ length: DAYS }, (_, i) => i + 1),
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: 740,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7, ${CELL}px)`,
          columnGap: GAP,
          opacity: head,
        }}
      >
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontFamily: cormorant,
              fontWeight: 600,
              fontSize: 26,
              letterSpacing: 4,
              color: GOLD,
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7, ${CELL}px)`,
          gap: GAP,
        }}
      >
        {cells.map((d, i) =>
          d === null ? <div key={`e${i}`} /> : <DayCell key={d} day={d} index={i} />,
        )}
      </div>
    </div>
  );
};

const Legend: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, FILL_TO, FILL_TO + 24);
  return (
    <div
      style={{
        position: "absolute",
        top: 1425,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: cormorant,
        fontStyle: "italic",
        fontSize: 48,
        lineHeight: 1.2,
        color: IVORY,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      Святкові дати розбирають першими
    </div>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, FILL_TO + 30, FILL_TO + 58);
  // a light sweep across the button every couple of seconds
  const sweep = ((frame - FILL_TO - 60) % 70) / 70;
  return (
    <div
      style={{
        position: "absolute",
        top: 1520,
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
          background: "rgba(10,4,6,0.6)",
          fontFamily: cormorant,
          fontWeight: 600,
          fontSize: 36,
          letterSpacing: 6,
          color: GOLD_LIGHT,
        }}
      >
        НАПИШІТЬ «ЗАПИС» У DIRECT
        {frame > FILL_TO + 60 ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 140,
              left: `${-20 + sweep * 140}%`,
              background:
                "linear-gradient(100deg, transparent, rgba(232,207,159,0.28), transparent)",
            }}
          />
        ) : null}
      </div>
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 500,
          fontSize: 30,
          letterSpacing: 3,
          color: IVORY,
          opacity: 0.8,
        }}
      >
        Оберіть свою дату заздалегідь
      </div>
    </div>
  );
};

export const BookingStory: React.FC = () => {
  return (
    <AbsoluteFill>
      <Backdrop />
      <Frame />
      <Logo />
      <Title />
      <Calendar />
      <Legend />
      <Cta />
    </AbsoluteFill>
  );
};
