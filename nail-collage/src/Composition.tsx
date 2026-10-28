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
loadFont({ family: cinzel, url: staticFile("fonts/Cinzel.ttf"), weight: "400 900" });
loadFont({ family: cormorant, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" });

const GOLD = "#c9a36a";
const IVORY = "#f2ece2";
const FPS = 30;
const W = 1080;
const PANEL = 600; // three panels of 1080×600
const BAND = 60; // gold bands between them
const XFADE = 15;
const DURATION = 390;

// Source clips are 720×1280 with the background already removed (scripts/clean.py)
const SRC_W = 720;
const SRC_H = 1280;

const ease = Easing.bezier(0.33, 0, 0.2, 1);

type Framing = {
  src: string;
  // point of the source clip (in its own pixels) that sits in the middle of the panel
  fx: number;
  fy: number;
  scale: number;
  from?: number; // seconds into the clip
};

// One clip framed inside a panel, with a slow drift so it never looks static
const Clip: React.FC<Framing> = ({ src, fx, fy, scale, from = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = scale * interpolate(frame, [0, durationInFrames], [1, 1.04]);
  const w = SRC_W * s;
  const h = SRC_H * s;
  // same clip, wide enough to cover the panel, blurred: fills the sides behind the sharp one
  const fill = Math.max(W / SRC_W, PANEL / SRC_H) * 1.1;
  const fade = "transparent 0, black 12%, black 88%, transparent 100%";
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
          left: W / 2 - fx * fill,
          top: PANEL / 2 - fy * fill,
          filter: "blur(28px) brightness(0.42)",
        }}
      />
      <Video
        src={staticFile(src)}
        trimBefore={Math.round(from * FPS)}
        muted
        style={{
          position: "absolute",
          width: w,
          height: h,
          left: W / 2 - fx * s,
          top: PANEL / 2 - fy * s,
          maskImage: `linear-gradient(90deg, ${fade}), linear-gradient(0deg, ${fade})`,
          maskComposite: "intersect",
        }}
      />
      {/* soft vignette so the panel edges sink into shadow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 85% at 50% 50%, transparent 70%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Panel: React.FC<{ top: number; children: React.ReactNode }> = ({
  top,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top,
      width: W,
      height: PANEL,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

// Shots that follow one another in the same panel, crossfading
const Sequence: React.FC<{ shots: (Framing & { frames: number })[] }> = ({
  shots,
}) => (
  <TransitionSeries>
    {shots.flatMap((shot, i) => {
      const seq = (
        <TransitionSeries.Sequence key={shot.src} durationInFrames={shot.frames}>
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

// Gold hairline with a diamond (or a title) in the middle, as on the page's covers
const Band: React.FC<{ top: number; title?: string; delay: number }> = ({
  top,
  title,
  delay,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const line = (dir: "left" | "right") => (
    <div
      style={{
        height: 2,
        flex: 1,
        background: `linear-gradient(${dir === "left" ? 90 : 270}deg, transparent, ${GOLD})`,
        transform: `scaleX(${p})`,
        transformOrigin: dir === "left" ? "right" : "left",
      }}
    />
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        width: W,
        height: BAND,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 70px",
        boxSizing: "border-box",
      }}
    >
      {line("left")}
      {title ? (
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 38,
            letterSpacing: 10 + (1 - p) * 16,
            color: IVORY,
            opacity: p,
            whiteSpace: "nowrap",
            filter: `blur(${(1 - p) * 6}px)`,
          }}
        >
          {title}
        </div>
      ) : (
        <div
          style={{
            fontFamily: cormorant,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 12,
            color: GOLD,
            textTransform: "uppercase",
            opacity: p,
            whiteSpace: "nowrap",
          }}
        >
          нейл-інсталяція
        </div>
      )}
      {line("right")}
    </div>
  );
};

export const NailCollage: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [1, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Panel top={0}>
        {/* Великий палець */}
        <Clip src="thumb.mp4" fx={340} fy={570} scale={0.82} />
      </Panel>
      <Band top={PANEL} title="CURSE OF THE DEEP" delay={6} />
      <Panel top={PANEL + BAND}>
        {/* Безіменний з кальмаром */}
        <Sequence
          shots={[
            { src: "squid-a.mp4", frames: 280, fx: 380, fy: 640, scale: 0.68 },
            { src: "squid-b.mp4", frames: 125, fx: 360, fy: 560, scale: 0.8 },
          ]}
        />
      </Panel>
      <Band top={PANEL * 2 + BAND} delay={14} />
      <Panel top={(PANEL + BAND) * 2}>
        {/* Вказівний, середній і мізинець по черзі */}
        <Sequence
          shots={[
            { src: "green.mp4", frames: 140, fx: 390, fy: 720, scale: 0.72 },
            { src: "purple.mp4", frames: 140, fx: 330, fy: 700, scale: 0.68 },
            { src: "copper.mp4", frames: 140, fx: 320, fy: 680, scale: 0.66 },
          ]}
        />
      </Panel>
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
      height={1920}
    />
  );
};
