import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Appear, Backdrop, GoldDivider, Lines, Ornament, Sparkle, useIn } from "../fx";
import { Texts } from "../i18n";
import { GOLD, GOLD_TEXT, IVORY, serif } from "../theme";

export const Cta: React.FC<{ t: Texts }> = ({ t }) => {
  const frame = useCurrentFrame();
  const title = useIn(10, 26);
  const div = useIn(34, 22);
  const bounce = Math.abs(Math.sin(frame / 8)) * 18;
  const glow = (Math.sin(frame / 10) + 1) / 2;
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
            fontSize: 112,
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
              fontWeight: 600,
              fontSize: 42,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: GOLD,
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
        <Appear start={64} style={{ marginTop: 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 44,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: IVORY,
            }}
          >
            {t.replyCta}
          </div>
          <div
            style={{
              marginTop: 22,
              padding: "14px 56px 18px",
              borderRadius: 60,
              border: `2px solid ${GOLD}`,
              boxShadow: `0 0 ${16 + glow * 34}px rgba(212,173,110,${0.25 + glow * 0.35})`,
              fontFamily: serif,
              fontWeight: 700,
              fontSize: 84,
              letterSpacing: 12,
              lineHeight: 1,
              transform: `scale(${1 + glow * 0.03})`,
              ...GOLD_TEXT,
            }}
          >
            «{t.keyword}»
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 40,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: IVORY,
            }}
          >
            {t.replyCtaAfter}
          </div>
          <svg width={60} height={60} viewBox="0 0 60 60" style={{ transform: `translateY(${bounce}px)`, marginTop: 10 }}>
            <path d="M14 22 L30 38 L46 22" fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Appear>
        <Appear start={90} style={{ marginTop: 30 }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: 12,
              color: GOLD,
              textTransform: "uppercase",
            }}
          >
            {t.signature}
          </div>
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
