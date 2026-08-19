import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore, type SearchMode } from "../../store/useAppStore";

export interface Suggestion {
  emoji: string;
  label: string;
  query: string;
  mode: SearchMode;
  route: string;
}

export const SUGGESTIONS: Suggestion[] = [
  { emoji: "🎧", label: "Наушники до 3 000₽", query: "Наушники до 3 000₽", mode: "product", route: "/search" },
  { emoji: "🪟", label: "Окна под ключ", query: "Окна под ключ", mode: "service", route: "/tender" },
  { emoji: "🎁", label: "Подарок парню", query: "Подарок парню", mode: "gift", route: "/gift" },
  { emoji: "📱", label: "Honor Magic 7 Pro", query: "Honor Magic 7 Pro", mode: "exact", route: "/search" },
];

export function SuggestionChips({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const setSearch = useAppStore((s) => s.setSearch);
  const [leaving, setLeaving] = useState<string | null>(null);

  const go = (s: Suggestion) => {
    console.log("[Aura] Suggestion tapped:", s.label);
    setLeaving(s.label);
    setSearch(s.query, s.mode);
    window.setTimeout(() => navigate(s.route), 260);
  };

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {SUGGESTIONS.map((s) => (
          <motion.button
            key={s.label}
            type="button"
            whileTap={{ scale: 0.93 }}
            onClick={() => go(s)}
            className="surface flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-card/95 px-3 py-1.5 text-[12.5px] font-medium shadow-sm"
          >
            <span>{s.emoji}</span>
            <span>{s.label}</span>
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <section id="try" className="mx-auto w-full max-w-[480px] px-5 pt-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 100, damping: 16 }}
      >
        <h2 className="font-display text-[22px] font-bold tracking-tight">
          Попробуйте прямо сейчас
        </h2>
        <p className="mt-1 text-sm text-mute">Один тап — и ИИ уже работает. Данные демо, смелее.</p>
      </motion.div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.label}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.08 * i }}
            animate={
              leaving === s.label
                ? { y: -18, opacity: 0, scale: 0.9 }
                : { y: 0, opacity: 1, scale: 1 }
            }
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => go(s)}
            className="surface flex min-h-11 items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-[14.5px] font-semibold shadow-card"
          >
            <span className="text-lg leading-none">{s.emoji}</span>
            <span>{s.label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
