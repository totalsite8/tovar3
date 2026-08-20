export type ScenarioId = "balkon" | "pereezd" | "photo" | "print" | "mebel" | "uborka";

export interface Bid {
  id: string;
  company: string;
  base: number;
  hidden: number;
  hiddenNote: string | null;
  total: number;
  reliability: number;
  term: string;
  recommended: boolean;
}

export interface Scenario {
  id: ScenarioId;
  emoji: string;
  label: string;
  tzTitle: string;
  tzLines: string[];
  bids: Bid[];
}

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  balkon: {
    id: "balkon",
    emoji: "🪟",
    label: "Остекление балкона",
    tzTitle: "Остекление балкона под ключ",
    tzLines: [
      "Объект: 3-комн. квартира, панелька, 5 этаж",
      "Балкон: ~3 м, остекление + обшивка",
      "Профиль: не указан (подскажу Rehau или Veka)",
      "Пожелания: москитные сетки, вынос мусора",
    ],
    bids: [
      { id: "b1", company: "ОкнаМастер", base: 72000, hidden: 0, hiddenNote: null, total: 72000, reliability: 96, term: "3 дня", recommended: true },
      { id: "b2", company: "Фирма Б", base: 68000, hidden: 5000, hiddenNote: "доставка", total: 73000, reliability: 71, term: "5 дней", recommended: false },
      { id: "b3", company: "СтройГарант", base: 75000, hidden: 0, hiddenNote: null, total: 75000, reliability: 92, term: "4 дня", recommended: false },
    ],
  },
  pereezd: {
    id: "pereezd",
    emoji: "🚚",
    label: "Переезд с грузчиками",
    tzTitle: "Квартирный переезд под ключ",
    tzLines: [
      "Откуда: 2-комн. квартира, 4 этаж без лифта",
      "Куда: новостройка, грузовой лифт есть",
      "Объём: ~40 мест + крупная техника",
      "Нужно: 2 грузчика, машина от 16 м³, упаковка",
    ],
    bids: [
      { id: "p1", company: "ГрузовичкоФ", base: 14900, hidden: 0, hiddenNote: null, total: 14900, reliability: 93, term: "завтра", recommended: true },
      { id: "p2", company: "ПереездПро", base: 12500, hidden: 4000, hiddenNote: "этаж без лифта", total: 16500, reliability: 68, term: "послезавтра", recommended: false },
      { id: "p3", company: "БыстроГруз", base: 15800, hidden: 0, hiddenNote: null, total: 15800, reliability: 90, term: "через 2 дня", recommended: false },
    ],
  },
  photo: {
    id: "photo",
    emoji: "📸",
    label: "Фотограф на праздник",
    tzTitle: "Фотосъёмка праздника",
    tzLines: [
      "Событие: день рождения, ~25 гостей",
      "Длительность: 3 часа, интерьер + улица",
      "Нужно: 100+ обработанных фото за 5 дней",
      "Пожелания: репортажный стиль, без позирования",
    ],
    bids: [
      { id: "f1", company: "Студия Свет", base: 12000, hidden: 0, hiddenNote: null, total: 12000, reliability: 96, term: "свободна суббота", recommended: true },
      { id: "f2", company: "ФотоДом", base: 9500, hidden: 4000, hiddenNote: "обработка и архив", total: 13500, reliability: 73, term: "свободно пт", recommended: false },
      { id: "f3", company: "ИП Карпов", base: 11000, hidden: 0, hiddenNote: null, total: 11000, reliability: 88, term: "любой день", recommended: false },
    ],
  },
  print: {
    id: "print",
    emoji: "🖼",
    label: "Печать картины на холсте",
    tzTitle: "Печать на холсте с подрамником",
    tzLines: [
      "Размер: 60×90 см, холст, подрамник",
      "Файл: фото в высоком разрешении",
      "Нужно: ламинация, крепление, подарочная упаковка",
      "Срок: к пятнице",
    ],
    bids: [
      { id: "r1", company: "АртПечать", base: 3900, hidden: 0, hiddenNote: null, total: 3900, reliability: 95, term: "2 дня", recommended: true },
      { id: "r2", company: "ХолстПринт", base: 2900, hidden: 1800, hiddenNote: "упаковка и доставка", total: 4700, reliability: 69, term: "3 дня", recommended: false },
      { id: "r3", company: "Фотосалон 24", base: 4200, hidden: 0, hiddenNote: null, total: 4200, reliability: 90, term: "1 день", recommended: false },
    ],
  },
  mebel: {
    id: "mebel",
    emoji: "🛠",
    label: "Сборка мебели",
    tzTitle: "Сборка корпусной мебели",
    tzLines: [
      "Что: шкаф-купе + комод + 2 стеллажа",
      "Мебель новая, в коробках, вся фурнитура на месте",
      "Адрес: ЖК «Речной», парковка у подъезда",
      "Нужно: свой инструмент, вынос коробок",
    ],
    bids: [
      { id: "m1", company: "СборкаПро", base: 4900, hidden: 0, hiddenNote: null, total: 4900, reliability: 95, term: "сегодня", recommended: true },
      { id: "m2", company: "Мастер 13", base: 3900, hidden: 2000, hiddenNote: "выезд и подъём", total: 5900, reliability: 72, term: "завтра", recommended: false },
      { id: "m3", company: "МебельHelp", base: 5400, hidden: 0, hiddenNote: null, total: 5400, reliability: 89, term: "сегодня", recommended: false },
    ],
  },
  uborka: {
    id: "uborka",
    emoji: "🧽",
    label: "Уборка после ремонта",
    tzTitle: "Послеремонтная уборка квартиры",
    tzLines: [
      "Объект: 2-комн. квартира, 54 м²",
      "Состояние: строительная пыль, следы краски и скотча",
      "Нужно: своя химия и инвентарь, 2 клинера",
      "Пожелания: мойка окон изнутри, вывоз мусора",
    ],
    bids: [
      { id: "u1", company: "ЧистоДом", base: 7900, hidden: 0, hiddenNote: null, total: 7900, reliability: 94, term: "завтра", recommended: true },
      { id: "u2", company: "КлинингМ", base: 5900, hidden: 3500, hiddenNote: "химия и инвентарь", total: 9400, reliability: 70, term: "сегодня", recommended: false },
      { id: "u3", company: "Уборка24", base: 8500, hidden: 0, hiddenNote: null, total: 8500, reliability: 91, term: "послезавтра", recommended: false },
    ],
  },
};

/* briefing questions for the services page */
export interface ServicesQuestionOption {
  value: string;
  label: string;
}
export interface ServicesQuestion {
  id: "scenario" | "time" | "budget";
  title: string;
  emoji: string;
  options: ServicesQuestionOption[];
}

export const SERVICES_QUESTIONS: ServicesQuestion[] = [
  {
    id: "scenario",
    title: "Что нужно сделать?",
    emoji: "🧰",
    options: [
      { value: "balkon", label: "🪟 Остеклить балкон" },
      { value: "pereezd", label: "🚚 Переезд с грузчиками" },
      { value: "mebel", label: "🛠 Собрать мебель" },
      { value: "uborka", label: "🧽 Уборка после ремонта" },
    ],
  },
  {
    id: "time",
    title: "Когда нужно?",
    emoji: "📅",
    options: [
      { value: "На этой неделе", label: "На этой неделе" },
      { value: "В течение месяца", label: "В течение месяца" },
      { value: "Пока смотрю цены", label: "Пока смотрю цены" },
    ],
  },
  {
    id: "budget",
    title: "Какой бюджет?",
    emoji: "💸",
    options: [
      { value: "до 30к", label: "До 30к" },
      { value: "30–80к", label: "30–80к" },
      { value: "80к+", label: "80к+" },
      { value: "не знаю", label: "Подскажите рыночную цену" },
    ],
  },
];

export const SMART_LINK_TZ: string[] = [
  "Балкон ~3 м: остекление + обшивка",
  "Профиль: Rehau/Veka",
  "Москитные сетки, вынос мусора",
  "Панелька, 5 этаж",
];

export const formatRub = (n: number): string => `${Math.round(n).toLocaleString("ru-RU")}₽`;
