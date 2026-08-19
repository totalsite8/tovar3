import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";
import { X } from "lucide-react";

/* ── Button ────────────────────────────────────────────────────── */

export type BtnColor = "product" | "service" | "ok" | "ai" | "ink";
type BtnVariant = "primary" | "ghost" | "soft";

const SOLID: Record<BtnColor, string> = {
  product: "bg-product text-white hover:brightness-110",
  service: "bg-service text-white hover:brightness-110",
  ok: "bg-ok text-white hover:brightness-110",
  ai: "bg-ai text-white hover:brightness-110",
  ink: "bg-ink text-bg hover:opacity-90",
};

export function Button({
  variant = "primary",
  color = "product",
  small = false,
  className = "",
  children,
  onClick,
  disabled,
}: {
  variant?: BtnVariant;
  color?: BtnColor;
  small?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}) {
  const base = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold select-none transition-colors disabled:opacity-40 disabled:pointer-events-none ${
    small ? "min-h-10 px-4 text-[13px]" : "min-h-12 px-5 text-[15px]"
  }`;
  const look =
    variant === "primary"
      ? `${SOLID[color]} shadow-card`
      : variant === "ghost"
        ? "border border-line bg-transparent text-ink hover:bg-soft"
        : "bg-soft text-ink hover:brightness-[0.98] dark:hover:brightness-110";
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${look} ${className}`}
    >
      {children}
    </motion.button>
  );
}

/* ── Card ──────────────────────────────────────────────────────── */

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`surface rounded-2xl border border-line bg-card p-5 shadow-card ${className}`}>
      {children}
    </div>
  );
}

/* ── Badge ─────────────────────────────────────────────────────── */

export type BadgeTone = "ok" | "warn" | "neutral" | "product" | "service" | "ai" | "bad";

const BADGE: Record<BadgeTone, string> = {
  ok: "bg-[var(--tint-ok)] text-ok",
  warn: "bg-[var(--tint-ai)] text-ai",
  neutral: "bg-soft text-mute",
  product: "bg-[var(--tint-product)] text-product",
  service: "bg-[var(--tint-service)] text-service",
  ai: "bg-[var(--tint-ai)] text-ai",
  bad: "bg-[var(--tint-bad)] text-bad",
};

export function Badge({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ${BADGE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ── Label (small uppercase) ───────────────────────────────────── */

export function Label({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`text-[11px] font-bold uppercase tracking-[0.08em] text-mute ${className}`}>
      {children}
    </div>
  );
}

/* ── ProgressBar ───────────────────────────────────────────────── */

export function ProgressBar({
  value,
  color = "var(--color-service)",
  className = "",
}: {
  value: number; // 0..100
  color?: string;
  className?: string;
}) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-soft ${className}`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
      />
    </div>
  );
}

/* ── Modal ─────────────────────────────────────────────────────── */

export function Modal({
  open,
  onClose,
  children,
  hideClose = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  hideClose?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="surface relative w-full max-w-[420px] rounded-2xl border border-line bg-card p-5 shadow-card"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-mute transition-colors hover:bg-soft hover:text-ink"
              >
                <X size={18} />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
