import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bold, Italic, Heading2, Link, Image as ImageIcon, Type } from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

type ToolbarAction = "bold" | "italic" | "h2" | "h3" | "link" | "image" | "bullet";

export function RichArticleEditor({
  title,
  summary,
  content,
  heroImageFile,
  onTitleChange,
  onSummaryChange,
  onContentChange,
  onHeroImageFileChange
}: {
  title: string;
  summary: string;
  content: string;
  heroImageFile: File | null;
  onTitleChange: (title: string) => void;
  onSummaryChange: (summary: string) => void;
  onContentChange: (content: string) => void;
  onHeroImageFileChange: (file: File | null) => void;
}) {
  const [contentFocused, setContentFocused] = useState(false);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState("");

  const extractHeadings = (markdown: string): string[] => {
    const lines = markdown.split("\n");
    return lines
      .filter((line) => line.startsWith("##") || line.startsWith("###"))
      .map((line) => line.replace(/^#+\s/, ""))
      .filter(Boolean);
  };

  const headings = useMemo(() => extractHeadings(content), [content]);

  useEffect(() => {
    if (!heroImageFile) {
      setHeroPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(heroImageFile);
    setHeroPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [heroImageFile]);

  const insertMarkdown = (before: string, after: string = "") => {
    const textareaRef = document.getElementById("article-content") as HTMLTextAreaElement | null;
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selectedText = content.substring(start, end) || "texte";
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    onContentChange(newContent);

    setTimeout(() => {
      textareaRef.selectionStart = start + before.length;
      textareaRef.selectionEnd = start + before.length + selectedText.length;
      textareaRef.focus();
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('URL du lien (exemple: /article/mon-slug ou https://exemple.com):');
    if (!url) return;
    insertMarkdown(`[`, `](${url})`);
  };

  const insertImageFromUpload = async (file: File) => {
    try {
      const uploadedUrl = await api.media.uploadImage(file);
      const caption = prompt("Légende (optionnel):") || "";
      const markdown = `![${caption}](${uploadedUrl})${caption ? ` *${caption}*` : ""}`;
      const textareaRef = document.getElementById("article-content") as HTMLTextAreaElement | null;
      if (!textareaRef) return;

      const start = textareaRef.selectionStart;
      const end = textareaRef.selectionEnd;
      onContentChange(content.substring(0, start) + "\n" + markdown + "\n" + content.substring(end));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleImageButton = () => {
    inlineImageInputRef.current?.click();
  };

  const toolbarButtons: Array<{
    icon: React.ReactNode;
    label: string;
    action: () => void;
  }> = [
    {
      icon: <Heading2 className="w-4 h-4" />,
      label: "Titre 2",
      action: () => insertMarkdown("## ")
    },
    {
      icon: <Type className="w-4 h-4" />,
      label: "Titre 3",
      action: () => insertMarkdown("### ")
    },
    {
      icon: <Bold className="w-4 h-4" />,
      label: "Gras",
      action: () => insertMarkdown("**", "**")
    },
    {
      icon: <Italic className="w-4 h-4" />,
      label: "Italique",
      action: () => insertMarkdown("*", "*")
    },
    {
      icon: <Link className="w-4 h-4" />,
      label: "Lien",
      action: insertLink
    },
    {
      icon: <ImageIcon className="w-4 h-4" />,
      label: "Image",
      action: handleImageButton
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left: Editor */}
      <div className="flex flex-col gap-3 min-h-0">
        <div>
          <label className="block text-sm text-[var(--bulbi-text-secondary)] mb-1">Titre de l'article</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Mon article..."
            className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)]"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--bulbi-text-secondary)] mb-1">Image héro (fichier)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onHeroImageFileChange(e.target.files?.[0] ?? null)}
            className="w-full h-10 px-3 rounded-lg border border-[var(--bulbi-border)] bg-white py-1"
          />
          <p className="mt-1 text-xs text-[var(--bulbi-text-secondary)]">JPEG, PNG, WEBP, GIF ou AVIF. Maximum 5 MB.</p>
        </div>

        <div>
          <label className="block text-sm text-[var(--bulbi-text-secondary)] mb-1">Résumé (pour la recherche)</label>
          <textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="Un court résumé de l'article..."
            className="w-full h-20 px-3 py-2 rounded-lg border border-[var(--bulbi-border)] resize-none"
          />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-[var(--bulbi-text-secondary)]">Contenu (Markdown)</label>
            <span className="text-xs text-[var(--bulbi-text-secondary)]">
              {headings.length} titre(s)
            </span>
          </div>

          <div className="flex gap-1 mb-2 flex-wrap">
            {toolbarButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                title={btn.label}
                className="p-2 rounded-md border border-[var(--bulbi-border)] hover:bg-[var(--bulbi-bg)] transition-colors"
              >
                {btn.icon}
              </button>
            ))}
          </div>

          <input
            ref={inlineImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              event.target.value = "";
              if (!file) {
                return;
              }

              void insertImageFromUpload(file);
            }}
          />

          <textarea
            id="article-content"
            required
            minLength={50}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            onFocus={() => setContentFocused(true)}
            onBlur={() => setContentFocused(false)}
            placeholder="Écris ton article en markdown..."
            className="flex-1 w-full px-3 py-2 rounded-lg border border-[var(--bulbi-border)] resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--bulbi-primary)]"
          />
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex flex-col gap-3 min-h-0 bg-white rounded-lg border border-[var(--bulbi-border)] p-6 overflow-auto">
        <h2 className="font-serif text-2xl font-bold text-[var(--bulbi-text)]">{title || "Titre de l'article"}</h2>

        {/* Infobox Preview */}
        {heroPreviewUrl && (
          <div className="rounded-lg border border-[var(--bulbi-border)] overflow-hidden bg-[var(--bulbi-bg)] mb-2">
            <img
              src={heroPreviewUrl}
              alt={title}
              className="w-full h-40 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="p-3 space-y-1 text-xs">
              <div className="border-b border-[var(--bulbi-border)] pb-1">
                <span className="text-[var(--bulbi-text-secondary)]">Titre</span>
              </div>
              <div>
                <span className="font-semibold">{title}</span>
              </div>
            </div>
          </div>
        )}

        {!heroPreviewUrl && (
          <div className="rounded-lg border border-dashed border-[var(--bulbi-border)] bg-[var(--bulbi-bg)]/50 p-3 text-xs text-[var(--bulbi-text-secondary)]">
            Aucune image héro sélectionnée.
          </div>
        )}

        {/* Sommaire */}
        {headings.length > 0 && (
          <div className="rounded-lg border border-dashed border-[var(--bulbi-border)] p-3 bg-[var(--bulbi-bg)]/50">
            <p className="text-xs font-semibold text-[var(--bulbi-text-secondary)] mb-2">Sommaire</p>
            <ul className="space-y-1 text-sm">
              {headings.map((heading, idx) => (
                <li key={idx} className="text-[var(--bulbi-link)]">
                  • {heading}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content Preview */}
        <div className="prose prose-sm max-w-none text-[var(--bulbi-text)]">
          <ReactMarkdown
            components={{
              h2: ({ node, ...props }) => (
                <h2 className="font-serif text-xl font-bold border-b border-[var(--bulbi-border)] pb-1 mt-3 mb-2" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="font-serif text-lg font-bold mt-2 mb-1" {...props} />
              ),
              strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              p: ({ node, ...props }) => <p className="leading-relaxed mb-2" {...props} />,
              a: ({ node, ...props }) => (
                <a className="text-[var(--bulbi-link)] hover:underline" {...props} />
              ),
              img: ({ node, ...props }) => (
                <div className="my-3">
                  <img {...props} className="w-full rounded-lg border border-[var(--bulbi-border)]" />
                </div>
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-1 mb-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside space-y-1 mb-2" {...props} />
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
