import { useEffect, useMemo, useState } from "react";
import { motion, animate, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Zap, Loader2, Store } from "lucide-react";
import { SEARCH_STEPS } from "../../data/mockOrchestratorFeed";
import type { Product } from "../../data/mockProducts";
import { Button, Badge } from "../ui";

const spring = { type: "spring" as const, stiffness: 100, damping: 15 };

/* ── "// ЧТО Я СЕЙЧАС ДЕЛАЮ" ─────────────────────────────────── */
export function StepsPanel({ phaseIdx }: { phaseIdx: number }) {
  return (
    <div className="panel p-4">
      <p className="microlabel">// Что я сейчас делаю</p>
      <ul className="mt-3 space-y-1">
        {SEARCH_STEPS.map((step, i) => {
          const done = i < phaseIdx;
          const active = i === phaseIdx;
          return (
            <li key={step} className="flex items-center gap-2.5 py-1">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md font-term text-[10px] font-bold transition-colors ${
                  done
                    ? "bg-[var(--tint-ok)] text-ok"
                    : active
                      ? "bg-[var(--tint-cyan)] text-cyan"
                      : "bg-soft text-mute"
                }`}
              >
                {done ? <CheckCircle2 size={13} /> : active ? <Loader2 size={12} className="animate-spin" /> : `0${i + 1}`}
              </span>
              <span
                className={`text-[13px] font-medium transition-colors ${
                  done ? "text-mute line-through decoration-[var(--color-ok)]/50" : active ? "text-ink font-semibold" : "text-mute/70"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── "// ЦЕНА · 90 ДНЕЙ" ─────────────────────────────────────── */
export function PriceChart({ product }: { product: Product }) {
  const W = 340;
  const H = 132;
  const PAD = { l: 10, r: 12, t: 16, b: 24 };
  const hist = product.priceHistory;

  const { linePath, areaPath, minPt, lastPt } = useMemo(() => {
    const min = Math.min(...hist);
    const max = Math.max(...hist);
    const x = (i: number) => PAD.l + (i / (hist.length - 1)) * (W - PAD.l - PAD.r);
    const y = (v: number) => PAD.t + (1 - (v - min) / (max - min || 1)) * (H - PAD.t - PAD.b);
    const pts = hist.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    const minIdx = hist.indexOf(min);
    return {
      linePath: `M ${pts.join(" L ")}`,
      areaPath: `M ${pts.join(" L ")} L ${x(hist.length - 1)},${H - PAD.b} L ${x(0)},${H - PAD.b} Z`,
      minPt: { x: x(minIdx), y: y(min) },
      lastPt: { x: x(hist.length - 1), y: y(hist[hist.length - 1]) },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hist]);

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <p className="microlabel">// Цена · 90 дней</p>
        <span className="font-term text-[10.5px] font-bold text-ok">сейчас: {product.priceNow.toLocaleString("ru-RU")}₽</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full">
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-line)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--chart-line)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PAD.l}
            x2={W - PAD.r}
            y1={PAD.t + f * (H - PAD.t - PAD.b)}
            y2={PAD.t + f * (H - PAD.t - PAD.b)}
            stroke="var(--border)"
            strokeDasharray="3 5"
          />
        ))}
        <motion.path
          d={areaPath}
          fill="url(#chart-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="var(--chart-line)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, ease: "easeInOut", delay: 0.2 }}
        />
        {/* historical bottom */}
        <circle cx={minPt.x} cy={minPt.y} r="3.5" fill="var(--color-ok)" />
        <text
          x={Math.min(Math.max(minPt.x, 60), W - 90)}
          y={minPt.y + 14}
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="700"
          fill="var(--color-ok)"
          fontFamily="ui-monospace, monospace"
        >
          дно {product.priceMin.value.toLocaleString("ru-RU")}₽
        </text>
        {/* today */}
        <motion.circle
          cx={lastPt.x}
          cy={lastPt.y}
          r="4"
          fill="var(--chart-line)"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <text x={PAD.l} y={H - 8} fontSize="9" fill="var(--text-secondary)" fontFamily="ui-monospace, monospace">
          -90 дней
        </text>
        <text x={W - PAD.r} y={H - 8} textAnchor="end" fontSize="9" fill="var(--text-secondary)" fontFamily="ui-monospace, monospace">
          сегодня
        </text>
      </svg>
      <p className="mt-1 text-[11px] text-mute">
        Минимум за 90 дней — {product.priceMin.at}. Дешевле было только там.
      </p>
    </div>
  );
}

/* ── "// ПРОВЕРКА НАДЁЖНОСТИ" ────────────────────────────────── */
const TONE_ICON = {
  ok: <CheckCircle2 size={14} className="text-ok" />,
  bad: <AlertTriangle size={14} className="text-bad" />,
  warn: <AlertTriangle size={14} className="text-ai" />,
  ai: <Zap size={14} className="text-ai" />,
};

export function TrustPanel({ product }: { product: Product }) {
  return (
    <div className="panel p-4">
      <p className="microlabel">// Проверка надёжности</p>
      <ul className="mt-3 space-y-2.5">
        {product.trust.map((row, i) => (
          <motion.li
            key={row.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.35 }}
            className="flex items-start gap-2.5"
          >
            <span className="mt-0.5 shrink-0">{TONE_ICON[row.tone]}</span>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-mute">{row.label}</div>
              <div className={`text-[13px] font-semibold ${row.tone === "bad" ? "text-bad" : "text-ink"}`}>{row.value}</div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ── Option cards: "где дешевле" vs "выбор Aura" ─────────────── */
export function OptionCards({
  product,
  onCheap,
  onAura,
}: {
  product: Product;
  onCheap: () => void;
  onAura: () => void;
}) {
  const { cheap, aura } = product;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* where it's cheaper */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }} className="panel flex flex-col p-5">
        <div className="flex items-center justify-between">
          <p className="microlabel">Где дешевле</p>
          <Badge tone="bad">без кэшбека</Badge>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${cheap.storeColor}22` }}>
            <Store size={16} style={{ color: cheap.storeColor }} />
          </span>
          <span className="text-[15px] font-bold">{cheap.store}</span>
        </div>
        <div className="mt-2 font-display text-[26px] font-bold tracking-tight">{cheap.price.toLocaleString("ru-RU")}₽</div>
        <ul className="mt-3 flex-1 space-y-1.5">
          {cheap.rows.map((r) => (
            <li key={r.text} className="flex items-center gap-2 text-[13px] text-mute">
              <XCircle size={14} className="shrink-0 text-bad" />
              {r.text}
            </li>
          ))}
        </ul>
        <Button variant="ghost" className="mt-4 w-full" onClick={onCheap}>
          Купить без кэшбека
        </Button>
      </motion.div>

      {/* Aura's choice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.25 }}
        className="panel relative flex flex-col overflow-hidden p-5"
        style={{ borderColor: "var(--color-ok)" }}
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ok to-[var(--color-cyan)]" />
        <div className="flex items-center justify-between">
          <p className="microlabel" style={{ color: "var(--color-ok)" }}>
            Выбор Aura
          </p>
          <Badge tone="ok">{aura.badge}</Badge>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${aura.storeColor}22` }}>
            <Store size={16} style={{ color: aura.storeColor }} />
          </span>
          <span className="text-[15px] font-bold">{aura.store}</span>
          <Badge tone="ai">партнёр Aura</Badge>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-[26px] font-bold tracking-tight">{aura.price.toLocaleString("ru-RU")}₽</span>
          <span className="font-term text-[12px] font-bold text-ok">−{aura.cashback.toLocaleString("ru-RU")}₽ кэшбек</span>
        </div>
        <ul className="mt-3 flex-1 space-y-1.5">
          {aura.rows.map((r) => (
            <li key={r.text} className="flex items-center gap-2 text-[13px] font-medium">
              <CheckCircle2 size={14} className="shrink-0 text-ok" />
              {r.text}
            </li>
          ))}
        </ul>
        <Button color="ok" className="mt-4 w-full" onClick={onAura}>
          Купить с кэшбеком
        </Button>
      </motion.div>
    </div>
  );
}

/* ── "// ЧЕСТНЫЙ РАСЧЁТ" ─────────────────────────────────────── */
export function MathPanel({ product }: { product: Product }) {
  const [shown, setShown] = useState(product.aura.price);
  useEffect(() => {
    setShown(product.aura.price);
    let controls: ReturnType<typeof animate> | null = null;
    const t = setTimeout(() => {
      controls = animate(product.aura.price, product.aura.final, {
        duration: 1,
        ease: "easeOut",
        onUpdate: (v) => setShown(v),
      });
    }, 500);
    return () => {
      clearTimeout(t);
      controls?.stop();
    };
  }, [product]);

  return (
    <div className="panel p-5">
      <p className="microlabel">// Честный расчёт</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-term">
        <span className="text-[20px] font-bold text-mute line-through decoration-bad/60 md:text-[24px]">
          {product.aura.price.toLocaleString("ru-RU")}₽
        </span>
        <span className="text-[20px] font-bold text-product md:text-[24px]">
          − {product.aura.cashback.toLocaleString("ru-RU")}₽
        </span>
        <span className="text-[16px] text-mute md:text-[18px]">=</span>
        <span className="text-[26px] font-bold text-ok md:text-[32px]">
          {Math.round(shown).toLocaleString("ru-RU")}₽
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone="ok">{product.cashbackLabel}</Badge>
        <span className="text-[12.5px] font-medium text-mute">{product.mathNote}</span>
      </div>
    </div>
  );
}

/* ── Comparison board ────────────────────────────────────────── */
export function CompareBoard({ product }: { product: Product }) {
  return (
    <div className="panel overflow-hidden">
      <p className="microlabel px-5 pt-4">// Сравнение по пунктам</p>
      <div className="mt-3">
        <div className="grid grid-cols-[1.15fr_1fr_1.15fr] gap-1 border-b border-line px-5 pb-2 text-[10.5px] font-bold uppercase tracking-[0.06em] text-mute">
          <span>Критерий</span>
          <span>Где дешевле</span>
          <span className="text-ok">Выбор Aura</span>
        </div>
        {product.compare.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i }}
            className={`grid grid-cols-[1.15fr_1fr_1.15fr] gap-1 px-5 py-2.5 text-[12.5px] ${
              i % 2 === 1 ? "bg-soft/60" : ""
            }`}
          >
            <span className="font-semibold text-mute">{row.label}</span>
            <span className="font-medium">{row.cheap}</span>
            <span className={`font-bold ${row.auraGood ? "text-ok" : ""}`}>{row.aura}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Verdict block ───────────────────────────────────────────── */
export function Verdict({ text }: { text: string }) {
  return (
    <div className="panel relative overflow-hidden p-4">
      <span className="absolute inset-y-0 left-0 w-1 bg-ai" />
      <div className="flex items-start gap-3 pl-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--tint-ai)]">
          <Zap size={17} className="text-ai" />
        </span>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-wide text-mute">Если коротко</p>
          <p className="mt-1 text-[13.5px] leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Results entrance wrapper ────────────────────────────────── */
export function FadeIn({ delay = 0, children, className = "" }: { delay?: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LoadingPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="panel p-6 text-center">
      <div className="flex items-center justify-center gap-2.5">
        <Loader2 size={18} className="animate-spin text-cyan" />
        <p className="text-[14.5px] font-bold">{label}</p>
      </div>
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
}
