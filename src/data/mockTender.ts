export interface TenderQuestionOption {
  value: string;
  label: string;
}

export interface TenderQuestion {
  id: "house" | "windows" | "balcony" | "budget";
  title: string;
  emoji: string;
  options: TenderQuestionOption[];
}

export const TENDER_QUESTIONS: TenderQuestion[] = [
  {
    id: "house",
    title: "Тип дома?",
    emoji: "🏢",
    options: [
      { value: "Панелька", label: "Панелька" },
      { value: "Кирпич", label: "Кирпич" },
      { value: "Монолит", label: "Монолит" },
    ],
  },
  {
    id: "windows",
    title: "Сколько окон?",
    emoji: "🪟",
    options: [
      { value: "2", label: "1–2" },
      { value: "4", label: "3–4" },
      { value: "6", label: "5+ (вся квартира)" },
    ],
  },
  {
    id: "balcony",
    title: "Нужен балкон?",
    emoji: "🏗️",
    options: [
      { value: "остекление + обшивка", label: "Да" },
      { value: "нет", label: "Нет" },
    ],
  },
  {
    id: "budget",
    title: "Бюджет?",
    emoji: "💸",
    options: [
      { value: "до 50к", label: "До 50к" },
      { value: "50–100к", label: "50–100к" },
      { value: "100к+", label: "100к+" },
      { value: "не знаю", label: "Не знаю, подскажите" },
    ],
  },
];

export interface TenderBid {
  id: string;
  company: string;
  basePrice: number;
  hiddenFees: number;
  hiddenFeeNote: string | null;
  finalPrice: number;
  aiTrustScore: number;
  rating: number;
  term: string;
  channel: string;
  recommended: boolean;
}

export interface Tender {
  tenderId: string;
  title: string;
  subtitle: string;
  status: "active";
  tz: {
    object: string;
    windows: string;
    balcony: string;
    profile: string;
    extras: string;
  };
  bids: TenderBid[];
  aiNote: string;
  leadPrice: number;
}

export const TENDER: Tender = {
  tenderId: "win-302",
  title: "Пластиковые окна под ключ",
  subtitle: "Пластиковые окна · Панелька · 3 комнаты",
  status: "active",
  tz: {
    object: "3-комн. квартира, панелька, 5 этаж",
    windows: "4 шт (стандарт 1300×1400)",
    balcony: "да, остекление + обшивка",
    profile: "не указан (ИИ рекомендует Rehau/Veka)",
    extras: "москитные сетки, вынос мусора",
  },
  bids: [
    {
      id: "b1",
      company: "ОкнаМастер",
      basePrice: 72000,
      hiddenFees: 0,
      hiddenFeeNote: null,
      finalPrice: 72000,
      aiTrustScore: 92,
      rating: 4.8,
      term: "3 дня",
      channel: "email",
      recommended: true,
    },
    {
      id: "b2",
      company: "Фирма Б",
      basePrice: 68000,
      hiddenFees: 5000,
      hiddenFeeNote: "доставка",
      finalPrice: 73000,
      aiTrustScore: 74,
      rating: 4.1,
      term: "5 дней",
      channel: "telegram",
      recommended: false,
    },
    {
      id: "b3",
      company: "СтройГарант",
      basePrice: 75000,
      hiddenFees: 0,
      hiddenFeeNote: null,
      finalPrice: 75000,
      aiTrustScore: 88,
      rating: 4.6,
      term: "4 дня",
      channel: "website",
      recommended: false,
    },
  ],
  aiNote: "Рекомендую ОкнаМастер: лучшая цена без скрытых доплат, рейтинг 4.8, срок 3 дня",
  leadPrice: 1500,
};

export const SMART_LINK_TZ: string[] = [
  "4 окна стандарт 1300×1400",
  "Балкон: остекление + обшивка",
  "Профиль: Rehau/Veka",
  "Москитные сетки, вынос мусора",
];
