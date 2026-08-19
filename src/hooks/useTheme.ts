import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

/**
 * Applies the effective theme (light/dark) to <html data-theme="…">.
 * Respects "system" preference and reacts to OS-level changes live.
 */
export function useTheme(): void {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const effective = theme === "system" ? (mq.matches ? "dark" : "light") : theme;
      document.documentElement.setAttribute("data-theme", effective);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", effective === "dark" ? "#16162A" : "#FAF7F2");
      console.log("[Aura] Theme applied:", effective, "(preference:", theme + ")");
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
}
