import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import WikiHeader from "@/components/WikiHeader";
import WikiSidebar from "@/components/WikiSidebar";
import { Search, Filter, FileText } from "lucide-react";

interface SearchResult {
  title: string;
  excerpt: string;
  categories: string[];
  lastModified: string;
}

const allArticles: SearchResult[] = [
  {
    title: "Bulbizarre",
    excerpt: "Bulbizarre (Bulbasaur) est un Pokémon de type Plante/Poison de la première génération. Il est le premier Pokémon du Pokédex National et l'un des trois Pokémon de départ proposés par le Professeur Chen.",
    categories: ["Plante", "Poison", "Génération I", "Pokémon de départ"],
    lastModified: "9 mars 2026",
  },
  {
    title: "Herbizarre",
    excerpt: "Herbizarre (Ivysaur) est un Pokémon de type Plante/Poison. Il est l'évolution de Bulbizarre à partir du niveau 16. Le bourgeon sur son dos s'est transformé en une grande fleur qui absorbe la lumière du soleil.",
    categories: ["Plante", "Poison", "Génération I"],
    lastModified: "8 mars 2026",
  },
  {
    title: "Florizarre",
    excerpt: "Florizarre (Venusaur) est un Pokémon de type Plante/Poison. Il est l'évolution finale de Bulbizarre. La fleur sur son dos est maintenant en pleine floraison et dégage un parfum apaisant.",
    categories: ["Plante", "Poison", "Génération I"],
    lastModified: "7 mars 2026",
  },
  {
    title: "Pikachu",
    excerpt: "Pikachu est un Pokémon de type Électrik de la première génération. Il est la mascotte officielle de la franchise Pokémon et le partenaire de Sacha dans l'anime.",
    categories: ["Électrik", "Génération I"],
    lastModified: "9 mars 2026",
  },
  {
    title: "Salamèche",
    excerpt: "Salamèche (Charmander) est un Pokémon de type Feu de la première génération. C'est l'un des trois Pokémon de départ proposés par le Professeur Chen dans Pokémon Rouge et Bleu.",
    categories: ["Feu", "Génération I", "Pokémon de départ"],
    lastModified: "6 mars 2026",
  },
  {
    title: "Carapuce",
    excerpt: "Carapuce (Squirtle) est un Pokémon de type Eau de la première génération. C'est l'un des trois Pokémon de départ proposés par le Professeur Chen.",
    categories: ["Eau", "Génération I", "Pokémon de départ"],
    lastModified: "5 mars 2026",
  },
  {
    title: "Dracaufeu",
    excerpt: "Dracaufeu (Charizard) est un Pokémon de type Feu/Vol. Il est l'évolution finale de Salamèche et l'un des Pokémon les plus populaires de la franchise.",
    categories: ["Feu", "Vol", "Génération I"],
    lastModified: "8 mars 2026",
  },
  {
    title: "Mewtwo",
    excerpt: "Mewtwo est un Pokémon légendaire de type Psy de la première génération. Il a été créé par manipulation génétique à partir de l'ADN de Mew.",
    categories: ["Psy", "Génération I", "Pokémon légendaires"],
    lastModified: "4 mars 2026",
  },
  {
    title: "Évoli",
    excerpt: "Évoli (Eevee) est un Pokémon de type Normal connu pour sa capacité unique à évoluer en huit formes différentes selon les conditions.",
    categories: ["Normal", "Génération I"],
    lastModified: "7 mars 2026",
  },
  {
    title: "Rondoudou",
    excerpt: "Rondoudou (Jigglypuff) est un Pokémon de type Normal/Fée de la première génération. Il est connu pour sa berceuse qui endort tous ceux qui l'écoutent.",
    categories: ["Normal", "Fée", "Génération I"],
    lastModified: "3 mars 2026",
  },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return allArticles.filter((article) => {
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.categories.some((c) => c.toLowerCase().includes(q));

      const matchesCategory =
        !selectedCategory ||
        article.categories.includes(selectedCategory);

      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    results.forEach((r) => r.categories.forEach((c) => cats.add(c)));
    return Array.from(cats).sort();
  }, [results]);

  return (
    <div className="min-h-screen bg-[var(--bulbi-bg)]">
      <WikiHeader />

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          <WikiSidebar />

          <main className="flex-1 min-w-0">
            {/* Search header */}
            <div className="bg-white rounded-lg border border-[var(--bulbi-border)] p-5 mb-6">
              <h1 className="font-serif text-2xl font-bold text-[var(--bulbi-text)] mb-4">
                Résultats de recherche
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (localQuery.trim()) {
                    window.location.href = `/recherche?q=${encodeURIComponent(localQuery.trim())}`;
                  }
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Rechercher dans Bulbipédia..."
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--bulbi-border)] bg-[var(--bulbi-bg)] text-[var(--bulbi-text)] focus:outline-none focus:ring-2 focus:ring-[var(--bulbi-primary)] text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--bulbi-text-secondary)]" />
                </div>
                <button
                  type="submit"
                  className="px-5 h-10 bg-[var(--bulbi-primary)] hover:bg-[var(--bulbi-secondary)] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Rechercher
                </button>
              </form>

              {query && (
                <p className="text-sm text-[var(--bulbi-text-secondary)] mt-3">
                  {results.length} résultat{results.length !== 1 ? "s" : ""} pour « <strong className="text-[var(--bulbi-text)]">{query}</strong> »
                </p>
              )}
            </div>

            {/* Filters */}
            {allCategories.length > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Filter className="w-4 h-4 text-[var(--bulbi-text-secondary)]" />
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    !selectedCategory
                      ? "bg-[var(--bulbi-primary)] text-white border-[var(--bulbi-primary)]"
                      : "bg-white text-[var(--bulbi-text-secondary)] border-[var(--bulbi-border)] hover:border-[var(--bulbi-primary)]"
                  }`}
                >
                  Tous
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      selectedCategory === cat
                        ? "bg-[var(--bulbi-primary)] text-white border-[var(--bulbi-primary)]"
                        : "bg-white text-[var(--bulbi-text-secondary)] border-[var(--bulbi-border)] hover:border-[var(--bulbi-primary)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Results */}
            <div className="space-y-3">
              {results.map((result) => (
                <Link
                  key={result.title}
                  to="/article/bulbizarre"
                  className="block bg-white rounded-lg border border-[var(--bulbi-border)] p-4 hover:border-[var(--bulbi-primary)] hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[var(--bulbi-primary)] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-[var(--bulbi-link)] group-hover:underline">
                        {result.title}
                      </h3>
                      <p className="text-sm text-[var(--bulbi-text)] mt-1 line-clamp-2 leading-relaxed">
                        {result.excerpt}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex gap-1.5 flex-wrap">
                          {result.categories.map((cat) => (
                            <span
                              key={cat}
                              className="px-2 py-0.5 text-xs bg-[var(--bulbi-bg)] text-[var(--bulbi-text-secondary)] rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-[var(--bulbi-text-secondary)] shrink-0">
                          {result.lastModified}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {results.length === 0 && (
                <div className="bg-white rounded-lg border border-[var(--bulbi-border)] p-8 text-center">
                  <Search className="w-12 h-12 text-[var(--bulbi-border)] mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-[var(--bulbi-text)] mb-1">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-sm text-[var(--bulbi-text-secondary)]">
                    Essayez avec d'autres mots-clés ou parcourez les{" "}
                    <Link to="/categories" className="wiki-link">catégories</Link>.
                  </p>
                </div>
              )}
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