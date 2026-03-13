import { Link } from "react-router-dom";
import WikiHeader from "@/components/WikiHeader";
import WikiSidebar from "@/components/WikiSidebar";
import {
  Dumbbell,
  Camera,
  Leaf,
  Heart,
  Car,
  Disc3,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

const BANNER_IMG = "https://storage.gra.cloud.ovh.net/v1/AUTH_f872c5d9108a481eafb02f903c46dbf0/nantral-platform-prod/group/group/banner/2024/2024-12-13-bulbizart-1734096908.jpg";

interface Pole {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  count: number;
  description: string;
}

const Pole: Pole[] = [
  { name: "Bureau", icon: Briefcase, color: "#a56300", bgColor: "#E8F5E9", count: 8, description: "Le Bureau, la tête pensante de la liste" },
  { name: "Com", icon: Camera, color: "#0077ff", bgColor: "#FFF3E0", count: 5, description: "Ceux qui donnent leur beauté et leur charme aux bulbis" },
  { name: "Écolo", icon: Leaf, color: "#1B7A4A", bgColor: "#FFF3E0", count: 3, description: "Les Bulbis sont évidemment engagés" },
  { name: "Event", icon: Disc3, color: "#be18ff", bgColor: "#FFF3E0", count: 5, description: "Le seule vrai pôle actif des bulbis" },
  { name: "Log", icon: Car, color: "#143321", bgColor: "#FFF3E0", count: 3, description: "Heureusement qu'ils sont là pour coordonner tous les projets" },
  { name: "Sensi", icon: Heart, color: "#fa72aa", bgColor: "#FFF3E0", count: 1, description: "Le coeur des bulbis (et son confessoir)" },
  { name: "Staff", icon: Dumbbell, color: "#ff0000", bgColor: "#FFF3E0", count: 5, description: "Les bras des Bulbis, toujours là pour aider" },
];

const Theme = [
  { name: "Annonces", sstitre: "Grandes nouvelles", count: 44, years: "1" },
  { name: "Bulbi Assemblée", sstitre: "La bulbi politique", count: 11, years: "2" },
  { name: "Bulbiglisse", sstitre: "Zwip zwip", count: 15, years: "3" },
  { name: "Bulbi SRFC", sstitre: "Le foot", count: 7, years: "4" },
  { name: "BulbiVlog", sstitre: "Le quotidien des bulbis", count: 24, years: "5" },
  { name: "Bulbi WE", sstitre: "Les WE entre bulbis", count: 23, years: "6" },
  { name: "Centrale", sstitre: "Sommeil", count: 44, years: "7" },
  { name: "Double Diplôme", sstitre: "Voyage voyage", count: 44, years: "8" },
  { name: "Event", sstitre: "Among Us", count: 17, years: "9" },
];

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-[var(--bulbi-bg)]">
      <WikiHeader />

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          <WikiSidebar />

          <main className="flex-1 min-w-0">
            {/* Banner */}
            <div className="relative rounded-xl overflow-hidden mb-6">
              <img
                src={BANNER_IMG}
                alt="Catégories"
                className="w-full h-40 object-cover [object-position:center_90%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bulbi-accent)] via-[var(--bulbi-accent)]/90 to-[var(--bulbi-accent)]/20 flex items-center px-6">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-white">Catégories</h1>
                  <p className="text-white/80 text-sm mt-1">
                    Découvrez l'univers des bulbis à travers les différentes catégorizarres.
                  </p>
                </div>
              </div>
            </div>

            {/* Pôles */}
            <div className="bg-white rounded-lg border border-[var(--bulbi-border)] overflow-hidden mb-6">
              <div className="px-5 py-3 bg-[var(--bulbi-accent)] text-white">
                <h2 className="font-serif font-bold text-lg">Par pôle</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Pole.map((type) => (
                    <Link
                      key={type.name}
                      to={`/recherche?q=${type.name}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[var(--bulbi-border)] hover:shadow-md hover:-translate-y-0.5 transition-all group"
                      style={{ borderLeftColor: type.color, borderLeftWidth: "3px" }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: type.bgColor }}
                      >
                        <type.icon className="w-5 h-5" style={{ color: type.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--bulbi-text)] group-hover:text-[var(--bulbi-link)]">
                          {type.name}
                        </p>
                        <p className="text-xs text-[var(--bulbi-text-secondary)] truncate">
                          {type.count} Membres
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Themes */}
            <div className="bg-white rounded-lg border border-[var(--bulbi-border)] overflow-hidden mb-6">
              <div className="px-5 py-3 bg-[var(--bulbi-primary)] text-white">
                <h2 className="font-serif font-bold text-lg">Par thème</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Theme.map((theme) => (
                    <Link
                      key={theme.name}
                      to={`/recherche?q=${theme.name}`}
                      className="p-4 rounded-lg border border-[var(--bulbi-border)] hover:shadow-md hover:border-[var(--bulbi-primary)] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-[var(--bulbi-text)] group-hover:text-[var(--bulbi-link)]">
                          {theme.name}
                        </h3>
                        <span className="text-xs text-[var(--bulbi-text-secondary)]">{theme.years}</span>
                      </div>
                      <p className="text-sm text-[var(--bulbi-primary)] font-medium">{theme.sstitre}</p>
                      <p className="text-xs text-[var(--bulbi-text-secondary)] mt-1">
                        {theme.count} membres sur Whatsapp
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Other categories */}
            <div className="bg-white rounded-lg border border-[var(--bulbi-border)] overflow-hidden">
              <div className="px-5 py-3 bg-[var(--bulbi-secondary)] text-white">
                <h2 className="font-serif font-bold text-lg">Autres catégories</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {[
                    "Bulbiski",
                    "Wonk'art",
                    "Godzill'art",
                    "BDA",
                    "Stage",
                    "Conditions de diplomation",
                    "Taverne",
                    "Secte",
                    "Materchef",
                    "Woolly Wonka",
                    "Sondages",
                    "Bridge",
                    "6trouille",
                    "Rennes",
                    "Valorant",
                    "Musique",
                  ].map((cat) => (
                    <Link
                      key={cat}
                      to={`/recherche?q=${cat}`}
                      className="px-3 py-2 text-sm text-[var(--bulbi-link)] hover:bg-[var(--bulbi-bg)] rounded-md transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 py-6 border-t border-[var(--bulbi-border)]">
              <div className="text-center text-xs text-[var(--bulbi-text-secondary)]">
                © 2026 Bulbipédia · Contenu sous licence CC BY-SA · JusiBridou
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}