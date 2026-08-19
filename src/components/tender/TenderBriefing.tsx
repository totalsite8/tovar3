import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TENDER_QUESTIONS } from "../../data/mockTender";
import { useAppStore } from "../../store/useAppStore";
import { ProgressBar } from "../ui";

export function TenderBriefing({ onComplete }: { onComplete: () => void }) {
  const setTenderAnswer = useAppStore((s) => s.setTenderAnswer);
  const [step, setStep] = useState(0);
  const question = TENDER_QUESTIONS[step];
  const total = TENDER_QUESTIONS.length;

  const pick = (value: string) => {
    setTenderAnswer({ [question.id]: value });
    if (step + 1 >= total) {
      setTimeout(onComplete, 320);
    } else {
      setTimeout(() => setStep((s) => s + 1), 320);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between text-[12px] font-bold text-mute">
        <span>
          Вопрос {step + 1} из {total}
        </span>
        <span>{Math.round(((step) / total) * 100)}%</span>
      </div>
      <ProgressBar
        value={(step / total) * 100}
        color="linear-gradient(90deg, #8B5CF6, #A78BFA)"
        className="mt-2"
      />

      <div className="mt-6 min-h-[260px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <h2 className="text-[19px] font-bold tracking-tight">
              {question.emoji} {question.title}
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {question.options.map((opt, i) => (
                <motion.button
                  key={opt.value}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 130, damping: 16, delay: 0.06 * i }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => pick(opt.value)}
                  className={`surface min-h-[64px] rounded-2xl border border-line bg-card p-4 text-left text-[15px] font-bold shadow-card ${
                    question.options.length === 3 && i === 0 ? "col-span-2" : ""
                  }`}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
