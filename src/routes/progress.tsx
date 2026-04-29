import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAppState } from "@/lib/store";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  const { t } = useI18n();
  const { subjects, sessions } = useAppState();

  const totalChapters = subjects.reduce((a, s) => a + s.chapters.length, 0);
  const completedChapters = subjects.reduce((a, s) => a + s.chapters.filter((c) => c.completed).length, 0);
  const overallPct = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  // Weekly hours data
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const weekData = weekDays.map((date, i) => {
    const mins = sessions.filter((s) => s.date === date && s.completed).reduce((a, s) => a + s.duration, 0);
    return { day: dayLabels[i], hours: +(mins / 60).toFixed(1) };
  });

  const colors = ["oklch(0.55 0.2 290)", "oklch(0.72 0.15 190)"];

  const subjectData = subjects.map((s) => {
    const total = s.chapters.length;
    const done = s.chapters.filter((c) => c.completed).length;
    return { name: s.name, color: s.color, total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  });

  return (
    <PageTransition>
      <h2 className="text-xl font-bold mb-4">{t("progress.title")}</h2>

      <StaggerContainer className="space-y-4">
        {/* Overall */}
        <StaggerItem>
          <div className="rounded-2xl gradient-hero p-5 text-primary-foreground shadow-glow-violet">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} />
              <span className="font-semibold">{t("progress.overall")}</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold">{overallPct}%</span>
              <span className="text-sm opacity-80 mb-1">{completedChapters}/{totalChapters} {t("subjects.chapters")}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-primary-foreground/20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary-foreground/80"
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </StaggerItem>

        {/* Weekly Chart */}
        <StaggerItem>
          <div className="rounded-2xl glass-panel p-5">
            <h3 className="font-semibold mb-4">{t("progress.hoursChart")}</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis hide />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]} maxBarSize={28}>
                    {weekData.map((_, i) => (
                      <Cell key={i} fill={colors[i % 2]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </StaggerItem>

        {/* By Subject */}
        <StaggerItem>
          <div className="rounded-2xl glass-panel p-5">
            <h3 className="font-semibold mb-4">{t("progress.bySubject")}</h3>
            <div className="space-y-4">
              {subjectData.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className="text-sm font-bold">{s.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        s.color === "violet" ? "gradient-violet" :
                        s.color === "turquoise" ? "gradient-turquoise" :
                        "bg-success"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{s.done}/{s.total} {t("subjects.chapters")}</p>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
