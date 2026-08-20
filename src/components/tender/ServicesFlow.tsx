import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FastForward,
  Loader2,
  Phone,
  Send,
  Sparkles,
  Building2,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { SCENARIOS, SERVICES_QUESTIONS, type ScenarioId, type Bid } from "../../data/mockTender";
import { SERVICES_FEED, SENT_REQUESTS } from "../../data/mockOrchestratorFeed";
import { SuggestionChips } from "../home/SuggestionChips";
import { Button, Badge, Modal, Label } from "../ui";

type Phase = "brief" | "tz" | "collect" | "compare";

const spring = { type: "spring" as const, stiffness: 100, damping: 15 };
const LEAD_PRICE = 1500;
const LAUNCH_COST = 100;

/* which feed item is "active" for each phase (index into SERVICES_FEED) */
const PHASE_ACTIVE: Record<Phase, number> = { brief: 0, tz: 1, collect: 5, compare: 6 };
/* items revealed over time during the collect phase [feedIndex, delayMs] */
const COLLECT_REVEALS: [number, number][] = [
  [2, 600],
  [3, 2000],
  [4, 4600],
  [5, 6800],
];

/* ── Typed ТЗ document ── */
function TzDocument({ lines, onDone }: { lines: string[]; onDone: () => void }) {
  const full = useMemo(() => lines.join("\n"), [lines]);
  const [chars, setChars] = useState(0);
  useEffect(() => {
    setChars(0);
    const iv = setInterval(() => {
      setChars((c) => {
        if (c >= full.length) {
          clearInterval(iv);
          return c;
        }
        return c + 2;
      });
    }, 16);
    return () => clearInterval(iv);
  }, [full]);
  useEffect(() => {
    if (chars >= full.length && full.length > 0) {
      const t = setTimeout(onDone, 300);
      return () => clearTimeout(t);
    }
  }, [chars, full, onDone]);
  return (
    <pre className="whitespace-pre-wrap rounded-xl bg-soft p-4 font-term text-[12.5px] leading-relaxed">
      {full.slice(0, chars)}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block h-[13px] w-[7px] translate-y-[2px] bg-service" />
    </pre>
  );
}

export function ServicesFlow() {
  const navigate = useNavigate();
  const city = useAppStore((s) => s.city);
  const points = useAppStore((s) => s.points);
  const spendPoints = useAppStore((s) => s.spendPoints);
  const showToast = useAppStore((s) => s.showToast);
  const presetScenario = useAppStore((s) => s.serviceScenario);
  const resetService = useAppStore((s) => s.resetService);

  const [phase, setPhase] = useState<Phase>("brief");
  const [qStep, setQStep] = useState(0);
  const [scenario, setScenario] = useState<ScenarioId | null>(presetScenario);
  const [answers, setAnswers] = useState<{ time: string | null; budget: string | null }>({ time: null, budget: null });
  const [tzTyped, setTzTyped] = useState(false);
  const [revealed, setRevealed] = useState(2); // feed items revealed (0,1 always)
  const [selectedBid, setSelectedBid] = useState<string | null>(null);
  const [payStage, setPayStage] = useState<"closed" | "pay" | "processing" | "done">("closed");

  const sc = scenario ? SCENARIOS[scenario] : null;

  useEffect(() => {
    console.log("[Aura] Services flow started, preset scenario:", presetScenario);
    setPhase("brief");
    setQStep(presetScenario ? 1 : 0);
    setScenario(presetScenario);
    setAnswers({ time: null, budget: null });
    setTzTyped(false);
    setRevealed(2);
    setSelectedBid(null);
    setPayStage("closed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* timed reveals during collect + auto-advance to compare */
  useEffect(() => {
    if (phase !== "collect") return;
    const timers = COLLECT_REVEALS.map(([idx, delay]) => setTimeout(() => setRevealed(idx + 1), delay));
    const done = setTimeout(() => {
      console.log("[Aura] Services: collection complete → compare");
      setPhase("compare");
    }, 8600);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [phase]);

  const tzLines = useMemo(() => {
    if (!sc) return [];
    return [
      `ТЕХНИЧЕСКОЕ ЗАДАНИЕ — ${sc.tzTitle.toUpperCase()}`,
      ...sc.tzLines,
      `Срок: ${answers.time ?? "не указан"}`,
      `Бюджет клиента: ${answers.budget ?? "не указан"}`,
      `Город: ${city}`,
    ];
  }, [sc, answers, city]);

  /* feed state */
  const feedActive = PHASE_ACTIVE[phase];
  const feedCount =
    phase === "compare" ? SERVICES_FEED.length : phase === "collect" ? revealed : Math.min(feedActive + 1, 2);
  const feedTimes = useMemo(() => {
    const base = Date.now();
    return SERVICES_FEED.map((f) =>
      new Date(base + f.minutesOffset * 60_000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  const question = SERVICES_QUESTIONS[qStep];
  const selectedAnswer =
    question.id === "scenario" ? scenario : question.id === "time" ? answers.time : answers.budget;

  const pickAnswer = (value: string) => {
    if (question.id === "scenario") {
      setScenario(value as ScenarioId);
      console.log("[Aura] Services scenario picked:", value);
    } else if (question.id === "time") {
      setAnswers((a) => ({ ...a, time: value }));
    } else {
      setAnswers((a) => ({ ...a, budget: value }));
    }
  };

  const nextQuestion = () => {
    if (qStep + 1 >= SERVICES_QUESTIONS.length) {
      console.log("[Aura] Briefing complete → ТЗ");
      setPhase("tz");
    } else {
      setQStep((s) => s + 1);
    }
  };

  const launch = () => {
    if (!spendPoints(LAUNCH_COST, `Подбор услуги: ${sc?.label ?? "услуга"}`)) {
      showToast(`Не хватает баллов: запуск стоит ${LAUNCH_COST}. Загляните в «Мои баллы»`, "err");
      return;
    }
    showToast(`Заявки отправляются: −${LAUNCH_COST} баллов`, "ok");
    setPhase("collect");
  };

  const chosen: Bid | null = sc?.bids.find((b) => b.id === selectedBid) ?? sc?.bids.find((b) => b.recommended) ?? null;

  const pay = () => {
    setPayStage("processing");
    setTimeout(() => {
      setPayStage("done");
      console.log("[Aura] Lead paid:", LEAD_PRICE + "₽ →", chosen?.company);
      showToast("Оплата прошла (демо). Контакт получен!", "ok");
    }, 1300);
  };

  const respondedSoFar = phase === "compare" ? 3 : Math.min(3, Math.max(0, revealed - 3));

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 pt-6 md:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex min-h-10 items-center gap-1 rounded-xl px-2 text-[13.5px] font-semibold text-mute transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> Назад
      </button>

      {/* header */}
      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[640px]">
          <p className="microlabel">// умный подбор подрядчиков</p>
          <h1 className="mt-2 font-display text-[26px] font-bold tracking-tight md:text-[34px]">Услуги</h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-mute">
            Нужно остеклить балкон, организовать переезд, собрать мебель или найти фотографа? Опишите
            задачу — я составлю понятное техзадание, отправлю его проверенным компаниям вашего города,
            сравню цены и подскажу, где прячут скрытые доплаты.
          </p>
        </div>
        {phase !== "brief" && sc && (
          <Badge tone="service" className="shrink-0">
            {sc.emoji} {sc.label} · {city}
          </Badge>
        )}
      </div>

      {/* wide grid: feed left, flow right */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        {/* ── left feed ── */}
        <div className="panel p-4 lg:sticky lg:top-20">
          <p className="microlabel">// Что я сейчас делаю</p>
          <ul className="mt-3 space-y-1">
            {SERVICES_FEED.map((item, i) => {
              const visible = i < feedCount;
              const active = phase !== "compare" && i === feedActive;
              const doneItem = visible && !active;
              if (!visible && phase !== "collect") return null;
              return (
                <AnimatePresence key={item.text}>
                  {visible && (
                    <motion.li
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...spring, delay: 0.04 }}
                      className="flex items-start gap-2.5 py-1"
                    >
                      <span
                        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md font-term text-[10px] font-bold ${
                          doneItem
                            ? "bg-[var(--tint-ok)] text-ok"
                            : active
                              ? "bg-[var(--tint-service)] text-service"
                              : "bg-soft text-mute"
                        }`}
                      >
                        {doneItem ? <CheckCircle2 size={13} /> : active ? <Loader2 size={12} className="animate-spin" /> : `0${i + 1}`}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className={`block text-[13px] font-medium ${active ? "font-semibold text-ink" : doneItem ? "text-mute" : "text-mute/70"}`}>
                          {item.text}
                        </span>
                      </div>
                      {visible && <span className="shrink-0 font-term text-[10.5px] font-semibold text-mute">{feedTimes[i]}</span>}
                    </motion.li>
                  )}
                </AnimatePresence>
              );
            })}
          </ul>
          {(phase === "collect" || phase === "compare") && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-soft px-3 py-2 font-term text-[11px] font-bold">
              <span className="text-mute">Отправлено заявок: {SENT_REQUESTS}</span>
              <span className="text-service">Ответов: {respondedSoFar}/3</span>
            </div>
          )}
        </div>

        {/* ── right flow ── */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {/* BRIEFING */}
            {phase === "brief" && (
              <motion.div key="brief" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }} className="panel p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <p className="microlabel">// Вопрос {qStep + 1} из {SERVICES_QUESTIONS.length}</p>
                  {presetScenario && qStep === 0 && <Badge tone="service">выбрано из запроса</Badge>}
                </div>
                <h2 className="mt-2 text-[19px] font-bold tracking-tight">
                  {question.emoji} {question.title}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-2.5 xl:grid-cols-4">
                  {question.options.map((opt, i) => {
                    const active = selectedAnswer === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.05 * i }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => pickAnswer(opt.value)}
                        className={`min-h-[64px] rounded-xl border p-4 text-left text-[14.5px] font-bold transition-colors ${
                          active ? "border-service bg-[var(--tint-service)] text-ink" : "border-line bg-soft/60 text-mute hover:text-ink"
                        }`}
                        style={{ boxShadow: active ? "0 0 0 2px var(--tint-service)" : undefined }}
                      >
                        {opt.label}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  {qStep > 0 ? (
                    <Button variant="soft" small onClick={() => setQStep((s) => s - 1)}>
                      ← Назад
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Button color="service" onClick={nextQuestion} disabled={!selectedAnswer}>
                    {qStep + 1 === SERVICES_QUESTIONS.length ? "Составить техзадание" : "Дальше"}
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* TZ PREVIEW */}
            {phase === "tz" && sc && (
              <motion.div key="tz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }}>
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-service" />
                  <h2 className="text-[17px] font-bold">Составляю техзадание…</h2>
                </div>
                <div className="mt-3">
                  <TzDocument lines={tzLines} onDone={() => setTzTyped(true)} />
                </div>
                <AnimatePresence>
                  {tzTyped && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
                      <div className="panel mt-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-[13.5px] font-bold">Стоимость запуска подбора</div>
                          <div className="text-[11.5px] text-mute">Верну баллы, если никто не ответит</div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="font-display text-[17px] font-bold text-service">{LAUNCH_COST} баллов</div>
                          <div className="font-term text-[11.5px] font-semibold text-mute">баланс: {points}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
                        <Button variant="ghost" onClick={() => { setPhase("brief"); setTzTyped(false); }}>
                          Изменить ответы
                        </Button>
                        <Button color="service" className="flex-1" onClick={launch} disabled={points < LAUNCH_COST}>
                          <Send size={17} /> Отправить подрядчикам
                        </Button>
                      </div>
                      {points < LAUNCH_COST && (
                        <button type="button" onClick={() => navigate("/wallet")} className="mt-2 w-full text-center text-[12px] font-bold text-bad underline-offset-4 hover:underline">
                          Не хватает баллов — открыть «Мои баллы»
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* COLLECT */}
            {phase === "collect" && sc && (
              <motion.div key="collect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} className="h-2.5 w-2.5 rounded-full bg-ok" />
                    <h2 className="text-[17px] font-bold">Заявки в работе</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setRevealed(6); setPhase("compare"); }}
                    className="flex min-h-9 items-center gap-1 rounded-lg px-2 text-[12px] font-bold text-service transition-colors hover:bg-[var(--tint-service)]"
                  >
                    <FastForward size={14} /> Пропустить
                  </button>
                </div>
                <div className="mt-4 space-y-2.5">
                  {sc.bids.map((bid, i) => {
                    const shownAt = [4, 5, 6][i];
                    if (revealed < shownAt) return null;
                    return (
                      <div key={bid.id}>
                        <motion.div
                          initial={{ opacity: 0, x: -24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={spring}
                          className="panel flex items-center justify-between p-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--tint-service)]">
                              <Building2 size={18} className="text-service" />
                            </span>
                            <div>
                              <div className="text-[14px] font-bold">{bid.company}</div>
                              <div className="text-[11.5px] text-mute">ответили на заявку</div>
                            </div>
                          </div>
                          <span className="font-display text-[17px] font-bold">{bid.base.toLocaleString("ru-RU")}₽</span>
                        </motion.div>
                        {bid.hidden > 0 && revealed >= shownAt + 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-2 flex items-start gap-2 rounded-xl border border-bad/40 bg-[var(--tint-bad)] p-3 text-[12.5px] font-semibold text-bad"
                          >
                            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                            Нашла скрытую доплату: {bid.company} не включила «{bid.hiddenNote}» (+{bid.hidden.toLocaleString("ru-RU")}₽)
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* COMPARE */}
            {phase === "compare" && sc && (
              <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }}>
                <p className="microlabel">// Сравнение предложений</p>
                <h2 className="mt-1 font-display text-[21px] font-bold tracking-tight">Кто что предложил</h2>
                <p className="mt-1 text-[12.5px] text-mute">Нажмите на строку, чтобы выбрать подрядчика</p>

                {/* header */}
                <div className="mt-4 hidden grid-cols-[1.3fr_0.9fr_1.1fr_0.95fr_0.8fr] gap-2 px-4 text-[10.5px] font-bold uppercase tracking-[0.06em] text-mute md:grid">
                  <span>Компания</span>
                  <span className="text-right">Цена</span>
                  <span className="text-right">Скрытые доплаты</span>
                  <span className="text-right">Итого</span>
                  <span className="text-right">Надёжность</span>
                </div>

                <div className="mt-2 space-y-2.5">
                  {sc.bids.map((bid, i) => {
                    const isSel = (selectedBid ?? sc.bids.find((b) => b.recommended)?.id) === bid.id;
                    return (
                      <motion.button
                        key={bid.id}
                        type="button"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.1 * i }}
                        onClick={() => {
                          setSelectedBid(bid.id);
                          console.log("[Aura] Bid selected:", bid.company);
                        }}
                        className={`panel block w-full p-4 text-left transition-all md:grid md:grid-cols-[1.3fr_0.9fr_1.1fr_0.95fr_0.8fr] md:items-center md:gap-2 ${
                          isSel ? "ring-2 ring-service" : "hover:-translate-y-0.5"
                        }`}
                        style={{ background: bid.recommended ? "var(--tint-service)" : undefined, borderColor: bid.recommended ? "var(--color-service)" : undefined }}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[14px] font-bold">{bid.company}</span>
                            {bid.recommended && <Badge tone="service">Рекомендую</Badge>}
                          </div>
                          <div className="text-[11px] text-mute">срок: {bid.term}</div>
                        </div>
                        <div className="mt-2 text-[13px] font-semibold md:mt-0 md:text-right">
                          <span className="text-mute md:hidden">Цена: </span>
                          {bid.base.toLocaleString("ru-RU")}₽
                        </div>
                        <div className={`mt-1 flex items-center gap-1 text-[12.5px] font-bold md:mt-0 md:justify-end ${bid.hidden > 0 ? "text-bad" : "text-mute"}`}>
                          {bid.hidden > 0 ? (
                            <>
                              <AlertTriangle size={12} className="shrink-0" />
                              +{bid.hidden.toLocaleString("ru-RU")}₽ {bid.hiddenNote}
                            </>
                          ) : (
                            <span>—</span>
                          )}
                        </div>
                        <div className={`mt-1 font-display text-[15px] font-bold md:mt-0 md:text-right ${bid.recommended ? "text-service" : ""}`}>
                          <span className="font-term text-[11px] font-semibold text-mute md:hidden">Итого: </span>
                          {bid.total.toLocaleString("ru-RU")}₽
                        </div>
                        <div className="mt-1 md:mt-0 md:text-right">
                          <span className={`font-term text-[13px] font-bold ${bid.reliability >= 85 ? "text-ok" : "text-bad"}`}>
                            {bid.reliability >= 85 ? "⭐ " : "⚠ "}
                            {bid.reliability}%
                          </span>
                        </div>
                        {bid.hidden > 0 && (
                          <p className="col-span-full mt-2 rounded-lg bg-[var(--tint-bad)] px-2.5 py-1 text-[11px] font-semibold text-bad">
                            Итог выше, чем кажется на первый взгляд: цена без «{bid.hiddenNote}»
                          </p>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.45 }} className="mt-5">
                  <Button color="service" className="w-full min-h-[52px]! text-[16px]" onClick={() => setPayStage("pay")}>
                    Выбрать подрядчика{chosen ? `: ${chosen.company}` : ""}
                  </Button>
                  <p className="mt-2 text-center text-[11.5px] text-mute">Разовая оплата за подбор · не подписка</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* service chips */}
      <div className="mt-14">
        <SuggestionChips groups="services" />
      </div>

      {/* ── payment modal ── */}
      <Modal open={payStage !== "closed"} onClose={() => payStage !== "processing" && setPayStage("closed")} hideClose={payStage === "processing"}>
        {payStage === "pay" && chosen && (
          <div className="text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="inline-block text-4xl">
              🎉
            </motion.span>
            <h3 className="mt-2 text-[18px] font-bold">Отличный выбор!</h3>
            <p className="mt-1.5 text-[13.5px] text-mute">
              Подрядчик получит ваш контакт после оплаты заявки. Это <b>не подписка</b> — разовая оплата за подбор.
            </p>
            <div className="mt-4 space-y-1.5 rounded-xl bg-soft p-3.5 text-[13.5px]">
              <div className="flex justify-between"><span className="text-mute">Подрядчик</span><span className="font-bold">{chosen.company}</span></div>
              <div className="flex justify-between"><span className="text-mute">Смета</span><span className="font-bold">{chosen.total.toLocaleString("ru-RU")}₽</span></div>
              <div className="flex justify-between"><span className="text-mute">Оплата заявки</span><span className="font-display text-[16px] font-bold text-service">{LEAD_PRICE.toLocaleString("ru-RU")}₽</span></div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button color="service" onClick={pay}>Оплатить и получить контакт</Button>
              <Button variant="soft" onClick={() => setPayStage("closed")}>Подождать</Button>
            </div>
          </div>
        )}
        {payStage === "processing" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 size={30} className="animate-spin text-service" />
            <p className="text-[14.5px] font-bold">Обрабатываю оплату…</p>
            <p className="text-[12px] text-mute">Демо-платёж, деньги не списываются</p>
          </div>
        )}
        {payStage === "done" && chosen && (
          <div className="text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 13 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--tint-ok)]">
              <CheckCircle2 size={32} className="text-ok" />
            </motion.span>
            <h3 className="mt-3 text-[18px] font-bold">Контакт разблокирован</h3>
            <div className="mt-4 rounded-xl bg-soft p-4 text-left">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--tint-service)]">
                  <Phone size={20} className="text-service" />
                </span>
                <div>
                  <div className="text-[14.5px] font-bold">{chosen.company} · менеджер Алексей</div>
                  <div className="font-term text-[13.5px] font-semibold text-service">+7 (900) 123-45-67</div>
                </div>
              </div>
              <p className="mt-2.5 text-[11.5px] text-mute">Подрядчик уведомлён о заказе и увидит ваш номер.</p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button color="ok" onClick={() => setPayStage("closed")}>Отлично</Button>
              <Button variant="soft" onClick={() => { setPayStage("closed"); navigate("/bid/win-302"); }}>
                Как это видит подрядчик
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* reset helper */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            resetService();
            setPhase("brief");
            setQStep(0);
            setScenario(null);
            setAnswers({ time: null, budget: null });
            setTzTyped(false);
            setRevealed(2);
            setSelectedBid(null);
          }}
          className="text-[12px] font-bold text-mute underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          ↺ Пройти сценарий заново
        </button>
      </div>

      <div className="mt-8">
        <Label className="text-center">Aura · подбор услуг · демо</Label>
      </div>
    </div>
  );
}
