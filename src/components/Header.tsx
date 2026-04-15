import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function Header() {
  const { lang, setLang } = useI18n();

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-border/50 px-4 py-3">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <h1 className="text-xl font-bold text-gradient tracking-tight">WINIT</h1>
        <button
          onClick={() => setLang(lang === "darija" ? "fr" : "darija")}
          className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-all hover:bg-accent active:scale-95"
        >
          <Globe size={14} />
          {lang === "darija" ? "FR" : "عربية"}
        </button>
      </div>
    </header>
  );
}
