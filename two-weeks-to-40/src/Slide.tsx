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
  const textOnly = !slide.photo && !slide.poll;
  // Full-screen photo with the text over it; pos says where the text sits
  // fit: the whole photo near the top, text below it on a blurred copy of the photo
  const fit = Boolean(slide.photo && slide.fit);
  const fitTop = slide.top ?? 200;
  const fitBottom = fitTop + 1080 * (slide.ratio ?? 1);
  const full = Boolean(slide.photo && (slide.full || slide.pos) && !fit);
  const pos = full ? (slide.pos ?? "center") : fit ? slide.pos : undefined;
  const vert = pos ? pos.split("-")[0] : undefined; // top | center | bottom
  const side = pos?.split("-")[1] as "left" | "right" | undefined;
  const centred = textOnly || full || fit;
  const shade = "rgba(10,9,9,0.9)";
  const overlay = [
    vert === "top" &&
      `linear-gradient(180deg, ${shade} 0%, rgba(10,9,9,0.72) 32%, transparent 62%)`,
    vert === "bottom" &&
      `linear-gradient(0deg, ${shade} 0%, rgba(10,9,9,0.72) 32%, transparent 62%)`,
    vert === "center" &&
      "radial-gradient(ellipse at 50% 45%, rgba(10,9,9,0.62) 0%, rgba(10,9,9,0.55) 55%, rgba(10,9,9,0.8) 100%)",
    side === "left" &&
      "linear-gradient(90deg, rgba(10,9,9,0.6) 0%, transparent 70%)",
    side === "right" &&
      "linear-gradient(270deg, rgba(10,9,9,0.6) 0%, transparent 70%)",
  ]
    .filter(Boolean)
    .join(", ");
  const dayNumber = slide.id.slice(1).split("-")[0];
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
      {fit && slide.photo ? (
        <>
          <Img
            src={staticFile(slide.photo)}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(40px) brightness(0.45)",
              transform: "scale(1.2)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: fitTop,
              height: fitBottom - fitTop,
              overflow: "hidden",
              opacity: appear(0, 30),
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <Img
              src={staticFile(slide.photo)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${zoom})`,
              }}
            />
          </div>
          {pos ? <AbsoluteFill style={{ background: overlay }} /> : null}
        </>
      ) : slide.photo ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: full ? 0 : 760,
            height: full ? 1920 : 1350,
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
              objectPosition: slide.focus ?? "50% 50%",
              transform: `scale(${zoom})`,
              transformOrigin: "50% 40%",
            }}
          />
          <AbsoluteFill
            style={{
              background: full
                ? overlay
                : `linear-gradient(180deg, ${BLACK} 0%, rgba(10,9,9,0.7) 12%, transparent 28%, transparent 70%, ${BLACK} 86%)`,
            }}
          />
        </div>
      ) : null}

      {textOnly ? (
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              position: "absolute",
              width: 1000,
              height: 1000,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(184,105,58,0.16) 0%, transparent 62%)",
            }}
          />
          <div
            style={{
              fontSize: dayNumber.length > 1 ? 820 : 1100,
              fontWeight: 300,
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "2px rgba(201,163,106,0.16)",
              transform: `translateY(-40px) scale(${1 + frame * 0.0002})`,
              opacity: appear(0, 40),
            }}
          >
            {dayNumber}
          </div>
        </AbsoluteFill>
      ) : null}

      <div
        style={{
          position: "absolute",
          top:
            fit && !vert
              ? fitBottom + 40
              : vert === "bottom"
                ? undefined
                : vert === "top"
                  ? 290
                  : slide.poll
                    ? 420
                    : centred
                      ? 300
                      : 280,
          bottom:
            fit && !vert
              ? 300
              : vert === "bottom"
                ? 340
                : vert === "top"
                  ? undefined
                  : centred
                    ? 380
                    : undefined,
          left: side === "right" ? 200 : 80,
          right: side === "left" ? 200 : 80,
          display: "flex",
          flexDirection: "column",
          alignItems:
            side === "left"
              ? "flex-start"
              : side === "right"
                ? "flex-end"
                : "center",
          justifyContent:
            (fit && !vert) || vert === "center" || (centred && !vert)
              ? "center"
              : "flex-start",
          textAlign: side ?? "center",
          textShadow: full || vert ? "0 2px 24px rgba(0,0,0,0.9)" : "none",
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
          const short = !fit && slide.paragraphs.join("").length < 40;
          const copper = p.startsWith("*") && p.endsWith("*");
          const a = appear(8 + i * 22);
          return (
            <div
              key={i}
              style={{
                fontSize: slide.poll
                  ? p.length < 14
                    ? 150
                    : 92
                  : fit
                    ? 60
                    : short
                      ? full
                        ? 104
                        : centred
                          ? 120
                          : 96
                      : full
                        ? 72
                        : centred
                          ? 80
                          : 68,
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
                      background: full || fit ? "#f3c79a" : COPPER,
                      textShadow: "none",
                      filter: full
                        ? "drop-shadow(0 2px 12px rgba(0,0,0,0.9))"
                        : undefined,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      fontSize: fit
                        ? 68
                        : short
                          ? full
                            ? 112
                            : centred
                              ? 128
                              : 104
                          : full
                            ? 80
                            : centred
                              ? 88
                              : 74,
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
