import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Appear, Backdrop, GoldDivider, Lines, Sparkle, useIn, usePop } from "../fx";
import { Texts } from "../i18n";
import { BERRY, GOLD, GOLD_LIGHT, IVORY, serif } from "../theme";

const Tick: React.FC<{ at: number }> = ({ at }) => {
  const p = useIn(at, 12);
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" style={{ position: "absolute", left: 6, top: -4 }}>
      <path
        d="M10 34 L26 50 L58 10"
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={80}
        strokeDashoffset={80 * (1 - p)}
      />
    </svg>
  );
};

const Row: React.FC<{
  label: string;
  start: number;
  done: boolean;
  note?: string;
}> = ({ label, start, done, note }) => {
  const frame = useCurrentFrame();
  const p = useIn(start, 16);
  const notePop = usePop(start + 40);
  const pulse = done ? 0 : (Math.sin((frame - start) / 6) + 1) / 2;
  const strike = useIn(start + 16, 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 40,
        width: 820,
        height: 128,
        opacity: p,
        transform: `translateX(${(1 - p) * -60}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 70,
          height: 70,
          flexShrink: 0,
          borderRadius: 16,
          border: `3px solid ${done ? GOLD : GOLD_LIGHT}`,
          boxShadow: done ? undefined : `0 0 ${10 + pulse * 30}px rgba(243,220,168,${0.3 + pulse * 0.5})`,
        }}
      >
        {done ? <Tick at={start + 10} /> : null}
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontFamily: serif,
            fontWeight: done ? 500 : 700,
            fontSize: done ? 74 : 84,
            letterSpacing: 2,
            color: done ? "rgba(244,238,228,0.55)" : IVORY,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
        {done ? (
          <div
            style={{
              position: "absolute",
              left: -6,
              right: -6,
              top: "52%",
              height: 3,
              background: GOLD,
              transform: `scaleX(${strike})`,
              transformOrigin: "left",
            }}
          />
        ) : null}
      </div>
      {note ? (
        <div
          style={{
            marginLeft: "auto",
            fontFamily: serif,
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: IVORY,
            background: BERRY,
            padding: "6px 22px 10px",
            borderRadius: 40,
            transform: `scale(${notePop}) rotate(-4deg)`,
            whiteSpace: "nowrap",
          }}
        >
          {note}
        </div>
      ) : null}
    </div>
  );
};

export const Checklist: React.FC<{ t: Texts }> = ({ t }) => {
  const frame = useCurrentFrame();
  const div = useIn(12, 20);
  const card = useIn(16, 20);
  const glow = interpolate(frame, [110, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Backdrop glowY={50} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 290 }}>
        <Appear start={0}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 500,
              fontSize: 96,
              letterSpacing: 10,
              color: IVORY,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {t.checklistTitle}
          </div>
        </Appear>
        <Appear start={6}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 46, letterSpacing: 10, textTransform: "uppercase", color: GOLD, marginTop: 18, marginRight: -10 }}>
            {t.checklistAccent}
          </div>
        </Appear>
        <div style={{ margin: "30px 0 50px" }}>
          <GoldDivider width={460} progress={div} />
        </div>
        <div
          style={{
            position: "relative",
            padding: "36px 50px",
            borderRadius: 36,
            border: "2px solid rgba(212,173,110,0.45)",
            background: "linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))",
            boxShadow: `0 0 ${80 * glow}px rgba(212,173,110,${0.25 * glow})`,
            opacity: card,
          }}
        >
          <Row label={t.checklist[0]} start={26} done />
          <Row label={t.checklist[1]} start={42} done />
          <Row label={t.checklist[2]} start={62} done={false} />
          <Row label={t.checklist[3]} start={76} done={false} note={t.dontForget} />
          <Sparkle x={900} y={20} size={60} phase={0} />
          <Sparkle x={10} y={560} size={44} phase={2.5} />
        </div>
        <Appear start={128} dur={22} style={{ marginTop: 64 }}>
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
            <Lines text={t.checklistOutro} />
          </div>
        </Appear>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
