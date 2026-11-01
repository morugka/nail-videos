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
    popularDates: "Самые желанные даты\nперед праздниками\nразбирают первыми",

    checklistTitle: "Новогодний",
    checklistAccent: "чек-лист",
    checklist: ["Подарки", "Наряд", "Маникюр", "Педикюр"],
    dontForget: "не забудь!",
    checklistOutro: "Запишись заранее —\nи встречай праздники\nбез суеты",

    whichDesign: "Какой дизайн",
    whichDesignAccent: "выберешь?",
    designs: ["Красный\nс золотом", "Шампань-\nблеск", "Зимний\nфренч", "Изумрудный\nбархат"],
    replyNumber: "Пиши номер в ответ",

    bookingLabel: "Запись на декабрь",
    bookNow: "Запишись\nзаранее",
    whileSlots: "пока есть удобные окошки",
    services: "Маникюр ✦ Педикюр",
    replyCta: "Ответь на эту сторис\nили напиши в директ",
  },
  uk: {
    reminder: "Нагадування",
    daysWord: (n: number) => pluralRu(n, "день", "дні", "днів"),
    untilNewYear: "до Нового року",
    planNow: "Час планувати\nноворічний манікюр\nі педикюр",

    december: "Грудень",
    bookedEarly: "розписується заздалегідь",
    weekdays: ["пн", "вт", "ср", "чт", "пт", "сб", "нд"],
    popularDates: "Найбажаніші дати\nперед святами\nрозбирають першими",

    checklistTitle: "Новорічний",
    checklistAccent: "чек-лист",
    checklist: ["Подарунки", "Вбрання", "Манікюр", "Педикюр"],
    dontForget: "не забудь!",
    checklistOutro: "Запишись заздалегідь —\nі зустрічай свята\nбез метушні",

    whichDesign: "Який дизайн",
    whichDesignAccent: "обереш?",
    designs: ["Червоний\nіз золотом", "Шампань-\nблиск", "Зимовий\nфренч", "Смарагдовий\nоксамит"],
    replyNumber: "Пиши номер у відповідь",

    bookingLabel: "Запис на грудень",
    bookNow: "Запишись\nзаздалегідь",
    whileSlots: "поки є зручні віконця",
    services: "Манікюр ✦ Педикюр",
    replyCta: "Відповідай на цю сторіз\nабо пиши в дірект",
  },
};

export type Texts = (typeof texts)["ru"];
