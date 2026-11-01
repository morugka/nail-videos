import { AbsoluteFill } from "remotion";
import { Appear, Backdrop, GoldDivider, Lines, Sparkle, useIn, usePop } from "../fx";
import { Texts } from "../i18n";
import { GOLD, GOLD_LIGHT, GOLD_TEXT, IVORY, serif } from "../theme";

const ROW_H = 300;

const Visit: React.FC<{ n: number; when: string; what: string; start: number }> = ({
  n,
  when,
  what,
  start,
}) => {
  const dot = usePop(start);
  const text = useIn(start + 6, 18);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 50, height: ROW_H }}>
      <div
        style={{
          width: 110,
          height: 110,
          flexShrink: 0,
          borderRadius: "50%",
          border: `3px solid ${GOLD}`,
          background: "#120d0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${dot})`,
          boxShadow: `0 0 40px rgba(212,173,110,0.35)`,
          fontFamily: serif,
          fontWeight: 700,
          fontSize: 64,
          ...GOLD_TEXT,
        }}
      >
        {n}
      </div>
      <div style={{ opacity: text, transform: `translateX(${(1 - text) * 40}px)` }}>
        <div
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: GOLD,
          }}
        >
          {when}
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 52,
            lineHeight: 1.15,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: IVORY,
          }}
        >
          <Lines text={what} />
        </div>
      </div>
    </div>
  );
};

export const TwoVisits: React.FC<{ t: Texts }> = ({ t }) => {
  const div = useIn(10, 20);
  const line = useIn(30, 40);
  return (
    <AbsoluteFill>
      <Backdrop glowY={45} snow={0.8} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <Appear start={0}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 500,
              fontSize: 110,
              letterSpacing: 14,
              color: IVORY,
              textTransform: "uppercase",
              lineHeight: 1,
              marginRight: -14,
            }}
          >
            {t.twoVisits}
          </div>
        </Appear>
        <Appear start={6}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 46,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: GOLD,
              marginTop: 18,
              marginRight: -10,
            }}
          >
            {t.twoVisitsAccent}
          </div>
        </Appear>
        <div style={{ margin: "36px 0 50px" }}>
          <GoldDivider width={460} progress={div} />
        </div>
        <div style={{ position: "relative", width: 900 }}>
          <div
            style={{
              position: "absolute",
              left: 54,
              top: ROW_H / 2,
              width: 3,
              height: ROW_H,
              background: `linear-gradient(${GOLD}, ${GOLD_LIGHT})`,
              transform: `scaleY(${line})`,
              transformOrigin: "top",
            }}
          />
          {t.visits.map((v, i) => (
            <Visit key={i} n={i + 1} when={v.when} what={v.what} start={24 + i * 40} />
          ))}
          <Sparkle x={860} y={40} size={56} phase={1} />
          <Sparkle x={40} y={620} size={40} phase={3} />
        </div>
        <Appear start={120} dur={22} style={{ marginTop: 60 }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 54,
              letterSpacing: 2,
              lineHeight: 1.22,
              color: IVORY,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            <Lines text={t.twoVisitsOutro} />
          </div>
        </Appear>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
