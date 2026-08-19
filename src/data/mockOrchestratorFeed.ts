export type FeedType = "scout" | "send" | "receive" | "warning" | "complete";

export interface FeedItem {
  agent: string;
  action: string;
  emoji: string;
  type: FeedType;
  /** minutes from tender launch, used to build mock timestamps */
  minutesOffset: number;
}

export const ORCHESTRATOR_FEED: FeedItem[] = [
  {
    agent: "Scout Agent",
    action: "Нашёл 23 компании в вашем городе",
    emoji: "🕵️",
    type: "scout",
    minutesOffset: 0,
  },
  {
    agent: "Sender Agent",
    action: "Отправил ТЗ по email: 8 компаний",
    emoji: "✉️",
    type: "send",
    minutesOffset: 1,
  },
  {
    agent: "Sender Agent",
    action: "Отправил в Telegram: 6 компаний",
    emoji: "💬",
    type: "send",
    minutesOffset: 1,
  },
  {
    agent: "Sender Agent",
    action: "Отправил через формы на сайтах: 3 компании",
    emoji: "📧",
    type: "send",
    minutesOffset: 2,
  },
  {
    agent: "Inbox Agent",
    action: "Ответ: ОкнаМастер — 72 000₽",
    emoji: "📥",
    type: "receive",
    minutesOffset: 14,
  },
  {
    agent: "Inbox Agent",
    action: "Ответ: Фирма Б — 68 000₽",
    emoji: "📥",
    type: "receive",
    minutesOffset: 17,
  },
  {
    agent: "Analyst Agent",
    action: "ИИ обнаружил: Фирма Б не включила доставку (+5 000₽)",
    emoji: "⚠️",
    type: "warning",
    minutesOffset: 21,
  },
  {
    agent: "Inbox Agent",
    action: "Ответ: СтройГарант — 75 000₽ под ключ",
    emoji: "📥",
    type: "receive",
    minutesOffset: 24,
  },
  {
    agent: "Aura",
    action: "Сбор завершён: 3 из 17 ответили. Дедлайн: завтра 18:00",
    emoji: "✅",
    type: "complete",
    minutesOffset: 29,
  },
];

export const TOTAL_COMPANIES = 17;
export const RESPONDED_COMPANIES = 3;
