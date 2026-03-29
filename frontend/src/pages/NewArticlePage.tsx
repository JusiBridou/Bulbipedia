import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { api, getApiErrorMessage } from "@/lib/api";

export default function NewArticlePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
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
      <div className="max-w-3xl mx-auto bg-white border border-[var(--bulbi-border)] rounded-lg p-6">
        <h1 className="font-serif text-3xl font-bold text-[var(--bulbi-text)] mb-2">Nouvel article</h1>
        <p className="text-sm text-[var(--bulbi-text-secondary)] mb-5">Publie un article dans Bulbipédia.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre"
            className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)]"
          />
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Résumé court (optionnel)"
            className="w-full min-h-20 px-3 py-2 rounded-lg border border-[var(--bulbi-border)]"
          />
          <textarea
            required
            minLength={50}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenu de l'article (minimum 50 caractères)"
            className="w-full min-h-56 px-3 py-2 rounded-lg border border-[var(--bulbi-border)]"
          />

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
            className="w-full h-10 rounded-lg bg-[var(--bulbi-primary)] text-white font-medium disabled:opacity-70"
          >
            {loading ? "Publication..." : "Publier"}
          </button>
        </form>
      </div>
    </div>
  );
}
