import { Composition } from "remotion";
import { BookingStory, DURATION, FPS } from "./Story";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BookingStory"
      component={BookingStory}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
