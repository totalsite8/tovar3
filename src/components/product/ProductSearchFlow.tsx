import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Search, ChartColumn, Bot, ArrowLeft, RotateCcw, Loader2, ExternalLink, Info } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { PRODUCTS, EXTRA_VARIANTS, type ProductOption } from "../../data/mockProducts";
import { ProductCard } from "./ProductCard";
import { Button, Badge, Modal, ProgressBar, Label } from "../ui";

type Phase = "analyze" | "scan" | "filter" | "results";

const SCANNED_STORES = [
  { name: "Ozon", color: "#005BFF" },
  { name: "DNS", color: "#F9A825" },
  { name: "Яндекс.Маркет", color: "#FFCC00" },
  { name: "Ситилинк", color: "#EA1B25" },
  { name: "Wildberries", color: "#CB11AB" },
];

export function ProductSearchFlow() {
  const navigate = useNavigate();
  const query = useAppStore((s) => s.searchQuery);
  const mode = useAppStore((s) => s.searchMode);
  const gift = useAppStore((s) => s.giftAnswers);
  const addPoints = useAppStore((s) => s.addPoints);
  const showToast = useAppStore((s) => s.showToast);

  const [phase, setPhase] = useState<Phase>("analyze");
  const [runKey, setRunKey] = useState(0);
  const [filterProgress, setFilterProgress] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);
  const [purchase, setPurchase] = useState<{
    option: ProductOption;
    stage: "confirm" | "processing" | "done" | "external";
  } | null>(null);

  const product = useMemo(() => {
    if (mode === "gift") return PRODUCTS.gift;
    const q = query.toLowerCase();
    if (q.includes("honor") || q.includes("magic")) return PRODUCTS.honor;
    return PRODUCTS.sony;
  }, [mode, query]);

  /* ── progressive loading state machine ── */
  useEffect(() => {
    console.log("[Aura] Search flow started →", { query, mode });
    setPhase("analyze");
    setFilterProgress(0);
    setShowMore(false);
    const startedAt = Date.now();
    const t1 = setTimeout(() => setPhase("scan"), 1000);
    const t2 = setTimeout(() => setPhase("filter"), 3000);
    const t3 = setTimeout(() => setPhase("results"), 5000);
    const iv = setInterval(() => {
      /* filter window runs from t=3s to t=5s */
      const elapsed = Date.now() - startedAt - 3000;
      setFilterProgress(Math.min(100, Math.max(0, (elapsed / 2000) * 100)));
    }, 50);
    return () => {
      [t1, t2, t3].forEach(clearTimeout);
      clearInterval(iv);
    };
  }, [runKey, query, mode]);

  const giftSummary =
    mode === "gift"
      ? `подарок для ${gift.hobbySummary ?? "геймера"}, ${gift.budget ?? "до 3 000₽"}, ${
          gift.kind === "Для эмоций" ? "для эмоций" : "практичный"
        }`
      : null;

  const openPurchase = (option: ProductOption) => {
    console.log("[Aura] Purchase intent:", option.store, option.price + "₽", option.isPartner ? "(partner)" : "(direct)");
    setPurchase({ option, stage: option.isPartner ? "confirm" : "external" });
  };

  const confirmPurchase = () => {
    if (!purchase) return;
    setPurchase({ ...purchase, stage: "processing" });
    setTimeout(() => {
      addPoints(purchase.option.cashbackPoints, `Покупка: ${product.title} (${purchase.option.store})`);
      setPurchase((p) => (p ? { ...p, stage: "done" } : p));
      showToast(`+${purchase.option.cashbackPoints} баллов начислено 🎉`, "ok");
    }, 1400);
  };

  return (
    <div className="mx-auto w-full max-w-[480px] px-5 pt-6">
      {/* header */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex min-h-10 items-center gap-1 rounded-xl px-2 text-[13.5px] font-semibold text-mute transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} /> Назад
        </button>
        <Button variant="ghost" small onClick={() => setRunKey((k) => k + 1)}>
          <RotateCcw size={14} /> Проиграть загрузку
        </Button>
      </div>

      <div className="mt-4">
        <Label>Запрос</Label>
        <h1 className="mt-1 font-display text-[22px] font-bold leading-tight tracking-tight">
          «{query}»
        </h1>
        {giftSummary && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <Badge tone="product">🎯 Ищу: {giftSummary}</Badge>
          </motion.div>
        )}
      </div>

      {/* ── Phase panels ── */}
      <AnimatePresence mode="wait">
        {phase !== "results" && (
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="surface mt-6 rounded-2xl border border-line bg-card p-6 text-center shadow-card"
          >
            {phase === "analyze" && (
              <div className="flex flex-col items-center gap-3 py-6">
                <motion.span
                  animate={{ scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-[var(--tint-ai)]"
                >
                  <Brain size={30} className="text-ai" />
                </motion.span>
                <p className="text-[15px] font-bold">🧠 Анализирую запрос...</p>
                <p className="text-[12.5px] text-mute">Понимаю, что именно вам нужно</p>
              </div>
            )}

            {phase === "scan" && (
              <div className="py-2">
                <p className="flex items-center justify-center gap-2 text-[15px] font-bold">
                  <Search size={17} className="animate-pulse text-product" />
                  Сканирую маркетплейсы и веб...
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  {SCANNED_STORES.map((s, i) => (
                    <motion.span
                      key={s.name}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 * i }}
                      className="surface flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-[12px] font-bold shadow-sm"
                    >
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.3 * i }}
                        className="h-2 w-2 rounded-full"
                        style={{ background: s.color }}
                      />
                      {s.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {phase === "filter" && (
              <div className="py-2">
                <p className="flex items-center justify-center gap-2 text-[15px] font-bold">
                  <ChartColumn size={17} className="text-service" />
                  Нашёл {product.totalFound} вариантов. Фильтрую по рейтингу...
                </p>
                <ProgressBar
                  value={filterProgress}
                  color="linear-gradient(90deg, #F97316, #F59E0B)"
                  className="mt-5"
                />
                <p className="mt-2 text-[12px] font-medium text-mute">
                  Убираю продавцов с рейтингом ниже 4.0 · проверяю оригинальность
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ── */}
      {phase === "results" && (
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <Label>
              {product.totalFound} вариантов · топ-3 по выгоде
            </Label>
            <Badge tone="ok">✓ баллы учтены</Badge>
          </motion.div>

          <div className="mt-3 space-y-4">
            {product.options.map((o, i) => (
              <ProductCard
                key={o.id}
                product={product}
                option={o}
                highlighted={i === 0}
                delay={0.12 + i * 0.5}
                onBuy={openPurchase}
              />
            ))}
          </div>

          {/* AI verdict */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 1.7 }}
            className="surface relative mt-4 overflow-hidden rounded-2xl border border-line bg-card p-5 shadow-card"
          >
            <span className="absolute inset-y-0 left-0 w-1.5 bg-ai" />
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--tint-ai)]">
                <Bot size={20} className="text-ai" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-bold">Вердикт ИИ</span>
                  <Badge tone="ai">честный разбор</Badge>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">{product.aiVerdict}</p>
              </div>
            </div>
          </motion.div>

          {/* extras */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mt-5 flex flex-col gap-2.5"
          >
            <Button variant="ghost" onClick={() => setShowMore((v) => !v)}>
              {showMore ? "Свернуть" : `Показать ещё ${product.totalFound - 3} вариантов`}
            </Button>
            <AnimatePresence>
              {showMore && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="surface divide-y divide-[var(--border)] rounded-2xl border border-line bg-card shadow-card">
                    {EXTRA_VARIANTS.map((v, i) => (
                      <motion.div
                        key={v.store + i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between gap-2 px-4 py-2.5 text-[13px]"
                      >
                        <span className="font-semibold">{v.store}</span>
                        <span className="truncate text-[11.5px] text-mute">{v.note}</span>
                        <span className="font-bold">{v.price.toLocaleString("ru-RU")}₽</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button variant="soft" small onClick={() => setMathOpen(true)}>
              <Info size={15} /> Как мы считаем баллы?
            </Button>
          </motion.div>
        </div>
      )}

      {/* ── Purchase modal ── */}
      <Modal open={purchase !== null} onClose={() => setPurchase(null)}>
        {purchase && (
          <div>
            {purchase.stage === "external" && (
              <div>
                <Badge tone="warn">⚠️ Это не партнёр</Badge>
                <h3 className="mt-2 text-[17px] font-bold">Баллы не начислятся</h3>
                <p className="mt-1.5 text-[13.5px] text-mute">
                  Вы уйдёте на {purchase.option.store} по прямой ссылке. Цена{" "}
                  <b>{purchase.option.price.toLocaleString("ru-RU")}₽</b> — без кэшбека Aura.
                  Партнёрская ссылка выше выгоднее с учётом баллов.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setPurchase(null);
                      showToast("Демо-режим: переход на маркетплейс отключён", "info");
                    }}
                  >
                    <ExternalLink size={16} /> Всё равно перейти
                  </Button>
                  <Button variant="soft" onClick={() => setPurchase(null)}>
                    Вернуться к результатам
                  </Button>
                </div>
              </div>
            )}

            {purchase.stage === "confirm" && (
              <div>
                <Badge tone="product">Партнёрская ссылка</Badge>
                <h3 className="mt-2 text-[17px] font-bold">
                  Переход на {purchase.option.store}
                </h3>
                <div className="surface mt-3 space-y-1.5 rounded-xl bg-soft p-3.5 text-[13.5px]">
                  <div className="flex justify-between">
                    <span className="text-mute">Товар</span>
                    <span className="font-semibold">{product.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mute">Цена</span>
                    <span className="font-semibold">
                      {purchase.option.price.toLocaleString("ru-RU")}₽
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mute">Баллы после покупки</span>
                    <span className="font-bold text-ok">
                      +{purchase.option.cashbackPoints}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Button color="product" onClick={confirmPurchase}>
                    Перейти к оплате
                  </Button>
                  <Button variant="soft" onClick={() => setPurchase(null)}>
                    Отмена
                  </Button>
                </div>
              </div>
            )}

            {purchase.stage === "processing" && (
              <div className="flex flex-col items-center gap-3 py-6">
                <Loader2 size={32} className="animate-spin text-product" />
                <p className="text-[14.5px] font-bold">Открываю {purchase.option.store}...</p>
                <p className="text-[12.5px] text-mute">Партнёрская ссылка активирована (демо)</p>
              </div>
            )}

            {purchase.stage === "done" && (
              <div className="flex flex-col items-center py-2 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 13 }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-[var(--tint-ok)] text-3xl"
                >
                  🎉
                </motion.span>
                <h3 className="mt-3 text-[17px] font-bold">Покупка засчитана (демо)</h3>
                <p className="mt-1.5 text-[13.5px] text-mute">
                  Начислено <b className="text-ok">+{purchase.option.cashbackPoints} баллов</b>. В
                  реальном приложении баллы придут после подтверждения заказа.
                </p>
                <Button className="mt-4 w-full" color="ok" onClick={() => setPurchase(null)}>
                  Отлично
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Points math modal ── */}
      <Modal open={mathOpen} onClose={() => setMathOpen(false)}>
        <h3 className="text-[17px] font-bold">Как мы считаем баллы?</h3>
        <div className="mt-3 space-y-2.5 text-[13.5px] text-mute">
          <p>
            <b className="text-ink">1.</b> Партнёры (Ozon, Яндекс.Маркет...) платят Aura комиссию
            за покупку — обычно 2–8% от чека.
          </p>
          <p>
            <b className="text-ink">2.</b> Долю комиссии мы возвращаем вам баллами. Курс для
            витрины: <b className="text-ink">1 балл ≈ 10₽ эквивалента</b> в партнёрских ценах.
          </p>
          <p>
            <b className="text-ink">3.</b> Итог: <span className="font-semibold">24 500₽ − 120 баллов = эквивалент 23 300₽</span>.
            Вы не платите меньше на кассе — но баллы компенсируют разницу.
          </p>
          <p>
            <b className="text-ink">4.</b> Баллами можно оплатить запуск тендера на услуги или
            обменять на промокоды.
          </p>
        </div>
        <Button variant="soft" className="mt-4 w-full" onClick={() => setMathOpen(false)}>
          Понятно
        </Button>
      </Modal>
    </div>
  );
}
