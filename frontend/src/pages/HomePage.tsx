import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PenSquare, Search, Star, ArrowRight, TrendingUp } from "lucide-react";
import WikiHeader from "@/components/WikiHeader";
import WikiSidebar from "@/components/WikiSidebar";
import { api } from "@/lib/api";

export default function HomePage() {
  const { data: latestArticles = [], isLoading } = useQuery({
    queryKey: ["home-articles"],
    queryFn: () => api.articles.search()
  });

  // Articles les mieux notés
  const topRatedArticles = latestArticles
    .filter(a => a.ratingCount && a.ratingCount > 0)
    .sort((a, b) => (b.ratingAverage ?? 0) - (a.ratingAverage ?? 0))
    .slice(0, 5);

  // Articles tendances (récents avec bonne note)
  const trendingArticles = latestArticles
    .filter(a => a.publishedAt && a.ratingCount && a.ratingCount > 0)
    .sort((a, b) => {
      const scoreA = (a.ratingAverage ?? 0) * (a.ratingCount ?? 0);
      const scoreB = (b.ratingAverage ?? 0) * (b.ratingCount ?? 0);
      return scoreB - scoreA;
    })
    .slice(0, 5);

  const featured = latestArticles.slice(0, 6);

  const ArticleCard = ({ article }: { article: typeof latestArticles[0] }) => (
    <article className="rounded-lg border border-[var(--bulbi-border)] p-4 bg-[var(--bulbi-bg)]/60">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-[var(--bulbi-text)] leading-snug">{article.title}</h3>
        <span className="text-xs shrink-0 inline-flex items-center gap-1 text-[var(--bulbi-text-secondary)]">
          <Star className="w-3.5 h-3.5" />
          {(article.ratingAverage ?? 0).toFixed(1)}
        </span>
      </div>

      <p className="text-sm text-[var(--bulbi-text-secondary)] mt-2 line-clamp-2">
        {article.summary || article.content.slice(0, 140)}
      </p>

      <div className="mt-3 flex items-center justify-between text-xs text-[var(--bulbi-text-secondary)]">
        <Link to={article.author ? `/profil/${article.author.username}` : "/recherche"} className="wiki-link">
          {article.author ? `@${article.author.username}` : "Auteur inconnu"}
        </Link>
        <span>{article.ratingCount ?? 0} vote(s)</span>
      </div>

      <Link to={`/article/${article.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm wiki-link">
        Lire l'article
        <ArrowRight className="w-4 h-4" />
      </Link>
    </article>
  );

  return (
    <div className="min-h-screen bg-[var(--bulbi-bg)]">
      <WikiHeader />

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          <WikiSidebar />

          <main className="flex-1 min-w-0 space-y-6">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-2xl border border-[var(--bulbi-border)] bg-gradient-to-br from-[var(--bulbi-accent)] via-[var(--bulbi-primary)] to-[var(--bulbi-secondary)] text-white p-6 md:p-10">
              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -left-16 -bottom-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

              <div className="relative z-10 max-w-2xl">
                <h1 className="font-serif text-3xl md:text-5xl leading-tight font-bold">
                  Bienvenue sur Bulbipédia
                </h1>
                <p className="mt-3 text-white/90 text-sm md:text-base max-w-xl">
                  Une encyclopédie collaborative où la communauté publie, note et améliore des articles.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/nouvel-article"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[var(--bulbi-accent)] font-semibold hover:bg-white/90 transition-colors"
                  >
                    <PenSquare className="w-4 h-4" />
                    Publier un article
                  </Link>
                  <Link
                    to="/recherche"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/40 text-white hover:bg-white/10 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    Explorer les articles
                  </Link>
                </div>
              </div>
            </section>

            {/* Articles les mieux notés */}
            {topRatedArticles.length > 0 && (
              <section className="bg-white border border-[var(--bulbi-border)] rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[var(--bulbi-primary)]" />
                    <h2 className="font-serif text-2xl text-[var(--bulbi-text)]">Mieux notés</h2>
                  </div>
                  <Link to="/recherche" className="wiki-link text-sm inline-flex items-center gap-1">
                    Voir tout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topRatedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Articles tendances */}
            {trendingArticles.length > 0 && (
              <section className="bg-white border border-[var(--bulbi-border)] rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[var(--bulbi-primary)]" />
                    <h2 className="font-serif text-2xl text-[var(--bulbi-text)]">Tendances</h2>
                  </div>
                  <Link to="/recherche" className="wiki-link text-sm inline-flex items-center gap-1">
                    Voir tout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendingArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Derniers articles publiés */}
            <section className="bg-white border border-[var(--bulbi-border)] rounded-xl p-5 md:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-serif text-2xl text-[var(--bulbi-text)]">Derniers articles publiés</h2>
                <Link to="/recherche" className="wiki-link text-sm inline-flex items-center gap-1">
                  Voir tout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {isLoading ? (
                <p className="text-sm text-[var(--bulbi-text-secondary)]">Chargement des articles...</p>
              ) : featured.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[var(--bulbi-border)] p-6 text-center">
                  <p className="text-[var(--bulbi-text)] font-medium">Aucun article publié pour le moment.</p>
                  <p className="text-sm text-[var(--bulbi-text-secondary)] mt-1">Sois le premier à contribuer.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featured.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
