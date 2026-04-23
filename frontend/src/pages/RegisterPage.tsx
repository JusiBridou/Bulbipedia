import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { api, getApiErrorMessage } from "@/lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [avatarFile]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.auth.register({
        email,
        username,
        password,
        avatarFile
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
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)] bg-white py-1"
            />
            <p className="text-xs text-[var(--bulbi-text-secondary)]">Photo de profil optionnelle, format image uniquement.</p>
            {avatarPreviewUrl && (
              <img
                src={avatarPreviewUrl}
                alt="Aperçu avatar"
                className="w-16 h-16 rounded-full object-cover border border-[var(--bulbi-border)]"
              />
            )}
          </div>
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
