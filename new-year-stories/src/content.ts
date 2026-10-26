// All story texts live here: edit them and re-render, no need to touch the layout

export const YEAR = "2027";

export const anons = {
  kicker: "Новорічний запис",
  title: "Запис на святковий манікюр відкрито",
  footer: "грудень · вільні віконця",
};

export const designs = {
  kicker: "Святкові дизайни",
  lines: [
    { text: "Золото і блиск", accent: "для головної ночі року" },
    { text: "Оксамит · Котяче око", accent: "глибина, що сяє" },
    { text: "Арт-дизайн", accent: "під твій образ" },
  ],
};

// December 2026 starts on Tuesday. `busy` — already booked days, `hot` — the most requested ones
export const calendar = {
  kicker: "Грудень 2026",
  title: "Найгарячіші дати",
  firstWeekday: 1, // 0 = Monday
  days: 31,
  busy: [19, 20, 24, 26, 27, 30],
  hot: [21, 22, 23, 25, 28, 29, 31],
  note: "Віконця перед святами розлітаються першими",
};

export const steps = {
  kicker: "Як записатися",
  items: [
    { title: "Напиши «НГ» у Direct", text: "або тисни на посилання в профілі" },
    { title: "Обери дату й дизайн", text: "підкажу, що пасуватиме саме тобі" },
    { title: "Отримай підтвердження", text: "і твоє віконце заброньоване" },
  ],
};

export const cta = {
  kicker: "Встигни до свят",
  title: "Зустрінь {YEAR} з ідеальним манікюром",
  action: "Пиши «НГ» у Direct",
  services: "МАНІКЮР ✦ НАРОЩУВАННЯ ✦ ПЕДИКЮР",
};
