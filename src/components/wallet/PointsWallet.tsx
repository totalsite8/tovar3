import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gift, Zap, Wallet as WalletIcon } from "lucide-react";
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
  const [shown, setShown] = useState(0);
  const [claimedPulse, setClaimedPulse] = useState(false);

  const claimedToday = dailyClaimedAt === new Date().toDateString();

  useEffect(() => {
    const controls = animate(0, points, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [points]);

  const claim = () => {
    if (claimDaily()) {
      setClaimedPulse(true);
      showToast("+5 баллов за ежедневный вход 🎉", "ok");
      setTimeout(() => setClaimedPulse(false), 1200);
    } else {
      showToast("Бонус за сегодня уже получен — приходите завтра", "info");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pt-6 md:px-8">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex min-h-10 items-center gap-1 rounded-xl px-2 text-[13.5px] font-semibold text-mute transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> На главную
      </button>

      <div className="mt-3 grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
        {/* balance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="panel relative overflow-hidden p-6"
        >
          <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ai to-product" />
          <p className="microlabel">// Мои баллы</p>
          <div className="mt-3 flex items-end gap-2">
            <motion.span
              key={claimedPulse ? "pulse" : "static"}
              animate={claimedPulse ? { scale: [1, 1.12, 1] } : {}}
              className="font-display text-[46px] font-bold leading-none tracking-tight"
            >
              {shown.toLocaleString("ru-RU")}
            </motion.span>
            <span className="pb-1.5 text-[15px] font-bold text-mute">баллов</span>
          </div>
          <p className="mt-1.5 text-[12.5px] text-mute">
            ≈ {points.toLocaleString("ru-RU")}₽ при оплате услуг или обмене на промокод
          </p>

          <Button color="ai" className="mt-5 w-full" onClick={claim} disabled={claimedToday}>
            <Gift size={17} />
            {claimedToday ? "Бонус за сегодня получен ✓" : "Забрать +5 за вход"}
          </Button>

          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-soft p-3">
            <Zap size={16} className="shrink-0 text-ai" />
            <p className="text-[12px] leading-snug text-mute">
              Кэшбэк от партнёров падает сюда сразу. Баллами оплачивается запуск подбора услуг.
            </p>
          </div>
        </motion.div>

        {/* right: earn/spend + history */}
        <div className="min-w-0 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.08 }}
            >
              <Card className="p-5">
                <Label className="mb-3">Как заработать</Label>
                <ul className="space-y-2.5">
                  {EARN_ROWS.map((r) => (
                    <li key={r.label} className="flex items-center justify-between gap-2 text-[13.5px]">
                      <span className="flex items-center gap-2.5">
                        <span className="text-lg">{r.icon}</span>
                        <span className="font-medium">{r.label}</span>
                      </span>
                      <span className="font-term text-[12.5px] font-bold text-ok">{r.value}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.14 }}
            >
              <Card className="p-5">
                <Label className="mb-3">Как потратить</Label>
                <ul className="space-y-2.5">
                  {SPEND_ROWS.map((r) => (
                    <li key={r.label} className="flex items-center justify-between gap-2 text-[13.5px]">
                      <span className="flex items-center gap-2.5">
                        <span className="text-lg">{r.icon}</span>
                        <span className="font-medium">{r.label}</span>
                      </span>
                      <span className={`font-term text-[12.5px] font-bold ${r.tone === "service" ? "text-service" : "text-bad"}`}>
                        {r.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* history */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
          >
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <Label>История операций</Label>
                <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-mute">
                  <WalletIcon size={13} /> демо-данные
                </span>
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {transactions.map((t, i) => (
                  <motion.li
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.24 + i * 0.05 }}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <span
                      className={`w-20 shrink-0 font-term text-[13.5px] font-bold ${
                        t.delta >= 0 ? "text-ok" : "text-bad"
                      }`}
                    >
                      {t.delta >= 0 ? `+${t.delta.toLocaleString("ru-RU")}` : t.delta.toLocaleString("ru-RU")}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{t.label}</span>
                    <span className="shrink-0 text-[11.5px] text-mute">{t.when}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
