// Text slides that follow each day's cover. A paragraph wrapped in *stars* is set in copper,
// \n breaks the line.
export type Slide = {
  id: string;
  photo?: string; // file in public/; without it the slide is text on black
  focus?: string; // which part of the photo to keep when cropping, CSS object-position
  full?: boolean; // photo fills the whole screen and the text sits over it (landscapes)
  // before/after pair: old work on top, new work below, title between them
  before?: string;
  after?: string;
  beforeFocus?: string;
  afterFocus?: string;
  fit?: boolean; // whole photo at the top, text below it (when text would cover a face)
  ratio?: number; // photo height / width, for fit
  top?: number; // where the fitted photo starts (px from the top)
  // where the text sits over a full-screen photo; the photo darkens under it
  pos?:
    | "top"
    | "center"
    | "bottom"
    | "top-left"
    | "top-right"
    | "center-left"
    | "center-right"
    | "bottom-left"
    | "bottom-right";
  title?: string; // gold capitals above the text
  paragraphs: string[];
  poll?: boolean; // leaves the middle of the screen free for an Instagram poll sticker
};

export const STORIES: Slide[] = [
  {
    id: "D14-2",
    photo: "photos/day-09.jpg",
    paragraphs: [
      "Через 14 днів\nмені 40.",
      "Чесно? Трохи страшно.\nТрохи цікаво.",
      "*І дуже хочеться зупинитись\nі подивитись, де я зараз.*",
    ],
  },
  {
    id: "D14-3",
    photo: "photos/day-12.jpg",
    paragraphs: [
      "Тож наступні два тижні —\nщодня одна тема.",
      "Не тільки про нігті,\nа про мене:",
      "*перемоги, помилки, людей,\nстрахи й мрії.*",
    ],
  },
  {
    id: "D14-4",
    photo: "photos/day-07.jpg",
    paragraphs: ["Без фільтрів.", "*Ну, хіба що\nна нігтях.*"],
  },
  {
    id: "D14-5",
    title: "Питання дня",
    paragraphs: ["40 — це…"],
    poll: true,
  },

  // Day 13 — Що я знаю в 40
  {
    id: "D13-2",
    photo: "photos/old-1985.jpg",
    focus: "50% 30%",
    paragraphs: [
      "13 днів до 40.",
      "Сьогодні — про те,\nщо я знаю зараз",
      "*і чого зовсім не знала у 20.*",
    ],
  },
  {
    id: "D13-3",
    photo: "photos/work-red-stiletto.jpg",
    focus: "50% 40%",
    paragraphs: [
      "Починати ніколи не пізно.",
      "*Свою справу я знайшла\nне в 20, а в 35.*",
    ],
  },
  {
    id: "D13-4",
    photo: "photos/land-clouds-fishing.jpg",
    full: true,
    focus: "45% 50%",
    paragraphs: ["Відпочинок —\nце не лінь.", "*Досі вчуся.*"],
  },
  {
    id: "D13-5",
    paragraphs: ["Не всі люди мають\nзалишатися поруч.", "*І це нормально.*"],
  },
  {
    id: "D13-6",
    photo: "photos/me-magnolia.jpg",
    focus: "50% 35%",
    paragraphs: [
      "Найкраще, що можна\nдля себе зробити, —",
      "*вкладати в себе: знання,\nздоров'я, спокій.*",
    ],
  },
  {
    id: "D13-7",
    title: "Питання дня",
    paragraphs: ["А що ви знаєте зараз,\nчого не знали\nкілька років тому?"],
    poll: true,
  },

  // Day 12 — Чим я пишаюсь
  {
    id: "D12-2",
    photo: "photos/me-portrait.jpg",
    fit: true,
    ratio: 1,
    paragraphs: [
      "12 днів до 40.\nСьогодні — без скромності.",
      "*Чим я пишаюсь у житті:*",
    ],
  },
  {
    id: "D12-3",
    photo: "photos/family-park.jpg",
    pos: "bottom",
    paragraphs: ["Перше і головне —", "*моя родина.*"],
  },
  {
    id: "D12-4",
    photo: "photos/family-graduation-clean.jpg",
    fit: true,
    ratio: 1620 / 1080,
    top: 220,
    pos: "bottom",
    paragraphs: [
      "Чоловік, який поруч\nу будь-яку погоду.",
      "*І донька, якою\nя пишаюсь щодня.*",
    ],
  },
  {
    id: "D12-5",
    photo: "photos/me-graduation-crop.jpg",
    fit: true,
    ratio: 1410 / 1080,
    top: 250,
    pos: "bottom-left",
    paragraphs: ["Подяка мені як мамі —", "*мабуть, найцінніша\nнагорода.*"],
  },
  {
    id: "D12-6",
    photo: "photos/land-city-sunset.jpg",
    pos: "top",
    focus: "45% 50%",
    paragraphs: [
      "Я пишаюсь тим, що\nв найнеспокійніші часи",
      "*вдома залишалось тепло.*",
    ],
  },
  {
    id: "D12-7",
    photo: "photos/me-embankment-dress.jpg",
    pos: "bottom-right",
    focus: "40% 50%",
    paragraphs: ["Що наважилась у 35", "*почати нову професію\nз нуля.*"],
  },
  {
    id: "D12-8",
    photo: "photos/me-selfie-sun.jpg",
    pos: "top",
    paragraphs: ["Що в найважчі дні кажу собі", "*«It's fine» — і йду далі.*"],
  },
  {
    id: "D12-9",
    photo: "photos/me-river-halfface.jpg",
    pos: "center-left",
    focus: "70% 40%",
    paragraphs: [
      "Що не здалася\nв найважчі роки —",
      "*і будувала своє,\nколи навколо\nбула війна.*",
    ],
  },
  {
    id: "D12-10",
    photo: "photos/work-red-stiletto.jpg",
    pos: "bottom",
    focus: "50% 30%",
    paragraphs: [
      "Що досі вмію дивуватися,\nвчитися й горіти\nтим, що роблю.",
      "*І так — я пишаюсь\nсвоїми роботами.*",
    ],
  },
  {
    id: "D12-11",
    photo: "photos/land-pink-river.jpg",
    pos: "top",
    title: "Питання дня",
    paragraphs: ["А чим\nпишаєтесь ви?"],
    poll: true,
  },

  // Day 11 — Що не вийшло
  {
    id: "D11-2",
    photo: "photos/land-road.jpg",
    pos: "top",
    focus: "50% 30%",
    paragraphs: [
      "11 днів до 40.\nВчора — перемоги.",
      "*Сьогодні чесно:\nщо в мене не виходило.*",
    ],
  },
  {
    id: "D11-3",
    photo: "photos/me-studio-hand.jpg",
    fit: true,
    ratio: 1,
    paragraphs: ["Я довго відкладала", "*себе «на потім».*"],
  },
  {
    id: "D11-4",
    photo: "photos/me-river-sitting.jpg",
    pos: "bottom",
    focus: "48% 50%",
    paragraphs: ["Довго боялася змін.", "*Не завжди вміла\nсказати «ні».*"],
  },
  {
    id: "D11-5",
    photo: "photos/day-05.jpg",
    pos: "bottom",
    focus: "50% 30%",
    paragraphs: [
      "Не все, що задумала,\nвдалося втілити.",
      "*Бракувало сил, часу\nчи ресурсу.*",
    ],
  },
  {
    id: "D11-6",
    paragraphs: ["Я часто була\nзанадто суворою", "*до себе.*"],
  },
  {
    id: "D11-7",
    photo: "photos/land-sunrise-tree.jpg",
    full: true,
    focus: "50% 0%",
    paragraphs: [
      "Але без цього не було б\nучорашнього списку.",
      "*Кожна помилка — це крок.\nПросто не туди,\nкуди планувала.*",
    ],
  },
  {
    id: "D11-8",
    photo: "photos/me-garden-orange-top.jpg",
    fit: true,
    ratio: 450 / 630,
    paragraphs: ["Тепер я вчуся", "*бути до себе м'якшою.*"],
  },
  {
    id: "D11-9",
    photo: "photos/land-moon.jpg",
    pos: "top",
    title: "Питання дня",
    paragraphs: ["Помилки — це…"],
    poll: true,
  },

  // Day 10 — Моя справа
  {
    id: "D10-2",
    photo: "photos/work-candle.jpg",
    pos: "bottom",
    paragraphs: ["Я працюю майстром манікюру", "*з 2021 року.*"],
  },
  {
    id: "D10-3",
    photo: "photos/day-14.jpg",
    pos: "bottom",
    focus: "45% 50%",
    paragraphs: [
      "І так склалося, що більшість\nмоїх клієнток прийшли до мене",
      "*вже після початку\nповномасштабної війни.*",
    ],
  },
  {
    id: "D10-4",
    photo: "photos/day-02.jpg",
    pos: "top",
    paragraphs: [
      "З кимось ми досі разом.",
      "*З кимось наші шляхи\nрозійшлися — і я вважаю\nце нормальним.*",
    ],
  },
  {
    id: "D10-5",
    photo: "photos/day-13.jpg",
    pos: "bottom",
    focus: "50% 40%",
    paragraphs: [
      "Я вдячна кожній дівчині,\nяка свого часу обрала мене.",
      "*І навіть якщо вона вже\nне моя клієнтка —\nвона все одно залишається\nдля мене улюбленою.*",
    ],
  },
  {
    id: "D10-6",
    photo: "photos/work-pink.jpg",
    pos: "bottom",
    focus: "50% 40%",
    paragraphs: [
      "Дуже люблю навчатися:\nщороку — кілька курсів.",
      "*Вдосконалюю техніку,\nосвоюю нові напрямки.*",
    ],
  },
  {
    id: "D10-7",
    photo: "photos/work-gothic.jpg",
    pos: "bottom-left",
    paragraphs: [
      "Експериментую\nз матеріалами —",
      "*іноді виходить\nось таке.*",
    ],
  },
  {
    id: "D10-8",
    photo: "photos/day-03.jpg",
    pos: "top",
    paragraphs: [
      "Хочу розвиватися",
      "*і радувати вас\nрезультатами своєї роботи.*",
    ],
  },
  {
    id: "D10-9",
    photo: "photos/day-12.jpg",
    pos: "bottom",
    title: "Питання дня",
    paragraphs: ["А ви б наважились\nна такі?"],
    poll: true,
  },

  // Day 9 — 9 фактів про мене
  {
    id: "D9-2",
    paragraphs: [
      "9 днів до 40 —",
      "*9 фактів про мене.*",
      "Деякі вас здивують 😉",
    ],
  },
  {
    id: "D9-3",
    photo: "photos/land-city-sunset.jpg",
    pos: "top",
    focus: "45% 50%",
    title: "Факт 1",
    paragraphs: ["Я народилася в Дніпрі", "*і все життя живу тут.*"],
  },
  {
    id: "D9-4",
    photo: "photos/old-1985-top.jpg",
    fit: true,
    ratio: 860 / 1078,
    title: "Факт 2",
    paragraphs: [
      "Мріяла бути вихователькою,\nвчителькою, фотографом,\nкриміналістом…",
      "*і патологоанатомом.*",
      "Стала майстром манікюру —\nтеж працюю з руками 😅",
    ],
  },
  {
    id: "D9-5",
    photo: "photos/cat-lessie.jpg",
    pos: "top",
    focus: "50% 70%",
    title: "Факт 3",
    paragraphs: [
      "У мене є британка\nLessie La Luna.",
      "*І так — вона чемпіонка.*",
      "🏆",
    ],
  },
  {
    id: "D9-6",
    title: "Факт 4",
    paragraphs: [
      "Ранок починається\nз кави з вершками —\nодразу після пробудження.",
      "*До неї до мене\nкраще не підходити.*",
      "☕",
    ],
  },
  {
    id: "D9-7",
    photo: "photos/land-clouds-fishing.jpg",
    full: true,
    focus: "60% 50%",
    title: "Факт 5",
    paragraphs: [
      "Мій найкращий відпочинок —\nрибалка, природа",
      "*і поїздки на машині\nз чоловіком.*",
    ],
  },
  {
    id: "D9-8",
    photo: "photos/land-moon.jpg",
    pos: "top",
    title: "Факт 6",
    paragraphs: [
      "Боюсь висоти (хоча раніше\nне боялась), павуків\nі маленьких змій.",
      "*Великих — ні.\nЛогіку не шукайте.*",
      "🐍",
    ],
  },
  {
    id: "D9-9",
    photo: "photos/me-garden-orange-top.jpg",
    fit: true,
    ratio: 450 / 630,
    title: "Факт 7",
    paragraphs: [
      "Вірю, що в мене\nвсе — до грошей 💸",
      "*А якщо бачу інкасаторську\nмашину — це до великих грошей.*",
    ],
  },
  {
    id: "D9-10",
    photo: "photos/family-bridge.jpg",
    pos: "bottom",
    focus: "50% 30%",
    title: "Факт 8",
    paragraphs: ["Обожнюю сімейні збори:", "*весело, гучно і запально.*"],
  },
  {
    id: "D9-11",
    photo: "photos/land-road.jpg",
    pos: "top",
    focus: "50% 30%",
    title: "Вгадайте",
    paragraphs: ["У скільки років\nя отримала права?"],
    poll: true,
  },
  {
    id: "D9-12",
    photo: "photos/me-balloons-crop.jpg",
    fit: true,
    ratio: 760 / 1080,
    title: "Факт 9",
    paragraphs: [
      "*У 38!*",
      "Поки ще не досвідчений водій —\nїжджу під керівництвом чоловіка,",
      "*але я стараюсь.*",
      "🚗",
    ],
  },
  {
    id: "D9-13",
    photo: "photos/land-pink-river.jpg",
    pos: "top",
    title: "Питання дня",
    paragraphs: ["Який факт вас\nздивував найбільше?"],
    poll: true,
  },

  // Day 8 — Тоді і зараз
  {
    id: "D8-2",
    paragraphs: [
      "8 днів до 40.\nСьогодні —",
      "*тоді і зараз.*",
      "Мої перші роботи —\nі те, що я роблю сьогодні.",
    ],
  },
  {
    id: "D8-3",
    before: "photos/old-nude.jpg",
    after: "photos/new-nude.jpg",
    afterFocus: "50% 40%",
    title: "Манікюр",
    paragraphs: ["Форма, довжина\nі ідеальне покриття."],
  },
  {
    id: "D8-4",
    before: "photos/old-purple.jpg",
    after: "photos/new-green.jpg",
    beforeFocus: "50% 30%",
    afterFocus: "50% 50%",
    title: "Геометрія",
    paragraphs: ["Від смужок на лаку —\nдо моделювання."],
  },
  {
    id: "D8-5",
    before: "photos/old-blue.jpg",
    after: "photos/new-blue.jpg",
    afterFocus: "50% 55%",
    title: "Колір",
    paragraphs: ["Від крапочок —\nдо глибини «котячого ока»."],
  },
  {
    id: "D8-6",
    before: "photos/old-roses.jpg",
    after: "photos/new-red.jpg",
    beforeFocus: "50% 40%",
    afterFocus: "50% 55%",
    title: "Креатив",
    paragraphs: ["Від малюнка на нігті —\nдо об'єму і характеру."],
  },
  {
    id: "D8-7",
    before: "photos/old-yellow.jpg",
    after: "photos/new-black.jpg",
    beforeFocus: "50% 40%",
    afterFocus: "50% 45%",
    title: "Фото",
    paragraphs: ["Від столу з клейонкою —\nдо студії і світла."],
  },
  {
    id: "D8-8",
    photo: "photos/work-red-stiletto.jpg",
    pos: "bottom",
    focus: "50% 30%",
    paragraphs: [
      "Кожна нова робота —\nкрок далі.",
      "*Шлях, який почався\nз крапочок.*",
    ],
  },
  {
    id: "D8-9",
    photo: "photos/new-moon.jpg",
    pos: "top",
    title: "Питання дня",
    paragraphs: ["Що змінилося\nнайбільше?"],
    poll: true,
  },
];
