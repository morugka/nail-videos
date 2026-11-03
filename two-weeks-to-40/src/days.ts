// One entry per day of the series, from 14 days before the birthday down to the day itself
export type Day = { n: number; label: string; theme: string };

export const DAYS: Day[] = [
  { n: 14, label: "днів до 40", theme: "Старт" },
  { n: 13, label: "днів до 40", theme: "Лист собі у 20" },
  { n: 12, label: "днів до 40", theme: "Чим я пишаюсь" },
  { n: 11, label: "днів до 40", theme: "Що не вийшло" },
  { n: 10, label: "днів до 40", theme: "Моя справа" },
  { n: 9, label: "днів до 40", theme: "Руки, спина, сон" },
  { n: 8, label: "днів до 40", theme: "Хто поруч" },
  { n: 7, label: "днів до 40", theme: "Чого я боюсь" },
  { n: 6, label: "днів до 40", theme: "Що лишаю в 30-х" },
  { n: 5, label: "днів до 40", theme: "Скільки я вартую" },
  { n: 4, label: "дні до 40", theme: "Що для мене дім" },
  { n: 3, label: "дні до 40", theme: "Мрії до 50" },
  { n: 2, label: "дні до 40", theme: "Подяка" },
  { n: 1, label: "день до 40", theme: "Завтра" },
  { n: 40, label: "сьогодні", theme: "З днем народження мене" },
];
