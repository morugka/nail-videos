import { Composition, Folder } from "remotion";
import { Lang, texts } from "./i18n";
import { Calendar } from "./stories/Calendar";
import { Checklist } from "./stories/Checklist";
import { Countdown } from "./stories/Countdown";
import { Cta } from "./stories/Cta";
import { TwoVisits } from "./stories/TwoVisits";
import { FPS, H, W } from "./theme";

// Days from the posting date to 1 January (1 Nov 2026 -> 61)
const daysUntilNewYear = (from = new Date(2026, 10, 1)) =>
  Math.round((new Date(from.getFullYear() + 1, 0, 1).getTime() - from.getTime()) / 86_400_000);

type Props = { lang: Lang; daysLeft: number };

// Props must stay JSON-serialisable, so the texts are looked up by language here
const STORIES: { id: string; seconds: number; C: React.FC<Props> }[] = [
  { id: "1-Countdown", seconds: 7, C: ({ lang, daysLeft }) => <Countdown t={texts[lang]} daysLeft={daysLeft} /> },
  { id: "2-Calendar", seconds: 8, C: ({ lang }) => <Calendar t={texts[lang]} /> },
  { id: "3-TwoVisits", seconds: 8, C: ({ lang }) => <TwoVisits t={texts[lang]} /> },
  { id: "4-Checklist", seconds: 8, C: ({ lang }) => <Checklist t={texts[lang]} /> },
  { id: "5-Booking", seconds: 8, C: ({ lang }) => <Cta t={texts[lang]} /> },
];

const LANGS: Lang[] = ["uk", "ru"];

export const RemotionRoot: React.FC = () => (
  <>
    {LANGS.map((lang) => (
      <Folder key={lang} name={lang}>
        {STORIES.map(({ id, seconds, C }) => (
          <Composition
            key={id}
            id={`${lang}-${id}`}
            component={C}
            durationInFrames={seconds * FPS}
            fps={FPS}
            width={W}
            height={H}
            defaultProps={{ lang, daysLeft: daysUntilNewYear() }}
          />
        ))}
      </Folder>
    ))}
  </>
);
