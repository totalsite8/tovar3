export interface ProductOption {
  id: string;
  store: string;
  storeColor: string;
  price: number;
  sellerRating: number;
  isPartner: boolean;
  cashbackPoints: number;
  finalPrice: number;
  badge: string;
  badgeTone: "ok" | "warn" | "neutral";
  buttonNote: string;
  delivery: string;
}

export interface Product {
  id: string;
  title: string;
  emoji: string;
  gradient: string;
  totalFound: number;
  options: ProductOption[];
  aiVerdict: string;
}

export const PRODUCTS: Record<"sony" | "gift" | "honor", Product> = {
  sony: {
    id: "sony-wh1000xm4",
    title: "Sony WH-1000XM4",
    emoji: "🎧",
    gradient: "from-orange-400/80 via-rose-400/70 to-purple-500/70",
    totalFound: 12,
    aiVerdict:
      "Рекомендую Ozon: да, на WB дешевле на 600₽, но с баллами Aura итоговая цена ниже на 600₽. Плюс у Ozon рейтинг продавца 4.9 против 4.2 — меньше риск подделки.",
    options: [
      {
        id: "sony-ozon",
        store: "Ozon",
        storeColor: "#005BFF",
        price: 24500,
        sellerRating: 4.9,
        isPartner: true,
        cashbackPoints: 120,
        finalPrice: 23300,
        badge: "Оригинал проверен · Рейтинг продавца 4.9",
        badgeTone: "ok",
        buttonNote: "Перейдёт на сайт Ozon по партнёрской ссылке",
        delivery: "Доставка завтра",
      },
      {
        id: "sony-wb",
        store: "Wildberries",
        storeColor: "#CB11AB",
        price: 23900,
        sellerRating: 4.2,
        isPartner: false,
        cashbackPoints: 0,
        finalPrice: 23900,
        badge: "Без баллов · Рейтинг продавца 4.2",
        badgeTone: "warn",
        buttonNote: "Прямая ссылка на Wildberries",
        delivery: "Доставка 2–3 дня",
      },
      {
        id: "sony-dns",
        store: "DNS",
        storeColor: "#F9A825",
        price: 25200,
        sellerRating: 4.7,
        isPartner: false,
        cashbackPoints: 0,
        finalPrice: 25200,
        badge: "Без баллов · Рейтинг 4.7 · Самовывоз",
        badgeTone: "neutral",
        buttonNote: "Прямая ссылка на DNS",
        delivery: "Самовывоз сегодня",
      },
    ],
  },

  gift: {
    id: "gift-gamer",
    title: "Подарок для геймера",
    emoji: "🎁",
    gradient: "from-emerald-400/80 via-cyan-400/70 to-blue-500/70",
    totalFound: 9,
    aiVerdict:
      "Рекомендую геймпад Xbox: универсальный и практичный подарок до 3 000₽. С баллами Aura выходит 1 350₽ — на 450₽ дешевле, чем везде. Клавиатура Logitech тоже хороша, но у геймера обычно уже есть своя.",
    options: [
      {
        id: "gift-gamepad",
        store: "Ozon",
        storeColor: "#005BFF",
        price: 1800,
        sellerRating: 4.8,
        isPartner: true,
        cashbackPoints: 45,
        finalPrice: 1350,
        badge: "Оригинал проверен · Рейтинг продавца 4.8",
        badgeTone: "ok",
        buttonNote: "Перейдёт на сайт Ozon по партнёрской ссылке",
        delivery: "Доставка завтра",
      },
      {
        id: "gift-keyboard",
        store: "DNS",
        storeColor: "#F9A825",
        price: 2500,
        sellerRating: 4.7,
        isPartner: false,
        cashbackPoints: 0,
        finalPrice: 2500,
        badge: "Без баллов · Рейтинг 4.7 · Самовывоз",
        badgeTone: "neutral",
        buttonNote: "Прямая ссылка на DNS",
        delivery: "Самовывоз сегодня",
      },
      {
        id: "gift-steam",
        store: "Яндекс.Маркет",
        storeColor: "#FFCC00",
        price: 2000,
        sellerRating: 4.6,
        isPartner: true,
        cashbackPoints: 40,
        finalPrice: 1600,
        badge: "Цифровой код · придёт за 5 минут",
        badgeTone: "ok",
        buttonNote: "Перейдёт на Яндекс.Маркет по партнёрской ссылке",
        delivery: "Мгновенно",
      },
    ],
  },

  honor: {
    id: "honor-magic7-pro",
    title: "Honor Magic7 Pro 12/512",
    emoji: "📱",
    gradient: "from-indigo-400/80 via-sky-400/70 to-teal-400/70",
    totalFound: 14,
    aiVerdict:
      "Рекомендую Ozon: цена выше WB на 1 000₽, но баллы Aura перекрывают разницу — итог 59 990₽ против 61 990₽. Продавец официальный, гарантия 12 месяцев.",
    options: [
      {
        id: "honor-ozon",
        store: "Ozon",
        storeColor: "#005BFF",
        price: 62990,
        sellerRating: 4.9,
        isPartner: true,
        cashbackPoints: 300,
        finalPrice: 59990,
        badge: "Официальный продавец · Гарантия 12 мес",
        badgeTone: "ok",
        buttonNote: "Перейдёт на сайт Ozon по партнёрской ссылке",
        delivery: "Доставка завтра",
      },
      {
        id: "honor-wb",
        store: "Wildberries",
        storeColor: "#CB11AB",
        price: 61990,
        sellerRating: 4.3,
        isPartner: false,
        cashbackPoints: 0,
        finalPrice: 61990,
        badge: "Без баллов · Рейтинг продавца 4.3",
        badgeTone: "warn",
        buttonNote: "Прямая ссылка на Wildberries",
        delivery: "Доставка 2–4 дня",
      },
      {
        id: "honor-citilink",
        store: "Ситилинк",
        storeColor: "#EA1B25",
        price: 63490,
        sellerRating: 4.8,
        isPartner: false,
        cashbackPoints: 0,
        finalPrice: 63490,
        badge: "Без баллов · Рейтинг 4.8 · Самовывоз",
        badgeTone: "neutral",
        buttonNote: "Прямая ссылка на Ситилинк",
        delivery: "Самовывоз сегодня",
      },
    ],
  },
};

export const EXTRA_VARIANTS: { store: string; price: number; note: string }[] = [
  { store: "Мегамаркет", price: 24100, note: "Бонусы СберСпасибо" },
  { store: "Ozon (продавец 4.6)", price: 23750, note: "Без проверки оригинала" },
  { store: "Яндекс.Маркет", price: 24890, note: "Сплит на 4 платежа" },
  { store: "Казань-Экспресс", price: 23400, note: "Доставка 5 дней" },
  { store: "DNS (уценка)", price: 21990, note: "Вскрытая упаковка" },
  { store: "Ситилинк", price: 25490, note: "Самовывоз" },
  { store: "Wildberries (продавец 3.9)", price: 22800, note: "⚠️ Низкий рейтинг" },
  { store: "Ozon Global", price: 20900, note: "Доставка 14 дней из-за рубежа" },
  { store: "Авито (новый)", price: 19500, note: "Без гарантии магазина" },
];

export function formatRub(n: number): string {
  return `${Math.round(n).toLocaleString("ru-RU")}₽`;
}
