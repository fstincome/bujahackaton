export function PageHeader({ kicker, title, subtitle, badge }: { kicker: string; title: string; subtitle?: string; badge?: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-xs uppercase tracking-widest text-primary">{kicker}</div>
      <h1 className="mt-3 text-4xl font-bold">{title}</h1>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>}
      {badge && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary">
          {badge}
        </div>
      )}
    </div>
  );
}
