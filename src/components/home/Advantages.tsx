import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { emoji: "💰", title: "Кэшбэк с каждой покупки", text: "Покупаешь через Aura — деньги сразу падают в кошелёк", tint: "var(--tint-ok)" },
  { emoji: "🤖", title: "ИИ сравнивает цены за тебя", text: "60 секунд вместо двух часов по вкладкам", tint: "var(--tint-ai)" },
  { emoji: "🔍", title: "Честно: показываем даже то, что нам невыгодно", text: "Включая варианты без кэшбека и серый импорт", tint: "var(--tint-cyan)" },
  { emoji: "⚡", title: "Ответ за минуту", text: "Один запрос — готовый расчёт, а не список ссылок", tint: "var(--tint-service)" },
];

export function Advantages() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-adv-card]", {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="mx-auto w-full max-w-[1600px] px-4 pt-16 md:px-8">
      <p className="microlabel">// почему aura</p>
      <h2 className="mt-2 font-display text-[22px] font-bold tracking-tight md:text-[28px]">
        Работает как личный закупщик
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            data-adv-card
            className="panel group p-4 transition-transform duration-200 hover:-translate-y-1 md:p-5"
          >
            <div
              className="grid h-11 w-11 place-items-center rounded-xl text-[22px] transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: item.tint }}
            >
              {item.emoji}
            </div>
            <div className="mt-3.5 text-[14.5px] font-bold leading-snug">{item.title}</div>
            <div className="mt-1.5 text-[12.5px] leading-snug text-mute">{item.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
