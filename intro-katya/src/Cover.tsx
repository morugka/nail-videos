import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Img, Still, staticFile } from "remotion";

const cinzel = "Cinzel";
const cormorant = "Cormorant Garamond";
loadFont({ family: cinzel, url: staticFile("fonts/Cinzel.ttf"), weight: "400 900" });
loadFont({ family: cormorant, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" });

const GOLD = "#c9a36a";
// Everything stays inside the middle 1080×1440, which the profile grid shows (3:4)
const LEFT = 80;

// Reels cover laid out like the cat-eye cover: logo top left, big title, gold line with a diamond
export const Cover: React.FC<{
  src: string;
  position?: string;
  logoRight?: boolean;
  // dark grade like the rest of the feed; the light stays on the face at this point (% of the frame)
  moody?: { x: number; y: number };
}> = ({ src, position = "50% 50%", logoRight = false, moody }) => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: position,
        filter: moody ? "brightness(0.88) contrast(1.1) saturate(0.78) sepia(0.16)" : undefined,
      }}
    />
    {moody ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 45% at ${moody.x}% ${moody.y}%, rgba(0,0,0,0) 0%, rgba(8,6,5,0.35) 55%, rgba(8,6,5,0.82) 100%)`,
        }}
      />
    ) : null}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.78) 25%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 58%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 18%, rgba(0,0,0,0) 32%)",
      }}
    />
    <Img
      src={staticFile("logo-full.png")}
      style={{
        position: "absolute",
        ...(logoRight ? { right: LEFT } : { left: LEFT }),
        top: 290,
        width: 200,
        filter: "drop-shadow(0 0 12px rgba(0,0,0,0.6))",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: LEFT,
        right: 60,
        top: 1190,
        display: "flex",
        flexDirection: "column",
        gap: 26,
      }}
    >
      <div
        style={{
          fontFamily: cinzel,
          fontSize: 104,
          lineHeight: 1.05,
          letterSpacing: 2,
          color: "white",
          textShadow: "0 3px 24px rgba(0,0,0,0.5)",
        }}
      >
        ДАВАЙТЕ
        <br />
        ЗНАЙОМИТИСЬ
      </div>
      <div
        style={{
          fontFamily: cormorant,
          fontWeight: 500,
          fontSize: 54,
          letterSpacing: 7,
          color: GOLD,
        }}
      >
        КАТЯ · ДНІПРО
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8 }}>
        <div style={{ width: 14, height: 14, background: GOLD, transform: "rotate(45deg)" }} />
        <div
          style={{
            height: 2,
            width: 380,
            background: `linear-gradient(90deg, ${GOLD}, transparent)`,
          }}
        />
      </div>
    </div>
  </AbsoluteFill>
);

export const CoverStill = () => (
  <>
    <Still
      id="Cover"
      component={Cover}
      width={1080}
      height={1920}
      defaultProps={{
        src: "photos/railing.jpg",
        position: "40% 50%",
        logoRight: true,
        moody: { x: 32, y: 30 },
      }}
    />
    <Still
      id="CoverGrass"
      component={Cover}
      width={1080}
      height={1920}
      defaultProps={{ src: "photos/grass.jpg", position: "62% 50%" }}
    />
    <Still id="CoverVideoFrame" component={Cover} width={1080} height={1920} defaultProps={{ src: "cover-frame.jpg" }} />
  </>
);
