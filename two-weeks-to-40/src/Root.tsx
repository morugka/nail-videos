import { Composition, Still } from "remotion";
import { Cover } from "./Cover";
import { DAYS } from "./days";
import { Slide } from "./Slide";
import { STORIES } from "./stories";

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
    {STORIES.map((s, i) => (
      <Composition
        key={`slide-${s.id}`}
        id={s.id}
        component={Slide}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ index: i, animated: true }}
      />
    ))}
    {STORIES.map((s, i) => (
      <Still
        key={`slide-still-${s.id}`}
        id={`${s.id}-still`}
        component={Slide}
        width={1080}
        height={1920}
        defaultProps={{ index: i, animated: false }}
      />
    ))}
  </>
);
