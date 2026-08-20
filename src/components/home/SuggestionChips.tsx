import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import {
  CHIP_GROUPS,
  PRODUCT_CHIPS,
  GIFT_CHIPS,
  SERVICE_CHIPS,
  type Chip,
  type ChipKind,
} from "../../data/suggestions";

export const ALL_HOME_CHIPS: Chip[] = [...PRODUCT_CHIPS, ...GIFT_CHIPS, ...SERVICE_CHIPS];

export function useChipGo() {
  const navigate = useNavigate();
  const setSearch = useAppStore((s) => s.setSearch);
  const setServiceScenario = useAppStore((s) => s.setServiceScenario);
  const [leaving, setLeaving] = useState<string | null>(null);

  const go = (chip: Chip) => {
    console.log("[Aura] Chip tapped:", chip.label, "→", chip.route);
    setLeaving(chip.label);
    setSearch(chip.query, chip.kind === "service" ? "service" : chip.kind === "gift" ? "gift" : "product");
    if (chip.kind === "service") setServiceScenario(chip.scenario ?? null);
    window.setTimeout(() => {
      navigate(chip.route);
      setLeaving(null);
    }, 260);
  };

  return { go, leaving };
}

function ChipButton({ chip, leaving, onGo }: { chip: Chip; leaving: string | null; onGo: (c: Chip) => void }) {
  const kindColor =
    chip.kind === "service" ? "var(--color-service)" : chip.kind === "gift" ? "var(--color-ai)" : "var(--color-product)";
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      animate={leaving === chip.label ? { y: -16, opacity: 0, scale: 0.9 } : { y: 0, opacity: 1, scale: 1 }}
      onClick={() => onGo(chip)}
      className="panel flex min-h-11 shrink-0 items-center gap-2 px-4 py-2.5 text-[14px] font-semibold"
      style={{ borderLeft: `3px solid ${kindColor}` }}
    >
      <span className="text-lg leading-none">{chip.emoji}</span>
      <span>{chip.label}</span>
    </motion.button>
  );
}

/** Grouped chips for the homepage: wrap on desktop, horizontal scroll on mobile */
export function SuggestionChips({ groups = "all" }: { groups?: "all" | "services" }) {
  const { go, leaving } = useChipGo();
  const list = groups === "services" ? [CHIP_GROUPS[2]] : CHIP_GROUPS;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pt-16 md:px-8">
      <p className="microlabel">// примеры запросов</p>
      <h2 className="mt-2 font-display text-[22px] font-bold tracking-tight md:text-[28px]">
        Попробуйте прямо сейчас
      </h2>
      <p className="mt-1 text-sm text-mute">Один тап — и умный помощник уже работает. Данные демо, смелее.</p>

      <div className={groups === "services" ? "mt-6 space-y-5" : "mt-6 space-y-6"}>
        {list.map((group) => (
          <div key={group.id}>
            <p className="microlabel mb-2.5">{group.label}</p>
            {/* mobile: scroll; desktop: wrap */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar md:flex-wrap md:overflow-visible md:pb-0">
              {group.chips.map((chip, i) => (
                <motion.div
                  key={chip.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ type: "spring", stiffness: 130, damping: 16, delay: 0.05 * i }}
                  className="contents"
                >
                  <ChipButton chip={chip} leaving={leaving} onGo={go} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Compact scrollable row used above the search bar */
export function ChipRow({ kind }: { kind?: ChipKind }) {
  const { go } = useChipGo();
  const chips = kind
    ? ALL_HOME_CHIPS.filter((c) => c.kind === kind)
    : ALL_HOME_CHIPS.slice(0, 8);
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {chips.map((chip) => (
        <motion.button
          key={chip.label}
          type="button"
          whileTap={{ scale: 0.93 }}
          onClick={() => go(chip)}
          className="panel flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full! px-3 py-1.5 text-[12.5px] font-medium"
        >
          <span>{chip.emoji}</span>
          <span>{chip.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
