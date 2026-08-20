export type ProductId = "airpods" | "gift" | "honor";

export interface OptionRow {
  ok: boolean;
  text: string;
}

export interface Option {
  store: string;
  storeColor: string;
  price: number;
  isPartner: boolean;
  rows: OptionRow[];
}

export interface TrustRow {
  label: string;
  value: string;
  tone: "ok" | "warn" | "bad" | "ai";
}

export interface CompareRow {
  label: string;
  cheap: string;
  aura: string;
  auraGood: boolean;
}

export interface Product {
  id: ProductId;
  emoji: string;
  gradient: string;
  title: string;
  category: string;
  sources: number;
  verdict: string;
  cheap: Option;
  aura: Option & { cashback: number; final: number; badge: string };
  mathNote: string;
  cashbackLabel: string;
  compare: CompareRow[];
  trust: TrustRow[];
  priceHistory: number[];
  priceMin: { value: number; at: string };
  priceNow: number;
}

/** deterministic 90-day price history with a dip around day ~60 */
function genHistory(seed: number, start: number, min: number, end: number, days = 90): number[] {
  const arr: number[] = [];
  for (let i = 0; i < days; i++) {
    const t = i / (days - 1);
    const base = start + (end - start) * t;
    const wave = Math.sin(i / 7 + seed) * 260 + Math.sin(i / 3.1 + seed * 2) * 130;
    let v = base + wave;
    if (i >= 54 && i <= 66) v = Math.min(v, min + Math.abs(i - 60) * 95);
    arr.push(Math.round(v / 10) * 10);
  }
  return arr;
}

export const PRODUCTS: Record<ProductId, Product> = {
  airpods: {
    id: "airpods",
    emoji: "🎧",
    gradient: "from-cyan-400/80 via-sky-400/70 to-blue-500/70",
    title: "AirPods Pro 3",
    category: "Наушники",
    sources: 14,
    verdict:
      "Самый дешёвый вариант — с оговорками: долгая доставка и нет официальной гарантии. С Aura на бумаге дороже, а по факту дешевле: кэшбэк падает в кошелёк сразу.",
    cheap: {
      store: "Ozon Global",
      storeColor: "#005BFF",
      price: 21990,
      isPartner: false,
      rows: [
        { ok: false, text: "доставка 6–9 дней" },
        { ok: false, text: "гарантия продавца 14 дней" },
        { ok: false, text: "возврат за ваш счёт" },
      ],
    },
    aura: {
      store: "М.Видео",
      storeColor: "#EA1B25",
      price: 23490,
      isPartner: true,
      cashback: 2584,
      final: 20906,
      badge: "−1 084₽ vs самый дешёвый",
      rows: [
        { ok: true, text: "доставка завтра, слот 2 часа" },
        { ok: true, text: "1 год, официальный дистрибьютор" },
        { ok: true, text: "30 дней, бесплатный вывоз" },
      ],
    },
    mathNote: "дешевле самого дешёвого на 1 084₽ — с официальной гарантией",
    cashbackLabel: "кэшбэк 11% сразу",
    compare: [
      { label: "Цена на получении", cheap: "21 990₽", aura: "20 906₽ с кэшбеком", auraGood: true },
      { label: "Кэшбэк Aura", cheap: "нет", aura: "+2 584₽ сразу", auraGood: true },
      { label: "Доставка", cheap: "6–9 дней", aura: "завтра, слот 2 часа", auraGood: true },
      { label: "Гарантия", cheap: "продавца, 14 дней", aura: "1 год, официальная", auraGood: true },
      { label: "Возврат", cheap: "за ваш счёт", aura: "30 дней, бесплатный", auraGood: true },
      { label: "Серийный номер", cheap: "не проверить", aura: "в официальной базе", auraGood: true },
    ],
    trust: [
      { label: "Цена к индексу 90 дней", value: "−16,3% · у исторического дна", tone: "ok" },
      { label: "Надёжность партнёра", value: "98,2% в срок · 412 сделок", tone: "ok" },
      { label: "Серийный номер", value: "проходит по официальной базе", tone: "ok" },
      { label: "Риск серого импорта", value: "высокий в самом дешёвом варианте", tone: "bad" },
      { label: "Выплата кэшбека", value: "мгновенно в кошелёк Aura", tone: "ai" },
    ],
    priceHistory: genHistory(1.7, 26800, 21990, 23490),
    priceMin: { value: 21990, at: "3 нед. назад" },
    priceNow: 23490,
  },

  gift: {
    id: "gift",
    emoji: "🎮",
    gradient: "from-emerald-400/80 via-cyan-400/70 to-blue-500/70",
    title: "Геймпад Xbox Wireless",
    category: "Подарок · геймеру",
    sources: 12,
    verdict:
      "Дешёвый вариант едет из-за рубежа две недели и без нормальной гарантии — для подарка рискованно. У партнёра Aura дороже на витрине, но кэшбэк делает его выгоднее, и приедет завтра.",
    cheap: {
      store: "Ozon Global",
      storeColor: "#005BFF",
      price: 1450,
      isPartner: false,
      rows: [
        { ok: false, text: "доставка 10–14 дней" },
        { ok: false, text: "гарантия продавца 7 дней" },
        { ok: false, text: "возврат за ваш счёт" },
      ],
    },
    aura: {
      store: "М.Видео",
      storeColor: "#EA1B25",
      price: 1800,
      isPartner: true,
      cashback: 420,
      final: 1380,
      badge: "−70₽ vs самый дешёвый",
      rows: [
        { ok: true, text: "доставка завтра, слот 2 часа" },
        { ok: true, text: "1 год, официальная гарантия" },
        { ok: true, text: "30 дней, бесплатный возврат" },
      ],
    },
    mathNote: "дешевле самого дешёвого на 70₽ — и приедет к празднику",
    cashbackLabel: "кэшбэк 23% сразу",
    compare: [
      { label: "Цена на получении", cheap: "1 450₽", aura: "1 380₽ с кэшбеком", auraGood: true },
      { label: "Кэшбэк Aura", cheap: "нет", aura: "+420₽ сразу", auraGood: true },
      { label: "Доставка", cheap: "10–14 дней", aura: "завтра, слот 2 часа", auraGood: true },
      { label: "Гарантия", cheap: "продавца, 7 дней", aura: "1 год, официальная", auraGood: true },
      { label: "Возврат", cheap: "за ваш счёт", aura: "30 дней, бесплатный", auraGood: true },
      { label: "Серийный номер", cheap: "не проверить", aura: "в официальной базе", auraGood: true },
    ],
    trust: [
      { label: "Цена к индексу 90 дней", value: "−12,8% · близко ко дну", tone: "ok" },
      { label: "Надёжность партнёра", value: "97,9% в срок · 388 сделок", tone: "ok" },
      { label: "Серийный номер", value: "проходит по базе Microsoft", tone: "ok" },
      { label: "Риск серого импорта", value: "высокий в самом дешёвом варианте", tone: "bad" },
      { label: "Выплата кэшбека", value: "мгновенно в кошелёк Aura", tone: "ai" },
    ],
    priceHistory: genHistory(3.1, 2150, 1450, 1800),
    priceMin: { value: 1450, at: "5 нед. назад" },
    priceNow: 1800,
  },

  honor: {
    id: "honor",
    emoji: "📱",
    gradient: "from-indigo-400/80 via-sky-400/70 to-teal-400/70",
    title: "Honor Magic7 Pro 12/512",
    category: "Смартфоны",
    sources: 16,
    verdict:
      "Самый дешёвый вариант — серый импорт без местной гарантии: ремонт в случае чего за ваш счёт. С кэшбеком Aura партнёрский смартфон выходит дешевле и с гарантией 12 месяцев.",
    cheap: {
      store: "Ozon Global",
      storeColor: "#005BFF",
      price: 56990,
      isPartner: false,
      rows: [
        { ok: false, text: "доставка 10–14 дней" },
        { ok: false, text: "гарантия продавца 30 дней" },
        { ok: false, text: "сервис за ваш счёт" },
      ],
    },
    aura: {
      store: "М.Видео",
      storeColor: "#EA1B25",
      price: 62990,
      isPartner: true,
      cashback: 7300,
      final: 55690,
      badge: "−1 300₽ vs самый дешёвый",
      rows: [
        { ok: true, text: "доставка завтра, слот 2 часа" },
        { ok: true, text: "12 мес, официальный ввоз" },
        { ok: true, text: "30 дней, бесплатный возврат" },
      ],
    },
    mathNote: "дешевле самого дешёвого на 1 300₽ — с гарантией 12 месяцев",
    cashbackLabel: "кэшбэк 11,6% сразу",
    compare: [
      { label: "Цена на получении", cheap: "56 990₽", aura: "55 690₽ с кэшбеком", auraGood: true },
      { label: "Кэшбэк Aura", cheap: "нет", aura: "+7 300₽ сразу", auraGood: true },
      { label: "Доставка", cheap: "10–14 дней", aura: "завтра, слот 2 часа", auraGood: true },
      { label: "Гарантия", cheap: "продавца, 30 дней", aura: "12 мес, официальная", auraGood: true },
      { label: "Возврат", cheap: "за ваш счёт", aura: "30 дней, бесплатный", auraGood: true },
      { label: "Серийный номер", cheap: "не проверить", aura: "в официальной базе", auraGood: true },
    ],
    trust: [
      { label: "Цена к индексу 90 дней", value: "−9,4% · ниже среднего", tone: "ok" },
      { label: "Надёжность партнёра", value: "98,6% в срок · 501 сделка", tone: "ok" },
      { label: "Серийный номер", value: "проходит по базе Honor", tone: "ok" },
      { label: "Риск серого импорта", value: "высокий в самом дешёвом варианте", tone: "bad" },
      { label: "Выплата кэшбека", value: "мгновенно в кошелёк Aura", tone: "ai" },
    ],
    priceHistory: genHistory(5.3, 71990, 56990, 62990),
    priceMin: { value: 56990, at: "2 нед. назад" },
    priceNow: 62990,
  },
};

export function formatRub(n: number): string {
  return `${Math.round(n).toLocaleString("ru-RU")}₽`;
}
