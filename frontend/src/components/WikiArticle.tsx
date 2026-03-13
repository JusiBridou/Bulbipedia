import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: string;
  subsections?: { id: string; title: string; content: string }[];
}

interface WikiArticleProps {
  title: string;
  intro: string;
  sections: Section[];
  categories?: string[];
}

export default function WikiArticle({
  title,
  intro,
  sections,
  categories = [],
}: WikiArticleProps) {
  const [tocOpen, setTocOpen] = useState(true);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <article className="bg-white rounded-lg border border-[var(--bulbi-border)] p-6 md:p-8">
      {/* Title */}
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--bulbi-text)] border-b border-[var(--bulbi-border)] pb-3 mb-4">
        {title}
      </h1>

      {/* Table of Contents */}
      <div className="wiki-toc mb-6 inline-block min-w-[250px]">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="flex items-center gap-2 font-semibold text-sm text-[var(--bulbi-text)] mb-2 w-full"
        >
          {tocOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          Sommaire
        </button>
        {tocOpen && (
          <ol className="list-decimal list-inside space-y-1 text-sm">
            {sections.map((section, index) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className="wiki-link text-sm"
                >
                  {section.title}
                </button>
                {section.subsections && section.subsections.length > 0 && (
                  <ol className="list-decimal list-inside ml-4 mt-1 space-y-0.5">
                    {section.subsections.map((sub, subIndex) => (
                      <li key={sub.id} className="text-xs">
                        <button
                          onClick={() => scrollToSection(sub.id)}
                          className="wiki-link text-xs"
                        >
                          {sub.title}
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Intro */}
      <div
        className="text-[var(--bulbi-text)] leading-relaxed mb-6"
        dangerouslySetInnerHTML={{ __html: intro }}
      />

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.id} className="mb-6">
          <h2
            id={section.id}
            className="wiki-heading font-serif text-2xl font-bold scroll-mt-20"
          >
            {section.title}
          </h2>
          <div
            className="text-[var(--bulbi-text)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
          {section.subsections?.map((sub) => (
            <div key={sub.id} className="mt-4 ml-2">
              <h3
                id={sub.id}
                className="text-lg font-semibold text-[var(--bulbi-text)] mb-2 scroll-mt-20"
              >
                {sub.title}
              </h3>
              <div
                className="text-[var(--bulbi-text)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sub.content }}
              />
            </div>
          ))}
        </div>
      ))}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mt-8 pt-4 border-t border-[var(--bulbi-border)]">
          <span className="text-sm font-semibold text-[var(--bulbi-text-secondary)] mr-2">
            Catégories :
          </span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-block px-2.5 py-0.5 bg-[var(--bulbi-bg)] text-[var(--bulbi-link)] text-xs font-medium rounded-full border border-[var(--bulbi-border)] hover:bg-[var(--bulbi-highlight)] hover:text-[var(--bulbi-accent)] transition-colors cursor-pointer"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}