import { Moon, Sun, Languages } from "lucide-react";
import { useI18n, useTheme } from "@/lib/providers";

export function SettingsToggles() {
  const { theme, toggle } = useTheme();
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs font-mono uppercase text-muted-foreground hover:text-foreground hover:bg-secondary"
        aria-label="Toggle language"
        title="Toggle language"
      >
        <Languages className="h-3.5 w-3.5" />
        {lang === "fr" ? "FR" : "EN"}
      </button>
      <button
        onClick={toggle}
        className="inline-flex items-center justify-center rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
