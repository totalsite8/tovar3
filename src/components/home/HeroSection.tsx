import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, BadgeCheck } from "lucide-react";
import { Button, Badge } from "../ui";

type Phase = "pulse" | "ozon" | "dns" | "market" | "align" | "scan" | "winner";

const TIMELINE: { p: Phase; d: number }[] = [
  { p: "pulse", d: 1200 },
  { p: "ozon", d: 1300 },
  { p: "dns", d: 1300 },
  { p: "market", d: 1300 },
  { p: "align", d: 1500 },
  { p: "scan", d: 1500 },
  { p: "winner", d: 2900 },
];

const ORDER: Phase[] = TIMELINE.map((t) => t.p);

interface StoreDef {
  key: "ozon" | "dns" | "market";
  name: string;
  color: string;
  x: number;
  y: number;
  price: string;
}

const STORES: StoreDef[] = [
  { key: "ozon", name: "Ozon", color: "#005BFF", x: 17, y: 20, price: "24 500₽" },
  { key: "dns", name: "DNS", color: "#F9A825", x: 83, y: 18, price: "25 200₽" },
  { key: "market", name: "Я.Маркет", color: "#FFCC00", x: 18, y: 56, price: "24 890₽" },
];

const SLOTS = [
  { x: 22, y: 79 },
  { x: 50, y: 79 },
  { x: 78, y: 79 },
];

const CAPTIONS: Record<Phase, string> = {
  pulse: "ИИ-агент запускается…",
  ozon: "Сканирую Ozon…",
  dns: "Сканирую DNS…",
  market: "Сканирую Яндекс.Маркет…",
  align: "Сравниваю 3 варианта…",
  scan: "Проверяю продавцов и баллы…",
  winner: "Готово: выгода 1 200₽ 🎉",
};

const ORB_POS: Record<Phase, { x: number; y: number }> = {
  pulse: { x: 55, y: 38 },
  ozon: { x: 17, y: 20 },
  dns: { x: 83, y: 18 },
  market: { x: 18, y: 56 },
  align: { x: 50, y: 57 },
  scan: { x: 50, y: 57 },
  winner: { x: 50, y: 57 },
};

const spring = { type: "spring" as const, stiffness: 100, damping: 15 };

export function HeroSection() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("pulse");
  const [count, setCount] = useState(24500);

  /* loop the scene every ~10.7s */
  useEffect(() => {
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      const current = TIMELINE[i % TIMELINE.length];
      setPhase(current.p);
      t = setTimeout(() => {
        i += 1;
        step();
      }, current.d);
    };
    step();
    return () => clearTimeout(t);
  }, []);

  /* animated final price on winner phase */
  useEffect(() => {
    if (phase === "winner") {
      const controls = animate(24500, 23300, {
        duration: 1.1,
        ease: "easeOut",
        onUpdate: (v) => setCount(v),
      });
      return () => controls.stop();
    }
    setCount(24500);
  }, [phase]);

  const idx = ORDER.indexOf(phase);
  const alignIdx = ORDER.indexOf("align");
  const winner = phase === "winner";

  return (
    <section className="mx-auto grid w-full max-w-[1000px] items-center gap-8 px-5 pb-4 pt-8 sm:pt-12 lg:grid-cols-[1fr_1.05fr]">
      {/* ── Copy ── */}
      <div>
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-mute shadow-sm"
        >
          <Zap size={13} className="text-ai" />
          ИИ-оркестратор покупок и услуг
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.08 }}
          className="mt-4 font-display text-[30px] font-bold leading-[1.08] tracking-tight sm:text-[40px]"
        >
          Один запрос —{" "}
          <span className="relative inline-block">
            весь рынок
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
              className="absolute -bottom-1 left-0 h-[5px] w-full origin-left rounded-full bg-ai/70"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.16 }}
          className="mt-4 max-w-[420px] text-[15px] text-mute"
        >
          Aura сравнивает цены на маркетплейсах, честно показывает ВСЕ варианты, начисляет баллы с
          каждой покупки и сама торгуется с подрядчиками за услуги.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.24 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <Button color="product" onClick={() => navigate("/search")}>
            🔎 Поиск товара с баллами
          </Button>
          <Button variant="ghost" onClick={() => navigate("/tender")}>
            🪟 Тендер на услугу
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-mute"
        >
          <span>⏱ 60 сек на поиск</span>
          <span className="h-1 w-1 rounded-full bg-line" />
          <span>🏬 12+ маркетплейсов</span>
          <span className="h-1 w-1 rounded-full bg-line" />
          <span>🕵️ 0 скрытых доплат</span>
        </motion.div>
      </div>

      {/* ── Animated scene ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...spring, delay: 0.15 }}
        className="surface relative h-[400px] overflow-hidden rounded-[28px] border border-line bg-card shadow-card sm:h-[440px]"
        style={{
          backgroundImage:
            "radial-gradient(75% 55% at 50% 0%, var(--tint-ai), transparent 70%), radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "auto, 22px 22px",
        }}
      >
        {/* store chips */}
        {STORES.map((s, i) => {
          const active = phase === s.key;
          return (
            <motion.button
              key={s.key}
              type="button"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.3 + i * 0.12 }}
              className="surface absolute z-10 flex w-[88px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl border bg-card px-2 py-2 shadow-card"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                borderColor: active ? "var(--color-ai)" : "var(--border)",
                boxShadow: active ? "0 0 0 3px var(--tint-ai)" : undefined,
              }}
            >
              <span className="flex items-center gap-1.5 text-[12px] font-bold">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <span className="text-[10px] font-medium text-mute">{s.price}</span>
            </motion.button>
          );
        })}

        {/* scan beam over aligned row */}
        <AnimatePresence>
          {phase === "scan" && (
            <motion.div
              key="beam"
              initial={{ left: "-20%", opacity: 0 }}
              animate={{ left: "115%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.35, ease: "easeInOut" }}
              className="pointer-events-none absolute z-[5] top-[68%] h-[92px] w-24 -translate-y-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(245,158,11,0.35) 45%, rgba(245,158,11,0.75) 50%, rgba(245,158,11,0.35) 55%, transparent)",
                filter: "blur(2px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* mini product cards */}
        {STORES.map((s, i) => {
          const visibleFrom = i + 1;
          const visible = idx >= visibleFrom;
          const aligned = idx >= alignIdx;
          const pos = aligned ? SLOTS[i] : { x: s.x, y: s.y + 14 };
          const isWinnerCard = winner && i === 0;
          const dimmed = winner && i !== 0;
          return (
            <motion.div
              key={`mini-${s.key}`}
              animate={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                opacity: visible ? (dimmed ? 0.45 : 1) : 0,
                scale: visible ? 1 : 0.3,
              }}
              transition={spring}
              className="surface absolute z-10 w-[88px] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-1.5 text-center shadow-card"
              style={{
                borderColor: isWinnerCard ? "var(--color-ok)" : "var(--border)",
                boxShadow: isWinnerCard ? "0 0 0 3px var(--tint-ok), 0 8px 24px rgba(16,185,129,.25)" : undefined,
              }}
            >
              <div className="text-lg leading-none">🎧</div>
              <div className="mt-0.5 text-[10.5px] font-bold leading-tight">{s.price}</div>
              {isWinnerCard && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-ok text-white shadow-card"
                >
                  <BadgeCheck size={14} />
                </motion.span>
              )}
            </motion.div>
          );
        })}

        {/* the AI orb */}
        <motion.div
          animate={{ left: `${ORB_POS[phase].x}%`, top: `${ORB_POS[phase].y}%` }}
          transition={spring}
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.25, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-full bg-ai/30 blur-xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-11 w-11 rounded-full"
            style={{
              background: "radial-gradient(circle at 32% 28%, #FDE68A, #F59E0B 55%, #F97316)",
              boxShadow: "0 6px 24px rgba(249,115,22,.45), inset 0 -4px 10px rgba(180,60,0,.25)",
            }}
          />
        </motion.div>

        {/* caption */}
        <div className="absolute inset-x-0 top-4 z-20 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="rounded-full border border-line bg-card/95 px-3.5 py-1 text-[11.5px] font-semibold shadow-sm"
            >
              {CAPTIONS[phase]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* price math appears on winner */}
        <AnimatePresence>
          {winner && (
            <motion.div
              key="math"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={spring}
              className="absolute inset-x-0 bottom-4 z-20 flex justify-center"
            >
              <div className="surface flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 shadow-card">
                <span className="text-[12px] font-medium text-mute line-through decoration-bad/60">
                  24 500₽
                </span>
                <Badge tone="product">−120 баллов</Badge>
                <span className="font-display text-[15px] font-bold text-ok">
                  {Math.round(count).toLocaleString("ru-RU")}₽
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
