import { loadFont } from "@remotion/fonts";
import { Video } from "@remotion/media";
import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const cinzel = "Cinzel";
const cormorant = "Cormorant Garamond";
loadFont({ family: cinzel, url: staticFile("fonts/Cinzel.ttf"), weight: "400 900" });
loadFont({ family: cormorant, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" });

// Page style: the same gold / ivory pair as in the CURSE OF THE DEEP and #0056 reels
const GOLD = "#c9a36a";
const IVORY = "#f2ece2";
const FPS = 30;
const FADE = 10;
const CLIP = staticFile("clean.mp4");

const ease = Easing.bezier(0.33, 0, 0.2, 1);

// Gold hairline with a small diamond in the middle
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

// One shot of the walk: a stretch of the graded clip with a slow push-in
const Shot: React.FC<{ from: number; to?: number }> = ({ from, to = 1.05 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, to], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Video
          src={CLIP}
          trimBefore={Math.round(from * FPS)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{
  text: string;
  label?: string; // small gold question above the answer
  accent?: string;
  position: "top" | "bottom";
  delay?: number;
  size?: number;
  topOffset?: number;
  stay?: boolean; // the last caption stays to the end
}> = ({ text, label, accent, position, delay = 6, size = 84, topOffset = 250, stay = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame - delay, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const accP = interpolate(frame - delay - 8, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  // gone before the crossfade, so two captions never overlap
  const out = stay ? 1 : interpolate(frame, [durationInFrames - FADE - 6, durationInFrames - FADE], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const top = position === "top";
  return (
    <AbsoluteFill
      style={{
        justifyContent: top ? "flex-start" : "flex-end",
        alignItems: "center",
        // bottom text sits above the Instagram UI; top text below the profile row
        paddingTop: top ? topOffset : 0,
        paddingBottom: top ? 0 : 420,
        opacity: out,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          [top ? "top" : "bottom"]: 0,
          height: 1100,
          background: `linear-gradient(${top ? 180 : 0}deg, rgba(0,0,0,0.88), rgba(0,0,0,0.8) 45%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0))`,
          opacity: inP,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        {label ? (
          <div
            style={{
              fontFamily: cormorant,
              fontWeight: 600,
              fontSize: 62,
              letterSpacing: 2,
              color: GOLD,
              textAlign: "center",
              opacity: inP,
              transform: `translateY(${(1 - inP) * 14}px)`,
              textShadow: "0 2px 14px rgba(0,0,0,0.55)",
            }}
          >
            {label}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: cinzel,
            fontSize: size,
            letterSpacing: 6 + (1 - (label ? accP : inP)) * 20,
            color: IVORY,
            textAlign: "center",
            lineHeight: 1.12,
            whiteSpace: "pre-line",
            opacity: label ? accP : inP,
            filter: `blur(${(1 - (label ? accP : inP)) * 8}px)`,
            textShadow: "0 2px 18px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </div>
        {accent ? (
          <div
            style={{
              fontFamily: cormorant,
              fontWeight: 500,
              fontSize: 72,
              color: GOLD,
              textAlign: "center",
              lineHeight: 1.05,
              whiteSpace: "pre-line",
              opacity: accP,
              transform: `translateY(${(1 - accP) * 20}px)`,
              textShadow: "0 2px 14px rgba(0,0,0,0.55)",
            }}
          >
            {accent}
          </div>
        ) : null}
        <GoldDivider width={420} progress={accent || label ? accP : inP} />
      </div>
    </AbsoluteFill>
  );
};

// Small KM monogram: top left, a bit below the edge so the "Reels" header does not cover it
const Monogram: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [durationInFrames - 10, durationInFrames], [0.75, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "flex-start", paddingTop: 110, paddingLeft: 48 }}>
      <Img
        src={staticFile("logo-km.png")}
        style={{
          height: 92,
          opacity: o,
          filter: "drop-shadow(0 0 10px rgba(0,0,0,0.85)) drop-shadow(0 0 3px rgba(0,0,0,0.9))",
        }}
      />
    </AbsoluteFill>
  );
};

// Full logo on the final shot, above the call to action
const FinalLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
      <Img
        src={staticFile("logo-full.png")}
        style={{
          width: 230,
          opacity: p,
          transform: `scale(${0.94 + 0.06 * p})`,
          filter: `blur(${(1 - p) * 6}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

type Scene = {
  name: string;
  from: number; // seconds into the source clip
  frames: number;
  label?: string;
  text?: string;
  size?: number;
};

const SCENES: Scene[] = [
  { name: "Алея, сонце", from: 0.0, frames: 90, label: "привіт, я", text: "КАТЯ", size: 150 },
  { name: "Кружляння", from: 4.0, frames: 105, label: "досвід", text: "МАЙЖЕ 6 РОКІВ\nУ МАНІКЮРІ", size: 84 },
  {
    name: "Сосни, погляд угору",
    from: 11.0,
    frames: 105,
    label: "мій стиль",
    text: "ЕЛЕГАНТНИЙ НЮД\nІ ЕКСТРАВАГАНТНИЙ\nАРТ",
    size: 70,
  },
  {
    name: "Посмішка біля перил",
    from: 21.0,
    frames: 105,
    label: "Дніпро · Сонячний",
    text: "МАНІКЮР\nПЕДИКЮР\nНАРОЩУВАННЯ",
    size: 80,
  },
  {
    name: "Розворот",
    from: 27.5,
    frames: 105,
    label: "мої принципи",
    text: "ЯКІСТЬ\nТУРБОТА ПРО\nКОЖНОГО КЛІЄНТА\nВІДПОВІДАЛЬНІСТЬ",
    size: 66,
  },
  {
    name: "Профіль біля перил",
    from: 32.0,
    frames: 90,
    label: "мій підхід",
    text: "ІНДИВІДУАЛЬНИЙ\nДО КОЖНОЇ\nКЛІЄНТКИ",
    size: 76,
  },
  {
    name: "Погляд у небо",
    from: 35.8,
    frames: 105,
    label: "поза роботою",
    text: "ТВОРЧІСТЬ\nПРИРОДА\nРОДИНА",
    size: 80,
  },
  {
    name: "У воді",
    from: 43.0,
    frames: 105,
    label: "моя мета",
    text: "ВЛАСНІ КУРСИ\nІ СВІЙ СТИЛЬ",
    size: 80,
  },
];
const FINAL = { name: "Фінал: запис", from: 48.4, frames: 150 };

const FRAMES = [...SCENES.map((s) => s.frames), FINAL.frames];
const TOTAL = FRAMES.reduce((a, b) => a + b, 0) - (FRAMES.length - 1) * FADE;
const FINAL_START = TOTAL - FINAL.frames;

export const IntroReel: React.FC = () => {
  const t = linearTiming({ durationInFrames: FADE });
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        {SCENES.flatMap((s) => [
          <TransitionSeries.Sequence key={s.name} name={s.name} durationInFrames={s.frames}>
            <Shot from={s.from} />
            {s.text ? (
              <Caption label={s.label} text={s.text} position="bottom" size={s.size} />
            ) : null}
          </TransitionSeries.Sequence>,
          <TransitionSeries.Transition key={`${s.name}-fade`} presentation={fade()} timing={t} />,
        ])}
        <TransitionSeries.Sequence name={FINAL.name} durationInFrames={FINAL.frames}>
          <Shot from={FINAL.from} to={1.03} />
          <Caption
            text="ЗАПИС — DIRECT"
            accent="слово «ХОЧУ»"
            position="top"
            size={72}
            delay={26}
            topOffset={430}
            stay
          />
          {/* after the caption, so its dark gradient doesn't dim the gold */}
          <FinalLogo />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {/* the mark stays until the finale, where the full logo takes over */}
      <Sequence durationInFrames={FINAL_START + FADE} layout="none">
        <Monogram />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition
    id="IntroReel"
    component={IntroReel}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
