import { Composition, Still } from "remotion";
import { Cover } from "./Cover";
import { DAYS } from "./days";

export const RemotionRoot: React.FC = () => (
  <>
    {DAYS.map((d, i) => (
      <Composition
        key={`story-${d.n}`}
        id={`Story-${String(d.n).padStart(2, "0")}`}
        component={Cover}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ index: i, animated: true }}
      />
    ))}
    {DAYS.map((d, i) => (
      <Still
        key={`cover-${d.n}`}
        id={`Cover-${String(d.n).padStart(2, "0")}`}
        component={Cover}
        width={1080}
        height={1920}
        defaultProps={{ index: i, animated: false }}
      />
    ))}
  </>
);
