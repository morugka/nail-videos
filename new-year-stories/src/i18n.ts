// All on-screen copy lives here: edit the text, re-render, done.
// "\n" = line break.

export type Lang = "ru" | "uk";

const pluralRu = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

export const texts = {
  ru: {
    reminder: "Напоминание",
    daysWord: (n: number) => pluralRu(n, "день", "дня", "дней"),
    untilNewYear: "до Нового года",
    planNow: "Пора планировать\nновогодний маникюр\nи педикюр",

    december: "Декабрь",
    bookedEarly: "расписывается заранее",
    weekdays: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
    popularDates: "Самые желанные даты —\nс 15 декабря —\nразбирают первыми",
    daysOff: "Не работаю по воскресеньям, 30 и 31.12",

    checklistTitle: "Новогодний",
    checklistAccent: "чек-лист",
    checklist: ["Подарки", "Наряд", "Маникюр", "Педикюр"],
    dontForget: "не забудь!",
    checklistOutro: "Запишись заранее —\nи встречай праздники\nбез суеты",


    bookingLabel: "Запись на декабрь",
    bookNow: "Запишись\nзаранее",
    whileSlots: "пока есть удобные окошки",
    services: "Маникюр ✦ Педикюр",
    replyCta: "Ответь на эту сторис\nили напиши в директ",
    signature: "Катя · Днепр",
  },
  uk: {
    reminder: "Нагадування",
    daysWord: (n: number) => pluralRu(n, "день", "дні", "днів"),
    untilNewYear: "до Нового року",
    planNow: "Час планувати\nноворічний манікюр\nі педикюр",

    december: "Грудень",
    bookedEarly: "розписується заздалегідь",
    weekdays: ["пн", "вт", "ср", "чт", "пт", "сб", "нд"],
    popularDates: "Найбажаніші дати —\nз 15 грудня —\nрозбирають першими",
    daysOff: "Не працюю по неділях, 30 та 31.12",

    checklistTitle: "Новорічний",
    checklistAccent: "чек-лист",
    checklist: ["Подарунки", "Вбрання", "Манікюр", "Педикюр"],
    dontForget: "не забудь!",
    checklistOutro: "Запишись заздалегідь —\nі зустрічай свята\nбез метушні",


    bookingLabel: "Запис на грудень",
    bookNow: "Запишись\nзаздалегідь",
    whileSlots: "поки є зручні віконця",
    services: "Манікюр ✦ Педикюр",
    replyCta: "Відповідай на цю сторіз\nабо пиши в дірект",
    signature: "Катя · Дніпро",
  },
};

export type Texts = (typeof texts)["ru"];
