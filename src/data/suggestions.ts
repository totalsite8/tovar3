import type { ScenarioId } from "./mockTender";

export type ChipKind = "product" | "gift" | "service";

export interface Chip {
  emoji: string;
  label: string;
  query: string;
  kind: ChipKind;
  route: string;
  scenario?: ScenarioId;
}

export const PRODUCT_CHIPS: Chip[] = [
  { emoji: "🎧", label: "Наушники до 3 000₽", query: "Наушники до 3 000₽", kind: "product", route: "/search" },
  { emoji: "📱", label: "Honor Magic 7 Pro дешевле", query: "Honor Magic 7 Pro дешевле", kind: "product", route: "/search" },
  { emoji: "🤖", label: "Робот-пылесос для шерсти", query: "Робот-пылесос для шерсти", kind: "product", route: "/search" },
  { emoji: "👟", label: "Кроссовки для бега до 5 000₽", query: "Кроссовки для бега до 5 000₽", kind: "product", route: "/search" },
  { emoji: "💄", label: "Аналог дорогого парфюма", query: "Аналог дорогого парфюма", kind: "product", route: "/search" },
  { emoji: "🌸", label: "Букет до 2 000₽ за час", query: "Букет до 2 000₽ за час", kind: "product", route: "/search" },
];

export const GIFT_CHIPS: Chip[] = [
  { emoji: "🎁", label: "Подарок парню на ДР", query: "Подарок парню на день рождения", kind: "gift", route: "/gift" },
  { emoji: "🎁", label: "Что подарить маме", query: "Что подарить маме", kind: "gift", route: "/gift" },
];

export const SERVICE_CHIPS: Chip[] = [
  { emoji: "🪟", label: "Остеклить балкон", query: "Остеклить балкон", kind: "service", route: "/tender", scenario: "balkon" },
  { emoji: "🚚", label: "Организовать переезд с грузчиками", query: "Переезд с грузчиками", kind: "service", route: "/tender", scenario: "pereezd" },
  { emoji: "📸", label: "Фотограф на праздник", query: "Фотограф на праздник", kind: "service", route: "/tender", scenario: "photo" },
  { emoji: "🖼", label: "Напечатать картину на холсте", query: "Печать картины на холсте", kind: "service", route: "/tender", scenario: "print" },
  { emoji: "🛠", label: "Собрать мебель", query: "Собрать мебель", kind: "service", route: "/tender", scenario: "mebel" },
  { emoji: "🧽", label: "Уборка после ремонта", query: "Уборка после ремонта", kind: "service", route: "/tender", scenario: "uborka" },
];

export const ALL_CHIPS: Chip[] = [...PRODUCT_CHIPS, ...GIFT_CHIPS, ...SERVICE_CHIPS];

export const CHIP_GROUPS: { id: ChipKind; label: string; chips: Chip[] }[] = [
  { id: "product", label: "// Товары", chips: PRODUCT_CHIPS },
  { id: "gift", label: "// Подарки", chips: GIFT_CHIPS },
  { id: "service", label: "// Услуги", chips: SERVICE_CHIPS },
];
