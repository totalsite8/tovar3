export const MOCK_USER = {
  points_balance: 340,
  searches_today: 2,
  searches_limit: 3,
  theme: "system" as const,
  city: "Москва",
};

export const CITIES: string[] = ["Москва", "Казань", "Санкт-Петербург", "Новосибирск"];

export interface EarnRow {
  icon: string;
  label: string;
  value: string;
  tone: "ok" | "ai";
}

export interface SpendRow {
  icon: string;
  label: string;
  value: string;
  tone: "bad" | "service";
}

export const EARN_ROWS: EarnRow[] = [
  { icon: "🛍️", label: "Покупка через партнёра", value: "до 11%", tone: "ok" },
  { icon: "📅", label: "Ежедневный вход", value: "+5", tone: "ok" },
  { icon: "👥", label: "Пригласить друга", value: "+50", tone: "ok" },
];

export const SPEND_ROWS: SpendRow[] = [
  { icon: "🧰", label: "Запуск подбора услуги", value: "−100", tone: "service" },
  { icon: "🔎", label: "Расширенный поиск", value: "−30", tone: "bad" },
  { icon: "🏷️", label: "Обмен на промокод", value: "по курсу", tone: "bad" },
];
