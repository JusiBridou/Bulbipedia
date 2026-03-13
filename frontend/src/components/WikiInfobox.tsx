interface InfoboxStat {
  label: string;
  value: string;
}

interface WikiInfoboxProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageAlt: string;
  stats: InfoboxStat[];
  footer?: string;
}

export default function WikiInfobox({
  title,
  subtitle,
  imageUrl,
  imageAlt,
  stats,
  footer,
}: WikiInfoboxProps) {
  return (
    <div className="wiki-infobox float-none md:float-right md:ml-6 mb-4 w-full md:w-72">
      {/* Header */}
      <div className="wiki-infobox-header text-lg">
        {title}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="bg-[var(--bulbi-secondary)] text-white text-center text-sm py-1 px-2">
          {subtitle}
        </div>
      )}

      {/* Image */}
      <div className="p-3 flex justify-center bg-white">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-w-full h-auto max-h-52 object-contain rounded"
        />
      </div>

      {/* Stats table */}
      <div className="divide-y divide-[var(--bulbi-border)]">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`grid grid-cols-2 text-sm ${
              index % 2 === 0 ? "bg-[var(--bulbi-bg)]" : "bg-white"
            }`}
          >
            <div className="px-3 py-1.5 font-semibold text-[var(--bulbi-text)]">
              {stat.label}
            </div>
            <div className="px-3 py-1.5 text-[var(--bulbi-text-secondary)]">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {footer && (
        <div className="bg-[var(--bulbi-bg)] text-center text-xs text-[var(--bulbi-text-secondary)] py-2 px-3 border-t border-[var(--bulbi-border)]">
          {footer}
        </div>
      )}
    </div>
  );
}