import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { api, getApiErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.auth.login({ email, password });
      toast.success("Connexion réussie");
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
        <h1 className="text-2xl font-serif font-bold text-[var(--bulbi-text)] mb-1">Connexion</h1>
        <p className="text-sm text-[var(--bulbi-text-secondary)] mb-5">Connecte-toi pour publier et noter des articles.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)]"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-[var(--bulbi-primary)] text-white font-medium disabled:opacity-70"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-sm text-[var(--bulbi-text-secondary)] mt-4">
          Pas encore de compte ? {" "}
          <Link to="/inscription" className="wiki-link">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
