import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemePref = "light" | "dark" | "system";
export type SearchMode = "product" | "gift" | "exact" | "service";
export type ToastTone = "ok" | "err" | "info";

export interface Tx {
  id: string;
  delta: number;
  label: string;
  when: string;
}

export interface ToastMsg {
  id: number;
  msg: string;
  tone: ToastTone;
}

export interface GiftAnswers {
  budget: string | null;
  hobby: string | null;
  hobbySummary: string | null;
  kind: string | null;
}

export interface TenderAnswers {
  house: string | null;
  windows: string | null;
  balcony: string | null;
  budget: string | null;
}

const SEED_TX: Tx[] = [
  { id: "t1", delta: 5, label: "Ежедневный вход", when: "сегодня" },
  { id: "t2", delta: 120, label: "Покупка наушников Sony", when: "2 дня назад" },
  { id: "t3", delta: -100, label: "Запуск тендера: окна", when: "5 дней назад" },
  { id: "t4", delta: 85, label: "Покупка чехла для телефона", when: "неделю назад" },
];

interface AuraState {
  theme: ThemePref;
  city: string;
  notifications: boolean;
  points: number;
  transactions: Tx[];
  searchQuery: string;
  searchMode: SearchMode;
  giftAnswers: GiftAnswers;
  tenderAnswers: TenderAnswers;
  dailyClaimedAt: string | null;
  toast: ToastMsg | null;
  legalDoc: "terms" | "privacy" | null;

  setTheme: (t: ThemePref) => void;
  setCity: (c: string) => void;
  setNotifications: (v: boolean) => void;
  setSearch: (q: string, m: SearchMode) => void;
  setGiftAnswer: (patch: Partial<GiftAnswers>) => void;
  resetGift: () => void;
  setTenderAnswer: (patch: Partial<TenderAnswers>) => void;
  resetTender: () => void;
  addPoints: (n: number, label: string) => void;
  spendPoints: (n: number, label: string) => boolean;
  claimDaily: () => boolean;
  showToast: (msg: string, tone?: ToastTone) => void;
  clearToast: () => void;
  setLegalDoc: (d: "terms" | "privacy" | null) => void;
}

let txCounter = 100;

export const useAppStore = create<AuraState>()(
  persist(
    (set, get) => ({
      theme: "system",
      city: "Москва",
      notifications: true,
      points: 340,
      transactions: SEED_TX,
      searchQuery: "Наушники с шумодавом до 25 000₽",
      searchMode: "product",
      giftAnswers: { budget: null, hobby: null, hobbySummary: null, kind: null },
      tenderAnswers: { house: null, windows: null, balcony: null, budget: null },
      dailyClaimedAt: null,
      toast: null,
      legalDoc: null,

      setTheme: (t) => {
        console.log("[Aura] Theme preference changed to:", t);
        set({ theme: t });
      },
      setCity: (c) => {
        console.log("[Aura] City changed to:", c);
        set({ city: c });
      },
      setNotifications: (v) => {
        console.log("[Aura] Notifications:", v ? "on" : "off");
        set({ notifications: v });
      },
      setSearch: (q, m) => {
        console.log("[Aura] Search routed →", m, "| query:", q);
        set({ searchQuery: q, searchMode: m });
      },
      setGiftAnswer: (patch) => {
        console.log("[Aura] Gift answer:", patch);
        set((s) => ({ giftAnswers: { ...s.giftAnswers, ...patch } }));
      },
      resetGift: () =>
        set({ giftAnswers: { budget: null, hobby: null, hobbySummary: null, kind: null } }),
      setTenderAnswer: (patch) => {
        console.log("[Aura] Tender answer:", patch);
        set((s) => ({ tenderAnswers: { ...s.tenderAnswers, ...patch } }));
      },
      resetTender: () =>
        set({ tenderAnswers: { house: null, windows: null, balcony: null, budget: null } }),

      addPoints: (n, label) => {
        const next = get().points + n;
        console.log(`[Aura] Points +${n} → ${next} (${label})`);
        set((s) => ({
          points: next,
          transactions: [
            { id: `tx-${++txCounter}`, delta: n, label, when: "только что" },
            ...s.transactions,
          ],
        }));
      },
      spendPoints: (n, label) => {
        if (get().points < n) {
          console.warn(`[Aura] Not enough points for "${label}" (need ${n})`);
          return false;
        }
        const next = get().points - n;
        console.log(`[Aura] Points −${n} → ${next} (${label})`);
        set((s) => ({
          points: next,
          transactions: [
            { id: `tx-${++txCounter}`, delta: -n, label, when: "только что" },
            ...s.transactions,
          ],
        }));
        return true;
      },
      claimDaily: () => {
        const today = new Date().toDateString();
        if (get().dailyClaimedAt === today) return false;
        console.log("[Aura] Daily bonus claimed: +5");
        set((s) => ({
          dailyClaimedAt: today,
          points: s.points + 5,
          transactions: [
            { id: `tx-${++txCounter}`, delta: 5, label: "Ежедневный вход", when: "только что" },
            ...s.transactions,
          ],
        }));
        return true;
      },

      showToast: (msg, tone = "info") => set({ toast: { id: Date.now(), msg, tone } }),
      clearToast: () => set({ toast: null }),
      setLegalDoc: (d) => set({ legalDoc: d }),
    }),
    {
      name: "aura-store",
      partialize: (s) => ({
        theme: s.theme,
        city: s.city,
        notifications: s.notifications,
        points: s.points,
        transactions: s.transactions,
        dailyClaimedAt: s.dailyClaimedAt,
      }),
    }
  )
);
