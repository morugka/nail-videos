import { loadFont } from "@remotion/fonts";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const cinzel = "Cinzel";
const cormorant = "Cormorant Garamond";
const cormorantItalic = "Cormorant Garamond";
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
const FPS = 30;
const CLIP = staticFile("graded.mp4");

const ease = Easing.bezier(0.33, 0, 0.2, 1);

// Gold hairline with a small diamond in the middle, as on the page's covers
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

type ShotProps = {
  from: number; // seconds into the source clip
  playbackRate?: number;
  // Optional push-in on one detail: starts at `at` (0..1 of the shot), ends at scale `to`
  detail?: { at: number; to: number; x: number; y: number };
};

const Shot: React.FC<ShotProps> = ({ from, playbackRate = 1, detail }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  const flash = interpolate(frame, [0, 4], [0.18, 0], {
    extrapolateRight: "clamp",
  });
  // whole frame stays visible; just a barely noticeable drift so the shot feels alive
  let scale = interpolate(p, [0, 1], [1, 1.03]);
  let origin = "50% 50%";
  if (detail) {
    const d = interpolate(p, [detail.at, Math.min(1, detail.at + 0.35)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    });
    scale *= interpolate(d, [0, 1], [1, detail.to]);
    origin = `${detail.x}% ${detail.y}%`;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: origin }}>
        <Video
          src={CLIP}
          trimBefore={Math.round(from * FPS)}
          playbackRate={playbackRate}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 75% at 50% 45%, transparent 65%, rgba(0,0,0,0.3) 100%)",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: GOLD, opacity: flash }} />
    </AbsoluteFill>
  );
};

// Small caption in the lower third: gold divider + serif line
const Caption: React.FC<{ text: string; accent?: string; delay?: number }> = ({
  text,
  accent,
  delay = 6,
}) => {
  const frame = useCurrentFrame() - delay;
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const out = interpolate(
    frame + delay,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 300,
        opacity: out,
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.75), rgba(0,0,0,0))",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 700,
          opacity: inP,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          transform: `translateY(${(1 - inP) * 30}px)`,
          opacity: inP,
        }}
      >
        <div
          style={{
            fontFamily: cormorant,
            fontWeight: 500,
            fontSize: 76,
            letterSpacing: 6,
            color: IVORY,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          {text}
        </div>
        {accent ? (
          <div
            style={{
              fontFamily: cormorantItalic,
              fontStyle: "italic",
              fontSize: 64,
              color: GOLD,
            }}
          >
            {accent}
          </div>
        ) : null}
        <GoldDivider width={420} progress={inP} />
      </div>
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [4, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const sub = interpolate(frame, [18, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const out = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", opacity: out }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 45%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          paddingBottom: 330,
        }}
      >
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 112,
            lineHeight: 1.08,
            color: IVORY,
            textAlign: "center",
            letterSpacing: 8 + (1 - p) * 30,
            opacity: p,
            filter: `blur(${(1 - p) * 10}px)`,
          }}
        >
          PEACOCK
        </div>
        <GoldDivider width={560} progress={sub} />
        <div
          style={{
            fontFamily: cormorant,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: 12,
            color: GOLD,
            textTransform: "uppercase",
            opacity: sub,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const sub = interpolate(frame, [14, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(0,0,0,${0.72 * p})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
          transform: `scale(${0.94 + 0.06 * p})`,
        }}
      >
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 118,
            lineHeight: 1.08,
            color: IVORY,
            textAlign: "center",
            letterSpacing: 8,
            opacity: p,
          }}
        >
          PEACOCK
        </div>
        <GoldDivider width={600} progress={sub} />
        <div
          style={{
            fontFamily: cormorant,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 4,
            color: IVORY,
            opacity: sub,
          }}
        >
          МАНІКЮР ✦ НАРОЩУВАННЯ ✦ ПЕДИКЮР
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const NailReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Series>
        <Series.Sequence name="Відкриття: перо павича" durationInFrames={SHOTS[0]}>
          <Shot from={1.0} playbackRate={0.9} />
          <TitleCard subtitle="котяче око" />
        </Series.Sequence>
        <Series.Sequence name="Перстень і перо" durationInFrames={SHOTS[1]}>
          <Shot from={22.5} />
        </Series.Sequence>
        <Series.Sequence name="Смарагд і кобальт" durationInFrames={SHOTS[2]}>
          <Shot from={44.0} detail={{ at: 0.3, to: 1.3, x: 62, y: 45 }} />
          <Caption text="Смарагд · Кобальт" />
        </Series.Sequence>
        <Series.Sequence name="Ланцюжки" durationInFrames={SHOTS[3]}>
          <Shot from={113.0} />
        </Series.Sequence>
        <Series.Sequence name="Відблиск" durationInFrames={SHOTS[4]}>
          <Shot from={121.5} playbackRate={0.85} />
          <Caption text="Гра світла" accent="у кожному русі." />
        </Series.Sequence>
        <Series.Sequence name="Мереживо" durationInFrames={SHOTS[5]}>
          <Shot from={133.0} />
        </Series.Sequence>
        <Series.Sequence name="Око павича" durationInFrames={SHOTS[6]}>
          <Shot from={147.0} detail={{ at: 0.35, to: 1.25, x: 45, y: 55 }} />
        </Series.Sequence>
        <Series.Sequence name="Довга форма" durationInFrames={SHOTS[7]}>
          <Shot from={168.0} playbackRate={0.85} />
          <Caption text="Ручна робота" delay={8} />
        </Series.Sequence>
        <Series.Sequence name="Фінал" durationInFrames={SHOTS[8]}>
          <Shot from={182.0} playbackRate={0.6} />
          <EndCard />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const SHOTS = [75, 60, 75, 60, 60, 54, 63, 66, 75];

export const MyComposition = () => {
  return (
    <Composition
      id="NailReel"
      component={NailReel}
      durationInFrames={SHOTS.reduce((a, b) => a + b, 0)}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
