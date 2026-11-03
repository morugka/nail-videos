import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BLACK, COPPER, ease, GOLD, GoldDivider, SERIF, WHITE } from "./Cover";
import { STORIES } from "./stories";

// A text slide in the page style: words on black at the top, the photo below
// (like the feed posts), the KM logo at the bottom
export const Slide: React.FC<{ index: number; animated: boolean }> = ({
  index,
  animated,
}) => {
  const slide = STORIES[index];
  const current = useCurrentFrame();
  const frame = animated ? current : 1000;

  const appear = (start: number, len = 26) =>
    interpolate(frame, [start, start + len], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    });
  const zoom = animated ? 1 + frame * 0.0003 : 1;

  return (
    <AbsoluteFill
      style={{
        background: BLACK,
        fontFamily: SERIF,
        fontVariantNumeric: "lining-nums",
        overflow: "hidden",
      }}
    >
      {slide.photo ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 760,
            height: 1350,
            overflow: "hidden",
            opacity: appear(0, 30),
          }}
        >
          <Img
            src={staticFile(slide.photo)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${zoom})`,
              transformOrigin: "50% 40%",
            }}
          />
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, ${BLACK} 0%, rgba(10,9,9,0.7) 12%, transparent 28%, transparent 70%, ${BLACK} 86%)`,
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          top: slide.poll ? 420 : 280,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {slide.title ? (
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: GOLD,
              opacity: appear(4),
              marginBottom: 26,
            }}
          >
            {slide.title}
          </div>
        ) : null}
        {slide.paragraphs.map((p, i) => {
          const short = slide.paragraphs.join("").length < 40;
          const copper = p.startsWith("*") && p.endsWith("*");
          const a = appear(8 + i * 22);
          return (
            <div
              key={i}
              style={{
                fontSize: slide.poll ? 150 : short ? 96 : 68,
                fontWeight: copper ? 500 : 400,
                fontStyle: copper ? "italic" : "normal",
                lineHeight: 1.18,
                whiteSpace: "pre-line",
                color: WHITE,
                marginTop: i === 0 ? 0 : 30,
                opacity: a,
                transform: `translateY(${(1 - a) * 18}px)`,
                ...(copper
                  ? {
                      background: COPPER,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      fontSize: short ? 104 : 74,
                    }
                  : {}),
              }}
            >
              {copper ? p.slice(1, -1) : p}
            </div>
          );
        })}
        <div style={{ marginTop: 40 }}>
          <GoldDivider
            width={260}
            progress={appear(10 + slide.paragraphs.length * 22, 30)}
          />
        </div>
      </div>

      {slide.photo ? null : (
        <Img
          src={staticFile("logo-km.png")}
          style={{
            position: "absolute",
            left: 540 - 70,
            top: 1585,
            width: 140,
            opacity: appear(40, 30) * 0.95,
            filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.8))",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
