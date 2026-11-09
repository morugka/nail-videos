// One entry per day of the series, from 14 days before the birthday down to the day itself
// photo: optional background, a file in public/ (e.g. "photos/day-14.jpg");
// without it the cover shows a dial of 14 nail tips instead
export type Day = { n: number; label: string; theme: string; photo?: string };

export const DAYS: Day[] = [
  { n: 14, label: "днів до 40", theme: "Старт", photo: "photos/day-14.jpg" },
  {
    n: 13,
    label: "днів до 40",
    theme: "Що я знаю в 40",
    photo: "photos/day-13.jpg",
  },
  {
    n: 12,
    label: "днів до 40",
    theme: "Чим я пишаюсь",
    photo: "photos/day-12.jpg",
  },
  { n: 11, label: "днів до 40", theme: "Що не вийшло" },
  {
    n: 10,
    label: "днів до 40",
    theme: "Моя справа",
    photo: "photos/day-10.jpg",
  },
  {
    n: 9,
    label: "днів до 40",
    theme: "9 фактів про мене",
    photo: "photos/day-09.jpg",
  },
  { n: 8, label: "днів до 40", theme: "Тоді і зараз" },
  {
    n: 7,
    label: "днів до 40",
    theme: "Чого я боюсь",
    photo: "photos/day-07.jpg",
  },
  { n: 6, label: "днів до 40", theme: "Вигорання" },
  {
    n: 5,
    label: "днів до 40",
    theme: "Скільки я вартую",
    photo: "photos/day-05.jpg",
  },
  { n: 4, label: "дні до 40", theme: "Що для мене дім" },
  { n: 3, label: "дні до 40", theme: "Мрії до 50", photo: "photos/day-03.jpg" },
  { n: 2, label: "дні до 40", theme: "Подяка", photo: "photos/day-02.jpg" },
  { n: 1, label: "день до 40", theme: "Завтра" },
  { n: 40, label: "сьогодні", theme: "З днем народження мене" },
];
