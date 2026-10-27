import { loadFont } from "@remotion/fonts";
import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const cinzel = "Cinzel";
const cormorant = "Cormorant Garamond";
loadFont({ family: cinzel, url: staticFile("fonts/Cinzel.ttf"), weight: "400 900" });
loadFont({ family: cormorant, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" });
loadFont({
  family: cormorant,
  url: staticFile("fonts/Cormorant-Italic.ttf"),
  weight: "300 700",
  style: "italic",
});

const GOLD = "#c9a36a";
const IVORY = "#f2ece2";
// close to the studio backdrop in the photos, so the faded photo edges blend in
const BG = "#0b0b0d";
const FPS = 30;
const FADE = 10;

const ease = Easing.bezier(0.33, 0, 0.2, 1);

// Gold hairline with a small diamond in the middle, same as in the CURSE OF THE DEEP reel
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

type PhotoProps = {
  src: string;
  // slow drift: scale from 1 to `to`, anchored at origin (percent of the photo)
  to?: number;
  x?: number;
  y?: number;
  // shift of the photo up/down on the canvas, px
  offsetY?: number;
};

// The 4:5 photo spans the full width of the 9:16 frame; top and bottom fade into the backdrop
const Photo: React.FC<PhotoProps> = ({ src, to = 1.06, x = 50, y = 50, offsetY = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const scale = interpolate(p, [0, 1], [1, to]);
  const mask =
    "linear-gradient(180deg, transparent 0%, black 9%, black 88%, transparent 100%)";
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${offsetY}px) scale(${scale})`,
          transformOrigin: `${x}% ${y}%`,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: 1188,
            height: 1485,
            objectFit: "cover",
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 95% 70% at 50% 50%, transparent 60%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

type CaptionProps = {
  text: string;
  accent?: string;
  position: "top" | "bottom";
  delay?: number;
  size?: number;
  // the accent line appears a beat after the main line
  accentDelay?: number;
};

const Caption: React.FC<CaptionProps> = ({
  text,
  accent,
  position,
  delay = 6,
  size = 84,
  accentDelay = 8,
}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame - delay, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const accP = interpolate(frame - delay - accentDelay, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const top = position === "top";
  return (
    <AbsoluteFill
      style={{
        justifyContent: top ? "flex-start" : "flex-end",
        alignItems: "center",
        // bottom text sits above the Instagram UI; top text below the profile row
        paddingTop: top ? 250 : 0,
        paddingBottom: top ? 0 : 420,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          [top ? "top" : "bottom"]: 0,
          height: 760,
          background: `linear-gradient(${top ? 180 : 0}deg, rgba(0,0,0,0.8), rgba(0,0,0,0))`,
          opacity: inP,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: cinzel,
            fontSize: size,
            letterSpacing: 6 + (1 - inP) * 20,
            color: IVORY,
            textAlign: "center",
            lineHeight: 1.08,
            opacity: inP,
            filter: `blur(${(1 - inP) * 8}px)`,
          }}
        >
          {text}
        </div>
        {accent ? (
          <div
            style={{
              fontFamily: cormorant,
              fontStyle: "italic",
              fontSize: 84,
              color: GOLD,
              textAlign: "center",
              lineHeight: 1.05,
              opacity: accP,
              transform: `translateY(${(1 - accP) * 20}px)`,
            }}
          >
            {accent}
          </div>
        ) : null}
        <GoldDivider width={420} progress={accent ? accP : inP} />
      </div>
    </AbsoluteFill>
  );
};

// Gold-tinted flash on the hard cut from "black?" to the answer
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6], [0.25, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: GOLD, opacity: o }} />;
};

const SHOTS = [60, 78, 72, 66, 90, 96];

export const GreenReel: React.FC = () => {
  const t = linearTiming({ durationInFrames: FADE });
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Гачок: чорний?" durationInFrames={SHOTS[0]}>
          <Photo src="photos/1-hook.jpg" to={1.08} x={62} y={45} />
          <Caption text="ЧОРНИЙ?" position="top" size={120} delay={4} />
        </TransitionSeries.Sequence>
        {/* hard cut on purpose: the answer should land like a punchline */}
        <TransitionSeries.Sequence name="Відповідь: темно-зелений" durationInFrames={SHOTS[1]}>
          <Photo src="photos/2-fist.jpg" to={1.07} x={45} y={45} />
          <Flash />
          <Caption text="НІ." accent="Темно-зелений." position="top" size={120} delay={2} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Один ніготь" durationInFrames={SHOTS[2]}>
          <Photo src="photos/3-single.jpg" to={1.1} x={52} y={52} />
          <Caption text="РОЗКРИВАЄТЬСЯ" accent="на світлі" position="bottom" size={72} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Листівки" durationInFrames={SHOTS[3]}>
          <Photo src="photos/4-cards.jpg" to={1.06} x={45} y={62} />
          <Caption text="ГЛИБОКИЙ · ГЛЯНЦЕВИЙ" position="bottom" size={60} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Торці" durationInFrames={SHOTS[4]}>
          {/* push in on the thin free edges of the middle nails */}
          <Photo src="photos/5-edge.jpg" to={1.45} x={46} y={58} />
          <Caption
            text="ТОНКІ ТОРЦІ"
            accent="як власний ніготь"
            position="top"
            size={90}
            delay={12}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Фінал: флакон #0056" durationInFrames={SHOTS[5]}>
          <Photo src="photos/6-bottle.jpg" to={1.05} x={55} y={45} offsetY={80} />
          <Caption
            text="ЗАПИС — DIRECT"
            accent="слово «ЗЕЛЕНИЙ»"
            position="top"
            size={84}
            delay={8}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="GreenReel"
      component={GreenReel}
      durationInFrames={SHOTS.reduce((a, b) => a + b, 0) - 4 * FADE}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
