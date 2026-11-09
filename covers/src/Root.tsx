import { Still } from "remotion";
import { Cover, CoverProps } from "./Cover";

// 3:4 — the shape Instagram now uses in the profile grid
const W = 1080;
const H = 1440;

export const covers: Record<string, CoverProps> = {
  "zazhralys-porahuiemo": {
    photo: "zazhralys.jpg",
    line1: "Майстри",
    line2: "зажрались?",
    subtitle: "Давайте порахуємо",
  },
  "zazhralys-za-vsih": {
    photo: "zazhralys.jpg",
    line1: "Майстри",
    line2: "зажрались?",
    subtitle: "Відповідаю за всіх нас",
  },
  "znimayu-chomu": {
    photo: "znimayu.jpg",
    line1: "Знімаю чуже",
    line2: "безкоштовно",
    subtitle: "І ось чому\nце вигідно нам обом",
    titleSize: 112,
  },
  "znimayu-maistram": {
    photo: "znimayu.jpg",
    line1: "Знімаю чуже",
    line2: "безкоштовно",
    subtitle: "Майстри,\nдочитайте до кінця",
    titleSize: 112,
  },
};

export const RemotionRoot: React.FC = () => (
  <>
    {Object.entries(covers).map(([id, props]) => (
      <Still key={id} id={id} component={Cover} width={W} height={H} defaultProps={props} />
    ))}
  </>
);
