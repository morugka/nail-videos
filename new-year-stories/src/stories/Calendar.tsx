import { AbsoluteFill } from "remotion";
import { Appear, Backdrop, GoldDivider, Lines, Sparkle, useIn, usePop } from "../fx";
import { Texts } from "../i18n";
import { GOLD, GOLD_DARK, GOLD_LIGHT, IVORY, serif } from "../theme";

// December 2026 starts on a Tuesday (Monday-first grid)
const OFFSET = 1;
const DAYS = 31;
// Days off: every Sunday plus 30 and 31 December
const isDayOff = (d: number) => (d + OFFSET) % 7 === 0 || d >= 30;
// The most wanted dates (from 15 December) fill up, latest first
const TAKEN = [29, 28, 26, 24, 25, 23, 22, 19, 21, 18, 17, 16, 15];
const CELL = 116;
const GAP = 14;

const Day: React.FC<{ d: number; takenAt: number | null }> = ({ d, takenAt }) => {
  const p = usePop(takenAt ?? 10_000);
  const filled = takenAt === null ? 0 : Math.min(1, p);
  if (isDayOff(d)) {
    return (
      <div
        style={{
          position: "relative",
          width: CELL,
          height: CELL,
          borderRadius: 22,
          border: "2px dashed rgba(244,238,228,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: CELL * 1.2,
            height: 2,
            background: "rgba(244,238,228,0.22)",
            transform: "rotate(-45deg)",
          }}
        />
        <div style={{ fontFamily: serif, fontWeight: 500, fontSize: 52, color: "rgba(244,238,228,0.3)" }}>
          {d}
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        position: "relative",
        width: CELL,
        height: CELL,
        borderRadius: 22,
        border: `2px solid rgba(212,173,110,${0.35 + 0.65 * filled})`,
        background: "rgba(255,255,255,0.03)",
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
          background: `linear-gradient(145deg, ${GOLD_LIGHT}, ${GOLD} 50%, ${GOLD_DARK})`,
          transform: `scale(${filled})`,
          borderRadius: 20,
        }}
      />
      <div
        style={{
          position: "relative",
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 52,
          color: filled > 0.5 ? "#1a1209" : IVORY,
        }}
      >
        {d}
      </div>
    </div>
  );
};

export const Calendar: React.FC<{ t: Texts }> = ({ t }) => {
  const gridIn = useIn(26, 20);
  const div = useIn(14, 20);
  const cells: (number | null)[] = [
    ...new Array(OFFSET).fill(null),
    ...new Array(DAYS).fill(0).map((_, i) => i + 1),
  ];
  const gridW = 7 * CELL + 6 * GAP;
  return (
    <AbsoluteFill>
      <Backdrop glowY={30} snow={0.7} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 270 }}>
        <Appear start={0}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 500,
              fontSize: 120,
              letterSpacing: 22,
              color: IVORY,
              textTransform: "uppercase",
              lineHeight: 1,
              marginRight: -22,
            }}
          >
            {t.december}
          </div>
        </Appear>
        <Appear start={8}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 46, letterSpacing: 10, textTransform: "uppercase", color: GOLD, marginTop: 18, marginRight: -10 }}>
            {t.bookedEarly}
          </div>
        </Appear>
        <div style={{ margin: "36px 0 44px" }}>
          <GoldDivider width={460} progress={div} />
        </div>
        <div
          style={{
            width: gridW,
            opacity: gridIn,
            transform: `translateY(${(1 - gridIn) * 40}px)`,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${CELL}px)`, gap: GAP, marginBottom: 16 }}>
            {t.weekdays.map((w, i) => (
              <div
                key={w}
                style={{
                  textAlign: "center",
                  fontFamily: serif,
                  fontWeight: 600,
                  fontSize: 34,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: i >= 5 ? GOLD : "rgba(244,238,228,0.6)",
                }}
              >
                {w}
              </div>
            ))}
          </div>
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(7, ${CELL}px)`, gap: GAP }}>
            {cells.map((d, i) =>
              d === null ? (
                <div key={i} />
              ) : (
                <Day
                  key={i}
                  d={d}
                  takenAt={TAKEN.includes(d) ? 50 + TAKEN.indexOf(d) * 5 : null}
                />
              ),
            )}
            <Sparkle x={gridW - 40} y={4 * (CELL + GAP) + 20} size={60} phase={1} />
            <Sparkle x={gridW * 0.45} y={3 * (CELL + GAP) + 90} size={44} phase={3} />
          </div>
        </div>
        <Appear start={130} dur={22} style={{ marginTop: 50 }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 58,
              letterSpacing: 2,
              lineHeight: 1.2,
              color: IVORY,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            <Lines text={t.popularDates} />
          </div>
        </Appear>
        <Appear start={150} dur={20} style={{ marginTop: 34 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 36,
              letterSpacing: 5,
              color: GOLD,
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "2px dashed rgba(244,238,228,0.35)",
                flexShrink: 0,
              }}
            />
            {t.daysOff}
          </div>
        </Appear>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
