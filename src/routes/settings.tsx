import { createFileRoute } from "@tanstack/react-router";
import { useI18n, type Language } from "@/lib/i18n";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Globe, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useI18n();

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://winit.app";

  const languages: { value: Language; label: string }[] = [
    { value: "darija", label: "🇲🇦 الدارجة" },
    { value: "fr", label: "🇫🇷 Français" },
  ];

  return (
    <PageTransition>
      <h2 className="text-xl font-bold mb-4">{t("settings.title")}</h2>

      <StaggerContainer className="space-y-4">
        {/* Language */}
        <StaggerItem>
          <div className="rounded-2xl glass-panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-primary" />
              <h3 className="font-semibold">{t("settings.language")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLang(l.value)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all active:scale-95 ${
                    lang === l.value
                      ? "gradient-hero text-primary-foreground shadow-glow-violet"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </StaggerItem>

        {/* QR Code */}
        <StaggerItem>
          <div className="rounded-2xl glass-panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <QrCode size={18} className="text-turquoise" />
              <h3 className="font-semibold">{t("settings.qrcode")}</h3>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-2xl bg-white p-4">
                <QRCodeSVG
                  value={appUrl}
                  size={180}
                  level="H"
                  fgColor="#1a1a2e"
                  bgColor="#ffffff"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {t("settings.scanQr")}
              </p>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
