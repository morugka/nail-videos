import { loadFont } from "@remotion/fonts";
import { Video } from "@remotion/media";
import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const cinzel = "Cinzel";
const cormorant = "Cormorant Garamond";
loadFont({
  family: cinzel,
  url: staticFile("fonts/Cinzel.ttf"),
  weight: "400 900",
});
loadFont({
  family: cormorant,
  url: staticFile("fonts/Cormorant.ttf"),
  weight: "300 700",
});

const GOLD = "#c9a36a";
const IVORY = "#f2ece2";
const FPS = 30;
const W = 1920;
const H = 1080;
const PANEL = 620; // three columns of 620×1080
const BAND = 30; // gold hairlines between them
const XFADE = 15;
const DURATION = 390;

// Source clips are 720×1280 with the background darkened (scripts/clean.py)
const SRC_W = 720;
const SRC_H = 1280;

const ease = Easing.bezier(0.33, 0, 0.2, 1);

type Framing = {
  src: string;
  // point of the source clip (in its own pixels) that sits in the middle of the column
  fx: number;
  fy: number;
  scale: number;
  from?: number; // seconds into the clip
};

// One clip framed inside a column, with a slow drift so it never looks static
const Clip: React.FC<Framing> = ({ src, fx, fy, scale, from = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = scale * interpolate(frame, [0, durationInFrames], [1, 1.04]);
  // same clip, big enough to cover the column, blurred: fills any gap behind the sharp one
  const fill = Math.max(PANEL / SRC_W, H / SRC_H) * 1.15;
  const fadeEdge = "transparent 0, black 8%, black 92%, transparent 100%";
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <Video
        src={staticFile(src)}
        trimBefore={Math.round(from * FPS)}
        muted
        style={{
          position: "absolute",
          width: SRC_W * fill,
          height: SRC_H * fill,
          left: PANEL / 2 - fx * fill,
          top: H / 2 - fy * fill,
          filter: "blur(28px) brightness(0.42)",
        }}
      />
      <Video
        src={staticFile(src)}
        trimBefore={Math.round(from * FPS)}
        muted
        style={{
          position: "absolute",
          width: SRC_W * s,
          height: SRC_H * s,
          left: PANEL / 2 - fx * s,
          top: H / 2 - fy * s,
          maskImage: `linear-gradient(90deg, ${fadeEdge}), linear-gradient(0deg, ${fadeEdge})`,
          maskComposite: "intersect",
        }}
      />
      {/* soft vignette so the column edges sink into shadow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 70%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Column: React.FC<{ left: number; children: React.ReactNode }> = ({
  left,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left,
      width: PANEL,
      height: H,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

// Shots that follow one another in the same column, crossfading
const Sequence: React.FC<{ shots: (Framing & { frames: number })[] }> = ({
  shots,
}) => (
  <TransitionSeries>
    {shots.flatMap((shot, i) => {
      const seq = (
        <TransitionSeries.Sequence
          key={shot.src}
          durationInFrames={shot.frames}
        >
          <Clip {...shot} />
        </TransitionSeries.Sequence>
      );
      return i === 0
        ? [seq]
        : [
            <TransitionSeries.Transition
              key={`${shot.src}-in`}
              presentation={fade()}
              timing={linearTiming({ durationInFrames: XFADE })}
            />,
            seq,
          ];
    })}
  </TransitionSeries>
);

// Vertical gold hairline with a small diamond in the middle, as on the page's covers
const Band: React.FC<{ left: number; delay: number }> = ({ left, delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const line = (dir: "top" | "bottom") => (
    <div
      style={{
        width: 2,
        flex: 1,
        background: `linear-gradient(${dir === "top" ? 180 : 0}deg, transparent, ${GOLD})`,
        transform: `scaleY(${p})`,
        transformOrigin: dir === "top" ? "bottom" : "top",
      }}
    />
  );
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left,
        width: BAND,
        height: H,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        padding: "60px 0",
        boxSizing: "border-box",
      }}
    >
      {line("top")}
      <div
        style={{
          width: 12,
          height: 12,
          background: GOLD,
          transform: `rotate(45deg) scale(${p})`,
        }}
      />
      {line("bottom")}
    </div>
  );
};

// Caption over the bottom of the collage
const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [8, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const sub = interpolate(frame, [22, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 340,
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0))",
          opacity: p,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          paddingBottom: 56,
          position: "relative", // keeps the text above the gradient
        }}
      >
        <div
          style={{
            fontFamily: cormorant,
            fontWeight: 500,
            fontSize: 66,
            letterSpacing: 5 + (1 - p) * 20,
            color: IVORY,
            textTransform: "uppercase",
            opacity: p,
            filter: `blur(${(1 - p) * 8}px)`,
            whiteSpace: "nowrap",
          }}
        >
          Моє наймасштабніше творіння
        </div>
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 28,
            letterSpacing: 12,
            color: GOLD,
            opacity: sub,
          }}
        >
          CURSE OF THE DEEP
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const NailCollage: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [1, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Column left={0}>
        {/* Великий палець */}
        <Clip src="thumb.mp4" fx={360} fy={600} scale={0.9} />
      </Column>
      <Band left={PANEL} delay={6} />
      <Column left={PANEL + BAND}>
        {/* Безіменний з кальмаром */}
        <Sequence
          shots={[
            { src: "squid-a.mp4", frames: 280, fx: 370, fy: 640, scale: 0.9 },
            { src: "squid-b.mp4", frames: 125, fx: 360, fy: 620, scale: 0.9 },
          ]}
        />
      </Column>
      <Band left={PANEL * 2 + BAND} delay={14} />
      <Column left={(PANEL + BAND) * 2}>
        {/* Вказівний, середній і мізинець по черзі */}
        <Sequence
          shots={[
            { src: "green.mp4", frames: 140, fx: 400, fy: 690, scale: 0.78 },
            { src: "purple.mp4", frames: 140, fx: 340, fy: 680, scale: 0.92 },
            { src: "copper.mp4", frames: 140, fx: 330, fy: 640, scale: 0.9 },
          ]}
        />
      </Column>
      <Title />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: fadeIn }} />
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="NailCollage"
      component={NailCollage}
      durationInFrames={DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
