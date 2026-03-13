import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, BookOpen, Shuffle, Users, Home } from "lucide-react";

const LOGO_URL = "https://storage.gra.cloud.ovh.net/v1/AUTH_f872c5d9108a481eafb02f903c46dbf0/nantral-platform-prod/group/group/icon/2024/2024-12-13-bulbizart-1734109982.png";

export default function WikiHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: "Accueil", icon: Home },
    { to: "/categories", label: "Catégories", icon: BookOpen },
    { to: "/article/bulbizarre", label: "Article aléatoire", icon: Shuffle },
    { to: "/categories", label: "Communauté", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--bulbi-accent)] shadow-lg">
      {/* Top bar */}
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={LOGO_URL}
              alt="Bulbipédia"
              className="w-12 h-12 rounded-full bg-white/10"
            />
            <span className="text-white font-serif font-bold text-xl hidden sm:block">
              Bulbipédia
            </span>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans Bulbipédia..."
                className="w-full h-9 pl-4 pr-10 rounded-full bg-white/15 text-white placeholder-white/60 border border-white/20 focus:bg-white/25 focus:border-white/40 focus:outline-none transition-all text-sm"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <Search className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </form>

          {/* Nav links - desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="flex items-center gap-1.5 px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors text-sm"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bulbi-accent)] border-t border-white/10 px-4 pb-4">
          <form onSubmit={handleSearch} className="mt-3 mb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full h-9 pl-4 pr-10 rounded-full bg-white/15 text-white placeholder-white/60 border border-white/20 focus:outline-none text-sm"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors text-sm"
            >
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}