export interface GiftOption {
  value: string;
  label: string;
  emoji: string;
  /** used to build the human-readable summary line */
  summary?: string;
  wide?: boolean;
}

export interface GiftQuestion {
  id: "budget" | "hobby" | "kind";
  title: string;
  options: GiftOption[];
}

export const GIFT_QUESTIONS: GiftQuestion[] = [
  {
    id: "budget",
    title: "Какой бюджет?",
    options: [
      { value: "до 3 000₽", label: "До 3 000₽", emoji: "🪙", wide: true },
      { value: "3 000–10 000₽", label: "3 000–10 000₽", emoji: "💵" },
      { value: "10 000₽+", label: "10 000₽+", emoji: "💎" },
    ],
  },
  {
    id: "hobby",
    title: "Чем он увлекается?",
    options: [
      { value: "Гейминг", label: "Гейминг", emoji: "🎮", summary: "геймера" },
      { value: "Спорт", label: "Спорт", emoji: "⚽", summary: "спортсмена" },
      { value: "Музыка", label: "Музыка", emoji: "🎵", summary: "меломана" },
      { value: "Авто", label: "Авто", emoji: "🚗", summary: "автомобилиста" },
    ],
  },
  {
    id: "kind",
    title: "Практичный или эмоциональный?",
    options: [
      { value: "Практичный", label: "Практичный", emoji: "🔧", summary: "практичный" },
      { value: "Для эмоций", label: "Для эмоций", emoji: "💝", summary: "для эмоций" },
    ],
  },
];
