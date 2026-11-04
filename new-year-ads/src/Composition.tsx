import { loadFont } from "@remotion/fonts";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  random,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const SERIF = "Cormorant Garamond";
loadFont({ family: SERIF, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" });

// Same palette as the page covers: black, ivory serif caps, gold accents
const BLACK = "#0b0a09";
const IVORY = "#f2ece2";
const GOLD = "#c9a36a";
const FPS = 30;

const INTRO = 75;
const SHOT = 66;
const OUTRO = 105;

type Ad = {
  id: string;
  title: [string, string]; // second line is gold
  captions: string[]; // one per shot, cycled
  media: string[]; // files in public/media/<id>/, .jpg/.png or .mp4
};

// Swap the files in public/media/* for the page's own photos or videos
const ADS: Ad[] = [
  {
    id: "designs",
    title: ["Новорічний", "дизайн"],
    captions: ["Блиск, який помітять усі", "Від мінімалізму до арт-деталей"],
    media: ["designs/1.jpg", "designs/2.jpg"],
  },
  {
    id: "extensions",
    title: ["Нарощування", "до свят"],
    captions: ["Довжина і форма під твій образ", "Тримається всі свята"],
    media: ["extensions/1.jpg", "extensions/2.jpg"],
  },
  {
    id: "short",
    title: ["Короткі —", "теж святкові"],
    captions: ["Акуратно і зручно", "Святково без зайвої довжини"],
    media: ["short/1.jpg", "short/2.jpg"],
  },
];

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useIn = (delay: number, dur = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, dur], [0, 1], { ...clamp, easing: ease });
};

// Fades a scene in and out so cuts stay soft
const useFade = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return Math.min(
    interpolate(frame, [0, 8], [0, 1], clamp),
    interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], clamp),
  );
};

const Rise: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  children,
  style,
}) => {
  const p = useIn(delay, 18);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        filter: `blur(${(1 - p) * 6}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Gold hairline with a small diamond in the middle, as on the page's covers
const GoldDivider: React.FC<{ width: number; delay: number }> = ({ width, delay }) => {
  const p = useIn(delay, 18);
  const line = (dir: "90deg" | "270deg", origin: string) => (
    <div
      style={{
        height: 2,
        flex: 1,
        background: `linear-gradient(${dir}, transparent, ${GOLD})`,
        transform: `scaleX(${p})`,
        transformOrigin: origin,
      }}
    />
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, width, opacity: p }}>
      {line("90deg", "right")}
      <div
        style={{ width: 12, height: 12, background: GOLD, transform: `rotate(45deg) scale(${p})` }}
      />
      {line("270deg", "left")}
    </div>
  );
};

const Title: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({
  children,
  size = 110,
  style,
}) => (
  <div
    style={{
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: size * 0.04,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);

const Kicker: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontWeight: 600,
      fontSize: 40,
      letterSpacing: 9,
      textTransform: "uppercase",
      color: GOLD,
      ...style,
    }}
  >
    {children}
  </div>
);

// Faint hairlines fanning in from one edge, like on the page's backgrounds
const Lines: React.FC = () => {
  const frame = useCurrentFrame();
  const d = Math.sin((frame / FPS) * 0.6) * 30;
  const px = 1160;
  const py = 1560 + d;
  const fan: [number, number, number][] = [
    [-40, 760, 0.09],
    [-40, 800, 0.06],
    [180, -40, 0.08],
    [230, -40, 0.05],
    [-40, 1500, 0.07],
  ];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {fan.map(([x, y, o], i) => (
        <path
          key={i}
          d={`M${x},${y} Q${(x + px) / 2 + d},${(y + py) / 2 - 60} ${px},${py}`}
          stroke={IVORY}
          strokeOpacity={o}
          strokeWidth={1.6}
          fill="none"
        />
      ))}
      <path
        d={`M${1010 - d},-40 C840,640 ${880 + d},1260 1120,1560`}
        stroke={GOLD}
        strokeOpacity={0.1}
        strokeWidth={1.4}
        fill="none"
      />
    </svg>
  );
};

const Bg: React.FC = () => (
  <AbsoluteFill
    style={{ background: `radial-gradient(ellipse 80% 55% at 50% 42%, #1d1915 0%, ${BLACK} 70%)` }}
  >
    <Lines />
  </AbsoluteFill>
);

// Slow-falling twinkling gold dust: the festive touch, kept quiet
const GoldDust: React.FC<{ count?: number; strength?: number }> = ({
  count = 46,
  strength = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const x = random(`x${i}`) * 1080 + Math.sin(frame / 40 + i) * 14;
        const speed = 0.6 + random(`s${i}`) * 1.4;
        const y = ((random(`y${i}`) * 2100 + frame * speed) % 2100) - 90;
        const size = 2 + random(`r${i}`) * 5;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (12 + random(`t${i}`) * 20) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: GOLD,
              opacity: tw * 0.75 * strength,
              boxShadow: `0 0 ${size * 3}px ${GOLD}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Logo: React.FC = () => (
  <Img
    src={staticFile("km-logo.png")}
    style={{ position: "absolute", left: 60, top: 110, width: 140 }}
  />
);

const Intro: React.FC<{ ad: Ad }> = ({ ad }) => {
  const frame = useCurrentFrame();
  const spacing = interpolate(frame, [4, 30], [24, 4], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: useFade() }}>
      <Bg />
      <GoldDust />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 70px" }}
      >
        <Rise delay={2}>
          <Kicker>Новий рік · 2027</Kicker>
        </Rise>
        <div style={{ margin: "36px 0" }}>
          <GoldDivider width={460} delay={8} />
        </div>
        <Rise delay={10}>
          <Title style={{ letterSpacing: spacing }}>{ad.title[0]}</Title>
        </Rise>
        <Rise delay={18}>
          <Title style={{ letterSpacing: spacing, color: GOLD }}>{ad.title[1]}</Title>
        </Rise>
      </AbsoluteFill>
      <Logo />
    </AbsoluteFill>
  );
};

// One photo or clip with a slow push-in and a caption in the lower third
const Shot: React.FC<{ src: string; caption: string; i: number }> = ({ src, caption, i }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, SHOT], i % 2 ? [1.12, 1.04] : [1.04, 1.12]);
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${scale})`,
  };
  return (
    <AbsoluteFill style={{ opacity: useFade(), backgroundColor: BLACK }}>
      {src.endsWith(".mp4") ? (
        <Video src={staticFile(`media/${src}`)} muted style={style} />
      ) : (
        <Img src={staticFile(`media/${src}`)} style={style} />
      )}
      <AbsoluteFill
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 42%)" }}
      />
      <GoldDust count={24} strength={0.7} />
      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 430, textAlign: "center" }}
      >
        <Rise delay={6}>
          <Title size={64} style={{ letterSpacing: 4, color: IVORY, padding: "0 90px" }}>
            {caption}
          </Title>
        </Rise>
        <div style={{ marginTop: 26 }}>
          <GoldDivider width={380} delay={12} />
        </div>
      </AbsoluteFill>
      <Logo />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill style={{ opacity: useFade() }}>
    <Bg />
    <GoldDust />
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 80px" }}
    >
      <Rise delay={2}>
        <Title size={96}>Запис</Title>
        <Title size={96}>на свята</Title>
        <Title size={96} style={{ color: GOLD }}>
          відкрито
        </Title>
      </Rise>
      <div style={{ margin: "44px 0 36px" }}>
        <GoldDivider width={520} delay={16} />
      </div>
      <Rise delay={24}>
        <Kicker>Вільних віконець небагато</Kicker>
      </Rise>
      <Rise delay={38} style={{ marginTop: 34 }}>
        <div style={{ fontWeight: 500, fontSize: 54, color: IVORY }}>Пишіть у директ</div>
      </Rise>
    </AbsoluteFill>
    <Logo />
  </AbsoluteFill>
);

const adLength = (ad: Ad) => INTRO + ad.media.length * SHOT + OUTRO;

const AdReel: React.FC<{ ad: Ad }> = ({ ad }) => (
  <AbsoluteFill style={{ backgroundColor: BLACK, fontFamily: SERIF, color: IVORY }}>
    <Series>
      <Series.Sequence durationInFrames={INTRO} name="intro">
        <Intro ad={ad} />
      </Series.Sequence>
      {ad.media.map((m, i) => (
        <Series.Sequence key={m} durationInFrames={SHOT} name={m}>
          <Shot src={m} caption={ad.captions[i % ad.captions.length]} i={i} />
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={OUTRO} name="outro">
        <Outro />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

export const MyComposition: React.FC = () => (
  <>
    {ADS.map((ad) => (
      <Composition
        key={ad.id}
        id={`NY-${ad.id}`}
        component={AdReel}
        defaultProps={{ ad }}
        durationInFrames={adLength(ad)}
        fps={FPS}
        width={1080}
        height={1920}
      />
    ))}
  </>
);
