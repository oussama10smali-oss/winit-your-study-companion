import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAppState } from "@/lib/store";
import { getDailyQuote } from "@/lib/quotes";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { BookOpen, Clock, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { t, lang } = useI18n();
  const { subjects, sessions } = useAppState();

  const today = new Date().toISOString().split("T")[0];
  const todaySessions = sessions.filter((s) => s.date === today);
  const completedToday = todaySessions.filter((s) => s.completed).length;
  const totalChapters = subjects.reduce((acc, s) => acc + s.chapters.length, 0);
  const completedChapters = subjects.reduce((acc, s) => acc + s.chapters.filter((c) => c.completed).length, 0);
  const totalHours = sessions.filter((s) => s.completed).reduce((acc, s) => acc + s.duration, 0) / 60;
  const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const quote = getDailyQuote(lang);

  // Smart suggestion: find incomplete chapter with most urgency
  const incompleteChapters = subjects.flatMap((s) =>
    s.chapters.filter((c) => !c.completed).map((c) => ({ subject: s.name, chapter: c.name, color: s.color }))
  );
  const suggestion = incompleteChapters[0];

  return (
    <PageTransition>
      <StaggerContainer className="space-y-4">
        {/* Welcome */}
        <StaggerItem>
          <div className="rounded-2xl gradient-hero p-5 text-primary-foreground shadow-glow-violet">
            <h2 className="text-lg font-bold">{t("dashboard.welcome")}</h2>
            <p className="mt-1 text-sm opacity-90">"{quote}"</p>
          </div>
        </StaggerItem>

        {/* Stats Grid */}
        <StaggerItem>
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={<Clock size={18} />} value={totalHours.toFixed(1)} label={t("dashboard.totalHours")} variant="violet" />
            <StatCard icon={<CheckCircle2 size={18} />} value={`${completedChapters}/${totalChapters}`} label={t("dashboard.completedChapters")} variant="turquoise" />
            <StatCard icon={<BookOpen size={18} />} value={`${completedToday}/${todaySessions.length}`} label={t("dashboard.studySessions")} variant="success" />
          </div>
        </StaggerItem>

        {/* Progress Ring */}
        <StaggerItem>
          <div className="rounded-2xl bg-card p-5 shadow-sm border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-primary" />
              <h3 className="font-semibold">{t("dashboard.weeklyProgress")}</h3>
            </div>
            <div className="flex items-center gap-6">
              <ProgressRing progress={overallProgress} />
              <div className="flex-1">
                <div className="space-y-2">
                  {subjects.map((s) => {
                    const total = s.chapters.length;
                    const done = s.chapters.filter((c) => c.completed).length;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <div key={s.id} className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${s.color === "violet" ? "bg-violet" : s.color === "turquoise" ? "bg-turquoise" : "bg-success"}`} />
                        <span className="flex-1 text-xs text-muted-foreground">{s.name}</span>
                        <span className="text-xs font-semibold">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Smart Suggestion */}
        {suggestion && (
          <StaggerItem>
            <div className="rounded-2xl bg-card p-4 shadow-sm border border-turquoise/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-turquoise" />
                <span className="text-sm font-semibold">{t("dashboard.suggestion")}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {lang === "darija"
                  ? `ابدا بـ "${suggestion.chapter}" فـ ${suggestion.subject}`
                  : `Commencez par "${suggestion.chapter}" en ${suggestion.subject}`}
              </p>
            </div>
          </StaggerItem>
        )}

        {/* Today's Sessions */}
        <StaggerItem>
          <div className="rounded-2xl bg-card p-5 shadow-sm border border-border/50">
            <h3 className="font-semibold mb-3">{t("dashboard.todayPlan")}</h3>
            {todaySessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("dashboard.noSessions")}</p>
            ) : (
              <div className="space-y-2.5">
                {todaySessions.map((session) => {
                  const subject = subjects.find((s) => s.id === session.subjectId);
                  const chapter = subject?.chapters.find((c) => c.id === session.chapterId);
                  return (
                    <div
                      key={session.id}
                      className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                        session.completed ? "bg-success/10" : "bg-secondary"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                        subject?.color === "violet" ? "gradient-violet text-violet-foreground" :
                        subject?.color === "turquoise" ? "gradient-turquoise text-turquoise-foreground" :
                        "bg-success text-success-foreground"
                      }`}>
                        {session.startTime}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{subject?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{chapter?.name} · {session.duration} min</p>
                      </div>
                      {session.completed && <CheckCircle2 size={18} className="text-success shrink-0" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}

function StatCard({ icon, value, label, variant }: { icon: React.ReactNode; value: string; label: string; variant: string }) {
  return (
    <div className="rounded-xl bg-card p-3 shadow-sm border border-border/50 text-center">
      <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${
        variant === "violet" ? "bg-violet/10 text-violet" :
        variant === "turquoise" ? "bg-turquoise/10 text-turquoise" :
        "bg-success/10 text-success"
      }`}>
        {icon}
      </div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{label}</p>
    </div>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={radius} fill="none"
          stroke="url(#progressGradient)" strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--violet)" />
            <stop offset="100%" stopColor="var(--turquoise)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gradient">{progress}%</span>
      </div>
    </div>
  );
}
