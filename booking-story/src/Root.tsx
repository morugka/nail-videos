import { Composition } from "remotion";
import { HYPE_DURATION, HypeStory } from "./Hype";
import { BookingStory, DURATION, FPS } from "./Story";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HypeStory"
        component={HypeStory}
        durationInFrames={HYPE_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BookingStory"
        component={BookingStory}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
