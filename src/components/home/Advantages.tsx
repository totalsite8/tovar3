import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    emoji: "💰",
    title: "Баллы с каждой покупки",
    text: "Покупай через нас, копи на подарки",
    tint: "var(--tint-ok)",
  },
  {
    emoji: "🤖",
    title: "ИИ найдёт и сравнит",
    text: "60 секунд вместо 2 часов поиска",
    tint: "var(--tint-ai)",
  },
  {
    emoji: "🔍",
    title: "Честно: ВСЕ цены",
    text: "Показываем даже то, что нам невыгодно",
    tint: "var(--tint-product)",
  },
  {
    emoji: "⚡",
    title: "Результат мгновенно",
    text: "Один запрос — готовый ответ",
    tint: "var(--tint-service)",
  },
];

export function Advantages() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-adv-card]", {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="mx-auto w-full max-w-[480px] px-5 pt-16">
      <h2 className="font-display text-[22px] font-bold tracking-tight">Почему Aura</h2>
      <p className="mt-1 text-sm text-mute">Четыре причины попробовать сегодня.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            data-adv-card
            className="surface group rounded-2xl border border-line bg-card p-4 shadow-card transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div
              className="grid h-10 w-10 place-items-center rounded-xl text-xl transition-transform duration-200 group-hover:scale-110"
              style={{ background: item.tint }}
            >
              {item.emoji}
            </div>
            <div className="mt-3 text-[14px] font-bold leading-snug">{item.title}</div>
            <div className="mt-1 text-[12.5px] leading-snug text-mute">{item.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
