import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, Calendar, BarChart3, Settings } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: LayoutDashboard, labelKey: "nav.dashboard" as const },
  { to: "/subjects", icon: BookOpen, labelKey: "nav.subjects" as const },
  { to: "/planner", icon: Calendar, labelKey: "nav.planner" as const },
  { to: "/progress", icon: BarChart3, labelKey: "nav.progress" as const },
  { to: "/settings", icon: Settings, labelKey: "nav.settings" as const },
];

export function BottomNav() {
  const { t } = useI18n();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2.5 text-xs transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-px left-2 right-2 h-0.5 rounded-full gradient-hero"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon
                size={22}
                className={isActive ? "text-primary" : "text-muted-foreground"}
              />
              <span className={isActive ? "font-semibold text-primary" : "text-muted-foreground"}>
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
