import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Search, MousePointerClick, Pause } from "lucide-react";
import { Button } from "../ui";

const QUERY = "Наушники до 3 000₽";
const SCENES = 4;
const DURATIONS = [2600, 4400, 3200, 3000]; // ≈13.2s loop

const FAKE_RESULTS = [
  { t: "Наушники с шумоподавлением — купить недорого", u: "market.example.ru › naushniki" },
  { t: "ТОП-10 беспроводных наушников 2026: рейтинг", u: "review-hub.ru › top-10" },
  { t: "AirPods Pro 3 — цена, отзывы, характеристики", u: "catalog.example.com › apple" },
  { t: "Где купить наушники до 3000 рублей с доставкой", u: "sravni.example › podbor" },
  { t: "Скидки на наушники сегодня — подборка", u: "sale-aggregator.ru › audio" },
];

const MARKETS = [
  { name: "Ozon", color: "#005BFF" },
  { name: "WB", color: "#CB11AB" },
  { name: "DNS", color: "#F9A825" },
  { name: "М.Видео", color: "#EA1B25" },
  { name: "Я.Маркет", color: "#FFCC00" },
];

const MINI_CARDS = [
  { store: "Ozon Global", price: "21 990₽", winner: false },
  { store: "М.Видео", price: "23 490₽", winner: true },
  { store: "DNS", price: "25 990₽", winner: false },
];

const CAMERA = [
  { scale: 1, x: "0%", y: "0%" },
  { scale: 1.03, x: "-1.5%", y: "-1%" },
  { scale: 1.22, x: "0%", y: "-7%" },
  { scale: 1.06, x: "0%", y: "2%" },
];

function SceneQuery({ typed }: { typed: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8">
      <span className="microlabel">// умный поиск</span>
      <div className="flex w-full max-w-[380px] items-center gap-3 rounded-xl border border-[#2b3446] bg-[#131926] px-4 py-3.5 shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_10px_30px_rgba(0,0,0,0.4)]">
        <Search size={18} className="shrink-0 text-cyan" />
        <span className="font-term text-[15px] text-[#e8ecf4]">
          {QUERY.slice(0, typed)}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-0.5 inline-block h-[15px] w-[8px] translate-y-[2px] bg-cyan"
          />
        </span>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: typed > 6 ? 1 : 0 }}
        className="font-term text-[11px] text-[#8b94a7]"
      >
        // ищу везде: маркетплейсы, магазины, доски объявлений
      </motion.p>
    </div>
  );
}

function ResultWindow({ name, offset }: { name: string; offset: number }) {
  const rows = [...FAKE_RESULTS, ...FAKE_RESULTS];
  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-[#2b3446] bg-[#131926]">
      <div className="flex items-center gap-1.5 border-b border-[#2b3446] px-2.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan/70" />
        <span className="font-term text-[10px] font-bold uppercase tracking-wider text-[#8b94a7]">
          {name}
        </span>
      </div>
      <div className="relative h-[120px] overflow-hidden">
        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: offset }}
          className="blur-[0.4px]"
        >
          {rows.map((r, i) => (
            <div key={i} className="border-b border-[#1d2430] px-2.5 py-2">
              <div className="truncate text-[10.5px] font-semibold text-[#7cb9ff]">{r.t}</div>
              <div className="truncate text-[9.5px] text-[#5d6578]">{r.u}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function SceneScan({ links, scanIdx }: { links: number; scanIdx: number }) {
  return (
    <div className="flex h-full flex-col gap-3 px-6 py-5">
      <div className="flex gap-3">
        <ResultWindow name="Яндекс" offset={0} />
        <ResultWindow name="Google" offset={0.4} />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-[#2b3446] bg-[#131926] px-3 py-2">
        <span className="font-term text-[11px] text-[#8b94a7]">Просмотрено ссылок:</span>
        <motion.span
          key={links}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-term text-[15px] font-bold text-cyan"
        >
          {links}
        </motion.span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {MARKETS.map((m, i) => (
          <div
            key={m.name}
            className="flex flex-col items-center gap-1 rounded-lg border border-[#2b3446] bg-[#131926] px-1 py-2 transition-all duration-300"
            style={{
              borderColor: scanIdx === i ? "#22d3ee" : "#2b3446",
              boxShadow: scanIdx === i ? "0 0 0 2px rgba(34,211,238,0.25)" : undefined,
            }}
          >
            <motion.span
              animate={{ opacity: scanIdx === i ? [0.4, 1, 0.4] : 0.75 }}
              transition={{ duration: 0.5, repeat: scanIdx === i ? Infinity : 0 }}
              className="h-2 w-2 rounded-full"
              style={{ background: m.color }}
            />
            <span className="font-term text-[8.5px] font-bold text-[#8b94a7]">{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneCompare({ progress }: { progress: number }) {
  const aligned = progress > 0.15;
  const beam = progress > 0.45 && progress < 0.85;
  const winner = progress > 0.85;
  return (
    <div className="relative flex h-full items-center justify-center px-6">
      <div className="relative flex w-full max-w-[420px] items-end justify-between gap-3">
        {beam && (
          <motion.div
            initial={{ left: "-15%" }}
            animate={{ left: "110%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="pointer-events-none absolute top-1/2 h-32 w-16 -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(34,211,238,0.4) 45%, rgba(34,211,238,0.85) 50%, rgba(34,211,238,0.4) 55%, transparent)",
              filter: "blur(2px)",
            }}
          />
        )}
        {MINI_CARDS.map((c, i) => (
          <motion.div
            key={c.store}
            initial={{ opacity: 0, y: 60, scale: 0.7 }}
            animate={{
              opacity: winner && !c.winner ? 0.4 : 1,
              y: aligned ? 0 : 46 + i * 8,
              scale: 1,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 15, delay: i * 0.12 }}
            className="flex w-[110px] flex-col items-center gap-1 rounded-xl border bg-[#131926] px-2 py-3"
            style={{
              borderColor: winner && c.winner ? "#10b981" : "#2b3446",
              boxShadow:
                winner && c.winner ? "0 0 0 3px rgba(16,185,129,0.3), 0 12px 30px rgba(16,185,129,0.2)" : "0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            <span className="text-xl">🎧</span>
            <span className="font-term text-[9px] font-bold text-[#8b94a7]">{c.store}</span>
            <span className="font-term text-[12px] font-bold text-[#e8ecf4]">{c.price}</span>
            {winner && c.winner && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 13 }}
                className="rounded-full bg-ok px-2 py-0.5 font-term text-[8.5px] font-bold text-white"
              >
                выбор Aura
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SceneMath() {
  const [finalPrice, setFinalPrice] = useState(2990);
  useEffect(() => {
    let controls: ReturnType<typeof animate> | null = null;
    const t = setTimeout(() => {
      controls = animate(2990, 2640, { duration: 0.9, ease: "easeOut", onUpdate: (v) => setFinalPrice(v) });
    }, 700);
    return () => {
      clearTimeout(t);
      controls?.stop();
    };
  }, []);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8">
      <div className="flex flex-wrap items-baseline justify-center gap-2.5 font-term">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[24px] font-bold text-[#e8ecf4] line-through decoration-[#ef4444]/70 md:text-[30px]"
        >
          2 990₽
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-[24px] font-bold text-cyan md:text-[30px]"
        >
          − 350₽
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-[16px] text-[#8b94a7] md:text-[20px]"
        >
          =
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-[28px] font-bold text-ok md:text-[36px]"
        >
          {Math.round(finalPrice).toLocaleString("ru-RU")}₽
        </motion.span>
      </div>
      <motion.span
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 13, delay: 1.1 }}
        className="rounded-full border border-ok/40 bg-ok/15 px-4 py-1.5 font-term text-[12px] font-bold text-ok"
      >
        Выгоднее на 11% с Aura
      </motion.span>
    </div>
  );
}

export function HeroSection() {
  const navigate = useNavigate();
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [boost, setBoost] = useState(false);
  const [typed, setTyped] = useState(0);
  const [links, setLinks] = useState(47);
  const [scanIdx, setScanIdx] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);

  /* scene scheduler */
  useEffect(() => {
    if (paused) return;
    const d = DURATIONS[scene] * (boost ? 0.4 : 1);
    const start = Date.now();
    const t = setTimeout(() => {
      const next = (scene + 1) % SCENES;
      console.log("[Aura] Hero scene →", next + 1);
      setScene(next);
      setBoost(false);
      if (next === 0) setTyped(0);
      if (next === 1) setLinks(38 + Math.floor(Math.random() * 20));
    }, d);
    const iv = setInterval(() => setSceneProgress((Date.now() - start) / d), 80);
    return () => {
      clearTimeout(t);
      clearInterval(iv);
    };
  }, [scene, paused, boost]);

  /* typewriter for scene 0 */
  useEffect(() => {
    if (scene !== 0 || paused) return;
    const iv = setInterval(() => setTyped((t) => Math.min(QUERY.length, t + 1)), 75);
    return () => clearInterval(iv);
  }, [scene, paused]);

  /* live counters for scene 1 */
  useEffect(() => {
    if (scene !== 1 || paused) return;
    const a = setInterval(() => setLinks((l) => l + 3 + Math.floor(Math.random() * 6)), 170);
    const b = setInterval(() => setScanIdx((i) => (i + 1) % MARKETS.length), 450);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, [scene, paused]);

  const spring = { type: "spring" as const, stiffness: 60, damping: 16 };

  return (
    <section className="mx-auto grid w-full max-w-[1600px] items-center gap-8 px-4 pb-6 pt-8 md:px-8 md:pt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
      {/* copy */}
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="microlabel"
        >
          // умный помощник для покупок и услуг
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 100, damping: 16 }}
          className="mt-4 font-display text-[28px] font-bold leading-[1.12] tracking-tight sm:text-[38px] xl:text-[46px]"
        >
          Один запрос —{" "}
          <span className="relative inline-block">
            весь рынок
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
              className="absolute -bottom-1.5 left-0 h-[5px] w-full origin-left rounded-full bg-product/80"
            />
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, type: "spring", stiffness: 100, damping: 16 }}
          className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-mute md:text-[16px]"
        >
          Пишете запрос — Aura сама смотрит цены везде, сравнивает с 90-дневной историей, находит
          кэшбэк и торгуется с подрядчиками за услуги. Вы видите честный расчёт, а не рекламу.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, type: "spring", stiffness: 100, damping: 16 }}
          className="mt-7 flex flex-wrap gap-3"
        >
          <Button color="product" onClick={() => navigate("/search")}>
            🔎 Искать товар
          </Button>
          <Button variant="ghost" onClick={() => navigate("/tender")}>
            🧰 Найти услугу
          </Button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 font-term text-[11.5px] font-semibold text-mute"
        >
          60 сек на поиск · 14+ источников · 0 скрытых доплат
        </motion.p>
      </div>

      {/* browser frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 90, damping: 16 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => setBoost(true)}
        className="group relative cursor-pointer overflow-hidden rounded-[18px] border border-[#2b3446] bg-[#0d1119] shadow-[0_30px_80px_rgba(11,14,20,0.35)]"
      >
        {/* window chrome */}
        <div className="flex items-center gap-3 border-b border-[#1d2430] bg-[#131926] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <span className="flex items-center gap-1.5 rounded-full border border-[#2b3446] bg-[#0d1119] px-4 py-1 font-term text-[11px] font-semibold text-[#8b94a7]">
              <Lock size={11} className="text-ok" />
              aura.ai
            </span>
          </div>
          <span className="flex items-center gap-1 font-term text-[9.5px] text-[#5d6578]">
            {paused ? <Pause size={10} /> : <MousePointerClick size={10} />}
            {paused ? "пауза" : "клик — быстрее"}
          </span>
        </div>

        {/* viewport with camera */}
        <div className="relative h-[400px] overflow-hidden md:h-[470px]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(60% 45% at 50% 0%, rgba(34,211,238,0.08), transparent 70%), linear-gradient(rgba(139,148,167,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,148,167,0.05) 1px, transparent 1px)",
              backgroundSize: "auto, 24px 24px, 24px 24px",
            }}
          />
          <motion.div
            animate={CAMERA[scene]}
            transition={spring}
            className="absolute inset-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={scene}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                {scene === 0 && <SceneQuery typed={typed} />}
                {scene === 1 && <SceneScan links={links} scanIdx={scanIdx} />}
                {scene === 2 && <SceneCompare progress={sceneProgress} />}
                {scene === 3 && <SceneMath />}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* scene dots */}
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {DURATIONS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Сцена ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setScene(i);
                  setBoost(false);
                }}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: scene === i ? 22 : 6,
                  background: scene === i ? "#22d3ee" : "#2b3446",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
