import WikiHeader from "@/components/WikiHeader";
import WikiSidebar from "@/components/WikiSidebar";
import WikiInfobox from "@/components/WikiInfobox";
import WikiArticle from "@/components/WikiArticle";

const HERO_IMG = "https://mgx-backend-cdn.metadl.com/generate/images/1012844/2026-03-09/7114fcac-9461-414c-943b-cc249383ec50.png";

const bulbizarreStats = [
  { label: "Numéro", value: "#001" },
  { label: "Type", value: "Plante / Poison" },
  { label: "Génération", value: "Première (I)" },
  { label: "Catégorie", value: "Pokémon Graine" },
  { label: "Taille", value: "0,7 m" },
  { label: "Poids", value: "6,9 kg" },
  { label: "Talent", value: "Engrais" },
  { label: "Talent caché", value: "Chlorophylle" },
  { label: "Groupe Œuf", value: "Monstre / Plante" },
  { label: "Évolution", value: "→ Herbizarre (N.16)" },
];

const articleSections = [
  {
    id: "etymologie",
    title: "Étymologie",
    content: `
      <p>Le nom <strong>Bulbizarre</strong> est un mot-valise composé de « <em>bulbe</em> » (référence à la graine sur son dos) et « <em>bizarre</em> » (en raison de son apparence inhabituelle). En anglais, son nom <strong>Bulbasaur</strong> combine « <em>bulb</em> » (bulbe) et « <em>dinosaur</em> » (dinosaure). Son nom japonais <strong>フシギダネ</strong> (Fushigidane) signifie littéralement « graine étrange ».</p>
    `,
  },
  {
    id: "physiologie",
    title: "Physiologie",
    content: `
      <p>Bulbizarre est un petit Pokémon quadrupède à la peau bleu-vert tachetée de taches plus foncées. Son trait le plus distinctif est le <strong>bulbe végétal</strong> qu'il porte sur son dos depuis sa naissance. Ce bulbe grandit progressivement en absorbant la lumière du soleil et les nutriments du sol.</p>
      <p class="mt-2">Ses yeux sont rouges avec des pupilles blanches, et il possède de petites oreilles pointues. Ses pattes sont courtes et trapues, chacune dotée de trois griffes. Sa bouche large lui donne une expression amicale et déterminée.</p>
    `,
    subsections: [
      {
        id: "differences-genre",
        title: "Différences entre les genres",
        content: `<p>Il n'existe pas de différence visuelle entre les Bulbizarre mâles et femelles. Cependant, le ratio de genre est de <strong>87,5% mâle</strong> pour <strong>12,5% femelle</strong>, ce qui rend les femelles relativement rares.</p>`,
      },
    ],
  },
  {
    id: "comportement",
    title: "Comportement et habitat",
    content: `
      <p>Bulbizarre est un Pokémon docile et loyal. Il est souvent trouvé dans les <strong>prairies ensoleillées</strong> et les <strong>forêts claires</strong> où la lumière du soleil est abondante, car il en a besoin pour nourrir le bulbe sur son dos.</p>
      <p class="mt-2">Dès sa naissance, Bulbizarre porte une graine sur son dos. Cette graine se développe lentement en puisant les nutriments du corps de Bulbizarre. On dit que la graine a été plantée à sa naissance et qu'elle pousse avec lui. Lorsque la graine est suffisamment développée, Bulbizarre évolue en <span class="wiki-link cursor-pointer">Herbizarre</span>.</p>
    `,
  },
  {
    id: "statistiques",
    title: "Statistiques de base",
    content: `
      <div class="overflow-x-auto mt-2">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-[var(--bulbi-accent)] text-white">
              <th class="px-3 py-2 text-left rounded-tl">Statistique</th>
              <th class="px-3 py-2 text-center">Base</th>
              <th class="px-3 py-2 text-left rounded-tr">Barre</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-[var(--bulbi-bg)]">
              <td class="px-3 py-1.5 font-medium">PV</td>
              <td class="px-3 py-1.5 text-center">45</td>
              <td class="px-3 py-1.5"><div class="h-3 bg-[var(--bulbi-border)] rounded-full overflow-hidden"><div class="h-full bg-green-500 rounded-full" style="width: 30%"></div></div></td>
            </tr>
            <tr class="bg-white">
              <td class="px-3 py-1.5 font-medium">Attaque</td>
              <td class="px-3 py-1.5 text-center">49</td>
              <td class="px-3 py-1.5"><div class="h-3 bg-[var(--bulbi-border)] rounded-full overflow-hidden"><div class="h-full bg-red-400 rounded-full" style="width: 32%"></div></div></td>
            </tr>
            <tr class="bg-[var(--bulbi-bg)]">
              <td class="px-3 py-1.5 font-medium">Défense</td>
              <td class="px-3 py-1.5 text-center">49</td>
              <td class="px-3 py-1.5"><div class="h-3 bg-[var(--bulbi-border)] rounded-full overflow-hidden"><div class="h-full bg-yellow-400 rounded-full" style="width: 32%"></div></div></td>
            </tr>
            <tr class="bg-white">
              <td class="px-3 py-1.5 font-medium">Atq. Spé.</td>
              <td class="px-3 py-1.5 text-center">65</td>
              <td class="px-3 py-1.5"><div class="h-3 bg-[var(--bulbi-border)] rounded-full overflow-hidden"><div class="h-full bg-blue-400 rounded-full" style="width: 43%"></div></div></td>
            </tr>
            <tr class="bg-[var(--bulbi-bg)]">
              <td class="px-3 py-1.5 font-medium">Déf. Spé.</td>
              <td class="px-3 py-1.5 text-center">65</td>
              <td class="px-3 py-1.5"><div class="h-3 bg-[var(--bulbi-border)] rounded-full overflow-hidden"><div class="h-full bg-purple-400 rounded-full" style="width: 43%"></div></div></td>
            </tr>
            <tr class="bg-white">
              <td class="px-3 py-1.5 font-medium">Vitesse</td>
              <td class="px-3 py-1.5 text-center">45</td>
              <td class="px-3 py-1.5"><div class="h-3 bg-[var(--bulbi-border)] rounded-full overflow-hidden"><div class="h-full bg-pink-400 rounded-full" style="width: 30%"></div></div></td>
            </tr>
            <tr class="bg-[var(--bulbi-bg)] font-semibold">
              <td class="px-3 py-1.5 rounded-bl">Total</td>
              <td class="px-3 py-1.5 text-center">318</td>
              <td class="px-3 py-1.5 rounded-br"><div class="h-3 bg-[var(--bulbi-border)] rounded-full overflow-hidden"><div class="h-full bg-[var(--bulbi-primary)] rounded-full" style="width: 35%"></div></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: "evolution",
    title: "Chaîne d'évolution",
    content: `
      <div class="flex flex-wrap items-center gap-4 mt-2 p-4 bg-[var(--bulbi-bg)] rounded-lg border border-[var(--bulbi-border)]">
        <div class="text-center">
          <div class="w-20 h-20 bg-white rounded-full border-2 border-[var(--bulbi-primary)] flex items-center justify-center text-2xl mb-1">🌱</div>
          <p class="text-sm font-semibold text-[var(--bulbi-link)]">Bulbizarre</p>
          <p class="text-xs text-[var(--bulbi-text-secondary)]">#001</p>
        </div>
        <div class="text-[var(--bulbi-primary)] font-bold text-lg">→ <span class="text-xs block">Niv. 16</span></div>
        <div class="text-center">
          <div class="w-20 h-20 bg-white rounded-full border-2 border-[var(--bulbi-secondary)] flex items-center justify-center text-2xl mb-1">🌿</div>
          <p class="text-sm font-semibold text-[var(--bulbi-link)]">Herbizarre</p>
          <p class="text-xs text-[var(--bulbi-text-secondary)]">#002</p>
        </div>
        <div class="text-[var(--bulbi-primary)] font-bold text-lg">→ <span class="text-xs block">Niv. 32</span></div>
        <div class="text-center">
          <div class="w-20 h-20 bg-white rounded-full border-2 border-[var(--bulbi-accent)] flex items-center justify-center text-2xl mb-1">🌺</div>
          <p class="text-sm font-semibold text-[var(--bulbi-link)]">Florizarre</p>
          <p class="text-xs text-[var(--bulbi-text-secondary)]">#003</p>
        </div>
      </div>
    `,
  },
  {
    id: "capacites",
    title: "Capacités apprises",
    content: `
      <div class="overflow-x-auto mt-2">
        <table class="w-full text-sm border-collapse border border-[var(--bulbi-border)]">
          <thead>
            <tr class="bg-[var(--bulbi-accent)] text-white">
              <th class="px-3 py-2 text-left border-r border-white/20">Niveau</th>
              <th class="px-3 py-2 text-left border-r border-white/20">Capacité</th>
              <th class="px-3 py-2 text-left border-r border-white/20">Type</th>
              <th class="px-3 py-2 text-center border-r border-white/20">Puissance</th>
              <th class="px-3 py-2 text-center">Précision</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-[var(--bulbi-bg)] border-b border-[var(--bulbi-border)]">
              <td class="px-3 py-1.5">1</td>
              <td class="px-3 py-1.5 font-medium">Charge</td>
              <td class="px-3 py-1.5"><span class="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">Normal</span></td>
              <td class="px-3 py-1.5 text-center">40</td>
              <td class="px-3 py-1.5 text-center">100%</td>
            </tr>
            <tr class="bg-white border-b border-[var(--bulbi-border)]">
              <td class="px-3 py-1.5">1</td>
              <td class="px-3 py-1.5 font-medium">Rugissement</td>
              <td class="px-3 py-1.5"><span class="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">Normal</span></td>
              <td class="px-3 py-1.5 text-center">—</td>
              <td class="px-3 py-1.5 text-center">100%</td>
            </tr>
            <tr class="bg-[var(--bulbi-bg)] border-b border-[var(--bulbi-border)]">
              <td class="px-3 py-1.5">7</td>
              <td class="px-3 py-1.5 font-medium">Vampigraine</td>
              <td class="px-3 py-1.5"><span class="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs">Plante</span></td>
              <td class="px-3 py-1.5 text-center">—</td>
              <td class="px-3 py-1.5 text-center">90%</td>
            </tr>
            <tr class="bg-white border-b border-[var(--bulbi-border)]">
              <td class="px-3 py-1.5">13</td>
              <td class="px-3 py-1.5 font-medium">Fouet Lianes</td>
              <td class="px-3 py-1.5"><span class="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs">Plante</span></td>
              <td class="px-3 py-1.5 text-center">45</td>
              <td class="px-3 py-1.5 text-center">100%</td>
            </tr>
            <tr class="bg-[var(--bulbi-bg)] border-b border-[var(--bulbi-border)]">
              <td class="px-3 py-1.5">20</td>
              <td class="px-3 py-1.5 font-medium">Poudre Toxik</td>
              <td class="px-3 py-1.5"><span class="px-2 py-0.5 bg-purple-200 text-purple-800 rounded text-xs">Poison</span></td>
              <td class="px-3 py-1.5 text-center">—</td>
              <td class="px-3 py-1.5 text-center">75%</td>
            </tr>
            <tr class="bg-white">
              <td class="px-3 py-1.5">27</td>
              <td class="px-3 py-1.5 font-medium">Tranch'Herbe</td>
              <td class="px-3 py-1.5"><span class="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs">Plante</span></td>
              <td class="px-3 py-1.5 text-center">55</td>
              <td class="px-3 py-1.5 text-center">95%</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: "anecdotes",
    title: "Anecdotes",
    content: `
      <ul class="list-disc list-inside space-y-2 text-[var(--bulbi-text)]">
        <li>Bulbizarre est le <strong>premier Pokémon</strong> dans l'ordre du Pokédex National.</li>
        <li>Malgré son apparence de reptile, Bulbizarre est classé dans le groupe d'œuf « <strong>Monstre</strong> » et « <strong>Plante</strong> ».</li>
        <li>Dans l'anime, le Bulbizarre de Sacha est l'un des Pokémon les plus loyaux et fiables de son équipe.</li>
        <li>Bulbizarre est le seul Pokémon de départ de la première génération à être de double type dès sa forme de base.</li>
        <li>Son design est inspiré d'un <strong>crapaud</strong> ou d'un <strong>dinosaure</strong> portant un bulbe de plante.</li>
      </ul>
    `,
  },
];

const articleCategories = [
  "Pokémon de type Plante",
  "Pokémon de type Poison",
  "Pokémon de départ",
  "Première génération",
  "Pokémon de Kanto",
  "Pokémon Graine",
];

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-[var(--bulbi-bg)]">
      <WikiHeader />

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          <WikiSidebar />

          <main className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <nav className="text-sm text-[var(--bulbi-text-secondary)] mb-4 flex items-center gap-1.5">
              <a href="/" className="wiki-link">Accueil</a>
              <span>›</span>
              <a href="/categories" className="wiki-link">Pokémon</a>
              <span>›</span>
              <span className="text-[var(--bulbi-text)]">Bulbizarre</span>
            </nav>

            {/* Article with Infobox */}
            <div className="relative">
              <WikiInfobox
                title="Bulbizarre"
                subtitle="Pokémon #001 — Graine"
                imageUrl={HERO_IMG}
                imageAlt="Bulbizarre"
                stats={bulbizarreStats}
                footer="Artwork officiel de Bulbizarre"
              />

              <WikiArticle
                title="Bulbizarre"
                intro={`
                  <p><strong>Bulbizarre</strong> (Bulbasaur en anglais, フシギダネ <em>Fushigidane</em> en japonais) est un <span class="wiki-link cursor-pointer">Pokémon</span> de type <span style="color: #4CAF7D; font-weight: 600;">Plante</span> / <span style="color: #A040A0; font-weight: 600;">Poison</span> introduit dans la <span class="wiki-link cursor-pointer">première génération</span>. Il porte le numéro 001 dans le <span class="wiki-link cursor-pointer">Pokédex National</span>.</p>
                  <p class="mt-2">Il est l'un des trois <span class="wiki-link cursor-pointer">Pokémon de départ</span> proposés par le <span class="wiki-link cursor-pointer">Professeur Chen</span> dans les jeux <em>Pokémon Rouge</em> et <em>Pokémon Bleu</em>, aux côtés de <span class="wiki-link cursor-pointer">Salamèche</span> et <span class="wiki-link cursor-pointer">Carapuce</span>. Il évolue en <span class="wiki-link cursor-pointer">Herbizarre</span> à partir du niveau 16, puis en <span class="wiki-link cursor-pointer">Florizarre</span> à partir du niveau 32.</p>
                  <p class="mt-2">Il est le pokémon qui a inspiré la liste <span class="wiki-link cursor-pointer">Bulbiz'art</span> d'élèves de Centrale à lister pour les campagnes.</p>
                `}
                sections={articleSections}
                categories={articleCategories}
              />
            </div>

            {/* Footer */}
            <footer className="mt-8 py-6 border-t border-[var(--bulbi-border)]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--bulbi-text-secondary)]">
                <div className="flex items-center gap-4">
                  <span>© 2026 Bulbipédia - JusiBridou</span>
                  <span>·</span>
                  <span>Contenu sous licence CC BY-SA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Dernière modification : 13 mars 2026 à 15h32</span>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}