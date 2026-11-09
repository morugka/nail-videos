import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";

const SERIF = "Cormorant Garamond";
loadFont({
  family: SERIF,
  url: staticFile("fonts/Cormorant.ttf"),
  weight: "300 700",
});

export const GOLD = "#c9a36a";
const GOLD_GRADIENT =
  "linear-gradient(180deg, #e6c48c 0%, #c9a36a 55%, #a77f45 100%)";
const IVORY = "#f2ece2";

export type CoverProps = {
  photo: string; // file in public/photos
  line1: string; // ivory line
  line2: string; // gold line
  subtitle: string; // small caps under the divider
  titleSize?: number;
  photoTop?: number; // where the photo starts, px from top
};

// Gold hairline with a small diamond in the middle, as on the page's covers
const Divider: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, width: 560 }}>
    <div
      style={{
        height: 2,
        flex: 1,
        background: `linear-gradient(90deg, transparent, ${GOLD})`,
      }}
    />
    <div
      style={{
        width: 12,
        height: 12,
        background: GOLD,
        transform: "rotate(45deg)",
      }}
    />
    <div
      style={{
        height: 2,
        flex: 1,
        background: `linear-gradient(90deg, ${GOLD}, transparent)`,
      }}
    />
  </div>
);

export const Cover: React.FC<CoverProps> = ({
  photo,
  line1,
  line2,
  subtitle,
  titleSize = 132,
  photoTop = 0,
}) => {
  const { height } = useVideoConfig();
  // On a 9:16 Reels cover the grid shows only the middle 3:4, so keep the layout inside it
  const pad = (height - 1440) / 2;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img
        src={staticFile(`photos/${photo}`)}
        style={{
          position: "absolute",
          top: pad + photoTop,
          left: 0,
          width: "100%",
          height: height - pad - photoTop,
          objectFit: "cover",
          objectPosition: "center bottom",
        }}
      />
      {/* darken the top so the title always reads, whatever the photo */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, #000 0px, rgba(0,0,0,0.92) ${pad + 430}px, rgba(0,0,0,0) ${pad + 690}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: pad + 90,
          fontFamily: SERIF,
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            color: IVORY,
            fontSize: titleSize,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          {line1}
        </div>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "0.02em",
            background: GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {line2}
        </div>
        <div style={{ marginTop: 34, marginBottom: 28 }}>
          <Divider />
        </div>
        <div
          style={{
            color: IVORY,
            fontSize: 44,
            fontWeight: 500,
            letterSpacing: "0.16em",
            maxWidth: 900,
            lineHeight: 1.3,
            whiteSpace: "pre-line",
          }}
        >
          {subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
