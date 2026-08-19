import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Camera, CheckCircle2, Flame } from "lucide-react";
import { SMART_LINK_TZ } from "../../data/mockTender";

/**
 * Smart Link — the page a CONTRACTOR sees.
 * Deliberately looks different from the main app: no nav, no omnibar,
 * one field, one button, zero friction.
 */
export function SmartLink() {
  const { id } = useParams<{ id: string }>();
  const [price, setPrice] = useState("");
  const [shake, setShake] = useState(0);
  const [sent, setSent] = useState(false);

  const submit = () => {
    const value = Number(price.replace(/\s/g, ""));
    if (!value || value <= 0) {
      setShake((s) => s + 1);
      return;
    }
    console.log("[Aura] SmartLink bid submitted:", value + "₽", "tender:", id);
    setSent(true);
  };

  return (
    <div
      className="grid min-h-screen place-items-center px-4 py-10"
      style={{
        background:
          "radial-gradient(80% 60% at 50% 0%, rgba(16,185,129,0.14), transparent 65%), #0B1220",
        backgroundImage:
          "radial-gradient(80% 60% at 50% 0%, rgba(16,185,129,0.14), transparent 65%), radial-gradient(rgba(148,163,184,0.16) 1px, transparent 1px)",
        backgroundSize: "auto, 26px 26px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="w-full max-w-[400px] rounded-3xl bg-white p-6 text-gray-900 shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
      >
        {!sent ? (
          <>
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100">
                <Flame size={22} className="text-orange-500" />
              </span>
              <div>
                <h1 className="text-[18px] font-extrabold leading-tight">
                  🔥 Новый заказ в вашем районе
                </h1>
                <p className="text-[12.5px] font-medium text-gray-500">
                  Пластиковые окна · Панелька · 3 комнаты
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-1.5 rounded-2xl bg-gray-50 p-4">
              {SMART_LINK_TZ.map((line) => (
                <li key={line} className="flex items-start gap-2 text-[13.5px] font-medium">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {line}
                </li>
              ))}
            </ul>

            {/* photo placeholder */}
            <div className="mt-3 grid h-28 place-items-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400">
              <div className="flex flex-col items-center gap-1">
                <Camera size={24} />
                <span className="text-[11.5px] font-semibold">Фото объекта (в реальном заказе)</span>
              </div>
            </div>

            <motion.div animate={shake ? { x: [0, -9, 9, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }} key={shake}>
              <label className="mt-4 block text-[12px] font-bold uppercase tracking-wide text-gray-500">
                Ваша цена под ключ (₽)
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d\s]/g, ""))}
                inputMode="numeric"
                placeholder="Например, 70 000"
                className="mt-1.5 h-14 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-center text-[20px] font-extrabold tracking-tight outline-none transition-colors placeholder:font-semibold placeholder:text-gray-300 focus:border-emerald-500"
              />
            </motion.div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={submit}
              className="mt-4 h-14 w-full rounded-2xl bg-emerald-500 text-[16px] font-extrabold text-white shadow-lg shadow-emerald-500/30 transition-colors hover:bg-emerald-600"
            >
              Отправить предложение
            </motion.button>

            <p className="mt-3 text-center text-[11px] font-medium text-gray-400">
              Без регистрации · клиент увидит ставку в сравнении · заказ #{id ?? "—"}
            </p>
          </>
        ) : (
          <div className="py-6 text-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 13 }}
              className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100"
            >
              <CheckCircle2 size={34} className="text-emerald-500" />
            </motion.span>
            <h2 className="mt-4 text-[19px] font-extrabold">✅ Спасибо!</h2>
            <p className="mx-auto mt-2 max-w-[280px] text-[14px] font-medium text-gray-500">
              Клиент увидит вашу ставку{" "}
              <b className="text-gray-900">{price}₽</b> в течение часа — прямо в таблице
              сравнения.
            </p>
            <div className="mt-5 rounded-2xl bg-gray-50 p-3 text-[12px] font-medium text-gray-500">
              Демо-режим: в реальном сервисе здесь появится кнопка «Открыть чат с клиентом»
            </div>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setPrice("");
              }}
              className="mt-4 text-[12.5px] font-bold text-emerald-600 underline-offset-4 hover:underline"
            >
              Отправить ещё одну ставку (демо)
            </button>
          </div>
        )}
      </motion.div>

      <p className="pointer-events-none fixed bottom-4 inset-x-0 text-center text-[11px] font-medium text-slate-500">
        Aura Smart Link · страница подрядчика
      </p>
    </div>
  );
}
