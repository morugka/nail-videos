import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Composition,
  Img,
  interpolate,
  staticFile,
  Still,
  useCurrentFrame,
} from "remotion";
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

// Hands only, one headline over every shot. Used for reel covers: render a still of the shot you want.
// The headline sits inside the 3:4 band (y 240–1680) that the profile grid shows.
const SHOTS = [78, 72, 72, 84];

// `still` shows the headline fully, without the intro animation (for the cover)
const Headline: React.FC<{ still?: boolean; top?: number }> = ({
  still = false,
  top = 310,
}) => {
  const current = useCurrentFrame();
  const frame = still ? 1000 : current;
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
    <AbsoluteFill style={{ alignItems: "center", paddingTop: top }}>
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
          <Photo
            src="photos/graded/1-hook.jpg"
            to={1.07}
            x={62}
            y={50}
            offsetY={120}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Кулак" durationInFrames={SHOTS[1]}>
          <Photo
            src="photos/graded/2-fist.jpg"
            to={1.07}
            x={45}
            y={50}
            offsetY={60}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence
          name="Один ніготь"
          durationInFrames={SHOTS[2]}
        >
          {/* pushed down so the sleeve doesn't sit under the headline */}
          <Photo
            src="photos/graded/3-single.jpg"
            to={1.08}
            x={55}
            y={60}
            offsetY={300}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Збоку" durationInFrames={SHOTS[3]}>
          <Photo
            src="photos/graded/5-edge.jpg"
            to={1.08}
            x={50}
            y={55}
            offsetY={220}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Headline />
      <Monogram />
    </AbsoluteFill>
  );
};

// Cover: fist photo, headline on top, full logo in the top left corner
export const HandsCover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Photo src="photos/graded/2-fist.jpg" to={1} offsetY={60} />
      <Headline still />
      {/* full logo in the top left corner, as on the rest of the profile */}
      <AbsoluteFill
        style={{ alignItems: "flex-start", paddingTop: 90, paddingLeft: 48 }}
      >
        <Img
          src={staticFile("logo-full.png")}
          style={{
            width: 190,
            filter: "drop-shadow(0 0 10px rgba(0,0,0,0.85))",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Cover on the dried-flowers photo: the 9:16 photo fills the frame, headline in the dark top,
// a small "details in the caption" line at the bottom of the band the profile grid shows
export const BranchCover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Img
        src={staticFile("photos/7-branch.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Headline still top={420} />
      <AbsoluteFill
        style={{ alignItems: "flex-start", paddingTop: 90, paddingLeft: 48 }}
      >
        <Img
          src={staticFile("logo-full.png")}
          style={{
            width: 190,
            filter: "drop-shadow(0 0 10px rgba(0,0,0,0.85))",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 270,
        }}
      >
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 30,
            letterSpacing: 8,
            color: IVORY,
            opacity: 0.85,
            textShadow: "0 0 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.9)",
          }}
        >
          ДЕТАЛІ В ОПИСІ
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const HandsComposition = () => {
  return (
    <>
      <Still
        id="BranchCover"
        component={BranchCover}
        width={1080}
        height={1920}
      />
      <Still
        id="HandsCover"
        component={HandsCover}
        width={1080}
        height={1920}
      />
      <Composition
        id="HandsReel"
        component={HandsReel}
        durationInFrames={
          SHOTS.reduce((a, b) => a + b, 0) - (SHOTS.length - 1) * FADE
        }
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
