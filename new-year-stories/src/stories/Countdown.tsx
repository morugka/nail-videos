import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Appear, Backdrop, GoldDivider, Lines, Ornament, Sparkle, useIn } from "../fx";
import { Texts } from "../i18n";
import { display, ease, GOLD, GOLD_TEXT, IVORY, serif } from "../theme";

export const Countdown: React.FC<{ t: Texts; daysLeft: number }> = ({ t, daysLeft }) => {
  const frame = useCurrentFrame();
  const counted = Math.round(
    interpolate(frame, [12, 66], [365, daysLeft], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    }),
  );
  const landed = useIn(64, 10);
  const numP = useIn(8, 16);
  const div = useIn(70, 22);
  return (
    <AbsoluteFill>
      <Backdrop glowY={44} />
      <Ornament x={170} string={210} size={120} dropAt={0} phase={0.5} />
      <Ornament x={905} string={140} size={92} dropAt={6} phase={2} />
      <Ornament x={790} string={300} size={64} dropAt={12} phase={4} tint="#9b1c30" />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 120,
        }}
      >
        <Appear start={0}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 40,
              letterSpacing: 16,
              color: GOLD,
              textTransform: "uppercase",
            }}
          >
            ✦ {t.reminder} ✦
          </div>
        </Appear>
        <div
          style={{
            position: "relative",
            fontFamily: display,
            fontWeight: 700,
            fontSize: 380,
            lineHeight: 1,
            marginTop: 30,
            opacity: numP,
            transform: `scale(${0.85 + 0.15 * numP + landed * 0.04 * Math.sin(landed * Math.PI)})`,
            filter: `drop-shadow(0 0 ${30 * landed}px rgba(212,173,110,0.45))`,
            fontVariantNumeric: "tabular-nums",
            ...GOLD_TEXT,
          }}
        >
          {counted}
        </div>
        <div style={{ position: "relative", width: 900, height: 0 }}>
          {landed > 0 ? (
            <>
              <Sparkle x={130} y={-330} size={70} phase={0} />
              <Sparkle x={790} y={-250} size={50} phase={2} />
              <Sparkle x={720} y={-40} size={36} phase={4} />
            </>
          ) : null}
        </div>
        <Appear start={58}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 54,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: IVORY,
              marginTop: 10,
              textAlign: "center",
              lineHeight: 1.05,
            }}
          >
            {t.daysWord(daysLeft)} {t.untilNewYear}
          </div>
        </Appear>
        <div style={{ marginTop: 54, marginBottom: 54 }}>
          <GoldDivider width={520} progress={div} />
        </div>
        <Appear start={84} dur={22}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 64,
              letterSpacing: 3,
              lineHeight: 1.18,
              color: IVORY,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            <Lines text={t.planNow} />
          </div>
        </Appear>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
