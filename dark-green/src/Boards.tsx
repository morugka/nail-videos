import { AbsoluteFill, Img, staticFile, Still } from "remotion";
import { cinzel, GOLD, GoldDivider, IVORY } from "./Composition";

// Pinterest board covers: 2:3 pin, everything important inside the central 1000×1000 square,
// because the profile shows board covers cropped to roughly a square.
const W = 1000;
const H = 1500;

type BoardCoverProps = { title: string; subtitle: string; english: string };

export const BoardCover: React.FC<BoardCoverProps> = ({
  title,
  subtitle,
  english,
}) => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 50%, #18171a 0%, #0b0b0d 100%)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
        }}
      >
        <Img src={staticFile("logo-km.png")} style={{ height: 120 }} />
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 112,
            letterSpacing: 10,
            color: IVORY,
            lineHeight: 1,
            marginTop: 30,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 46,
            letterSpacing: 6,
            color: GOLD,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {subtitle}
        </div>
        <GoldDivider width={460} progress={1} />
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 30,
            letterSpacing: 10,
            color: IVORY,
            opacity: 0.75,
          }}
        >
          {english}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BoardStills = () => {
  return (
    <Still
      id="BoardCare"
      component={BoardCover}
      defaultProps={{
        title: "ДОГЛЯД",
        subtitle: "ЗА НІГТЯМИ ТА НОГАМИ",
        english: "NAIL & FOOT CARE",
      }}
      width={W}
      height={H}
    />
  );
};
