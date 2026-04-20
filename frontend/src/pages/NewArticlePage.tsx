import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { api, getApiErrorMessage } from "@/lib/api";
import { RichArticleEditor } from "@/components/RichArticleEditor";

export default function NewArticlePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!api.auth.getToken()) {
      toast.error("Tu dois être connecté pour publier.");
      navigate("/connexion");
      return;
    }

    setLoading(true);

    try {
      const article = await api.articles.create({
        title,
        summary: summary || undefined,
        content,
        heroImageUrl: heroImageUrl || undefined,
        published
      });

      toast.success("Article publié");
      navigate(`/article/${article.slug}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bulbi-bg)] p-4 md:p-8">
      <div className="max-w-full mx-auto space-y-4">
        <div>
          <Link to="/" className="inline-flex items-center text-sm wiki-link mb-3">← Retour à l'accueil</Link>
          <h1 className="font-serif text-3xl font-bold text-[var(--bulbi-text)] mb-2">Nouvel article</h1>
          <p className="text-sm text-[var(--bulbi-text-secondary)]">Publie un article dans Bulbipédia avec un éditeur riche et un aperçu en temps réel.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 h-[calc(100vh-220px)]">
          <RichArticleEditor
            title={title}
            summary={summary}
            content={content}
            heroImageUrl={heroImageUrl}
            onTitleChange={setTitle}
            onSummaryChange={setSummary}
            onContentChange={setContent}
            onHeroImageUrlChange={setHeroImageUrl}
          />

          <div className="flex items-center justify-between gap-3 bg-white rounded-lg border border-[var(--bulbi-border)] p-4">
            <label className="inline-flex items-center gap-2 text-sm text-[var(--bulbi-text)]">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              Publier immédiatement
            </label>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-[var(--bulbi-primary)] text-white font-medium disabled:opacity-70"
            >
              {loading ? "Publication..." : "Publier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
