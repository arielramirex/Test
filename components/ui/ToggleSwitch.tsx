export function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-8 w-16 rounded-full transition ${checked ? 'bg-aurora shadow-glow' : 'bg-slate-300 dark:bg-slate-600'}`}
      aria-label="Toggle dark mode"
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${checked ? 'left-9' : 'left-1'}`}
      />
    </button>
  );
}