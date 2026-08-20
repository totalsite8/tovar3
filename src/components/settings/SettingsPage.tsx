import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  MapPin,
  Bell,
  Wallet,
  FileText,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useAppStore, type ThemePref } from "../../store/useAppStore";
import { CITIES } from "../../data/mockUser";
import { Card, Label } from "../ui";

const THEME_OPTS: { value: ThemePref; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
  { value: "system", label: "Система", icon: Monitor },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const city = useAppStore((s) => s.city);
  const setCity = useAppStore((s) => s.setCity);
  const notifications = useAppStore((s) => s.notifications);
  const setNotifications = useAppStore((s) => s.setNotifications);
  const points = useAppStore((s) => s.points);
  const setLegalDoc = useAppStore((s) => s.setLegalDoc);

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pt-6 md:px-8">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex min-h-10 items-center gap-1 rounded-xl px-2 text-[13.5px] font-semibold text-mute transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> На главную
      </button>

      <p className="microlabel mt-3">// настройки</p>
      <h1 className="mt-1 font-display text-[24px] font-bold tracking-tight md:text-[28px]">Как вам удобнее</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
        <div className="space-y-4">
          {/* theme */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.05 }}>
            <Label>Тема оформления</Label>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-2xl border border-line bg-soft p-1">
              {THEME_OPTS.map((opt) => {
                const Icon = opt.icon;
                const active = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTheme(opt.value)}
                    className={`relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl text-[12px] font-bold transition-colors ${
                      active ? "text-ink" : "text-mute hover:text-ink"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="theme-pill"
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        className="surface absolute inset-0 rounded-xl border shadow-card"
                      />
                    )}
                    <Icon size={17} className={`relative z-10 ${active ? "text-ai" : ""}`} />
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11.5px] text-mute">Применяется мгновенно · «Система» следит за настройками устройства</p>
          </motion.div>

          {/* city */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.12 }}>
            <Label>Город (для подбора услуг)</Label>
            <div className="relative mt-2">
              <MapPin size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-line bg-card pl-11 pr-10 text-[14.5px] font-semibold shadow-card outline-none transition-colors focus:border-service"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mute" />
            </div>
          </motion.div>

          {/* notifications */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.19 }}>
            <Card className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--tint-service)]">
                  <Bell size={18} className="text-service" />
                </span>
                <div>
                  <div className="text-[14px] font-bold">Уведомления</div>
                  <div className="text-[11.5px] text-mute">Ответы подрядчиков, кэшбэк, дедлайны</div>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications}
                onClick={() => setNotifications(!notifications)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${notifications ? "bg-ok" : "bg-line"}`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow ${notifications ? "right-0.5" : "left-0.5"}`}
                />
              </button>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-4">
          {/* points summary */}
          <motion.button
            type="button"
            onClick={() => navigate("/wallet")}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
            className="block w-full text-left"
          >
            <Card className="flex items-center justify-between p-4 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--tint-ai)]">
                  <Wallet size={18} className="text-ai" />
                </span>
                <div>
                  <div className="text-[14px] font-bold">Мои баллы</div>
                  <div className="text-[11.5px] text-mute">Баланс и история операций</div>
                </div>
              </div>
              <span className="font-display text-[17px] font-bold text-ok">{points.toLocaleString("ru-RU")} ⚡</span>
            </Card>
          </motion.button>

          {/* legal */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.17 }}>
            <Label>Документы</Label>
            <div className="mt-2 divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-line bg-card shadow-card">
              <button type="button" onClick={() => setLegalDoc("terms")} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-soft">
                <FileText size={17} className="text-mute" />
                <span className="flex-1 text-[13.5px] font-semibold">Оферта</span>
                <ChevronDown size={16} className="-rotate-90 text-mute" />
              </button>
              <button type="button" onClick={() => setLegalDoc("privacy")} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-soft">
                <ShieldCheck size={17} className="text-mute" />
                <span className="flex-1 text-[13.5px] font-semibold">Политика конфиденциальности</span>
                <ChevronDown size={16} className="-rotate-90 text-mute" />
              </button>
            </div>
          </motion.div>

          <p className="text-center text-[11px] text-mute/70">Aura v0.2.0 · MVP Prototype · демо-данные</p>
        </div>
      </div>
    </div>
  );
}
