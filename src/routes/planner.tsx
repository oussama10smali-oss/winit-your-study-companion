import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAppState } from "@/lib/store";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
});

function PlannerPage() {
  const { t } = useI18n();
  const { subjects, sessions, addSession, toggleSession, deleteSession } = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    subjectId: "",
    chapterId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    duration: 60,
  });

  const selectedSubject = subjects.find((s) => s.id === form.subjectId);

  const handleAdd = () => {
    if (!form.subjectId || !form.chapterId) return;
    addSession({ ...form, duration: Number(form.duration), completed: false });
    setShowAdd(false);
    setForm({ subjectId: "", chapterId: "", date: new Date().toISOString().split("T")[0], startTime: "09:00", duration: 60 });
  };

  // Group sessions by date
  const grouped = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    (acc[s.date] = acc[s.date] || []).push(s);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{t("planner.title")}</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 rounded-full gradient-hero px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow-violet transition-all active:scale-95"
        >
          <Plus size={14} />
          {t("planner.addSession")}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-2xl glass-panel p-4 space-y-3">
              <select
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value, chapterId: "" })}
                className="w-full rounded-xl glass-input px-4 py-2.5 text-sm"
              >
                <option value="">{t("planner.subject")}</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              {selectedSubject && (
                <select
                  value={form.chapterId}
                  onChange={(e) => setForm({ ...form, chapterId: e.target.value })}
                  className="w-full rounded-xl glass-input px-4 py-2.5 text-sm"
                >
                  <option value="">{t("planner.chapter")}</option>
                  {selectedSubject.chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">{t("planner.date")}</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-lg glass-input px-2 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">{t("planner.time")}</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full rounded-lg glass-input px-2 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">{t("planner.duration")}</label>
                  <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                    className="w-full rounded-lg glass-input px-2 py-2 text-sm" />
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={handleAdd} className="flex-1 rounded-xl gradient-hero py-2.5 text-sm font-semibold text-primary-foreground active:scale-95">
                  {t("common.save")}
                </button>
                <button onClick={() => setShowAdd(false)} className="flex-1 rounded-xl bg-secondary py-2.5 text-sm font-medium active:scale-95">
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <StaggerContainer className="space-y-4">
        {sortedDates.map((date) => {
          const daySessions = grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
          const dateLabel = new Date(date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

          return (
            <StaggerItem key={date}>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{dateLabel}</p>
                <div className="space-y-2">
                  {daySessions.map((session) => {
                    const subject = subjects.find((s) => s.id === session.subjectId);
                    const chapter = subject?.chapters.find((c) => c.id === session.chapterId);
                    return (
                      <motion.div
                        key={session.id}
                        layout
                        className={`flex items-center gap-3 rounded-xl p-3 transition-all ${session.completed ? "bg-success/10 border border-success/20" : "glass-panel"}`}
                      >
                        <button onClick={() => toggleSession(session.id)} className="shrink-0">
                          {session.completed ? (
                            <CheckCircle2 size={22} className="text-success" />
                          ) : (
                            <Circle size={22} className="text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${session.completed ? "line-through text-muted-foreground" : ""}`}>
                            {subject?.name} — {chapter?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{session.startTime} · {session.duration} min</p>
                        </div>
                        <button onClick={() => deleteSession(session.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageTransition>
  );
}
