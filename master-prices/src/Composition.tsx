import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CLIENTS,
  COSTS_AFTER,
  COSTS_BEFORE,
  DROP_PERCENT,
  EXPENSES,
  FAIR_PRICE,
  fmt,
  HOURLY_BEFORE,
  HOURS,
  PRICE,
  REVENUE,
  SALARY_AFTER,
  SALARY_BEFORE,
} from "./numbers";

const SERIF = "Cormorant Garamond";
loadFont({ family: SERIF, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" });
loadFont({
  family: SERIF,
  url: staticFile("fonts/Cormorant-Italic.ttf"),
  weight: "300 700",
  style: "italic",
});

// Same palette as the page covers: black, ivory serif caps, gold accents
const BLACK = "#0b0a09";
const IVORY = "#f2ece2";
const GOLD = "#c9a36a";
const DIM = "#8f877c";
const LINE = "rgba(201,163,106,0.28)";
const FPS = 30;

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0→1 over `dur` frames, starting at `delay`
const useIn = (delay: number, dur = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, dur], [0, 1], { ...clamp, easing: ease });
};

// Gold hairline with a small diamond in the middle, as on the page's covers
const GoldDivider: React.FC<{ width: number; delay: number }> = ({ width, delay }) => {
  const p = useIn(delay, 18);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, width, opacity: p }}>
      <div
        style={{
          height: 2,
          flex: 1,
          background: `linear-gradient(90deg, transparent, ${GOLD})`,
          transform: `scaleX(${p})`,
          transformOrigin: "right",
        }}
      />
      <div
        style={{ width: 12, height: 12, background: GOLD, transform: `rotate(45deg) scale(${p})` }}
      />
      <div
        style={{
          height: 2,
          flex: 1,
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
          transform: `scaleX(${p})`,
          transformOrigin: "left",
        }}
      />
    </div>
  );
};

// Black with a faint warm glow, so plain slides don't look flat
const Bg: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: BLACK,
      background: `radial-gradient(ellipse 80% 55% at 50% 42%, #1d1915 0%, ${BLACK} 70%)`,
    }}
  />
);

// Every scene fades in and out so cuts stay soft
const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], clamp);
  const inP = interpolate(frame, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: Math.min(out, inP) }}>
      <Bg />
      <AbsoluteFill
        style={{
          // keep clear of Reels UI: top bar, caption/buttons at the bottom, icons on the right
          padding: "250px 130px 400px 90px",
          justifyContent: "center",
          color: IVORY,
          fontFamily: SERIF,
          fontVariantNumeric: "lining-nums",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Slides up out of a slight blur
const Rise: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, children, style }) => {
  const p = useIn(delay, 18);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        filter: `blur(${(1 - p) * 6}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Spaced serif caps, the page's headline style
const Title: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({
  children,
  size = 96,
  style,
}) => (
  <div
    style={{
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: size * 0.03,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);

// Small gold caps, like the subtitles under the covers' titles
const Kicker: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontWeight: 600,
      fontSize: 34,
      letterSpacing: 7,
      textTransform: "uppercase",
      color: GOLD,
      ...style,
    }}
  >
    {children}
  </div>
);

const Body: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div style={{ fontWeight: 500, fontSize: 50, lineHeight: 1.25, ...style }}>{children}</div>
);

const Aside: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div style={{ fontStyle: "italic", fontWeight: 500, fontSize: 58, lineHeight: 1.15, color: GOLD, ...style }}>
    {children}
  </div>
);

const Num: React.FC<{ children: React.ReactNode; size: number; style?: React.CSSProperties }> = ({
  children,
  size,
  style,
}) => (
  <div
    style={{
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1,
      whiteSpace: "nowrap",
      fontVariantNumeric: "lining-nums tabular-nums",
      ...style,
    }}
  >
    {children}
  </div>
);

// Gold underline that draws under a phrase
const Underline: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const p = useIn(delay, 14);
  return (
    <span style={{ position: "relative", display: "inline-block", color: GOLD }}>
      {children}
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "-0.04em",
          height: 3,
          background: GOLD,
          transform: `scaleX(${p})`,
          transformOrigin: "left",
        }}
      />
    </span>
  );
};

// Line drawn across text, for "old" numbers
const Strike: React.FC<{ delay: number; children: React.ReactNode; color?: string }> = ({
  delay,
  children,
  color = GOLD,
}) => {
  const p = useIn(delay, 12);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <span
        style={{
          position: "absolute",
          left: -4,
          right: -4,
          top: "54%",
          height: 3,
          background: color,
          transform: `scaleX(${p}) rotate(-3deg)`,
          transformOrigin: "left",
        }}
      />
    </span>
  );
};

// Number that counts from `from` to `to` between frames `start` and `start + dur`
const Count: React.FC<{ from: number; to: number; start: number; dur?: number }> = ({
  from,
  to,
  start,
  dur = 24,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + dur], [from, to], { ...clamp, easing: ease });
  return <>{fmt(v)}</>;
};

// Thin gold-framed panel for the expense lists
const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      border: `1.5px solid ${LINE}`,
      background: "rgba(255,255,255,0.025)",
      padding: "26px 36px",
    }}
  >
    {children}
  </div>
);

// ——— Scenes ———

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spacing = interpolate(frame, [4, 30], [26, 4], { ...clamp, easing: ease });
  return (
    <Scene>
      <Rise delay={4}>
        <Title size={112} style={{ letterSpacing: spacing }}>
          Майстри
        </Title>
      </Rise>
      <Rise delay={10}>
        <Title size={112} style={{ letterSpacing: spacing, color: GOLD }}>
          зажралися,
        </Title>
      </Rise>
      <Rise delay={18}>
        <Title size={112} style={{ letterSpacing: spacing }}>
          або...?
        </Title>
      </Rise>
      <div style={{ margin: "40px 0 28px" }}>
        <GoldDivider width={520} delay={32} />
      </div>
      <Rise delay={40}>
        <Kicker>Крик душі майстра</Kicker>
      </Rise>
    </Scene>
  );
};

const NotEqual: React.FC = () => (
  <Scene>
    <Rise delay={4}>
      <Kicker>Почнемо з головного</Kicker>
    </Rise>
    <Rise delay={12} style={{ marginTop: 50 }}>
      <Title size={92}>Ціна манікюру</Title>
    </Rise>
    <Rise delay={24}>
      <Num size={240} style={{ color: GOLD, fontWeight: 400, margin: "10px 0" }}>
        ≠
      </Num>
    </Rise>
    <Rise delay={32}>
      <Title size={92}>зарплата майстра</Title>
    </Rise>
    <Rise delay={64} style={{ marginTop: 60 }}>
      <Aside>з ваших {PRICE} ₴ мені лишається далеко не {PRICE} ₴</Aside>
    </Rise>
  </Scene>
);

const Revenue: React.FC = () => (
  <Scene>
    <Rise delay={2}>
      <Kicker>Рахуємо чесно · один місяць</Kicker>
    </Rise>
    <div style={{ display: "flex", alignItems: "baseline", gap: 26, marginTop: 60 }}>
      <Rise delay={10}>
        <Num size={170}>{CLIENTS}</Num>
      </Rise>
      <Rise delay={14}>
        <Body style={{ color: DIM }}>клієнток</Body>
      </Rise>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 26, marginTop: 10 }}>
      <Rise delay={22}>
        <Num size={170} style={{ color: DIM, fontWeight: 300 }}>
          ×
        </Num>
      </Rise>
      <Rise delay={28}>
        <Num size={170}>{PRICE}</Num>
      </Rise>
      <Rise delay={32}>
        <Body style={{ color: DIM }}>гривень</Body>
      </Rise>
    </div>
    <div style={{ margin: "40px 0" }}>
      <GoldDivider width={860} delay={42} />
    </div>
    <Rise delay={48}>
      <Num size={170} style={{ color: GOLD }}>
        <Count from={0} to={REVENUE} start={52} dur={30} /> ₴
      </Num>
    </Rise>
    <Rise delay={96} style={{ marginTop: 50 }}>
      <Aside>«ого, багато!» — зачекайте</Aside>
    </Rise>
  </Scene>
);

const ROW_GAP = 26; // frames between receipt rows

// Each expense line appears, the balance on top melts down with it
const Receipt: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 30;
  const spent = EXPENSES.reduce((s, e, i) => {
    const p = interpolate(frame, [start + i * ROW_GAP, start + i * ROW_GAP + 14], [0, 1], {
      ...clamp,
      easing: ease,
    });
    return s + e.before * p;
  }, 0);
  const totalAt = start + EXPENSES.length * ROW_GAP + 10;
  return (
    <Scene>
      <Rise delay={0}>
        <Kicker>Дохід {fmt(REVENUE)} ₴ · а тепер мінус</Kicker>
      </Rise>
      <Rise delay={6} style={{ margin: "24px 0 40px" }}>
        <Num size={150}>{fmt(REVENUE - spent)} ₴</Num>
      </Rise>
      <Rise delay={14}>
        <Panel>
          {EXPENSES.map((e, i) => {
            const d = start + i * ROW_GAP;
            const p = interpolate(frame, [d, d + 12], [0, 1], { ...clamp, easing: ease });
            return (
              <div
                key={e.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 20,
                  padding: "12px 0",
                  borderBottom: `1px solid ${LINE}`,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -24}px)`,
                  fontSize: 40,
                  fontWeight: 500,
                }}
              >
                <span>{e.label}</span>
                <span style={{ color: GOLD, fontWeight: 600, whiteSpace: "nowrap" }}>
                  −{fmt(e.before)}
                </span>
              </div>
            );
          })}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 20,
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: interpolate(frame, [totalAt, totalAt + 10], [0, 1], clamp),
            }}
          >
            <span>Разом</span>
            <span style={{ color: GOLD }}>−{fmt(COSTS_BEFORE)} ₴</span>
          </div>
        </Panel>
      </Rise>
    </Scene>
  );
};

const Salary: React.FC = () => (
  <Scene>
    <Rise delay={2}>
      <Kicker>Залишок — це і є моя зарплата</Kicker>
    </Rise>
    <Rise delay={10} style={{ marginTop: 30 }}>
      <Num size={180} style={{ color: GOLD }}>
        {fmt(SALARY_BEFORE)} ₴
      </Num>
    </Rise>
    <Rise delay={40} style={{ marginTop: 50 }}>
      <Body>
        За ≈{HOURS} годин: клієнтки, стерилізація, прибирання, переписки о 23:00
      </Body>
    </Rise>
    <Rise delay={70} style={{ marginTop: 40 }}>
      <Title size={96}>
        = <Underline delay={82}>{HOURLY_BEFORE}&nbsp;₴/год</Underline>
      </Title>
    </Rise>
    <Rise delay={100} style={{ marginTop: 46 }}>
      <Body style={{ color: DIM }}>Без лікарняних. Без відпусток. Без пенсії.</Body>
    </Rise>
    <Rise delay={130} style={{ marginTop: 30 }}>
      <Aside>менше, ніж коштує шаурма</Aside>
    </Rise>
  </Scene>
);

// Same list after prices went up: old sum struck, new sum in gold, salary shrinks again
const Inflation: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 40;
  const gap = 14;
  const listEnd = start + EXPENSES.length * gap;
  return (
    <Scene>
      <Rise delay={0}>
        <Title size={76}>
          А тепер подорожчало <span style={{ color: GOLD }}>все</span>
        </Title>
      </Rise>
      <Rise delay={10} style={{ marginTop: 18 }}>
        <Kicker style={{ fontSize: 30, letterSpacing: 5 }}>
          Ціна та сама — {PRICE} ₴. Витрати — ні
        </Kicker>
      </Rise>
      <Rise delay={20} style={{ marginTop: 34 }}>
        <Panel>
          {EXPENSES.map((e, i) => {
            const d = start + i * gap;
            const pct = Math.round((e.after / e.before - 1) * 100);
            const p = interpolate(frame, [d, d + 10], [0, 1], clamp);
            return (
              <div
                key={e.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 14,
                  padding: "9px 0",
                  borderBottom: `1px solid ${LINE}`,
                  fontSize: 34,
                  fontWeight: 500,
                }}
              >
                <span style={{ flex: 1 }}>{e.label}</span>
                <span style={{ color: DIM, whiteSpace: "nowrap" }}>
                  <Strike delay={d} color={DIM}>
                    {fmt(e.before)}
                  </Strike>
                </span>
                <span
                  style={{
                    color: GOLD,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    minWidth: 190,
                    textAlign: "right",
                    opacity: p,
                  }}
                >
                  {fmt(e.after)} <span style={{ fontSize: 26 }}>+{pct}%</span>
                </span>
              </div>
            );
          })}
        </Panel>
      </Rise>
      <div style={{ marginTop: 50, display: "flex", alignItems: "flex-end", gap: 34 }}>
        <Rise delay={listEnd}>
          <Kicker style={{ fontSize: 30 }}>Моя зарплата</Kicker>
          <Num size={130} style={{ color: GOLD, marginTop: 10 }}>
            <Count from={SALARY_BEFORE} to={SALARY_AFTER} start={listEnd + 10} dur={40} /> ₴
          </Num>
        </Rise>
        <Rise delay={listEnd + 54}>
          <div
            style={{
              border: `2px solid ${GOLD}`,
              color: IVORY,
              fontWeight: 600,
              fontSize: 60,
              padding: "4px 20px",
              marginBottom: 8,
            }}
          >
            −{DROP_PERCENT}%
          </div>
        </Rise>
      </div>
      <Rise delay={listEnd + 70} style={{ marginTop: 24 }}>
        <Body style={{ fontSize: 40, color: DIM }}>
          Витрати: {fmt(COSTS_BEFORE)} → {fmt(COSTS_AFTER)} ₴ на місяць
        </Body>
      </Rise>
    </Scene>
  );
};

const FairPrice: React.FC = () => (
  <Scene>
    <Rise delay={2}>
      <Body>
        Щоб просто залишитись на своїх {fmt(SALARY_BEFORE)} ₴ —{" "}
        <span style={{ fontStyle: "italic", color: GOLD }}>не розбагатіти!</span>
      </Body>
    </Rise>
    <Rise delay={20} style={{ marginTop: 50 }}>
      <Kicker>ціна має бути не</Kicker>
    </Rise>
    <Rise delay={26} style={{ marginTop: 10 }}>
      <Num size={150} style={{ color: DIM }}>
        <Strike delay={46}>{PRICE} ₴</Strike>
      </Num>
    </Rise>
    <Rise delay={56} style={{ marginTop: 30 }}>
      <Kicker>а</Kicker>
    </Rise>
    <Rise delay={62} style={{ marginTop: 10 }}>
      <Num size={230} style={{ color: GOLD }}>
        {FAIR_PRICE} ₴
      </Num>
    </Rise>
    <div style={{ margin: "50px 0 34px" }}>
      <GoldDivider width={600} delay={90} />
    </div>
    <Rise delay={100}>
      <Aside>це не «гребу лопатою». це «щоб не закритися»</Aside>
    </Rise>
  </Scene>
);

const WhereTitle: React.FC = () => (
  <Scene>
    <Rise delay={2}>
      <Kicker>А тепер ваші улюблені</Kicker>
    </Rise>
    <Rise delay={10} style={{ marginTop: 30 }}>
      <Title size={110}>
        «Куди ви
        <br />
        піднімаєте
        <br />
        <span style={{ color: GOLD }}>ціни?!»</span>
      </Title>
    </Rise>
    <div style={{ marginTop: 40 }}>
      <GoldDivider width={520} delay={24} />
    </div>
  </Scene>
);

type Objection = { quote: string; answer: React.ReactNode; more: string; aside?: string };

const OBJECTIONS: Objection[] = [
  {
    quote: "В нас зарплати не ростуть!",
    answer: (
      <>
        А в мене, думаєте, росте? Вона <span style={{ color: GOLD }}>падає</span>. Ви щойно
        бачили.
      </>
    ),
    more: "Оренда, матеріали і світло не питають, яка у вас зарплата. У мене теж не питають.",
  },
  {
    quote: "В країні війна, а ви ціни піднімаєте!",
    answer: (
      <>
        Саме тому. Війна — це <span style={{ color: GOLD }}>не знижка</span> на оренду.
      </>
    ),
    more: "Блекаут — працюю від генератора. Тривога — переношу записи. Податки ніхто не скасовував.",
  },
  {
    quote: "Ви вже зажралися!",
    answer: (
      <>
        Зажратися на <span style={{ color: GOLD }}>{HOURLY_BEFORE}&nbsp;₴</span> на годину?
      </>
    ),
    more: "Без лікарняних, відпусток і пенсії. Спина, шия і зір — в подарунок до професії.",
  },
  {
    quote: "Це ж просто пиляння нігтів!",
    answer: (
      <>
        «Просто» — це <span style={{ color: GOLD }}>вдома пилочкою</span>.
      </>
    ),
    more: "А тут: стерилізація, апарат біля живої шкіри, архітектура нігтя, роки навчання.",
    aside: "хочете «просто» — отримаєте грибок і відшарування за тиждень",
  },
  {
    quote: "Я знаю, ви все в Китаї купуєте, там дешево!",
    answer: (
      <>
        Купую там, де <span style={{ color: GOLD }}>якісно</span>, а не там, де дешево.
      </>
    ),
    more: "Нормальні матеріали коштують у валюті. Навіть українські бренди купують сировину за долари і євро.",
    aside: "дешевий «Китай» — це алергія, опіки під лампою і переробка за мій рахунок",
  },
];

const ObjectionScene: React.FC<{ o: Objection; n: number }> = ({ o, n }) => (
  <Scene>
    <Rise delay={0}>
      <Kicker>
        {String(n).padStart(2, "0")} / {String(OBJECTIONS.length).padStart(2, "0")}
      </Kicker>
    </Rise>
    {/* the objection, as an italic quote between gold hairlines */}
    <Rise delay={6} style={{ marginTop: 40 }}>
      <div
        style={{
          borderLeft: `3px solid ${GOLD}`,
          paddingLeft: 34,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 66,
          lineHeight: 1.12,
          color: DIM,
        }}
      >
        «{o.quote}»
      </div>
    </Rise>
    <Rise delay={36} style={{ marginTop: 60 }}>
      <Title size={76} style={{ lineHeight: 1.1, letterSpacing: 1.5 }}>
        {o.answer}
      </Title>
    </Rise>
    <Rise delay={70} style={{ marginTop: 44 }}>
      <Body style={{ fontSize: 48 }}>{o.more}</Body>
    </Rise>
    {o.aside ? (
      <Rise delay={130} style={{ marginTop: 40 }}>
        <Aside style={{ fontSize: 54 }}>{o.aside}</Aside>
      </Rise>
    ) : null}
  </Scene>
);

// "And also": the small everyday requests that cost money too
const EXTRAS: { ask: string; cost: string }[] = [
  { ask: "А що в тебе є новенького з кольорів?", cost: "нові колекції щосезону" },
  { ask: "А можна як на цьому фото?", cost: "втирки, фольга, слайдери, стрази" },
  { ask: "А в тебе є кава?", cost: "кава, чай, цукерки" },
  { ask: "Відкололось, переробиш безкоштовно?", cost: "гарантія — за мій рахунок" },
  { ask: "А можна в неділю о восьмій ранку?", cost: "вихідних немає" },
  { ask: "Перенесемо на завтра?", cost: "порожнє вікно — мінус гроші" },
];

const Extras: React.FC = () => (
  <Scene>
    <Rise delay={0}>
      <Title size={110}>
        А <span style={{ color: GOLD }}>ще:</span>
      </Title>
    </Rise>
    <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 26 }}>
      {EXTRAS.map((x, i) => (
        <Rise key={x.ask} delay={14 + i * 22}>
          <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
            <div
              style={{
                width: 12,
                height: 12,
                flexShrink: 0,
                background: GOLD,
                transform: "rotate(45deg) translateY(-6px)",
              }}
            />
            <div>
              <div style={{ fontStyle: "italic", fontWeight: 500, fontSize: 52, lineHeight: 1.1 }}>
                «{x.ask}»
              </div>
              <Kicker style={{ fontSize: 28, letterSpacing: 5, marginTop: 6 }}>{x.cost}</Kicker>
            </div>
          </div>
        </Rise>
      ))}
    </div>
    <Rise delay={14 + EXTRAS.length * 22 + 10} style={{ marginTop: 44 }}>
      <Aside>і все це — з тих самих {PRICE} ₴</Aside>
    </Rise>
  </Scene>
);

const Outro: React.FC = () => (
  <Scene>
    <Rise delay={2}>
      <Title size={80}>Підняти ціну —</Title>
    </Rise>
    <Rise delay={10}>
      <Title size={80} style={{ color: DIM }}>
        <Strike delay={30}>не жадібність</Strike>
      </Title>
    </Rise>
    <Rise delay={40} style={{ marginTop: 30 }}>
      <Body style={{ fontSize: 56 }}>
        Це спосіб <span style={{ color: GOLD }}>не закрити кабінет</span> і не економити на
        вашій безпеці.
      </Body>
    </Rise>
    <div style={{ margin: "44px 0 30px" }}>
      <GoldDivider width={520} delay={80} />
    </div>
    <Rise delay={90}>
      <Kicker>Дякую всім, хто розуміє</Kicker>
    </Rise>
    <Rise delay={110} style={{ marginTop: 26 }}>
      <Aside>перешліть тій, хто каже «зажралися»</Aside>
    </Rise>
  </Scene>
);

const s = (sec: number) => Math.round(sec * FPS);

const SCENES: { id: string; dur: number; el: React.ReactNode }[] = [
  { id: "hook", dur: s(4.5), el: <Hook /> },
  { id: "not-equal", dur: s(5), el: <NotEqual /> },
  { id: "revenue", dur: s(5), el: <Revenue /> },
  { id: "receipt", dur: s(11), el: <Receipt /> },
  { id: "salary", dur: s(8), el: <Salary /> },
  { id: "inflation", dur: s(11), el: <Inflation /> },
  { id: "fair-price", dur: s(6), el: <FairPrice /> },
  { id: "where", dur: s(3.5), el: <WhereTitle /> },
  ...OBJECTIONS.map((o, i) => ({
    id: `objection-${i + 1}`,
    dur: s(o.aside ? 8 : 7),
    el: <ObjectionScene o={o} n={i + 1} />,
  })),
  { id: "extras", dur: s(9), el: <Extras /> },
  { id: "outro", dur: s(7), el: <Outro /> },
];

export const TOTAL = SCENES.reduce((t, sc) => t + sc.dur, 0);

const Reel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BLACK }}>
    <Series>
      {SCENES.map((sc) => (
        <Series.Sequence key={sc.id} durationInFrames={sc.dur} name={sc.id}>
          {sc.el}
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export const MyComposition: React.FC = () => (
  <Composition
    id="PriceReel"
    component={Reel}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
