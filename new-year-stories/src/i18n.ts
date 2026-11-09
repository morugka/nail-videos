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
    replyCta: "Напиши в директ слово",
    keyword: "ЁЛКА",
    replyCtaAfter: "и я подберу тебе окошко",

    twoVisits: "Два визита",
    twoVisitsAccent: "до праздников",
    visits: [
      { when: "1–14 декабря", what: "Маникюр и педикюр\nк корпоративам" },
      { when: "15–29 декабря", what: "Праздничный дизайн —\nсвежий к Новому году" },
    ],
    twoVisitsOutro: "Бронируй оба визита сразу —\nпока есть выбор времени",
    signature: "Катя · Днепр",

    lastSlotTitle: "Новогодняя\nзапись",
    lastSlotBookEarly: "Записывайся заранее —\nпоследние дни перед Новым годом\nразлетаются",
    lastSlotDate: "29 декабря",
    busy: "занято",
    lastSlotLabel: "последнее свободное",
    lastSlotOutro: "А дальше я ухожу\nв новогодний загул",
    lastSlotCta: "Пиши «ЁЛКА» в директ",

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
    replyCta: "Напиши в дірект слово",
    keyword: "ЯЛИНКА",
    replyCtaAfter: "і я підберу тобі віконце",

    twoVisits: "Два візити",
    twoVisitsAccent: "до свят",
    visits: [
      { when: "1–14 грудня", what: "Манікюр і педикюр\nдо корпоративів" },
      { when: "15–29 грудня", what: "Святковий дизайн —\nсвіжий на Новий рік" },
    ],
    twoVisitsOutro: "Бронюй обидва візити одразу —\nпоки є вибір часу",
    signature: "Катя · Дніпро",

    lastSlotTitle: "Новорічний\nзапис",
    lastSlotBookEarly: "Записуйся заздалегідь —\nостанні дні перед Новим роком\nрозлітаються",
    lastSlotDate: "29 грудня",
    busy: "зайнято",
    lastSlotLabel: "останнє вільне",
    lastSlotOutro: "А далі я йду\nв новорічний загул",
    lastSlotCta: "Пиши «ЯЛИНКА» в дірект",

  },
};

export type Texts = (typeof texts)["ru"];
