import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, ArrowUp, SendHorizonal } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { ChipRow } from "../home/SuggestionChips";

const SERVICE_WORDS = ["окн", "балкон", "ремонт", "установ", "монтаж", "подряд", "переезд", "грузчик", "уборк", "клининг", "мебел", "собрат", "фотограф", "холст", "печат", "услуг"];
const GIFT_WORDS = ["подарок", "подар", "парню", "девушк", "маме", "папе", "другу", "жене", "мужу"];

type Intent = "product" | "gift" | "service";

function detectIntent(q: string): Intent {
  const s = q.toLowerCase();
  if (SERVICE_WORDS.some((w) => s.includes(w))) return "service";
  if (GIFT_WORDS.some((w) => s.includes(w))) return "gift";
  return "product";
}

const GLOW: Record<Intent, { ring: string; soft: string; solid: string }> = {
  product: { ring: "rgba(249,115,22,.65)", soft: "rgba(249,115,22,.22)", solid: "#F97316" },
  service: { ring: "rgba(139,92,246,.65)", soft: "rgba(139,92,246,.22)", solid: "#8B5CF6" },
  gift: { ring: "rgba(245,158,11,.65)", soft: "rgba(245,158,11,.22)", solid: "#F59E0B" },
};

const READY_TEXT: Record<Intent, string> = {
  product: "Похоже, это товар → сравню цены и найду кэшбэк",
  gift: "Похоже, это подарок → задам 3 коротких вопроса",
  service: "Похоже, это услуга → найду подрядчиков и сравню цены",
};

export function Omnibar() {
  const navigate = useNavigate();
  const setSearch = useAppStore((s) => s.setSearch);
  const showToast = useAppStore((s) => s.showToast);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "detecting" | "ready" | "routing">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const intent = useMemo(() => detectIntent(value), [value]);
  const glow = value.trim() ? GLOW[intent] : null;

  useEffect(() => {
    if (!value.trim()) {
      setStatus("idle");
      return;
    }
    setStatus("detecting");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setStatus("ready"), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  useEffect(
    () => () => {
      if (routeTimer.current) clearTimeout(routeTimer.current);
    },
    []
  );

  const submit = () => {
    const q = value.trim();
    if (!q) {
      showToast("Введите запрос — например, «наушники до 3 000₽»", "info");
      return;
    }
    setStatus("routing");
    const route = intent === "service" ? "/tender" : intent === "gift" ? "/gift" : "/search";
    const mode = intent === "service" ? "service" : intent === "gift" ? "gift" : "product";
    console.log("[Aura] Search intent:", intent, "→ route:", route);
    setSearch(q, mode);
    routeTimer.current = setTimeout(() => {
      navigate(route);
      setValue("");
      setStatus("idle");
    }, 620);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      {/* mobile: near full width · desktop: wide centered bar */}
      <div className="mx-auto w-[calc(100%-2rem)] md:w-full md:max-w-3xl md:px-0">
        {/* micro-status line */}
        <div className="flex h-6 items-end justify-center pb-1">
          <AnimatePresence mode="wait">
            {status === "detecting" && (
              <motion.span
                key="detecting"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="panel rounded-full px-3 py-0.5 text-[11px] font-medium text-mute"
              >
                Определяю тип запроса
                <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity }}>
                  ...
                </motion.span>
              </motion.span>
            )}
            {(status === "ready" || status === "routing") && (
              <motion.span
                key="ready"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="panel rounded-full px-3 py-0.5 text-[11px] font-semibold"
                style={{ color: glow?.solid }}
              >
                {status === "routing" ? "Запускаю…" : READY_TEXT[intent]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* suggestion chips */}
        <div className="pb-2">
          <ChipRow />
        </div>

        {/* the bar */}
        <div className="pb-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="surface flex h-14 items-center gap-1.5 rounded-full border bg-card pl-2.5 pr-2 shadow-[0_14px_44px_rgba(0,0,0,0.22)] transition-[border-color,box-shadow] duration-300"
            style={{
              borderColor: glow ? glow.ring : "var(--border)",
              boxShadow: glow
                ? `0 0 0 3px ${glow.soft}, 0 14px 44px rgba(0,0,0,0.24)`
                : "0 14px 44px rgba(0,0,0,0.18)",
            }}
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => showToast("Голосовой ввод появится в следующей версии 🙂", "info")}
              aria-label="Голосовой ввод"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-mute transition-colors hover:bg-soft hover:text-ink"
            >
              <Mic size={19} />
            </motion.button>

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Что ищем?"
              aria-label="Что ищем?"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-mute"
            />

            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              aria-label="Найти"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors duration-300"
              style={{ background: glow ? glow.solid : "var(--text-primary)", color: glow ? "#fff" : "var(--bg)" }}
            >
              {status === "routing" ? <SendHorizonal size={18} className="animate-pulse" /> : <ArrowUp size={19} strokeWidth={2.6} />}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
