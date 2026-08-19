import { motion } from "framer-motion";
import { AlertTriangle, Bot, Star, BadgeCheck } from "lucide-react";
import { TENDER } from "../../data/mockTender";
import { Badge, Button, Label } from "../ui";

const spring = { type: "spring" as const, stiffness: 100, damping: 15 };

export function ComparisonTable({ onSelect }: { onSelect: () => void }) {
  return (
    <div>
      <Label>Тендер #{TENDER.tenderId} · {TENDER.bids.length} ответа</Label>
      <h2 className="mt-1 font-display text-[21px] font-bold tracking-tight">
        Сравнение предложений
      </h2>

      {/* header row */}
      <div className="mt-4 grid grid-cols-[1.35fr_0.95fr_0.95fr_1fr_0.75fr] gap-1 px-3 text-[10.5px] font-bold uppercase tracking-[0.06em] text-mute">
        <span>Компания</span>
        <span className="text-right">База</span>
        <span className="text-right">Доплаты</span>
        <span className="text-right">Итого</span>
        <span className="text-right">ИИ</span>
      </div>

      <div className="mt-1.5 space-y-2">
        {TENDER.bids.map((bid, i) => (
          <motion.div
            key={bid.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.12 * i }}
            className={`surface relative rounded-2xl border p-3 shadow-card ${
              bid.recommended ? "border-service" : "border-line"
            }`}
            style={{
              background: bid.recommended ? "var(--tint-service)" : "var(--card)",
            }}
          >
            {bid.recommended && (
              <span className="absolute -top-2.5 left-3">
                <Badge tone="service">
                  <Star size={11} fill="currentColor" /> Рекомендация ИИ
                </Badge>
              </span>
            )}

            <div className="grid grid-cols-[1.35fr_0.95fr_0.95fr_1fr_0.75fr] items-center gap-1">
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[13px] font-bold">
                  <span className="truncate">{bid.company}</span>
                  {bid.recommended && <BadgeCheck size={14} className="shrink-0 text-service" />}
                </div>
                <div className="text-[10.5px] text-mute">
                  ★ {bid.rating} · {bid.term} · {bid.channel}
                </div>
              </div>
              <div className="text-right text-[12.5px] font-semibold">
                {bid.basePrice.toLocaleString("ru-RU")}₽
              </div>
              <div
                className={`flex items-center justify-end gap-0.5 text-right text-[12px] font-bold ${
                  bid.hiddenFees > 0 ? "text-bad" : "text-mute"
                }`}
              >
                {bid.hiddenFees > 0 ? (
                  <>
                    <AlertTriangle size={12} className="shrink-0" />
                    +{bid.hiddenFees.toLocaleString("ru-RU")}₽
                  </>
                ) : (
                  "—"
                )}
              </div>
              <div
                className={`text-right text-[13px] font-bold ${
                  bid.recommended ? "text-service" : ""
                }`}
              >
                {bid.finalPrice.toLocaleString("ru-RU")}₽
              </div>
              <div className="text-right">
                <span
                  className={`font-display text-[13px] font-bold ${
                    bid.aiTrustScore >= 85 ? "text-ok" : "text-ai"
                  }`}
                >
                  {bid.aiTrustScore >= 85 ? "⭐ " : "⚠️ "}
                  {bid.aiTrustScore}
                </span>
              </div>
            </div>

            {bid.hiddenFeeNote && (
              <p className="mt-1.5 rounded-lg bg-[var(--tint-bad)] px-2.5 py-1 text-[11px] font-semibold text-bad">
                ИИ нашёл скрытую доплату: +{bid.hiddenFees.toLocaleString("ru-RU")}₽ ({bid.hiddenFeeNote}) не была в цене
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* AI note */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.5 }}
        className="surface relative mt-4 overflow-hidden rounded-2xl border border-line bg-card p-4 shadow-card"
      >
        <span className="absolute inset-y-0 left-0 w-1.5 bg-ai" />
        <div className="flex items-start gap-2.5">
          <Bot size={18} className="mt-0.5 shrink-0 text-ai" />
          <p className="text-[13px] leading-relaxed text-mute">
            <b className="text-ink">{TENDER.aiNote}.</b> Фирма Б заманивает ценой, но с доставкой
            выходит дороже на 1 000₽.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.65 }}
        className="mt-5"
      >
        <Button color="service" className="w-full min-h-[52px]! text-[16px]" onClick={onSelect}>
          Выбрать ОкнаМастер
        </Button>
        <p className="mt-2 text-center text-[11.5px] text-mute">
          Разовая оплата лида · не подписка
        </p>
      </motion.div>
    </div>
  );
}
