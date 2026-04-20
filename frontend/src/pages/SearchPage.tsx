import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import WikiHeader from "@/components/WikiHeader";
import WikiSidebar from "@/components/WikiSidebar";
import { Search, Filter, FileText } from "lucide-react";
import { api } from "@/lib/api";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: allArticles = [], isLoading } = useQuery({
    queryKey: ["articles", query],
    queryFn: () => api.articles.search({ q: query || undefined })
  });

  const results = useMemo(() => {
    return allArticles
      .map((article) => ({
        title: article.title,
        excerpt: article.summary || article.content.slice(0, 180),
        categories: [article.author?.username ? `Auteur: ${article.author.username}` : "Communauté"],
        authorUsername: article.author?.username,
        slug: article.slug,
        ratingAverage: article.ratingAverage ?? 0,
        ratingCount: article.ratingCount ?? 0,
        lastModified: new Date(article.updatedAt).toLocaleDateString("fr-FR")
      }))
      .filter((article) => {
        const q = query.toLowerCase();
        const matchesQuery =
          !q ||
          article.title.toLowerCase().includes(q) ||
          article.excerpt.toLowerCase().includes(q) ||
          article.categories.some((c) => c.toLowerCase().includes(q));

        const matchesCategory = !selectedCategory || article.categories.includes(selectedCategory);

        return matchesQuery && matchesCategory;
      });
  }, [allArticles, query, selectedCategory]);

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
              {isLoading && (
                <div className="bg-white rounded-lg border border-[var(--bulbi-border)] p-6 text-center text-[var(--bulbi-text-secondary)]">
                  Chargement des articles...
                </div>
              )}

              {results.map((result) => (
                <Link
                  key={result.title}
                  to={`/article/${result.slug}`}
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
                        {result.authorUsername && (
                          <Link
                            to={`/profil/${result.authorUsername}`}
                            onClick={(event) => event.stopPropagation()}
                            className="text-xs wiki-link shrink-0"
                          >
                            Voir le profil auteur
                          </Link>
                        )}
                        <span className="text-xs text-[var(--bulbi-text-secondary)] shrink-0">
                          Modifié le {result.lastModified} · ★ {result.ratingAverage.toFixed(1)} ({result.ratingCount})
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