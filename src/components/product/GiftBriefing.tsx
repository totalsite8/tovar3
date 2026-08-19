import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Gift, ArrowLeft, Sparkles } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { GIFT_QUESTIONS } from "../../data/mockGiftQuestions";
import { Button, ProgressBar } from "../ui";

export function GiftBriefing() {
  const navigate = useNavigate();
  const answers = useAppStore((s) => s.giftAnswers);
  const setGiftAnswer = useAppStore((s) => s.setGiftAnswer);
  const resetGift = useAppStore((s) => s.resetGift);
  const setSearch = useAppStore((s) => s.setSearch);

  const [step, setStep] = useState(0); // 0..2 questions, 3 = summary
  const done = step >= GIFT_QUESTIONS.length;
  const question = GIFT_QUESTIONS[Math.min(step, GIFT_QUESTIONS.length - 1)];

  const selected = useMemo(() => {
    if (!done) return null;
    return answers;
  }, [done, answers]);

  /* reset on mount so demo always starts fresh */
  useEffect(() => {
    resetGift();
    setStep(0);
    console.log("[Aura] Gift briefing started");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* auto-transition to results after summary */
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      setSearch(
        `Подарок: ${answers.hobbySummary ?? "геймеру"}, ${answers.budget ?? "до 3 000₽"}`,
        "gift"
      );
      navigate("/search");
    }, 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const pick = (optValue: string, optSummary?: string) => {
    const q = GIFT_QUESTIONS[step];
    if (q.id === "hobby") {
      setGiftAnswer({ hobby: optValue, hobbySummary: optSummary ?? optValue.toLowerCase() });
    } else if (q.id === "kind") {
      setGiftAnswer({ kind: optValue });
    } else {
      setGiftAnswer({ budget: optValue });
    }
    setTimeout(() => setStep((s) => s + 1), 320);
  };

  return (
    <div className="mx-auto w-full max-w-[480px] px-5 pt-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex min-h-10 items-center gap-1 rounded-xl px-2 text-[13.5px] font-semibold text-mute transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> Назад
      </button>

      <div className="mt-3 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--tint-product)]">
          <Gift size={22} className="text-product" />
        </span>
        <div>
          <h1 className="font-display text-[21px] font-bold leading-tight tracking-tight">
            Подберу подарок парню
          </h1>
          <p className="text-[12.5px] text-mute">3 быстрых вопроса — и ИИ всё поймёт</p>
        </div>
      </div>

      <ProgressBar
        value={(Math.min(step, GIFT_QUESTIONS.length) / GIFT_QUESTIONS.length) * 100}
        color="linear-gradient(90deg, #F97316, #F59E0B)"
        className="mt-5"
      />

      <div className="mt-6 min-h-[280px]">
        <AnimatePresence mode="wait">
          {!done && (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-mute">
                Вопрос {step + 1} из {GIFT_QUESTIONS.length}
              </p>
              <h2 className="mt-1.5 text-[19px] font-bold tracking-tight">{question.title}</h2>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 130, damping: 16, delay: 0.07 * i }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => pick(opt.value, opt.summary)}
                    className={`surface flex min-h-[76px] items-center gap-3 rounded-2xl border bg-card p-4 text-left shadow-card ${
                      opt.wide ? "col-span-2" : ""
                    }`}
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span className="text-[26px] leading-none">{opt.emoji}</span>
                    <span className="text-[15px] font-bold">{opt.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {done && selected && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
              className="surface rounded-2xl border border-line bg-card p-6 text-center shadow-card"
            >
              <motion.span
                animate={{ rotate: [0, -8, 8, -5, 5, 0] }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="inline-block text-4xl"
              >
                🎁
              </motion.span>
              <h2 className="mt-3 text-[18px] font-bold tracking-tight">Отлично, всё понял!</h2>
              <p className="mx-auto mt-2 max-w-[300px] text-[14px] text-mute">
                Ищу: <b className="text-ink">подарок для {selected.hobbySummary}, {selected.budget},{" "}
                {selected.kind === "Для эмоций" ? "для эмоций" : "практичный"}</b>
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-[12.5px] font-semibold text-product">
                <Sparkles size={15} className="animate-pulse" />
                Запускаю поиск по 12 маркетплейсам...
              </div>
              <motion.div className="mx-auto mt-4 h-1 w-40 overflow-hidden rounded-full bg-soft">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-1/2 rounded-full bg-product"
                />
              </motion.div>
              <Button
                variant="soft"
                small
                className="mt-5"
                onClick={() => {
                  setSearch(
                    `Подарок: ${selected.hobbySummary ?? "геймеру"}, ${selected.budget ?? "до 3 000₽"}`,
                    "gift"
                  );
                  navigate("/search");
                }}
              >
                Не ждать — показать сразу
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
