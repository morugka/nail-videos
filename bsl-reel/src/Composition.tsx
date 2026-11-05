import { loadFont } from "@remotion/fonts";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";

const cormorant = "Cormorant Garamond";
loadFont({
  family: cormorant,
  url: staticFile("fonts/Cormorant.ttf"),
  weight: "300 700",
});

const GOLD = "#c9a36a";
const IVORY = "#f2ece2";
const FPS = 30;
// edit.mp4: the clip in the client's own grade (near-black wall), sound removed
const CLIP = 146; // frames in edit.mp4
const OUTRO = 50; // full logo on black after the clip
const FADE = 16; // clip fades to black over its last frames
const DURATION = CLIP + OUTRO - FADE;

const ease = Easing.bezier(0.33, 0, 0.2, 1);

// Gold hairline with a small diamond in the middle, as in the other reels
const GoldDivider: React.FC<{ width: number; progress: number }> = ({
  width,
  progress,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      width,
      opacity: progress,
    }}
  >
    <div
      style={{
        height: 2,
        flex: 1,
        background: `linear-gradient(90deg, transparent, ${GOLD})`,
        transform: `scaleX(${progress})`,
        transformOrigin: "right",
      }}
    />
    <div
      style={{
        width: 14,
        height: 14,
        background: GOLD,
        transform: `rotate(45deg) scale(${progress})`,
      }}
    />
    <div
      style={{
        height: 2,
        flex: 1,
        background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        transform: `scaleX(${progress})`,
        transformOrigin: "left",
      }}
    />
  </div>
);

// KM mark, same size and place as in the #0056 reel
const Monogram: React.FC = () => (
  <AbsoluteFill
    style={{ alignItems: "flex-start", paddingTop: 110, paddingLeft: 48 }}
  >
    <Img
      src={staticFile("logo-km.png")}
      style={{
        height: 92,
        filter:
          "drop-shadow(0 0 10px rgba(0,0,0,0.85)) drop-shadow(0 0 3px rgba(0,0,0,0.9))",
      }}
    />
  </AbsoluteFill>
);

// Hook over the dark wall at the top, below the KM mark and the profile row
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [3, 17], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const acc = interpolate(frame, [12, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 255 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 820,
          background: "linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0))",
          opacity: p,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div
          style={{
            fontFamily: cormorant,
            fontWeight: 600,
            fontSize: 70,
            lineHeight: 1.04,
            letterSpacing: 1 + (1 - p) * 10,
            color: IVORY,
            textAlign: "center",
            opacity: p,
            filter: `blur(${(1 - p) * 8}px)`,
            textShadow: "0 0 18px rgba(0,0,0,0.6)",
          }}
        >
          Манікюр
          <br />з ароматом кави
        </div>
        <GoldDivider width={320} progress={acc} />
      </div>
    </AbsoluteFill>
  );
};

// Full logo (logo-full.png, cut from the client's own transparent PNG) on black at the end
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Img
        src={staticFile("logo-full.png")}
        style={{
          width: 440,
          opacity: p,
          transform: `scale(${0.96 + 0.04 * p})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const FoamReel: React.FC = () => {
  const frame = useCurrentFrame();
  // the clip, the hook and the corner mark fade out together before the outro
  const clipOut = interpolate(frame, [CLIP - FADE, CLIP], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ opacity: clipOut }}>
        <Video
          src={staticFile("edit.mp4")}
          muted
          style={{ width: "100%", height: "100%" }}
        />
        <Monogram />
        <Hook />
      </AbsoluteFill>
      <Sequence from={CLIP - FADE / 2}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition
    id="FoamReel"
    component={FoamReel}
    durationInFrames={DURATION}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
