import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import WikiHeader from "@/components/WikiHeader";
import { api, getApiErrorMessage } from "@/lib/api";

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [nextUsername, setNextUsername] = useState("");
  const [nextAvatarUrl, setNextAvatarUrl] = useState("");

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.auth.me(),
    enabled: Boolean(api.auth.getToken()),
    retry: false
  });

  const resolvedUsername = username ?? me?.username;

  const profileQuery = useQuery({
    queryKey: ["profile", resolvedUsername],
    queryFn: () => api.users.profile(resolvedUsername as string),
    enabled: Boolean(resolvedUsername)
  });

  const isOwnProfile = useMemo(() => {
    if (!me || !resolvedUsername) {
      return false;
    }
    return me.username.toLowerCase() === resolvedUsername.toLowerCase();
  }, [me, resolvedUsername]);

  useEffect(() => {
    if (!isOwnProfile || !profileQuery.data) {
      return;
    }

    setNextUsername(profileQuery.data.profile.username);
    setNextAvatarUrl(profileQuery.data.profile.avatarUrl ?? "");
  }, [isOwnProfile, profileQuery.data]);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.users.updateMe({
        username: nextUsername.trim(),
        avatarUrl: nextAvatarUrl.trim() ? nextAvatarUrl.trim() : null
      }),
    onSuccess: async (updatedUser) => {
      toast.success("Profil mis a jour");
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (username) {
        navigate(`/profil/${updatedUser.username}`, { replace: true });
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });

  if (!resolvedUsername) {
    return (
      <div className="min-h-screen bg-[var(--bulbi-bg)]">
        <WikiHeader />
        <main className="max-w-[860px] mx-auto px-4 py-8">
          <section className="bg-white border border-[var(--bulbi-border)] rounded-xl p-6">
            <h1 className="font-serif text-2xl font-bold text-[var(--bulbi-text)]">Profil</h1>
            <p className="text-[var(--bulbi-text-secondary)] mt-2">
              Connecte-toi pour acceder a ton profil.
            </p>
            <div className="mt-4 flex gap-3">
              <Link to="/connexion" className="px-4 py-2 rounded-lg bg-[var(--bulbi-primary)] text-white text-sm font-medium">
                Se connecter
              </Link>
              <Link to="/" className="px-4 py-2 rounded-lg border border-[var(--bulbi-border)] text-sm">
                Retour a l'accueil
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bulbi-bg)]">
        <WikiHeader />
        <main className="max-w-[960px] mx-auto px-4 py-8 text-[var(--bulbi-text-secondary)]">Chargement du profil...</main>
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="min-h-screen bg-[var(--bulbi-bg)]">
        <WikiHeader />
        <main className="max-w-[860px] mx-auto px-4 py-8">
          <section className="bg-white border border-[var(--bulbi-border)] rounded-xl p-6">
            <h1 className="font-serif text-2xl font-bold text-[var(--bulbi-text)]">Profil introuvable</h1>
            <p className="text-[var(--bulbi-text-secondary)] mt-2">{getApiErrorMessage(profileQuery.error)}</p>
            <Link to="/" className="wiki-link inline-block mt-4">Retour a l'accueil</Link>
          </section>
        </main>
      </div>
    );
  }

  const { profile, articles } = profileQuery.data;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!nextUsername.trim()) {
      toast.error("Le username ne peut pas etre vide");
      return;
    }

    updateMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[var(--bulbi-bg)]">
      <WikiHeader />

      <main className="max-w-[960px] mx-auto px-4 py-8 space-y-6">
        <section className="bg-white border border-[var(--bulbi-border)] rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="w-20 h-20 rounded-full object-cover border border-[var(--bulbi-border)]"
              />
            ) : (
              <span className="w-20 h-20 rounded-full bg-[var(--bulbi-primary)]/20 text-[var(--bulbi-accent)] text-2xl font-semibold flex items-center justify-center border border-[var(--bulbi-border)]">
                {profile.username.slice(0, 1).toUpperCase()}
              </span>
            )}

            <div className="min-w-0">
              <h1 className="font-serif text-3xl font-bold text-[var(--bulbi-text)]">@{profile.username}</h1>
              <p className="text-sm text-[var(--bulbi-text-secondary)] mt-1">
                Membre depuis {new Date(profile.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
            <div className="rounded-lg border border-[var(--bulbi-border)] bg-[var(--bulbi-bg)]/60 p-3">
              <p className="text-xs text-[var(--bulbi-text-secondary)]">Articles publies</p>
              <p className="text-xl font-semibold text-[var(--bulbi-text)]">{profile.articleCount}</p>
            </div>
            <div className="rounded-lg border border-[var(--bulbi-border)] bg-[var(--bulbi-bg)]/60 p-3">
              <p className="text-xs text-[var(--bulbi-text-secondary)]">Note moyenne auteur</p>
              <p className="text-xl font-semibold text-[var(--bulbi-text)]">★ {profile.ratingAverage.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-[var(--bulbi-border)] bg-[var(--bulbi-bg)]/60 p-3 col-span-2 md:col-span-1">
              <p className="text-xs text-[var(--bulbi-text-secondary)]">Nombre total de votes recus</p>
              <p className="text-xl font-semibold text-[var(--bulbi-text)]">{profile.ratingCount}</p>
            </div>
          </div>
        </section>

        {isOwnProfile && (
          <section className="bg-white border border-[var(--bulbi-border)] rounded-xl p-6">
            <h2 className="font-serif text-2xl text-[var(--bulbi-text)]">Modifier mon profil</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-lg">
              <div>
                <label className="block text-sm text-[var(--bulbi-text-secondary)] mb-1">Username</label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={30}
                  value={nextUsername}
                  onChange={(event) => setNextUsername(event.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)]"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--bulbi-text-secondary)] mb-1">URL avatar (optionnel)</label>
                <input
                  type="url"
                  value={nextAvatarUrl}
                  onChange={(event) => setNextAvatarUrl(event.target.value)}
                  placeholder="https://..."
                  className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)]"
                />
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-4 py-2 rounded-lg bg-[var(--bulbi-primary)] text-white text-sm font-medium disabled:opacity-70"
              >
                {updateMutation.isPending ? "Mise a jour..." : "Enregistrer"}
              </button>
            </form>
          </section>
        )}

        <section className="bg-white border border-[var(--bulbi-border)] rounded-xl p-6">
          <h2 className="font-serif text-2xl text-[var(--bulbi-text)]">Articles de @{profile.username}</h2>

          {articles.length === 0 ? (
            <p className="text-sm text-[var(--bulbi-text-secondary)] mt-3">Aucun article publie pour le moment.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {articles.map((article) => (
                <article key={article.id} className="rounded-lg border border-[var(--bulbi-border)] p-4 bg-[var(--bulbi-bg)]/60">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/article/${article.slug}`} className="font-semibold text-[var(--bulbi-link)] hover:underline">
                      {article.title}
                    </Link>
                    <span className="text-xs text-[var(--bulbi-text-secondary)] shrink-0">
                      ★ {article.ratingAverage.toFixed(2)} ({article.ratingCount})
                    </span>
                  </div>
                  <p className="text-sm text-[var(--bulbi-text-secondary)] mt-1 line-clamp-2">
                    {article.summary || "Sans resume"}
                  </p>
                  <p className="text-xs text-[var(--bulbi-text-secondary)] mt-2">
                    Mis a jour le {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
