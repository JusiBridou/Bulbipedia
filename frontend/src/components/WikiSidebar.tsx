import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Star,
  Clock,
  Dumbbell,
  Camera,
  Flame,
  Heart,
  Trophy,
  Disc3,
  Briefcase,
} from "lucide-react";

const navigationSections = [
  {
    title: "Navigation",
    links: [
      { to: "/", label: "Accueil", icon: Home },
      { to: "/categories", label: "Catégories", icon: BookOpen },
      { to: "/article/bulbizarre", label: "Article vedette", icon: Star },
    ],
  },
  {
    title: "Types Pokémon",
    links: [
      { to: "/recherche?q=vlog", label: "Vlog", icon: Camera },
      { to: "/recherche?q=benevolat", label: "Bénévolat", icon: Dumbbell },
      { to: "/recherche?q=bulbi we", label: "Bulbi Week End", icon: Heart },
      { to: "/recherche?q=foot", label: "Football", icon: Trophy },
      { to: "/recherche?q=event", label: "Event", icon: Disc3 },
      { to: "/recherche?q=travail", label: "Travail", icon: Briefcase },
      { to: "/recherche?q=taverne", label: "Taverne", icon: Flame },
    ],
  },
  {
    title: "Activité récente",
    links: [
      { to: "/article/bulbizarre", label: "Bulbizarre", icon: Clock },
      { to: "/article/bulbizarre", label: "Herbizarre", icon: Clock },
      { to: "/article/bulbizarre", label: "Florizarre", icon: Clock },
    ],
  },
];

export default function WikiSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-[72px] space-y-4 pr-4">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--bulbi-text-secondary)] mb-2 px-2">
              {section.title}
            </h3>
            <nav className="space-y-0.5">
              {section.links.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? "bg-[var(--bulbi-primary)] text-white font-medium"
                        : "text-[var(--bulbi-text-secondary)] hover:bg-[var(--bulbi-border)] hover:text-[var(--bulbi-text)]"
                    }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Stats box */}
        <div className="bg-white rounded-lg border border-[var(--bulbi-border)] p-3 mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--bulbi-text-secondary)] mb-2">
            Statistiques
          </h3>
          <div className="space-y-1 text-sm text-[var(--bulbi-text-secondary)]">
            <p><span className="font-semibold text-[var(--bulbi-primary)]">44</span> Membres</p>
            <p><span className="font-semibold text-[var(--bulbi-primary)]">2000</span> Dessins de Bulbis</p>
            <p><span className="font-semibold text-[var(--bulbi-primary)]">6767</span> Roses crochetées</p>
          </div>
        </div>
      </div>
    </aside>
  );
}