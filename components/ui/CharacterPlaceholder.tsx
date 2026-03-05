export function CharacterPlaceholder({ label, tint }: { label: string; tint: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold text-cream backdrop-blur">
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-night"
        style={{ backgroundColor: tint }}
      >
        {label.slice(0, 1)}
      </span>
      <span>{label}</span>
    </div>
  );
}