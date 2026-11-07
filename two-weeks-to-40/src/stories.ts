// Text slides that follow each day's cover. A paragraph wrapped in *stars* is set in copper,
// \n breaks the line.
export type Slide = {
  id: string;
  photo?: string; // file in public/; without it the slide is text on black
  focus?: string; // which part of the photo to keep when cropping, CSS object-position
  full?: boolean; // photo fills the whole screen and the text sits over it (landscapes)
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
    photo: "photos/me-garden-orange.jpg",
    fit: true,
    ratio: 1,
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
    photo: "photos/work-curse.jpg",
    pos: "bottom",
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
    photo: "photos/work-pink.jpg",
    pos: "top",
    title: "Питання дня",
    paragraphs: ["Які нігті\nвам ближчі?"],
    poll: true,
  },
];
