import { CharacterPlaceholder } from './CharacterPlaceholder';

export function SectionHero({
  label,
  title,
  subtitle,
  tint,
  rightSlot
}: {
  label: string;
  title: string;
  subtitle: string;
  tint: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <header className="wood-header relative">
      {rightSlot ? <div className="absolute right-4 top-4">{rightSlot}</div> : null}
      <div className="mb-2">
        <CharacterPlaceholder label={label} tint={tint} />
      </div>
      <h1 className="text-2xl font-extrabold sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-cream/90 sm:text-base">{subtitle}</p>
    </header>
  );
}
