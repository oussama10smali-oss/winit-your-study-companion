import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAppState } from "@/lib/store";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Plus, Trash2, CheckCircle2, Circle, Calculator, Atom, Leaf, BookOpen } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/subjects")({
  component: SubjectsPage,
});

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  calculator: Calculator,
  atom: Atom,
  leaf: Leaf,
  book: BookOpen,
};

const colorOptions = ["violet", "turquoise", "success"];

function SubjectsPage() {
  const { t } = useI18n();
  const { subjects, addSubject, addChapter, toggleChapter, deleteSubject } = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("violet");
  const [addingChapter, setAddingChapter] = useState<string | null>(null);
  const [chapterName, setChapterName] = useState("");

  const handleAddSubject = () => {
    if (!newName.trim()) return;
    addSubject(newName.trim(), newColor, "book");
    setNewName("");
    setShowAdd(false);
  };

  const handleAddChapter = (subjectId: string) => {
    if (!chapterName.trim()) return;
    addChapter(subjectId, chapterName.trim());
    setChapterName("");
    setAddingChapter(null);
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{t("subjects.title")}</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 rounded-full gradient-hero px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow-violet transition-all active:scale-95"
        >
          <Plus size={14} />
          {t("subjects.add")}
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
              <input
                type="text"
                placeholder={t("subjects.name")}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl glass-input px-4 py-2.5 text-sm"
              />
              <div className="flex gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`h-8 w-8 rounded-full transition-all ${
                      c === "violet" ? "bg-violet" : c === "turquoise" ? "bg-turquoise" : "bg-success"
                    } ${newColor === c ? "ring-2 ring-offset-2 ring-primary scale-110" : ""}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddSubject} className="flex-1 rounded-xl gradient-hero py-2 text-sm font-semibold text-primary-foreground active:scale-95">
                  {t("common.save")}
                </button>
                <button onClick={() => setShowAdd(false)} className="flex-1 rounded-xl glass-button py-2 text-sm font-medium active:scale-95">
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <StaggerContainer className="space-y-3">
        {subjects.map((subject) => {
          const Icon = iconMap[subject.icon] || BookOpen;
          const completed = subject.chapters.filter((c) => c.completed).length;
          const total = subject.chapters.length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <StaggerItem key={subject.id}>
              <div className="rounded-2xl glass-panel overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                    subject.color === "violet" ? "gradient-violet text-violet-foreground" :
                    subject.color === "turquoise" ? "gradient-turquoise text-turquoise-foreground" :
                    "bg-success text-success-foreground"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{subject.name}</p>
                    <p className="text-xs text-muted-foreground">{completed}/{total} {t("subjects.chapters")} · {pct}%</p>
                  </div>
                  <button onClick={() => deleteSubject(subject.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mx-4 mb-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      subject.color === "violet" ? "gradient-violet" :
                      subject.color === "turquoise" ? "gradient-turquoise" :
                      "bg-success"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>

                {/* Chapters */}
                <div className="px-4 pb-3 space-y-1.5">
                  {subject.chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => toggleChapter(subject.id, chapter.id)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-all hover:bg-secondary/50 active:scale-[0.98]"
                    >
                      {chapter.completed ? (
                        <CheckCircle2 size={16} className="text-success shrink-0" />
                      ) : (
                        <Circle size={16} className="text-muted-foreground shrink-0" />
                      )}
                      <span className={chapter.completed ? "line-through text-muted-foreground" : ""}>{chapter.name}</span>
                    </button>
                  ))}

                  {addingChapter === subject.id ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        placeholder={t("subjects.chapterName")}
                        value={chapterName}
                        onChange={(e) => setChapterName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddChapter(subject.id)}
                        className="flex-1 rounded-lg glass-input px-3 py-1.5 text-sm"
                        autoFocus
                      />
                      <button onClick={() => handleAddChapter(subject.id)} className="rounded-lg gradient-hero px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                        {t("common.save")}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAddingChapter(subject.id); setChapterName(""); }}
                      className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1 hover:text-primary/80 transition-colors"
                    >
                      <Plus size={14} />
                      {t("subjects.addChapter")}
                    </button>
                  )}
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageTransition>
  );
}
