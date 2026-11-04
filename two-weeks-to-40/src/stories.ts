// Text slides that follow each day's cover. A paragraph wrapped in *stars* is set in copper,
// \n breaks the line.
export type Slide = {
  id: string;
  photo?: string; // file in public/; without it the slide is text on black
  focus?: string; // which part of the photo to keep when cropping, CSS object-position
  full?: boolean; // photo fills the whole screen and the text sits over it (landscapes)
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
    paragraphs: ["А що знаєте ви\nі не знали у 20?"],
    poll: true,
  },

  // Day 12 — Чим я пишаюсь
  {
    id: "D12-2",
    photo: "photos/me-portrait.jpg",
    focus: "50% 40%",
    paragraphs: [
      "12 днів до 40.\nСьогодні — без скромності.",
      "*Чим я пишаюсь у житті:*",
    ],
  },
  {
    id: "D12-3",
    photo: "photos/me-embankment-dress.jpg",
    focus: "50% 45%",
    paragraphs: ["Що наважилась у 35", "*почати нову професію\nз нуля.*"],
  },
  {
    id: "D12-4",
    photo: "photos/me-river-halfface.jpg",
    focus: "60% 30%",
    paragraphs: [
      "Що не здалася\nв найважчі роки —",
      "*і будувала своє,\nколи навколо була війна.*",
    ],
  },
  {
    id: "D12-5",
    photo: "photos/me-graduation.jpg",
    focus: "50% 30%",
    paragraphs: [
      "Що досі вмію дивуватися,",
      "*вчитися й горіти тим,\nщо роблю.*",
    ],
  },
  {
    id: "D12-6",
    title: "Питання дня",
    paragraphs: ["А ви пишаєтесь\nсобою?"],
    poll: true,
  },

  // Day 11 — Що не вийшло
  {
    id: "D11-2",
    paragraphs: [
      "11 днів до 40.\nВчора — перемоги.",
      "*Сьогодні чесно:\nщо в мене не виходило.*",
    ],
  },
  {
    id: "D11-3",
    photo: "photos/land-road.jpg",
    full: true,
    focus: "50% 0%",
    paragraphs: ["Я довго відкладала", "*себе «на потім».*"],
  },
  {
    id: "D11-4",
    photo: "photos/me-river-sitting.jpg",
    focus: "45% 40%",
    paragraphs: ["Довго боялася змін.", "*Не завжди вміла\nсказати «ні».*"],
  },
  {
    id: "D11-5",
    photo: "photos/land-sunrise-tree.jpg",
    full: true,
    focus: "50% 0%",
    paragraphs: [
      "Але без цього не було б\nучорашнього списку.",
      "*Кожна помилка — це крок.\nПросто не туди,\nкуди планувала.*",
    ],
  },
  {
    id: "D11-6",
    title: "Питання дня",
    paragraphs: ["Помилки — це…"],
    poll: true,
  },
];
