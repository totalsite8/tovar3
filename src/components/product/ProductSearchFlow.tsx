import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Loader2, ExternalLink, ShieldCheck } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { PRODUCTS, type Product } from "../../data/mockProducts";
import { StepsPanel, PriceChart, TrustPanel, OptionCards, MathPanel, CompareBoard, Verdict, FadeIn, LoadingPanel } from "./dashboard";
import { Button, Badge, Modal } from "../ui";

const PHASE_TIMES = [900, 1800, 3600, 5000]; // boundaries between the 5 steps

export function ProductSearchFlow() {
  const navigate = useNavigate();
  const query = useAppStore((s) => s.searchQuery);
  const mode = useAppStore((s) => s.searchMode);
  const gift = useAppStore((s) => s.giftAnswers);
  const addPoints = useAppStore((s) => s.addPoints);
  const showToast = useAppStore((s) => s.showToast);

  const [runKey, setRunKey] = useState(0);
  const [phase, setPhase] = useState(0); // 0..4 (4 = results)
  const [modal, setModal] = useState<"none" | "cashback-confirm" | "cashback-processing" | "cashback-done" | "cheap">("none");

  const product: Product = useMemo(() => {
    if (mode === "gift") return PRODUCTS.gift;
    const q = query.toLowerCase();
    if (q.includes("honor") || q.includes("magic")) return PRODUCTS.honor;
    return PRODUCTS.airpods;
  }, [mode, query]);

  /* staged loading */
  useEffect(() => {
    console.log("[Aura] Search dashboard started →", { query, mode });
    setPhase(0);
    const timers = PHASE_TIMES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, [runKey, query, mode]);

  const results = phase >= 4;

  const giftSummary =
    mode === "gift"
      ? `подарок для ${gift.hobbySummary ?? "геймера"}, ${gift.budget ?? "до 3 000₽"}, ${gift.kind === "Для эмоций" ? "для эмоций" : "практичный"}`
      : null;

  const buyWithCashback = () => {
    console.log("[Aura] Purchase with cashback:", product.aura.store, product.aura.price + "₽");
    setModal("cashback-confirm");
  };

  const confirmCashback = () => {
    setModal("cashback-processing");
    setTimeout(() => {
      addPoints(product.aura.cashback, `Кэшбэк: ${product.title} (${product.aura.store})`);
      setModal("cashback-done");
      showToast(`+${product.aura.cashback.toLocaleString("ru-RU")}₽ кэшбека в кошельке 🎉`, "ok");
    }, 1400);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 pt-6 md:px-8">
      {/* header row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex min-h-10 items-center gap-1 rounded-xl px-2 text-[13.5px] font-semibold text-mute transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} /> Назад
        </button>
        <div className="flex items-center gap-2">
          {giftSummary && <Badge tone="product">🎯 Ищу: {giftSummary}</Badge>}
          <Button variant="ghost" small onClick={() => setRunKey((k) => k + 1)}>
            <RotateCcw size={14} /> Проиграть загрузку
          </Button>
        </div>
      </div>

      {/*
        Desktop: left 380px + right flexible.
        Mobile stack order: steps → product → options → math → table → chart → trust → actions
      */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
        {/* 1 · steps */}
        <div className="lg:col-start-1 lg:row-start-1">
          <StepsPanel phaseIdx={Math.min(phase, 4)} />
        </div>

        {/* 2 · product header */}
        <div className="lg:col-start-2 lg:row-start-1">
          <FadeIn delay={0.05}>
            <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className={`grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-5xl ${product.gradient}`}>
                <span className="drop-shadow-sm">{product.emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-[22px] font-bold tracking-tight md:text-[26px]">{product.title}</h1>
                  {results && (
                    <motion.span initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }}>
                      <Badge tone="ok">Кэшбэк найден</Badge>
                    </motion.span>
                  )}
                </div>
                <p className="mt-1 font-term text-[12px] font-semibold text-mute">
                  {product.category} · источников: {product.sources} · запрос: «{query}»
                </p>
              </div>
            </div>
          </FadeIn>
          {results && (
            <FadeIn delay={0.2} className="mt-4">
              <Verdict text={product.verdict} />
            </FadeIn>
          )}
        </div>

        {/* 3 · options */}
        <div className="lg:col-start-2 lg:row-start-2">
          {results ? (
            <OptionCards
              product={product}
              onCheap={() => {
                console.log("[Aura] Cheap option clicked:", product.cheap.store);
                setModal("cheap");
              }}
              onAura={buyWithCashback}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="panel animate-pulse p-5">
                  <div className="h-3 w-24 rounded bg-soft" />
                  <div className="mt-4 h-7 w-32 rounded bg-soft" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-soft" />
                    <div className="h-3 w-4/5 rounded bg-soft" />
                    <div className="h-3 w-3/5 rounded bg-soft" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4 · math */}
        <div className="lg:col-start-2 lg:row-start-3">
          {results ? (
            <FadeIn delay={0.15}>
              <MathPanel product={product} />
            </FadeIn>
          ) : (
            <LoadingPanel label={phase < 2 ? "Сканирую маркетплейсы и индексы цен…" : "Торгуюсь за кэшбек…"}>
              <motion.p key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-[12.5px] text-mute">
                {phase === 0 && "Понимаю, что именно вам нужно"}
                {phase === 1 && "Категория зафиксирована, ищу везде"}
                {phase === 2 && `Уже ${product.sources} источников в работе`}
                {phase === 3 && "Партнёр подтверждает размер кэшбека"}
              </motion.p>
            </LoadingPanel>
          )}
        </div>

        {/* 5 · comparison table */}
        <div className="lg:col-start-2 lg:row-start-4">
          {results && (
            <FadeIn delay={0.25}>
              <CompareBoard product={product} />
            </FadeIn>
          )}
        </div>

        {/* 6 · price chart (left col, row 2) */}
        <div className="lg:col-start-1 lg:row-start-2">
          {results && (
            <FadeIn delay={0.2}>
              <PriceChart product={product} />
            </FadeIn>
          )}
        </div>

        {/* 7 · trust (left col, row 3) */}
        <div className="lg:col-start-1 lg:row-start-3">
          {results && (
            <FadeIn delay={0.3}>
              <TrustPanel product={product} />
            </FadeIn>
          )}
        </div>

        {/* 8 · actions (after table) */}
        {results && (
          <div className="lg:col-start-2 lg:row-start-5">
            <FadeIn delay={0.35}>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Button color="ok" className="flex-1 min-h-[52px]! text-[16px]" onClick={buyWithCashback}>
                  Купить с кэшбеком · +{product.aura.cashback.toLocaleString("ru-RU")}₽
                </Button>
                <Button variant="ghost" className="sm:w-64" onClick={() => setModal("cheap")}>
                  Купить без кэшбека
                </Button>
              </div>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-mute">
                <ShieldCheck size={13} className="text-ok" />
                Кэшбэк придёт в кошелёк Aura сразу после подтверждения заказа (демо — мгновенно)
              </p>
            </FadeIn>
          </div>
        )}
      </div>

      {/* ── Cashback purchase modal ── */}
      <Modal open={modal.startsWith("cashback")} onClose={() => setModal("none")}>
        {modal === "cashback-confirm" && (
          <div>
            <Badge tone="ok">Партнёр Aura</Badge>
            <h3 className="mt-2 text-[17px] font-bold">Переход на {product.aura.store}</h3>
            <div className="mt-3 space-y-1.5 rounded-xl bg-soft p-3.5 text-[13.5px]">
              <div className="flex justify-between"><span className="text-mute">Товар</span><span className="font-semibold">{product.title}</span></div>
              <div className="flex justify-between"><span className="text-mute">Цена</span><span className="font-semibold">{product.aura.price.toLocaleString("ru-RU")}₽</span></div>
              <div className="flex justify-between"><span className="text-mute">Кэшбэк в кошелёк</span><span className="font-bold text-ok">+{product.aura.cashback.toLocaleString("ru-RU")}₽</span></div>
              <div className="flex justify-between border-t border-line pt-1.5"><span className="text-mute">Итоговая цена</span><span className="font-display font-bold text-ok">{product.aura.final.toLocaleString("ru-RU")}₽</span></div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button color="ok" onClick={confirmCashback}>Перейти к оплате</Button>
              <Button variant="soft" onClick={() => setModal("none")}>Отмена</Button>
            </div>
          </div>
        )}
        {modal === "cashback-processing" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 size={32} className="animate-spin text-ok" />
            <p className="text-[14.5px] font-bold">Открываю {product.aura.store}…</p>
            <p className="text-[12.5px] text-mute">Партнёрская ссылка активирована (демо)</p>
          </div>
        )}
        {modal === "cashback-done" && (
          <div className="flex flex-col items-center py-2 text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 13 }} className="grid h-16 w-16 place-items-center rounded-full bg-[var(--tint-ok)] text-3xl">
              🎉
            </motion.span>
            <h3 className="mt-3 text-[17px] font-bold">Кэшбэк уже в кошельке</h3>
            <p className="mt-1.5 text-[13.5px] text-mute">
              Начислено <b className="text-ok">+{product.aura.cashback.toLocaleString("ru-RU")}₽</b>. В реальном приложении кэшбэк приходит после подтверждения заказа магазином.
            </p>
            <div className="mt-4 flex w-full flex-col gap-2">
              <Button color="ok" onClick={() => setModal("none")}>Отлично</Button>
              <Button variant="soft" onClick={() => { setModal("none"); navigate("/wallet"); }}>Открыть кошелёк</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Cheap option warning modal ── */}
      <Modal open={modal === "cheap"} onClose={() => setModal("none")}>
        <Badge tone="bad">⚠️ Самый дешёвый — с оговорками</Badge>
        <h3 className="mt-2 text-[17px] font-bold">{product.cheap.store}: {product.cheap.price.toLocaleString("ru-RU")}₽</h3>
        <ul className="mt-3 space-y-1.5 text-[13.5px] text-mute">
          {product.cheap.rows.map((r) => (
            <li key={r.text}>· {r.text}</li>
          ))}
          <li className="font-semibold text-bad">· без кэшбека Aura и без проверки серийного номера</li>
        </ul>
        <p className="mt-3 rounded-xl bg-soft p-3 text-[12.5px] text-mute">
          Выбор Aura выходит <b className="text-ink">на {(product.cheap.price - product.aura.final).toLocaleString("ru-RU")}₽ дешевле по факту</b> — с официальной гарантией. Но решать вам: показываем всё как есть.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setModal("none");
              showToast("Демо-режим: переход на маркетплейс отключён", "info");
            }}
          >
            <ExternalLink size={16} /> Всё равно перейти
          </Button>
          <Button color="ok" onClick={() => { setModal("none"); buyWithCashback(); }}>
            Лучше с кэшбеком
          </Button>
        </div>
      </Modal>

      <AnimatePresence>{/* reserved for future inline toasts */}</AnimatePresence>
    </div>
  );
}
