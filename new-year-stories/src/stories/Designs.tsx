import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Appear, Backdrop, GoldDivider, Lines, Sparkle, useIn, usePop } from "../fx";
import { Texts } from "../i18n";
import { display, GOLD, GOLD_DARK, GOLD_LIGHT, GOLD_TEXT, IVORY, serif } from "../theme";

const NAIL_W = 150;
const NAIL_H = 236;
const ALMOND = "50% 50% 46% 46% / 62% 62% 38% 38%";

// Stylised almond nail painted with one of four festive designs
const Nail: React.FC<{ kind: number }> = ({ kind }) => {
  const frame = useCurrentFrame();
  const shine = ((frame * 3) % 420) - 140;
  const layers: React.ReactNode[] = [];
  let base = "";
  if (kind === 0) {
    base = "linear-gradient(170deg, #c4243b 0%, #8e1226 55%, #4d0712 100%)";
    layers.push(
      <div
        key="foil"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(125deg, transparent 52%, ${GOLD_LIGHT} 55%, ${GOLD} 60%, ${GOLD_DARK} 64%, transparent 67%)`,
        }}
      />,
    );
  } else if (kind === 1) {
    base = "linear-gradient(170deg, #f6e2c2 0%, #d8b98c 50%, #a8865a 100%)";
    layers.push(
      <div
        key="glitter"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, #fff 1.4px, transparent 2px), radial-gradient(circle, #fff3d6 1px, transparent 1.6px)",
          backgroundSize: "14px 14px, 9px 9px",
          backgroundPosition: "0 0, 4px 6px",
          opacity: 0.85,
        }}
      />,
    );
  } else if (kind === 2) {
    base = "linear-gradient(170deg, #f3d6d0 0%, #e7bfb6 100%)";
    layers.push(
      <div
        key="tip"
        style={{
          position: "absolute",
          left: -30,
          right: -30,
          top: -NAIL_H * 0.72,
          height: NAIL_H,
          borderRadius: "0 0 50% 50% / 0 0 34% 34%",
          background: "linear-gradient(180deg, #ffffff, #eef3ff)",
          boxShadow: "0 4px 10px rgba(160,180,220,0.5)",
        }}
      />,
      <svg key="flake" width={64} height={64} viewBox="-10 -10 20 20" style={{ position: "absolute", left: NAIL_W / 2 - 32, top: NAIL_H * 0.55 }}>
        {[0, 60, 120].map((a) => (
          <g key={a} transform={`rotate(${a})`} stroke="#ffffff" strokeWidth={1.1} strokeLinecap="round">
            <line x1={0} y1={-8} x2={0} y2={8} />
            <line x1={0} y1={-5} x2={-2.2} y2={-7} />
            <line x1={0} y1={-5} x2={2.2} y2={-7} />
            <line x1={0} y1={5} x2={-2.2} y2={7} />
            <line x1={0} y1={5} x2={2.2} y2={7} />
          </g>
        ))}
      </svg>,
    );
  } else {
    base = "linear-gradient(170deg, #0f5a45 0%, #083a2d 60%, #031a14 100%)";
    layers.push(
      <div
        key="velvet"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${100 + Math.sin(frame / 20) * 14}deg, transparent 30%, rgba(120,230,180,0.55) 48%, rgba(200,255,225,0.8) 50%, rgba(120,230,180,0.55) 52%, transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />,
    );
  }
  return (
    <div
      style={{
        position: "relative",
        width: NAIL_W,
        height: NAIL_H,
        borderRadius: ALMOND,
        background: base,
        overflow: "hidden",
        boxShadow: "0 18px 40px rgba(0,0,0,0.55), inset 0 -8px 18px rgba(0,0,0,0.25)",
      }}
    >
      {layers}
      {/* gloss + travelling shine */}
      <div
        style={{
          position: "absolute",
          left: 26,
          top: 30,
          width: 26,
          height: NAIL_H * 0.55,
          borderRadius: 20,
          background: "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0))",
          filter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: shine,
          height: 60,
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.35), transparent)",
          transform: "skewY(-20deg)",
        }}
      />
    </div>
  );
};

const Card: React.FC<{ n: number; label: string; start: number }> = ({ n, label, start }) => {
  const p = usePop(start);
  return (
    <div
      style={{
        position: "relative",
        width: 430,
        height: 470,
        borderRadius: 36,
        border: "2px solid rgba(212,173,110,0.5)",
        background: "linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        transform: `scale(${0.6 + 0.4 * p}) translateY(${(1 - p) * 60}px)`,
        opacity: Math.min(1, p * 1.5),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 26,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 64,
          lineHeight: 1,
          ...GOLD_TEXT,
        }}
      >
        {n}
      </div>
      <div style={{ marginTop: 20 }}>
        <Nail kind={n - 1} />
      </div>
      <div
        style={{
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.05,
          letterSpacing: 1,
          color: IVORY,
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        <Lines text={label} />
      </div>
    </div>
  );
};

export const Designs: React.FC<{ t: Texts }> = ({ t }) => {
  const frame = useCurrentFrame();
  const div = useIn(10, 20);
  const bounce = Math.abs(Math.sin(frame / 8)) * 18;
  return (
    <AbsoluteFill>
      <Backdrop glowY={50} snow={0.6} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 240 }}>
        <Appear start={0}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 500,
              fontSize: 88,
              letterSpacing: 8,
              color: IVORY,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {t.whichDesign}
          </div>
        </Appear>
        <Appear start={6}>
          <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 92, color: GOLD, lineHeight: 1.1 }}>
            {t.whichDesignAccent}
          </div>
        </Appear>
        <div style={{ margin: "24px 0 40px" }}>
          <GoldDivider width={460} progress={div} />
        </div>
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "430px 430px", gap: 30 }}>
          {t.designs.map((d, i) => (
            <Card key={i} n={i + 1} label={d} start={22 + i * 9} />
          ))}
          <Sparkle x={445} y={490} size={70} phase={0} />
          <Sparkle x={860} y={10} size={50} phase={2} />
          <Sparkle x={20} y={960} size={44} phase={4} />
        </div>
        <Appear start={80} style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 56,
              letterSpacing: 2,
              color: IVORY,
              textTransform: "uppercase",
            }}
          >
            {t.replyNumber}
          </div>
          <svg width={60} height={60} viewBox="0 0 60 60" style={{ transform: `translateY(${bounce}px)`, marginTop: 6 }}>
            <path d="M14 22 L30 38 L46 22" fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Appear>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
