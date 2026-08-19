import { HeroSection } from "./HeroSection";
import { Advantages } from "./Advantages";
import { SuggestionChips } from "./SuggestionChips";
import { useAppStore } from "../../store/useAppStore";

export function HomePage() {
  const setLegalDoc = useAppStore((s) => s.setLegalDoc);

  return (
    <div>
      <HeroSection />
      <Advantages />
      <SuggestionChips />

      <footer className="mx-auto mt-16 w-full max-w-[480px] border-t border-line px-5 py-8">
        <div className="flex items-center gap-2">
          <span
            className="h-6 w-6 rounded-full"
            style={{
              background: "radial-gradient(circle at 32% 28%, #FDE68A, #F59E0B 55%, #F97316)",
            }}
          />
          <span className="font-display text-[15px] font-bold tracking-tight">Aura</span>
        </div>
        <p className="mt-3 text-[13px] text-mute">
          Сделано с 💛 командой Aura · демо-прототип, все данные вымышлены
        </p>
        <div className="mt-4 flex gap-5 text-[12.5px] font-medium">
          <button
            type="button"
            onClick={() => setLegalDoc("terms")}
            className="text-mute underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Оферта
          </button>
          <button
            type="button"
            onClick={() => setLegalDoc("privacy")}
            className="text-mute underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Политика конфиденциальности
          </button>
        </div>
        <p className="mt-4 text-[11px] text-mute/70">v0.1.0 · MVP Prototype</p>
      </footer>
    </div>
  );
}
