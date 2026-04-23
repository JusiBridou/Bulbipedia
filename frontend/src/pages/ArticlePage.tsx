import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ChevronDown, ChevronRight } from "lucide-react";
import WikiHeader from "@/components/WikiHeader";
import WikiSidebar from "@/components/WikiSidebar";
import WikiInfobox from "@/components/WikiInfobox";
import { api, getApiErrorMessage, resolveMediaURL } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const FALLBACK_HERO_IMG =
  "https://mgx-backend-cdn.metadl.com/generate/images/1012844/2026-03-09/7114fcac-9461-414c-943b-cc249383ec50.png";

export default function ArticlePage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [tocOpen, setTocOpen] = useState(true);

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => api.articles.bySlug(slug),
    enabled: Boolean(slug)
  });

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.auth.me(),
    enabled: Boolean(api.auth.getToken()),
    retry: false
  });

  const rateMutation = useMutation({
    mutationFn: (value: number) => api.articles.rate(slug, value),
    onSuccess: () => {
      toast.success("Merci pour ta note");
      void queryClient.invalidateQueries({ queryKey: ["article", slug] });
      void queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });

  const headings = useMemo(() => {
    if (!article) return [];
    const lines = article.content.split("\n");
    return lines
      .filter((line) => line.startsWith("##") || line.startsWith("###"))
      .map((line) => ({
        id: line.replace(/^#+\s/, "").toLowerCase().replace(/\s+/g, "-"),
        level: line.startsWith("###") ? 3 : 2,
        title: line.replace(/^#+\s/, "")
      }));
  }, [article]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bulbi-bg)]">
        <WikiHeader />
        <div className="max-w-[1400px] mx-auto px-4 py-8 text-[var(--bulbi-text-secondary)]">Chargement de l'article...</div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-[var(--bulbi-bg)]">
        <WikiHeader />
        <div className="max-w-[900px] mx-auto px-4 py-8">
          <div className="bg-white border border-[var(--bulbi-border)] rounded-lg p-6">
            <h1 className="font-serif text-2xl font-bold text-[var(--bulbi-text)] mb-2">Article introuvable</h1>
            <p className="text-[var(--bulbi-text-secondary)]">Cet article n'existe pas ou n'est pas publié.</p>
            <Link to="/" className="wiki-link inline-block mt-4">Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    );
  }

  const infoboxStats = [
    { label: "Auteur", value: article.author?.username || "Inconnu" },
    { label: "Slug", value: article.slug },
    { label: "Moyenne", value: `★ ${(article.ratingAverage ?? 0).toFixed(1)} / 5` },
    { label: "Votes", value: String(article.ratingCount ?? 0) },
    { label: "Publié", value: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("fr-FR") : "Non" },
    { label: "Mis à jour", value: new Date(article.updatedAt).toLocaleDateString("fr-FR") }
  ];

  return (
    <div className="min-h-screen bg-[var(--bulbi-bg)]">
      <WikiHeader />

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          <WikiSidebar />

          <main className="flex-1 min-w-0">
            <nav className="text-sm text-[var(--bulbi-text-secondary)] mb-4 flex items-center gap-1.5">
              <Link to="/" className="wiki-link">Accueil</Link>
              <span>›</span>
              <span className="text-[var(--bulbi-text)]">{article.title}</span>
            </nav>

            {article.author?.username && (
              <p className="text-sm text-[var(--bulbi-text-secondary)] mb-4">
                Auteur: <Link className="wiki-link" to={`/profil/${article.author.username}`}>@{article.author.username}</Link>
              </p>
            )}

            <div className="relative">
              <WikiInfobox
                title={article.title}
                subtitle={article.summary || "Article Bulbipédia"}
                imageUrl={resolveMediaURL(article.heroImageUrl) || FALLBACK_HERO_IMG}
                imageAlt={article.title}
                stats={infoboxStats}
                footer="Données issues de l'API Bulbipédia"
              />

              <article className="bg-white rounded-lg border border-[var(--bulbi-border)] p-6 md:p-8">
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--bulbi-text)] border-b border-[var(--bulbi-border)] pb-3 mb-4">
                  {article.title}
                </h1>

                {/* Table of Contents */}
                {headings.length > 0 && (
                  <div className="wiki-toc mb-6 inline-block min-w-[250px]">
                    <button
                      onClick={() => setTocOpen(!tocOpen)}
                      className="flex items-center gap-2 font-semibold text-sm text-[var(--bulbi-text)] mb-2 w-full"
                    >
                      {tocOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      Sommaire
                    </button>
                    {tocOpen && (
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {headings.map((heading) => (
                          <li key={heading.id} className={heading.level === 3 ? "ml-4 text-xs" : ""}>
                            <button
                              onClick={() => {
                                const element = document.getElementById(heading.id);
                                if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
                              }}
                              className="wiki-link"
                            >
                              {heading.title}
                            </button>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-sm max-w-none text-[var(--bulbi-text)]">
                  <ReactMarkdown
                    components={{
                      h2: ({ node, ...props }) => (
                        <h2
                          id={props.children?.[0]?.toString().toLowerCase().replace(/\s+/g, "-")}
                          className="font-serif text-xl font-bold border-b border-[var(--bulbi-border)] pb-1 mt-3 mb-2"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          id={props.children?.[0]?.toString().toLowerCase().replace(/\s+/g, "-")}
                          className="font-serif text-lg font-bold mt-2 mb-1"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                      em: ({ node, ...props }) => <em className="italic" {...props} />,
                      p: ({ node, ...props }) => <p className="leading-relaxed mb-2" {...props} />,
                      a: ({ node, ...props }) => (
                        <a className="text-[var(--bulbi-link)] hover:underline" {...props} />
                      ),
                      img: ({ node, ...props }) => (
                        <div className="my-3">
                          <img {...props} className="w-full rounded-lg border border-[var(--bulbi-border)]" />
                        </div>
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside space-y-1 mb-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside space-y-1 mb-2" {...props} />
                      )
                    }}
                  >
                    {article.content}
                  </ReactMarkdown>
                </div>

                {/* Categories */}
                <div className="mt-6 pt-4 border-t border-[var(--bulbi-border)] flex flex-wrap gap-2">
                  {article.author?.username && (
                    <span className="inline-block text-xs bg-[var(--bulbi-bg)] text-[var(--bulbi-text-secondary)] rounded-full px-2.5 py-1">
                      Auteur: {article.author.username}
                    </span>
                  )}
                </div>
              </article>
            </div>

            <section className="mt-4 bg-white border border-[var(--bulbi-border)] rounded-lg p-4">
              <h2 className="font-serif text-xl text-[var(--bulbi-text)] mb-2">Notation</h2>
              <p className="text-sm text-[var(--bulbi-text-secondary)] mb-3">
                Note actuelle: <strong>★ {(article.ratingAverage ?? 0).toFixed(1)}</strong> ({article.ratingCount ?? 0} vote(s))
              </p>

              {me ? (
                <div className="flex items-center gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSelectedRating(value);
                        rateMutation.mutate(value);
                      }}
                      className={`px-3 py-1.5 rounded-full border text-sm ${
                        selectedRating === value
                          ? "bg-[var(--bulbi-primary)] text-white border-[var(--bulbi-primary)]"
                          : "bg-white border-[var(--bulbi-border)] text-[var(--bulbi-text)]"
                      }`}
                    >
                      {value} ★
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-[var(--bulbi-text-secondary)]">
                  Connecte-toi pour noter cet article. {" "}
                  <button onClick={() => navigate("/connexion")} className="wiki-link">Se connecter</button>
                </div>
              )}
            </section>

            <footer className="mt-8 py-6 border-t border-[var(--bulbi-border)]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--bulbi-text-secondary)]">
                <div className="flex items-center gap-4">
                  <span>© 2026 Bulbipédia</span>
                  <span>·</span>
                  <span>Contenu sous licence CC BY-SA</span>
                </div>
                <div>
                  Dernière modification : {new Date(article.updatedAt).toLocaleString("fr-FR")}
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}