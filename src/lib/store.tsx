import { createContext, useContext, useState, type ReactNode } from "react";

export interface Chapter {
  id: string;
  name: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  chapters: Chapter[];
}

export interface StudySession {
  id: string;
  subjectId: string;
  chapterId: string;
  date: string;
  startTime: string;
  duration: number; // minutes
  completed: boolean;
}

interface AppState {
  subjects: Subject[];
  sessions: StudySession[];
  addSubject: (name: string, color: string, icon: string) => void;
  addChapter: (subjectId: string, name: string) => void;
  toggleChapter: (subjectId: string, chapterId: string) => void;
  deleteSubject: (id: string) => void;
  addSession: (session: Omit<StudySession, "id">) => void;
  toggleSession: (id: string) => void;
  deleteSession: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

const defaultSubjects: Subject[] = [
  {
    id: "1",
    name: "Mathématiques",
    color: "violet",
    icon: "calculator",
    chapters: [
      { id: "1-1", name: "Les fonctions", completed: true },
      { id: "1-2", name: "Les dérivées", completed: false },
      { id: "1-3", name: "Les intégrales", completed: false },
    ],
  },
  {
    id: "2",
    name: "Physique",
    color: "turquoise",
    icon: "atom",
    chapters: [
      { id: "2-1", name: "La mécanique", completed: true },
      { id: "2-2", name: "L'électricité", completed: true },
      { id: "2-3", name: "L'optique", completed: false },
    ],
  },
  {
    id: "3",
    name: "SVT",
    color: "success",
    icon: "leaf",
    chapters: [
      { id: "3-1", name: "La cellule", completed: false },
      { id: "3-2", name: "La génétique", completed: false },
    ],
  },
];

const defaultSessions: StudySession[] = [
  { id: "s1", subjectId: "1", chapterId: "1-2", date: new Date().toISOString().split("T")[0], startTime: "09:00", duration: 60, completed: false },
  { id: "s2", subjectId: "2", chapterId: "2-3", date: new Date().toISOString().split("T")[0], startTime: "11:00", duration: 45, completed: false },
  { id: "s3", subjectId: "3", chapterId: "3-1", date: new Date().toISOString().split("T")[0], startTime: "14:00", duration: 30, completed: true },
];

let nextId = 100;

export function AppProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [sessions, setSessions] = useState<StudySession[]>(defaultSessions);

  const addSubject = (name: string, color: string, icon: string) => {
    setSubjects((prev) => [...prev, { id: String(nextId++), name, color, icon, chapters: [] }]);
  };

  const addChapter = (subjectId: string, name: string) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? { ...s, chapters: [...s.chapters, { id: `${s.id}-${nextId++}`, name, completed: false }] }
          : s
      )
    );
  };

  const toggleChapter = (subjectId: string, chapterId: string) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? { ...s, chapters: s.chapters.map((c) => (c.id === chapterId ? { ...c, completed: !c.completed } : c)) }
          : s
      )
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setSessions((prev) => prev.filter((s) => s.subjectId !== id));
  };

  const addSession = (session: Omit<StudySession, "id">) => {
    setSessions((prev) => [...prev, { ...session, id: String(nextId++) }]);
  };

  const toggleSession = (id: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AppContext.Provider value={{ subjects, sessions, addSubject, addChapter, toggleChapter, deleteSubject, addSession, toggleSession, deleteSession }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used within AppProvider");
  return context;
}
