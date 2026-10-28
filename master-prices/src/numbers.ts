// All the money in the reel lives here: change a number and re-render, the rest recounts itself.

export const PRICE = 800; // грн за манікюр з покриттям
export const CLIENTS = 60; // клієнток на місяць (≈ 3 на день, 20 робочих днів)
export const HOURS = 200; // годин на місяць: клієнтки + стерилізація + прибирання + переписки

export type Expense = { label: string; before: number; after: number };

// before — витрати «як було», after — ті самі статті після подорожчання
export const EXPENSES: Expense[] = [
  { label: "Оренда кабінету", before: 9000, after: 10500 },
  { label: "Матеріали (≈150 ₴ на клієнтку)", before: 9000, after: 11400 },
  { label: "Податки ФОП + ЄСВ", before: 4300, after: 4500 },
  { label: "Світло, генератор, зв'язок", before: 2000, after: 2600 },
  { label: "Реклама, фото, Instagram", before: 2000, after: 2500 },
  { label: "Стерилізація, дезрозчини, крафт", before: 1500, after: 1900 },
  { label: "Навчання, курси", before: 1500, after: 1800 },
  { label: "Знос і ремонт обладнання", before: 1500, after: 2000 },
];

export const REVENUE = PRICE * CLIENTS;
export const COSTS_BEFORE = EXPENSES.reduce((s, e) => s + e.before, 0);
export const COSTS_AFTER = EXPENSES.reduce((s, e) => s + e.after, 0);
export const SALARY_BEFORE = REVENUE - COSTS_BEFORE;
export const SALARY_AFTER = REVENUE - COSTS_AFTER;
export const HOURLY_BEFORE = Math.round(SALARY_BEFORE / HOURS);
export const HOURLY_AFTER = Math.round(SALARY_AFTER / HOURS);
export const DROP_PERCENT = Math.round((1 - SALARY_AFTER / SALARY_BEFORE) * 100);
// price that keeps the old salary with the new costs, rounded up to 10 ₴
export const FAIR_PRICE = Math.ceil((COSTS_AFTER + SALARY_BEFORE) / CLIENTS / 10) * 10;

export const fmt = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
