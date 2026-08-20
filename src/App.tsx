import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sun,
  Moon,
  Monitor,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAppStore, type ThemePref } from "./store/useAppStore";
import { useTheme } from "./hooks/useTheme";
import { HomePage } from "./components/home/HomePage";
import { ProductSearchFlow } from "./components/product/ProductSearchFlow";
import { GiftBriefing } from "./components/product/GiftBriefing";
import { ServicesFlow } from "./components/tender/ServicesFlow";
import { SmartLink } from "./components/tender/SmartLink";
import { PointsWallet } from "./components/wallet/PointsWallet";
import { SettingsPage } from "./components/settings/SettingsPage";
import { Omnibar } from "./components/omnibar/Omnibar";
import { Modal, Button } from "./components/ui";

/* ── Demo badge ── */
function DemoBadge() {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 120, damping: 16 }}
      className="panel fixed right-3 top-[64px] z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-term text-[10.5px] font-bold"
      title="Напоминание: это демо"
    >
      <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        🧪
      </motion.span>
      {expanded ? "Прототип · данные демонстрационные" : "Прототип"}
    </motion.button>
  );
}

/* ── Toast host ── */
function ToastHost() {
  const toast = useAppStore((s) => s.toast);
  const clearToast = useAppStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2800);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[80] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="surface flex max-w-[440px] items-center gap-2.5 rounded-2xl border bg-card px-4 py-3 shadow-card"
            style={{
              borderColor:
                toast.tone === "ok" ? "var(--color-ok)" : toast.tone === "err" ? "var(--color-bad)" : "var(--border)",
            }}
          >
            {toast.tone === "ok" && <CheckCircle2 size={18} className="shrink-0 text-ok" />}
            {toast.tone === "err" && <AlertTriangle size={18} className="shrink-0 text-bad" />}
            {toast.tone === "info" && <Info size={18} className="shrink-0 text-ai" />}
            <span className="text-[13px] font-semibold">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Legal placeholder modal ── */
function LegalModal() {
  const doc = useAppStore((s) => s.legalDoc);
  const setLegalDoc = useAppStore((s) => s.setLegalDoc);
  return (
    <Modal open={doc !== null} onClose={() => setLegalDoc(null)}>
      <h3 className="pr-8 text-[17px] font-bold">
        {doc === "terms" ? "Оферта" : "Политика конфиденциальности"}
      </h3>
      <p className="mt-2 rounded-xl bg-soft p-3 text-[12px] font-semibold text-mute">
        📄 Плейсхолдер документа — в реальном продукте здесь будет юридический текст.
      </p>
      <div className="mt-3 space-y-2 text-[13px] text-mute">
        {doc === "terms" ? (
          <>
            <p>1. Aura — демонстрационный прототип. Все цены, магазины, баллы и подрядчики вымышлены.</p>
            <p>2. Баллы Aura не являются деньгами, ценной бумагой или криптовалютой.</p>
            <p>3. Партнёрские ссылки в реальной версии будут маркироваться по закону.</p>
          </>
        ) : (
          <>
            <p>1. Прототип не отправляет данные на сервер: всё хранится локально в вашем браузере.</p>
            <p>2. Тема, город и баланс сохраняются в localStorage устройства.</p>
            <p>3. В реальной версии политика будет соответствовать 152-ФЗ.</p>
          </>
        )}
      </div>
      <Button variant="soft" className="mt-4 w-full" onClick={() => setLegalDoc(null)}>
        Закрыть
      </Button>
    </Modal>
  );
}

/* ── Navbar ── */
const NAV = [
  { to: "/search", label: "Товары", match: (p: string) => p === "/search" || p === "/gift" },
  { to: "/tender", label: "Услуги", match: (p: string) => p === "/tender" },
  { to: "/wallet", label: "Мои баллы", match: (p: string) => p === "/wallet" },
  { to: "/settings", label: "Настройки", match: (p: string) => p === "/settings" },
];

function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const points = useAppStore((s) => s.points);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const nextTheme: Record<ThemePref, ThemePref> = { light: "dark", dark: "system", system: "light" };
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <header className="surface sticky top-0 z-40 border-b bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-3 px-4 md:px-8">
        {/* logo */}
        <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2" aria-label="Aura — на главную">
          <motion.span
            whileHover={{ rotate: 40, scale: 1.08 }}
            className="block h-7 w-7 rounded-full"
            style={{
              background: "radial-gradient(circle at 32% 28%, #FDE68A, #F59E0B 55%, #F97316)",
              boxShadow: "0 2px 12px rgba(249,115,22,.45)",
            }}
          />
          <span className="font-display text-[17px] font-bold tracking-tight">Aura</span>
        </button>

        {/* center nav — desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className={`relative rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                  active ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="absolute inset-x-3 -bottom-[13px] h-[2.5px] rounded-full bg-product"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* right: points + theme */}
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/wallet")}
            className="surface flex min-h-10 items-center gap-1.5 rounded-full border bg-card px-3.5 font-term text-[13px] font-bold shadow-sm transition-colors hover:border-[var(--color-ai)]"
            aria-label="Мои баллы"
          >
            <Zap size={14} className="text-ai" fill="currentColor" />
            <motion.span
              key={points}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
            >
              {points.toLocaleString("ru-RU")}
            </motion.span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(nextTheme[theme])}
            className="surface grid h-10 w-10 place-items-center rounded-full border bg-card text-mute shadow-sm transition-colors hover:text-ink"
            aria-label={`Тема: ${theme}`}
            title={`Тема: ${theme === "system" ? "системная" : theme === "light" ? "светлая" : "тёмная"} (клик — сменить)`}
          >
            <ThemeIcon size={17} />
          </motion.button>

          {/* mobile: settings shortcut */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("/settings")}
            className="surface grid h-10 w-10 place-items-center rounded-full border bg-card text-mute shadow-sm transition-colors hover:text-ink md:hidden"
            aria-label="Настройки"
          >
            <SettingsIcon size={17} />
          </motion.button>
        </div>
      </div>
    </header>
  );
}

/* ── Shell: wide content + omnibar ── */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* ambient glows */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(50% 34% at 10% 4%, var(--glow-a), transparent 65%), radial-gradient(46% 32% at 94% 96%, var(--glow-b), transparent 65%)",
        }}
      />
      <Navbar />
      <main className="relative z-10 pb-52 md:pb-48">{children}</main>
      <Omnibar />
      <DemoBadge />
    </div>
  );
}

/* ── App root ── */
export default function App() {
  useTheme();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    console.log("[Aura] Route →", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <ToastHost />
      <LegalModal />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <Routes location={location}>
            <Route path="/bid/:id" element={<SmartLink />} />
            <Route
              path="/*"
              element={
                <Shell>
                  <Routes location={location}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<ProductSearchFlow />} />
                    <Route path="/gift" element={<GiftBriefing />} />
                    <Route path="/tender" element={<ServicesFlow />} />
                    <Route path="/services" element={<ServicesFlow />} />
                    <Route path="/wallet" element={<PointsWallet />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Shell>
              }
            />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
