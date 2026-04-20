import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { api, getApiErrorMessage } from "@/lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.auth.register({
        email,
        username,
        password,
        avatarUrl: avatarUrl.trim() ? avatarUrl.trim() : undefined
      });
      toast.success("Compte créé avec succès");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bulbi-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[var(--bulbi-border)] rounded-lg p-6">
        <Link to="/" className="inline-flex items-center text-sm wiki-link mb-3">← Retour à l'accueil</Link>
        <h1 className="text-2xl font-serif font-bold text-[var(--bulbi-text)] mb-1">Inscription</h1>
        <p className="text-sm text-[var(--bulbi-text-secondary)] mb-5">Crée ton compte Bulbipédia.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)]"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)]"
          />
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="URL photo de profil (optionnel)"
            className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)]"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe (8+ caractères)"
            className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-[var(--bulbi-primary)] text-white font-medium disabled:opacity-70"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-sm text-[var(--bulbi-text-secondary)] mt-4">
          Déjà inscrit ? {" "}
          <Link to="/connexion" className="wiki-link">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
