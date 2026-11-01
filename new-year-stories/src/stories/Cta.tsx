import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Appear, Backdrop, GoldDivider, Lines, Ornament, Sparkle, useIn } from "../fx";
import { Texts } from "../i18n";
import { GOLD, GOLD_TEXT, IVORY, serif } from "../theme";

export const Cta: React.FC<{ t: Texts }> = ({ t }) => {
  const frame = useCurrentFrame();
  const title = useIn(10, 26);
  const div = useIn(34, 22);
  const bounce = Math.abs(Math.sin(frame / 8)) * 18;
  return (
    <AbsoluteFill>
      <Backdrop glowY={42} />
      <Ornament x={140} string={160} size={96} dropAt={0} phase={1} tint="#9b1c30" />
      <Ornament x={300} string={60} size={70} dropAt={8} phase={3} />
      <Ornament x={930} string={250} size={120} dropAt={4} phase={0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 60 }}>
        <Appear start={0}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 40,
              letterSpacing: 14,
              color: GOLD,
              textTransform: "uppercase",
            }}
          >
            ✦ {t.bookingLabel} ✦
          </div>
        </Appear>
        <div
          style={{
            position: "relative",
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 150,
            lineHeight: 0.98,
            letterSpacing: 4 + (1 - title) * 24,
            textTransform: "uppercase",
            textAlign: "center",
            marginTop: 40,
            opacity: title,
            filter: `blur(${(1 - title) * 10}px) drop-shadow(0 0 24px rgba(212,173,110,0.35))`,
            ...GOLD_TEXT,
          }}
        >
          <Lines text={t.bookNow} />
        </div>
        <Appear start={30}>
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: 70,
              color: IVORY,
              marginTop: 26,
              textAlign: "center",
            }}
          >
            {t.whileSlots}
          </div>
        </Appear>
        <div style={{ margin: "50px 0 40px" }}>
          <GoldDivider width={560} progress={div} />
        </div>
        <Appear start={44}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 52,
              letterSpacing: 8,
              color: IVORY,
              textTransform: "uppercase",
            }}
          >
            {t.services}
          </div>
        </Appear>
        <Appear start={70} style={{ marginTop: 110, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 500,
              fontStyle: "italic",
              fontSize: 58,
              lineHeight: 1.15,
              color: IVORY,
              textAlign: "center",
            }}
          >
            <Lines text={t.replyCta} />
          </div>
          <svg width={60} height={60} viewBox="0 0 60 60" style={{ transform: `translateY(${bounce}px)`, marginTop: 10 }}>
            <path d="M14 22 L30 38 L46 22" fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Appear>
        <div style={{ position: "relative", width: 1000, height: 0 }}>
          <Sparkle x={90} y={-780} size={60} phase={0} />
          <Sparkle x={900} y={-640} size={46} phase={2} />
          <Sparkle x={140} y={-420} size={36} phase={4} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
