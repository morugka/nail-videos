import { AbsoluteFill, Composition, Folder, Series } from "remotion";
import {
  StoryAnons,
  StoryCalendar,
  StoryCta,
  StoryDesigns,
  StorySteps,
} from "./Stories";

const FPS = 30;
const STORY = 7 * FPS; // one story, 7 s

const stories = [
  { id: "Story1-Anons", component: StoryAnons },
  { id: "Story2-Designs", component: StoryDesigns },
  { id: "Story3-Calendar", component: StoryCalendar },
  { id: "Story4-Steps", component: StorySteps },
  { id: "Story5-Cta", component: StoryCta },
];

// All five in a row, to watch the series the way followers will tap through it
const AllStories: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Series>
      {stories.map(({ id, component: C }) => (
        <Series.Sequence key={id} name={id} durationInFrames={STORY}>
          <C />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="NewYear">
        {stories.map(({ id, component }) => (
          <Composition
            key={id}
            id={id}
            component={component}
            durationInFrames={STORY}
            fps={FPS}
            width={1080}
            height={1920}
          />
        ))}
      </Folder>
      <Composition
        id="AllStories"
        component={AllStories}
        durationInFrames={STORY * stories.length}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
