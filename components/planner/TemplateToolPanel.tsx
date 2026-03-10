import { templateTools, type TemplateToolId } from '@/src/data/islandPlanner';

export function TemplateToolPanel({
  activeTemplateId,
  templateSize,
  onSelectTemplate,
  onTemplateSize
}: {
  activeTemplateId: TemplateToolId | null;
  templateSize: number;
  onSelectTemplate: (templateId: TemplateToolId) => void;
  onTemplateSize: (size: number) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl bg-white/85 p-4 shadow-float dark:bg-slate-900/75">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">Template Tools</h3>
      <div className="grid gap-2">
        {templateTools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelectTemplate(tool.id)}
            className={`rounded-xl px-3 py-2 text-left text-sm font-bold ${
              activeTemplateId === tool.id ? 'bg-meadow text-slate-900 dark:bg-aurora' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <p>{tool.name}</p>
            <p className="text-xs font-medium opacity-80">{tool.description}</p>
          </button>
        ))}
      </div>

      <label className="block rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        Template Size: {templateSize}
        <input
          type="range"
          min={2}
          max={12}
          step={1}
          value={templateSize}
          onChange={(event) => onTemplateSize(Number(event.target.value))}
          className="mt-1 w-full"
        />
      </label>
    </section>
  );
}

