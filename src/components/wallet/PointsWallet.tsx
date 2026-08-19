import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useMotionValueEvent } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarCheck, ChevronRight, Coins } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { EARN_ROWS, SPEND_ROWS } from "../../data/mockUser";
import { Button, Card, Label } from "../ui";

export function PointsWallet() {
  const navigate = useNavigate();
  const points = useAppStore((s) => s.points);
  const transactions = useAppStore((s) => s.transactions);
  const claimDaily = useAppStore((s) => s.claimDaily);
  const dailyClaimedAt = useAppStore((s) => s.dailyClaimedAt);
  const showToast = useAppStore((s) => s.showToast);

  const claimedToday = dailyClaimedAt === new Date().toDateString();

  /* animated counter */
  const mv = useMotionValue(0);
  const springVal = useSpring(mv, { stiffness: 55, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    mv.set(points);
    console.log("[Aura] Wallet opened. Balance:", points);
  }, [points, mv]);

  useMotionValueEvent(springVal, "change", (v) => setDisplay(v));

  const claim = () => {
    if (claimDaily()) {
      showToast("+5 баллов за ежедневный вход 📅", "ok");
    } else {
      showToast("Бонус уже получен — возвращайтесь завтра", "info");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[480px] px-5 pt-6">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex min-h-10 items-center gap-1 rounded-xl px-2 text-[13.5px] font-semibold text-mute transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> На главную
      </button>

      {/* balance hero card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="surface relative mt-4 overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-card"
        style={{
          backgroundImage:
            "radial-gradient(70% 90% at 85% 10%, var(--tint-ai), transparent 60%)",
        }}
      >
        <div className="flex items-center gap-2">
          <Coins size={16} className="text-ai" />
          <Label>Баланс Aura</Label>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-[44px] font-bold leading-none tracking-tight">
            {Math.round(display).toLocaleString("ru-RU")}
          </span>
          <span className="font-display text-[18px] font-bold text-mute">баллов</span>
        </div>
        <p className="mt-1.5 text-[13px] font-medium text-mute">
          ≈ {Math.round(points / 10).toLocaleString("ru-RU")}₽ эквивалента при обмене на промокод
        </p>

        <Button
          color={claimedToday ? "ink" : "ok"}
          variant={claimedToday ? "soft" : "primary"}
          small
          className="mt-4"
          onClick={claim}
          disabled={claimedToday}
        >
          <CalendarCheck size={16} />
          {claimedToday ? "Бонус получен — до завтра" : "Ежедневный вход: +5 баллов"}
        </Button>
      </motion.div>

      {/* earn / spend */}
      <div className="mt-5 grid grid-cols-1 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
        >
          <Card className="p-4!">
            <Label className="mb-2.5">Как заработать</Label>
            <div className="space-y-1">
              {EARN_ROWS.map((r) => (
                <div key={r.label} className="flex items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-soft">
                  <span className="flex items-center gap-2.5 text-[13.5px] font-semibold">
                    <span className="text-lg leading-none">{r.icon}</span>
                    {r.label}
                  </span>
                  <span className={`text-[13px] font-bold ${r.tone === "ok" ? "text-ok" : "text-ai"}`}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.18 }}
        >
          <Card className="p-4!">
            <Label className="mb-2.5">Как потратить</Label>
            <div className="space-y-1">
              {SPEND_ROWS.map((r) => (
                <div key={r.label} className="flex items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-soft">
                  <span className="flex items-center gap-2.5 text-[13.5px] font-semibold">
                    <span className="text-lg leading-none">{r.icon}</span>
                    {r.label}
                  </span>
                  <span className="text-[13px] font-bold text-mute">{r.value}</span>
                </div>
              ))}
            </div>
            <Button variant="soft" small className="mt-2 w-full" onClick={() => navigate("/tender")}>
              Потратить 100 баллов на тендер →
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* history */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.26 }}
        className="mt-5"
      >
        <Label>История операций</Label>
        <div className="surface mt-2 divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-line bg-card shadow-card">
          {transactions.slice(0, 7).map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-semibold">{tx.label}</div>
                <div className="text-[11.5px] text-mute">{tx.when}</div>
              </div>
              <span
                className={`shrink-0 text-[14px] font-bold ${
                  tx.delta >= 0 ? "text-ok" : "text-bad"
                }`}
              >
                {tx.delta >= 0 ? "+" : "−"}
                {Math.abs(tx.delta)}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => navigate("/settings")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-5 flex w-full items-center justify-center gap-1 text-[13px] font-bold text-mute transition-colors hover:text-ink"
      >
        Настройки кошелька <ChevronRight size={15} />
      </motion.button>
    </div>
  );
}
