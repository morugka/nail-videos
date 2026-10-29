import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Composition, interpolate, useCurrentFrame } from "remotion";
import {
  BG,
  cinzel,
  ease,
  FADE,
  FPS,
  GOLD,
  GoldDivider,
  IVORY,
  Monogram,
  Photo,
} from "./Composition";

// Hands only, one headline over the whole reel; the answer goes in the post caption
const SHOTS = [78, 72, 72, 84];

const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const line2 = interpolate(frame, [10, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const text: React.CSSProperties = {
    fontFamily: cinzel,
    fontSize: 64,
    lineHeight: 1.15,
    letterSpacing: 4,
    color: IVORY,
    textAlign: "center",
  };
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 760,
          background: "linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0))",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div style={{ ...text, opacity: p, filter: `blur(${(1 - p) * 8}px)` }}>
          Я ВІД ЦЬОГО
          <br />
          ВІДМОВИЛАСЯ
        </div>
        <div
          style={{
            ...text,
            color: GOLD,
            opacity: line2,
            transform: `translateY(${(1 - line2) * 20}px)`,
          }}
        >
          І ТІЛЬКИ ВИГРАЛА
        </div>
        <GoldDivider width={420} progress={line2} />
      </div>
    </AbsoluteFill>
  );
};

export const HandsReel: React.FC = () => {
  const t = linearTiming({ durationInFrames: FADE });
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Кільце" durationInFrames={SHOTS[0]}>
          <Photo src="photos/graded/1-hook.jpg" to={1.07} x={62} y={50} offsetY={120} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Кулак" durationInFrames={SHOTS[1]}>
          <Photo src="photos/graded/2-fist.jpg" to={1.07} x={45} y={50} offsetY={60} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Один ніготь" durationInFrames={SHOTS[2]}>
          {/* pushed down so the sleeve doesn't sit under the headline */}
          <Photo src="photos/graded/3-single.jpg" to={1.08} x={55} y={60} offsetY={300} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Збоку" durationInFrames={SHOTS[3]}>
          <Photo src="photos/graded/5-edge.jpg" to={1.08} x={50} y={55} offsetY={220} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Headline />
      <Monogram />
    </AbsoluteFill>
  );
};

export const HandsComposition = () => {
  return (
    <Composition
      id="HandsReel"
      component={HandsReel}
      durationInFrames={SHOTS.reduce((a, b) => a + b, 0) - (SHOTS.length - 1) * FADE}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
