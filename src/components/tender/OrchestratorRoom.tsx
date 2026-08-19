import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FastForward, ArrowRight } from "lucide-react";
import {
  ORCHESTRATOR_FEED,
  TOTAL_COMPANIES,
  RESPONDED_COMPANIES,
  type FeedType,
} from "../../data/mockOrchestratorFeed";
import { ProgressBar, Button, Label } from "../ui";

const TYPE_COLOR: Record<FeedType, string> = {
  scout: "var(--color-ai)",
  send: "var(--color-service)",
  receive: "var(--color-ok)",
  warning: "var(--color-bad)",
  complete: "var(--color-ok)",
};

const spring = { type: "spring" as const, stiffness: 110, damping: 16 };

export function OrchestratorRoom({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(0);
  const [fast, setFast] = useState(false);
  const doneRef = useRef(false);

  /* mock timestamps: start now, add item offsets in minutes */
  const times = useMemo(() => {
    const base = Date.now();
    return ORCHESTRATOR_FEED.map((f) =>
      new Date(base + f.minutesOffset * 60_000).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  useEffect(() => {
    console.log("[Aura] Orchestrator room launched");
    const iv = setInterval(
      () => {
        setVisible((v) => {
          if (v >= ORCHESTRATOR_FEED.length) return v;
          console.log("[Aura] Feed:", ORCHESTRATOR_FEED[v].action);
          return v + 1;
        });
      },
      fast ? 180 : 950
    );
    return () => clearInterval(iv);
  }, [fast]);

  const complete = visible >= ORCHESTRATOR_FEED.length;

  useEffect(() => {
    if (complete && !doneRef.current) {
      doneRef.current = true;
      console.log("[Aura] Orchestrator: collection complete");
    }
  }, [complete]);

  const respondedSoFar = ORCHESTRATOR_FEED.slice(0, visible).filter(
    (f) => f.type === "receive"
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label>Сбор ответов: {respondedSoFar}/{RESPONDED_COMPANIES} получено · всего {TOTAL_COMPANIES}</Label>
        {!complete && (
          <button
            type="button"
            onClick={() => {
              setFast(true);
              setVisible(ORCHESTRATOR_FEED.length);
            }}
            className="flex min-h-9 items-center gap-1 rounded-lg px-2 text-[12px] font-bold text-service transition-colors hover:bg-[var(--tint-service)]"
          >
            <FastForward size={14} /> Пропустить
          </button>
        )}
      </div>
      <ProgressBar
        value={(respondedSoFar / RESPONDED_COMPANIES) * 100}
        color="linear-gradient(90deg, #8B5CF6, #10B981)"
        className="mt-2"
      />

      <div className="mt-5 space-y-2.5">
        <AnimatePresence initial={false}>
          {ORCHESTRATOR_FEED.slice(0, visible).map((item, i) => {
            const isLatest = i === visible - 1 && !complete;
            return (
              <motion.div
                key={item.action}
                initial={{ opacity: 0, x: -28, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={spring}
                className="surface relative flex items-start gap-3 rounded-2xl border border-line bg-card p-3.5 shadow-card"
                style={{
                  borderColor: item.type === "warning" ? "var(--color-bad)" : undefined,
                  background: item.type === "warning" ? "var(--tint-bad)" : undefined,
                }}
              >
                <span
                  className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[17px]"
                  style={{ background: "var(--bg-soft)" }}
                >
                  {item.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold" style={{ color: TYPE_COLOR[item.type] }}>
                      {item.agent}
                    </span>
                    {isLatest && (
                      <motion.span
                        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="h-1.5 w-1.5 rounded-full bg-ok"
                      />
                    )}
                  </div>
                  <p className="text-[13.5px] font-medium leading-snug">{item.action}</p>
                </div>
                <span className="shrink-0 font-mono text-[11px] font-semibold text-mute">
                  {times[i]}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
            className="mt-5"
          >
            <Button color="service" className="w-full" onClick={onDone}>
              Смотреть сравнение предложений <ArrowRight size={17} />
            </Button>
            <p className="mt-2 text-center text-[11.5px] text-mute">
              Остальные 14 компаний могут ответить до завтра 18:00 — таблица обновится
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
