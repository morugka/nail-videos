import { AbsoluteFill } from "remotion";
import { Appear, Backdrop, Lines, useIn, usePop } from "../fx";
import { Texts } from "../i18n";
import { GOLD, IVORY, serif } from "../theme";

// Deliberately restrained: ivory on black, gold only as a thin accent
const SLOT_W = 720;
const MUTED = "rgba(244,238,228,0.55)";

const Hairline: React.FC<{ progress: number; width?: number }> = ({ progress, width = 360 }) => (
  <div
    style={{
      width,
      height: 1,
      background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      transform: `scaleX(${progress})`,
      opacity: 0.8,
    }}
  />
);

const BusySlot: React.FC<{ label: string; start: number }> = ({ label, start }) => {
  const p = useIn(start, 12);
  return (
    <div
      style={{
        width: SLOT_W,
        height: 66,
        borderRadius: 14,
        border: "1px solid rgba(244,238,228,0.14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: p,
        fontFamily: serif,
        fontWeight: 500,
        fontSize: 30,
        letterSpacing: 10,
        textTransform: "uppercase",
        color: "rgba(244,238,228,0.28)",
        textDecoration: "line-through",
      }}
    >
      {label}
    </div>
  );
};

export const LastSlot: React.FC<{ t: Texts }> = ({ t }) => {
  const line1 = useIn(14, 20);
  const line2 = useIn(96, 20);
  const slot = usePop(78);
  return (
    <AbsoluteFill>
      <Backdrop glowY={45} snow={0.6} plain />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 280 }}>
        <Appear start={0}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: 14,
              color: MUTED,
              textTransform: "uppercase",
              marginRight: -14,
            }}
          >
            {t.reminder}
          </div>
        </Appear>
        <Appear start={4}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 500,
              fontSize: 96,
              letterSpacing: 8,
              color: IVORY,
              textTransform: "uppercase",
              lineHeight: 1.02,
              marginTop: 22,
              textAlign: "center",
            }}
          >
            <Lines text={t.lastSlotTitle} />
          </div>
        </Appear>
        <div style={{ margin: "34px 0 30px" }}>
          <Hairline progress={line1} />
        </div>
        <Appear start={18} dur={22}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 44,
              letterSpacing: 2,
              lineHeight: 1.25,
              color: IVORY,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            <Lines text={t.lastSlotBookEarly} />
          </div>
        </Appear>
        <Appear start={44} style={{ marginTop: 56 }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 54,
              letterSpacing: 12,
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: 24,
              marginRight: -12,
              textAlign: "center",
            }}
          >
            {t.lastSlotDate}
          </div>
        </Appear>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <BusySlot label={t.busy} start={52} />
          <BusySlot label={t.busy} start={60} />
          <BusySlot label={t.busy} start={68} />
          <div
            style={{
              width: SLOT_W,
              height: 160,
              marginTop: 4,
              borderRadius: 22,
              border: `1.5px solid ${IVORY}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: Math.min(1, slot * 1.4),
              transform: `scale(${0.92 + 0.08 * slot})`,
            }}
          >
            <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 100, lineHeight: 1, letterSpacing: 6, color: IVORY }}>
              18:00
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: serif,
                fontWeight: 600,
                fontSize: 28,
                letterSpacing: 8,
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              {t.lastSlotLabel}
            </div>
          </div>
        </div>
        <div style={{ margin: "50px 0 34px" }}>
          <Hairline progress={line2} width={260} />
        </div>
        <Appear start={100} dur={22}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 52,
              letterSpacing: 3,
              lineHeight: 1.18,
              color: IVORY,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            <Lines text={t.lastSlotOutro} />
          </div>
        </Appear>
        <Appear start={135} style={{ marginTop: 30 }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: 6,
              color: MUTED,
              textTransform: "uppercase",
            }}
          >
            {t.lastSlotCta}
          </div>
        </Appear>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
