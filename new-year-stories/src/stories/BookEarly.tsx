import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Appear, Lines, useIn } from "../fx";
import { Texts } from "../i18n";
import { ease, GOLD, IVORY, serif } from "../theme";

// Full-bleed dark photo with a slow push-in; text sits in the empty dark top part
const MUTED = "rgba(244,238,228,0.7)";

export const BookEarly: React.FC<{ t: Texts }> = ({ t }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.08], { easing: ease });
  const photoIn = useIn(0, 20);
  const line = useIn(22, 22);
  return (
    <AbsoluteFill style={{ backgroundColor: "#050404" }}>
      <AbsoluteFill style={{ opacity: photoIn, transform: `scale(${zoom})`, transformOrigin: "60% 58%" }}>
        <Img src={staticFile("photos/orange-thumb.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* keep text readable: darken the top and the bottom edge */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <Appear start={6}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: 14,
              color: MUTED,
              textTransform: "uppercase",
              marginRight: -14,
            }}
          >
            {t.bookEarlyKicker}
          </div>
        </Appear>
        <Appear start={12} dur={24}>
          <div
            style={{
              marginTop: 28,
              fontFamily: serif,
              fontWeight: 500,
              fontSize: 112,
              lineHeight: 1.02,
              letterSpacing: 6,
              color: IVORY,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            <Lines text={t.bookEarlyTitle} />
          </div>
        </Appear>
        <div
          style={{
            margin: "40px 0 34px",
            width: 300,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            transform: `scaleX(${line})`,
          }}
        />
        <Appear start={36} dur={22}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 46,
              letterSpacing: 4,
              lineHeight: 1.25,
              color: IVORY,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            <Lines text={t.bookEarlyText} />
          </div>
        </Appear>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 330 }}>
        <Appear
          start={70}
          dur={22}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            textShadow: "0 2px 18px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)",
          }}
        >
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 40,
              letterSpacing: 4,
              color: IVORY,
              textTransform: "uppercase",
            }}
          >
            {t.bookEarlyCta}
          </div>
          <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 46, letterSpacing: 1, color: IVORY }}>
            @moruga_nailart
          </div>
        </Appear>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
