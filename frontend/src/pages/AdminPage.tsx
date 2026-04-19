import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import WikiHeader from "@/components/WikiHeader";
import { api, getApiErrorMessage } from "@/lib/api";

export default function AdminPage() {
  const queryClient = useQueryClient();

  const { data: me, isLoading: meLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.auth.me(),
    enabled: Boolean(api.auth.getToken()),
    retry: false
  });

  const {
    data: users = [],
    isLoading: usersLoading
  } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.admin.users(),
    enabled: me?.role === "ADMIN"
  });

  const {
    data: articles = [],
    isLoading: articlesLoading
  } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: () => api.admin.articles(),
    enabled: me?.role === "ADMIN"
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.admin.deleteUser(userId),
    onSuccess: () => {
      toast.success("Compte supprimé");
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (articleId: string) => api.admin.deleteArticle(articleId),
    onSuccess: () => {
      toast.success("Article supprimé");
      void queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  const totals = useMemo(
    () => ({ users: users.length, articles: articles.length }),
    [users.length, articles.length]
  );

  if (meLoading) {
    return (
      <div className="min-h-screen bg-[var(--bulbi-bg)]">
        <WikiHeader />
        <div className="max-w-[1000px] mx-auto px-4 py-8 text-[var(--bulbi-text-secondary)]">Chargement...</div>
      </div>
    );
  }

  if (!me) {
    return <Navigate to="/connexion" replace />;
  }

  if (me.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--bulbi-bg)]">
      <WikiHeader />

      <main className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
        <section className="bg-white border border-[var(--bulbi-border)] rounded-lg p-5">
          <h1 className="font-serif text-3xl font-bold text-[var(--bulbi-text)]">Administration</h1>
          <p className="text-sm text-[var(--bulbi-text-secondary)] mt-2">
            Zone réservée aux administrateurs. Les suppressions sont définitives.
          </p>
          <div className="mt-4 flex gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-[var(--bulbi-bg)] border border-[var(--bulbi-border)]">
              Utilisateurs: {totals.users}
            </span>
            <span className="px-3 py-1 rounded-full bg-[var(--bulbi-bg)] border border-[var(--bulbi-border)]">
              Articles: {totals.articles}
            </span>
          </div>
        </section>

        <section className="bg-white border border-[var(--bulbi-border)] rounded-lg p-5 overflow-x-auto">
          <h2 className="font-serif text-2xl font-bold text-[var(--bulbi-text)] mb-4">Utilisateurs</h2>
          {usersLoading ? (
            <p className="text-sm text-[var(--bulbi-text-secondary)]">Chargement des utilisateurs...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[var(--bulbi-border)]">
                  <th className="py-2">Username</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Rôle</th>
                  <th className="py-2">Articles</th>
                  <th className="py-2">Créé le</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--bulbi-border)] last:border-0">
                    <td className="py-2">@{user.username}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.role}</td>
                    <td className="py-2">{user._count.articles}</td>
                    <td className="py-2">{new Date(user.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="py-2">
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer le compte @${user.username} ?`)) {
                            deleteUserMutation.mutate(user.id);
                          }
                        }}
                        disabled={deleteUserMutation.isPending || user.id === me.id}
                        className="px-3 py-1 rounded border border-red-300 text-red-700 disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="bg-white border border-[var(--bulbi-border)] rounded-lg p-5 overflow-x-auto">
          <h2 className="font-serif text-2xl font-bold text-[var(--bulbi-text)] mb-4">Articles</h2>
          {articlesLoading ? (
            <p className="text-sm text-[var(--bulbi-text-secondary)]">Chargement des articles...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[var(--bulbi-border)]">
                  <th className="py-2">Titre</th>
                  <th className="py-2">Slug</th>
                  <th className="py-2">Auteur</th>
                  <th className="py-2">Statut</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-[var(--bulbi-border)] last:border-0">
                    <td className="py-2">
                      <Link to={`/article/${article.slug}`} className="wiki-link">
                        {article.title}
                      </Link>
                    </td>
                    <td className="py-2">{article.slug}</td>
                    <td className="py-2">@{article.author.username}</td>
                    <td className="py-2">{article.published ? "Publié" : "Brouillon"}</td>
                    <td className="py-2">
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer l'article "${article.title}" ?`)) {
                            deleteArticleMutation.mutate(article.id);
                          }
                        }}
                        disabled={deleteArticleMutation.isPending}
                        className="px-3 py-1 rounded border border-red-300 text-red-700 disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
