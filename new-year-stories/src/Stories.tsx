import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { anons, calendar, cta, designs, steps, YEAR } from "./content";
import {
  Backdrop,
  cinzel,
  cormorant,
  ease,
  GOLD,
  GOLD_LIGHT,
  GoldDivider,
  IVORY,
  Kicker,
  MUTED,
  reveal,
  Sparkle,
  useOutro,
} from "./shared";

// Instagram covers ~250px at the top and ~300px at the bottom with its UI,
// so all text stays inside this padded column
const Column: React.FC<{ children: React.ReactNode; gap?: number }> = ({
  children,
  gap = 34,
}) => (
  <AbsoluteFill
    style={{
      padding: "260px 90px 320px",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap,
      textAlign: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

// 1 — announcement: the year flies in, then the news
export const StoryAnons: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useOutro();
  const year = reveal(frame, 6, 28);
  const title = reveal(frame, 34, 20);
  const foot = reveal(frame, 52, 18);
  const shine = interpolate(frame, [40, 110], [-60, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Backdrop glowY={42} seed="anons" />
      <Sparkle x={250} y={560} size={70} progress={reveal(frame, 30, 14)} />
      <Sparkle x={860} y={720} size={46} progress={reveal(frame, 38, 14)} />
      <Sparkle x={820} y={1330} size={56} progress={reveal(frame, 60, 14)} />
      <Column>
        <Kicker text={anons.kicker} progress={reveal(frame, 0, 20)} />
        <div
          style={{
            fontFamily: cinzel,
            fontWeight: 600,
            fontSize: 270,
            lineHeight: 1,
            letterSpacing: 10 + (1 - year) * 60,
            backgroundImage: `linear-gradient(100deg, ${GOLD} ${shine - 40}%, #fff6e0 ${shine}%, ${GOLD} ${shine + 40}%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            opacity: year,
            filter: `blur(${(1 - year) * 14}px)`,
            scale: String(1.25 - 0.25 * year),
          }}
        >
          {YEAR}
        </div>
        <GoldDivider width={560} progress={title} />
        <div
          style={{
            fontFamily: cormorant,
            fontWeight: 500,
            fontSize: 88,
            lineHeight: 1.08,
            color: IVORY,
            opacity: title,
            translate: `0 ${(1 - title) * 40}px`,
          }}
        >
          {anons.title}
        </div>
        <div
          style={{
            fontFamily: cormorant,
            fontStyle: "italic",
            fontSize: 56,
            color: GOLD,
            opacity: foot,
          }}
        >
          {anons.footer}
        </div>
      </Column>
    </AbsoluteFill>
  );
};

const DesignLine: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = reveal(frame, 0, 14);
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 380,
        opacity: out,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: p,
          translate: `0 ${(1 - p) * 30}px`,
        }}
      >
        <div
          style={{
            fontFamily: cormorant,
            fontWeight: 500,
            fontSize: 84,
            letterSpacing: 5,
            color: IVORY,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {text}
        </div>
        <div style={{ fontFamily: cormorant, fontStyle: "italic", fontSize: 60, color: GOLD }}>
          {accent}
        </div>
        <GoldDivider width={420} progress={p} />
      </div>
    </AbsoluteFill>
  );
};

// 2 — designs: the studio's footage under three short captions
export const StoryDesigns: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = useOutro();
  const per = Math.floor((durationInFrames - 20) / designs.lines.length);
  return (
    <AbsoluteFill style={{ backgroundColor: "black", opacity: out }}>
      <AbsoluteFill
        style={{
          scale: String(interpolate(frame, [0, durationInFrames], [1.04, 1.14])),
        }}
      >
        <Video
          src={staticFile("designs.mp4")}
          trimBefore={0}
          playbackRate={0.75}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,4,3,0.85) 0%, rgba(5,4,3,0) 30%, rgba(5,4,3,0) 45%, rgba(5,4,3,0.9) 80%)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 290 }}>
        <Kicker text={designs.kicker} progress={reveal(frame, 4, 20)} />
      </AbsoluteFill>
      {designs.lines.map((line, i) => (
        <Sequence key={line.text} from={14 + i * per} durationInFrames={per} layout="none">
          <DesignLine text={line.text} accent={line.accent} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const WEEK = ["пн", "вт", "ср", "чт", "пт", "сб", "нд"];

// 3 — December calendar with the booked and hot dates
export const StoryCalendar: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useOutro();
  const cell = 118;
  const cells = [
    ...new Array(calendar.firstWeekday).fill(null),
    ...new Array(calendar.days).fill(0).map((_, i) => i + 1),
  ];
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Backdrop glowY={50} seed="cal" />
      <Column gap={30}>
        <Kicker text={calendar.kicker} progress={reveal(frame, 0, 18)} />
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 84,
            color: IVORY,
            letterSpacing: 4,
            lineHeight: 1.1,
            opacity: reveal(frame, 6, 20),
          }}
        >
          {calendar.title}
        </div>
        <GoldDivider width={480} progress={reveal(frame, 14, 18)} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(7, ${cell}px)`,
            gap: 8,
            marginTop: 10,
          }}
        >
          {WEEK.map((d) => (
            <div
              key={d}
              style={{
                fontFamily: cormorant,
                fontWeight: 600,
                fontSize: 34,
                letterSpacing: 3,
                color: GOLD,
                textTransform: "uppercase",
                height: 56,
                opacity: reveal(frame, 18, 14),
              }}
            >
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`e${i}`} />;
            const busy = calendar.busy.includes(day);
            const hot = calendar.hot.includes(day);
            const p = reveal(frame, 22 + i * 1.3, 12);
            // booked days get crossed out after the grid has appeared
            const strike = busy ? reveal(frame, 80 + calendar.busy.indexOf(day) * 6, 10) : 0;
            const glow = hot ? reveal(frame, 110, 16) : 0;
            return (
              <div
                key={day}
                style={{
                  position: "relative",
                  height: cell - 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  fontFamily: cormorant,
                  fontWeight: 600,
                  fontSize: 54,
                  color: busy
                    ? strike > 0.5
                      ? MUTED
                      : IVORY
                    : glow > 0
                      ? "#1a120a"
                      : IVORY,
                  background: glow > 0 ? `rgba(201,163,106,${glow})` : "rgba(242,236,226,0.05)",
                  border: `1.5px solid rgba(201,163,106,${hot ? 0.35 + 0.65 * glow : 0.18})`,
                  boxShadow: glow > 0 ? `0 0 ${20 + 24 * pulse * glow}px rgba(201,163,106,0.55)` : "none",
                  opacity: p,
                  scale: String(0.7 + 0.3 * p),
                }}
              >
                {day}
                {busy ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "18%",
                      right: "18%",
                      top: "50%",
                      height: 3,
                      background: GOLD,
                      rotate: "-35deg",
                      scale: `${strike} 1`,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: 46,
            fontFamily: cormorant,
            fontSize: 38,
            color: IVORY,
            opacity: reveal(frame, 120, 16),
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 26, height: 26, borderRadius: 6, background: GOLD }} />
            ще є віконця
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 14, color: MUTED }}>
            <span style={{ width: 26, height: 3, background: GOLD, rotate: "-35deg" }} />
            зайнято
          </span>
        </div>
        <div
          style={{
            fontFamily: cormorant,
            fontStyle: "italic",
            fontSize: 54,
            lineHeight: 1.15,
            color: GOLD_LIGHT,
            opacity: reveal(frame, 135, 18),
            translate: `0 ${(1 - reveal(frame, 135, 18)) * 24}px`,
          }}
        >
          {calendar.note}
        </div>
      </Column>
    </AbsoluteFill>
  );
};

// 4 — how to book, three steps
export const StorySteps: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useOutro();
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Backdrop glowY={30} seed="steps" />
      <Column gap={40}>
        <Kicker text={steps.kicker} progress={reveal(frame, 0, 18)} />
        <GoldDivider width={480} progress={reveal(frame, 8, 18)} />
        <div style={{ display: "flex", flexDirection: "column", gap: 64, marginTop: 30 }}>
          {steps.items.map((s, i) => {
            const p = reveal(frame, 20 + i * 32, 20);
            return (
              <div
                key={s.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 44,
                  textAlign: "left",
                  opacity: p,
                  translate: `${(1 - p) * -60}px 0`,
                }}
              >
                <div
                  style={{
                    flex: "0 0 150px",
                    height: 150,
                    borderRadius: "50%",
                    border: `2px solid ${GOLD}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: cinzel,
                    fontSize: 78,
                    color: GOLD_LIGHT,
                    boxShadow: `0 0 40px rgba(201,163,106,${0.35 * p})`,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div
                    style={{
                      fontFamily: cormorant,
                      fontWeight: 600,
                      fontSize: 66,
                      lineHeight: 1.05,
                      color: IVORY,
                    }}
                  >
                    {s.title}
                  </div>
                  <div
                    style={{
                      fontFamily: cormorant,
                      fontStyle: "italic",
                      fontSize: 46,
                      lineHeight: 1.1,
                      color: GOLD,
                    }}
                  >
                    {s.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Column>
    </AbsoluteFill>
  );
};

// 5 — call to action; the lower area is left clear for an Instagram link/DM sticker
export const StoryCta: React.FC = () => {
  const frame = useCurrentFrame();
  const title = reveal(frame, 10, 24);
  const action = reveal(frame, 44, 20);
  const [before, after] = cta.title.split("{YEAR}");
  const breathe = 1 + 0.03 * Math.sin(frame / 9);
  return (
    <AbsoluteFill>
      <Backdrop glowY={36} seed="cta" />
      <Sparkle x={170} y={250} size={60} progress={reveal(frame, 26, 14)} />
      <Sparkle x={900} y={1180} size={84} progress={reveal(frame, 34, 14)} />
      <AbsoluteFill
        style={{
          padding: "300px 90px 0",
          alignItems: "center",
          flexDirection: "column",
          gap: 36,
          textAlign: "center",
        }}
      >
        <Kicker text={cta.kicker} progress={reveal(frame, 0, 18)} />
        <div
          style={{
            fontFamily: cormorant,
            fontWeight: 500,
            fontSize: 96,
            lineHeight: 1.08,
            color: IVORY,
            opacity: title,
            filter: `blur(${(1 - title) * 8}px)`,
          }}
        >
          {before}
          <span style={{ fontFamily: cinzel, color: GOLD_LIGHT }}>{YEAR}</span>
          {after}
        </div>
        <GoldDivider width={560} progress={reveal(frame, 30, 18)} />
        <div
          style={{
            marginTop: 30,
            padding: "34px 64px",
            borderRadius: 999,
            background: `linear-gradient(100deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`,
            color: "#1a120a",
            fontFamily: cormorant,
            fontWeight: 700,
            fontSize: 64,
            letterSpacing: 1,
            opacity: action,
            scale: String((0.85 + 0.15 * action) * (frame > 64 ? breathe : 1)),
            boxShadow: `0 0 60px rgba(201,163,106,${0.5 * action})`,
          }}
        >
          {cta.action}
        </div>
        <div
          style={{
            fontFamily: cormorant,
            fontWeight: 600,
            fontSize: 32,
            letterSpacing: 4,
            color: MUTED,
            opacity: reveal(frame, 64, 18),
          }}
        >
          {cta.services}
        </div>
      </AbsoluteFill>
      {/* soft arrow pointing down to where the sticker goes */}
      <AbsoluteFill style={{ alignItems: "center", top: 1330 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRight: `3px solid ${GOLD}`,
            borderBottom: `3px solid ${GOLD}`,
            rotate: "45deg",
            opacity: reveal(frame, 80, 16) * (0.5 + 0.5 * Math.sin(frame / 8)),
            translate: `0 ${interpolate(Math.sin(frame / 8), [-1, 1], [0, 18], { easing: ease })}px`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
