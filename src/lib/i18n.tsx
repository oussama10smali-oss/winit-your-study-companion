import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "darija" | "fr";

const translations = {
  // Navigation
  "nav.dashboard": { darija: "الرئيسية", fr: "Tableau de bord" },
  "nav.subjects": { darija: "المواد", fr: "Matières" },
  "nav.planner": { darija: "البرنامج", fr: "Planificateur" },
  "nav.progress": { darija: "التقدم", fr: "Progrès" },

  // Dashboard
  "dashboard.welcome": { darija: "مرحبا بيك! 👋", fr: "Bienvenue ! 👋" },
  "dashboard.todayPlan": { darija: "برنامج اليوم", fr: "Plan du jour" },
  "dashboard.weeklyProgress": { darija: "تقدم هاد السيمانة", fr: "Progrès hebdomadaire" },
  "dashboard.totalHours": { darija: "ساعات القراية", fr: "Heures étudiées" },
  "dashboard.completedChapters": { darija: "الفصول المكملة", fr: "Chapitres terminés" },
  "dashboard.studySessions": { darija: "حصص القراية", fr: "Sessions d'étude" },
  "dashboard.suggestion": { darija: "💡 اقتراح ذكي", fr: "💡 Suggestion intelligente" },
  "dashboard.noSessions": { darija: "ما عندك حتى حصة اليوم", fr: "Aucune session aujourd'hui" },

  // Subjects
  "subjects.title": { darija: "المواد ديالك", fr: "Vos matières" },
  "subjects.add": { darija: "زيد مادة", fr: "Ajouter matière" },
  "subjects.chapters": { darija: "فصول", fr: "chapitres" },
  "subjects.addChapter": { darija: "زيد فصل", fr: "Ajouter chapitre" },
  "subjects.name": { darija: "سمية المادة", fr: "Nom de la matière" },
  "subjects.chapterName": { darija: "سمية الفصل", fr: "Nom du chapitre" },

  // Planner
  "planner.title": { darija: "البرنامج ديالك", fr: "Votre planificateur" },
  "planner.addSession": { darija: "زيد حصة", fr: "Ajouter session" },
  "planner.subject": { darija: "المادة", fr: "Matière" },
  "planner.chapter": { darija: "الفصل", fr: "Chapitre" },
  "planner.date": { darija: "التاريخ", fr: "Date" },
  "planner.time": { darija: "الوقت", fr: "Heure" },
  "planner.duration": { darija: "المدة (دقائق)", fr: "Durée (minutes)" },
  "planner.done": { darija: "مكمل ✅", fr: "Terminé ✅" },
  "planner.pending": { darija: "باقي ⏳", fr: "En attente ⏳" },

  // Progress
  "progress.title": { darija: "التقدم ديالك", fr: "Votre progrès" },
  "progress.overall": { darija: "التقدم الإجمالي", fr: "Progrès global" },
  "progress.bySubject": { darija: "حسب المادة", fr: "Par matière" },
  "progress.hoursChart": { darija: "ساعات القراية هاد السيمانة", fr: "Heures d'étude cette semaine" },

  // Common
  "common.save": { darija: "حفظ", fr: "Enregistrer" },
  "common.cancel": { darija: "إلغاء", fr: "Annuler" },
  "common.delete": { darija: "حذف", fr: "Supprimer" },
  "common.edit": { darija: "تعديل", fr: "Modifier" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("darija");

  const t = (key: TranslationKey): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
