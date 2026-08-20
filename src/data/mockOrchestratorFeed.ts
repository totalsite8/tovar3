export type FeedType = "think" | "tz" | "find" | "send" | "receive" | "analyze" | "done";

export interface FeedItem {
  text: string;
  type: FeedType;
  /** minutes after start, used for mock timestamps */
  minutesOffset: number;
}

/** Plain-language feed for the Services page ("// ЧТО Я СЕЙЧАС ДЕЛАЮ") */
export const SERVICES_FEED: FeedItem[] = [
  { text: "Задаю уточняющие вопросы", type: "think", minutesOffset: 0 },
  { text: "Составляю техзадание", type: "tz", minutesOffset: 1 },
  { text: "Нашёл 23 подрядчика в вашем городе", type: "find", minutesOffset: 2 },
  { text: "Отправил 12 заявок: почта, Telegram, сайты", type: "send", minutesOffset: 3 },
  { text: "Получил 3 ответа", type: "receive", minutesOffset: 16 },
  { text: "Сравниваю цены и ищу скрытые доплаты", type: "analyze", minutesOffset: 18 },
  { text: "Готово — сравнение ниже", type: "done", minutesOffset: 19 },
];

export const FOUND_COMPANIES = 23;
export const SENT_REQUESTS = 12;
export const RESPONSES = 3;

/** Plain-language steps for the product search ("// ЧТО Я СЕЙЧАС ДЕЛАЮ") */
export const SEARCH_STEPS: string[] = [
  "Разбираю запрос…",
  "Категория зафиксирована",
  "Сканирую маркетплейсы и индексы цен…",
  "Торгуюсь за кэшбек…",
  "Готово — показываю математику",
];
