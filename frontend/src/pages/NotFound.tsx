import { Link } from "react-router-dom";
import WikiHeader from "@/components/WikiHeader";
import { Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bulbi-bg)]">
      <WikiHeader />

      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="font-serif text-3xl font-bold text-[var(--bulbi-text)] mb-3">
          Page introuvable
        </h1>
        <p className="text-[var(--bulbi-text-secondary)] mb-6">
          Bulbipédia ne possède pas encore d'article avec ce titre.
          Vous pouvez créer cet article ou rechercher un autre sujet.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bulbi-primary)] hover:bg-[var(--bulbi-secondary)] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
          <Link
            to="/recherche?q="
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[var(--bulbi-border)] hover:border-[var(--bulbi-primary)] text-[var(--bulbi-text)] rounded-lg text-sm font-medium transition-colors"
          >
            <Search className="w-4 h-4" />
            Rechercher
          </Link>
        </div>
      </div>
    </div>
  );
}