import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Loader2, Phone, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { TENDER } from "../../data/mockTender";
import { TenderBriefing } from "./TenderBriefing";
import { OrchestratorRoom } from "./OrchestratorRoom";
import { ComparisonTable } from "./ComparisonTable";
import { Button, Badge, Modal, Label } from "../ui";

type Step = "brief" | "tz" | "room" | "compare";
const STEP_IDX: Record<Step, number> = { brief: 0, tz: 1, room: 2, compare: 3 };

const spring = { type: "spring" as const, stiffness: 100, damping: 15 };

/* ── Typed ТЗ document ── */
function TzDocument({ lines, onDone }: { lines: string[]; onDone: () => void }) {
  const full = useMemo(() => lines.join("\n"), [lines]);
  const [chars, setChars] = useState(0);

  useEffect(() => {
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
    <pre className="whitespace-pre-wrap rounded-xl bg-soft p-4 font-mono text-[12.5px] leading-relaxed">
      {full.slice(0, chars)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block h-[14px] w-[7px] translate-y-[2px] bg-service"
      />
    </pre>
  );
}

export function TenderFlow() {
  const navigate = useNavigate();
  const answers = useAppStore((s) => s.tenderAnswers);
  const resetTender = useAppStore((s) => s.resetTender);
  const points = useAppStore((s) => s.points);
  const spendPoints = useAppStore((s) => s.spendPoints);
  const city = useAppStore((s) => s.city);
  const showToast = useAppStore((s) => s.showToast);

  const [step, setStep] = useState<Step>("brief");
  const [tzTyped, setTzTyped] = useState(false);
  const [payStage, setPayStage] = useState<"closed" | "pay" | "processing" | "done">("closed");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    resetTender();
    setStep("brief");
    setTzTyped(false);
    setPaid(false);
    console.log("[Aura] Tender flow started");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tzLines = useMemo(
    () => [
      "ТЕХНИЧЕСКОЕ ЗАДАНИЕ",
      `Объект: 3-комн. квартира, ${answers.house ?? "панелька"}, 5 этаж`,
      `Окон: ${answers.windows ?? "4"} шт (стандарт 1300×1400)`,
      `Балкон: ${answers.balcony === "нет" ? "нет" : "да, остекление + обшивка"}`,
      "Профиль: не указан (ИИ рекомендует Rehau/Veka)",
      "Пожелания: москитные сетки, вынос мусора",
      `Город: ${city}`,
      `Бюджет клиента: ${answers.budget ?? "50–100к"}`,
    ],
    [answers, city]
  );

  const launch = () => {
    if (!spendPoints(100, "Запуск тендера: окна")) {
      showToast("Не хватает баллов: запуск тендера стоит 100. Загляните в Кошелёк", "err");
      return;
    }
    showToast("Тендер запущен: −100 баллов", "ok");
    setStep("room");
  };

  const pay = () => {
    setPayStage("processing");
    setTimeout(() => {
      setPayStage("done");
      setPaid(true);
      console.log("[Aura] Lead paid: 1 500₽ → ОкнаМастер contact unlocked");
      showToast("Оплата прошла (демо). Контакт получен!", "ok");
    }, 1300);
  };

  return (
    <div className="mx-auto w-full max-w-[480px] px-5 pt-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex min-h-10 items-center gap-1 rounded-xl px-2 text-[13.5px] font-semibold text-mute transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} /> Назад
        </button>
        <Badge tone="service">
          Тендер · шаг {STEP_IDX[step] + 1}/4
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--tint-service)]">
          <Building2 size={22} className="text-service" />
        </span>
        <div>
          <h1 className="font-display text-[20px] font-bold leading-tight tracking-tight">
            🪟 Окна под ключ
          </h1>
          <p className="text-[12.5px] text-mute">Подберу лучших подрядчиков в г. {city}</p>
        </div>
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {/* ── Step 1: briefing ── */}
          {step === "brief" && (
            <motion.div key="brief" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }}>
              <TenderBriefing onComplete={() => setStep("tz")} />
            </motion.div>
          )}

          {/* ── Step 2: ТЗ generation ── */}
          {step === "tz" && (
            <motion.div key="tz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }}>
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-service" />
                <h2 className="text-[17px] font-bold">ИИ составляет ТЗ...</h2>
              </div>
              <div className="mt-3">
                <TzDocument lines={tzLines} onDone={() => setTzTyped(true)} />
              </div>

              <AnimatePresence>
                {tzTyped && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring}
                    className="mt-4"
                  >
                    <div className="surface flex items-center justify-between rounded-2xl border border-line bg-card p-4 shadow-card">
                      <div>
                        <div className="text-[13px] font-bold">Стоимость запуска</div>
                        <div className="text-[11.5px] text-mute">Спишется сейчас, вернётся если подрядчиков не найдём</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-[17px] font-bold text-service">100 баллов</div>
                        <div className="text-[11.5px] font-semibold text-mute">баланс: {points}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2.5">
                      <Button variant="ghost" onClick={() => setStep("brief")}>
                        Изменить
                      </Button>
                      <Button
                        color="service"
                        className="flex-1"
                        onClick={launch}
                        disabled={points < 100}
                      >
                        <Send size={17} /> Отправить подрядчикам
                      </Button>
                    </div>
                    {points < 100 && (
                      <button
                        type="button"
                        onClick={() => navigate("/wallet")}
                        className="mt-2 w-full text-center text-[12px] font-bold text-bad underline-offset-4 hover:underline"
                      >
                        Не хватает баллов — открыть Кошелёк
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── Step 3: orchestrator room ── */}
          {step === "room" && (
            <motion.div key="room" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }}>
              <div className="mb-4 flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="h-2.5 w-2.5 rounded-full bg-ok"
                />
                <h2 className="text-[17px] font-bold">Агенты Aura работают</h2>
                <Badge tone="service">live</Badge>
              </div>
              <OrchestratorRoom onDone={() => setStep("compare")} />
            </motion.div>
          )}

          {/* ── Step 4: comparison ── */}
          {step === "compare" && (
            <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }}>
              {paid && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="surface mb-4 flex items-start gap-2.5 rounded-2xl border border-ok/40 bg-[var(--tint-ok)] p-4"
                >
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-ok" />
                  <div className="text-[13px]">
                    <b>Контакт ОкнаМастер получен.</b>{" "}
                    <span className="text-mute">Подрядчик свяжется до 18:00.</span>{" "}
                    <button
                      type="button"
                      onClick={() => navigate(`/bid/${TENDER.tenderId}`)}
                      className="mt-1 block font-bold text-service underline-offset-4 hover:underline"
                    >
                      Посмотреть, что видит подрядчик →
                    </button>
                  </div>
                </motion.div>
              )}
              <ComparisonTable onSelect={() => setPayStage("pay")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Payment gate modal ── */}
      <Modal
        open={payStage !== "closed"}
        onClose={() => payStage !== "processing" && setPayStage("closed")}
        hideClose={payStage === "processing"}
      >
        {payStage === "pay" && (
          <div className="text-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              className="inline-block text-4xl"
            >
              🎉
            </motion.span>
            <h3 className="mt-2 text-[18px] font-bold">Отличный выбор!</h3>
            <p className="mt-1.5 text-[13.5px] text-mute">
              Подрядчик получит ваш контакт после оплаты лида. Это <b>не подписка</b> — разовая
              оплата за подбор.
            </p>
            <div className="surface mt-4 rounded-xl bg-soft p-3.5 text-[13.5px]">
              <div className="flex justify-between">
                <span className="text-mute">Подрядчик</span>
                <span className="font-bold">ОкнаМастер</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-mute">Смета под ключ</span>
                <span className="font-bold">72 000₽</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-mute">Оплата лида</span>
                <span className="font-display text-[16px] font-bold text-service">
                  {TENDER.leadPrice.toLocaleString("ru-RU")}₽
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button color="service" onClick={pay}>
                Оплатить и получить контакт
              </Button>
              <Button variant="soft" onClick={() => setPayStage("closed")}>
                Подождать
              </Button>
            </div>
          </div>
        )}

        {payStage === "processing" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 size={30} className="animate-spin text-service" />
            <p className="text-[14.5px] font-bold">Обрабатываю оплату...</p>
            <p className="text-[12px] text-mute">Демо-платёж, деньги не списываются</p>
          </div>
        )}

        {payStage === "done" && (
          <div className="text-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 13 }}
              className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--tint-ok)]"
            >
              <CheckCircle2 size={32} className="text-ok" />
            </motion.span>
            <h3 className="mt-3 text-[18px] font-bold">Контакт разблокирован</h3>
            <div className="surface mt-4 rounded-xl bg-soft p-4 text-left">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--tint-service)]">
                  <Phone size={20} className="text-service" />
                </span>
                <div>
                  <div className="text-[14.5px] font-bold">ОкнаМастер · Алексей</div>
                  <div className="font-mono text-[13.5px] font-semibold text-service">
                    +7 (900) 123-45-67
                  </div>
                </div>
              </div>
              <p className="mt-2.5 text-[11.5px] text-mute">
                Подрядчик уведомлён о заказе #{TENDER.tenderId} и увидит ваш номер.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button color="ok" onClick={() => setPayStage("closed")}>
                Отлично
              </Button>
              <Button
                variant="soft"
                onClick={() => {
                  setPayStage("closed");
                  navigate(`/bid/${TENDER.tenderId}`);
                }}
              >
                Как это видит подрядчик (Smart Link)
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
