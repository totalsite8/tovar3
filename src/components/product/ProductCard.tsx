import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import { BadgeCheck, AlertTriangle, Truck } from "lucide-react";
import { Badge, Button } from "../ui";
import type { ProductOption, Product } from "../../data/mockProducts";

export function ProductCard({
  product,
  option,
  highlighted = false,
  delay = 0,
  onBuy,
}: {
  product: Product;
  option: ProductOption;
  highlighted?: boolean;
  delay?: number;
  onBuy: (o: ProductOption) => void;
}) {
  const [shown, setShown] = useState(highlighted ? option.price : option.finalPrice);

  /* count price → final on the highlighted card */
  useEffect(() => {
    if (!highlighted) return;
    const t = setTimeout(() => {
      const controls = animate(option.price, option.finalPrice, {
        duration: 1,
        ease: "easeOut",
        onUpdate: (v) => setShown(v),
      });
      return () => controls.stop();
    }, 400 + delay * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlighted]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay }}
      className="surface relative overflow-hidden rounded-2xl border border-line bg-card p-5 shadow-card"
    >
      {highlighted && <span className="absolute inset-y-0 left-0 w-1.5 bg-product" />}

      <div className="flex gap-4">
        <div
          className={`grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-4xl ${product.gradient}`}
        >
          <span className="drop-shadow-sm">{product.emoji}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-bold leading-snug">{product.title}</h3>
            {highlighted && <Badge tone="product">Выбор ИИ</Badge>}
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-[12.5px] font-semibold">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: option.storeColor }}
            />
            <span>{option.store}</span>
            {option.isPartner && <Badge tone="ai">партнёр</Badge>}
          </div>

          <div
            className={`mt-0.5 flex items-center gap-1 text-[11.5px] font-medium ${
              option.badgeTone === "warn" ? "text-ai" : "text-mute"
            }`}
          >
            {option.badgeTone === "ok" && <BadgeCheck size={13} className="shrink-0 text-ok" />}
            {option.badgeTone === "warn" && (
              <AlertTriangle size={13} className="shrink-0 text-ai" />
            )}
            <span>{option.badge}</span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-[11.5px] text-mute">
            <Truck size={12} />
            <span>{option.delivery}</span>
          </div>
        </div>
      </div>

      {/* price + cashback block */}
      <div
        className={`mt-4 rounded-xl p-3 ${
          highlighted ? "bg-[var(--tint-product)]" : "bg-soft"
        }`}
      >
        {highlighted ? (
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[13px] font-semibold text-mute line-through decoration-bad/50">
              {option.price.toLocaleString("ru-RU")}₽
            </span>
            <span className="text-[13px] font-bold text-product">
              − {option.cashbackPoints} баллов
            </span>
            <span className="text-[13px] font-medium text-mute">= эквивалент</span>
            <span className="font-display text-[19px] font-bold tracking-tight">
              {Math.round(shown).toLocaleString("ru-RU")}₽
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[19px] font-bold tracking-tight">
              {option.price.toLocaleString("ru-RU")}₽
            </span>
            <span className="text-[12px] font-medium text-mute">без баллов Aura</span>
          </div>
        )}
      </div>

      <Button
        color={highlighted ? "product" : "ink"}
        variant={highlighted ? "primary" : "ghost"}
        className="mt-3 w-full"
        onClick={() => onBuy(option)}
      >
        {highlighted
          ? `Купить и получить ${option.cashbackPoints} баллов`
          : "Купить без баллов"}
      </Button>
      <p className="mt-2 text-center text-[11px] text-mute">{option.buttonNote}</p>
    </motion.article>
  );
}
