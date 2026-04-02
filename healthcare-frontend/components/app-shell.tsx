import { cn } from "@/lib/utils"

export function AppPage({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("mx-auto flex w-full max-w-7xl flex-col gap-6 p-6", className)}>{children}</div>
}

export function PageHero({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string
  description: string
  eyebrow?: string
  actions?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-border bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(9,14,24,0.98))] px-6 py-7 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(148,163,184,0.04),transparent)]" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          {eyebrow ? (
            <p className="font-heading text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
              {eyebrow}
            </p>
          ) : null}
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-white md:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-[0.98rem] leading-7 tracking-[-0.01em] text-slate-300">
              {description}
            </p>
          </div>
        </div>
        {actions ? <div className="relative flex shrink-0 items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  )
}

export function SurfaceCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(11,15,20,0.98))] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.18)]",
        className
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="space-y-1">
      <h2 className="font-heading text-xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
      {description ? (
        <p className="text-[0.95rem] tracking-[-0.01em] text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}

export function MetricCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: string
  hint?: string
  accent?: string
}) {
  return (
    <SurfaceCard className="gap-3">
      <p className="text-sm font-medium tracking-[-0.01em] text-muted-foreground">{label}</p>
      <p className={cn("font-heading text-3xl font-semibold tracking-[-0.05em] text-white", accent)}>{value}</p>
      {hint ? <p className="text-sm tracking-[-0.01em] text-slate-400">{hint}</p> : null}
    </SurfaceCard>
  )
}

export function EmptyPanel({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <SurfaceCard className="border-dashed text-center">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 py-8">
        <h3 className="font-heading text-xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
        <p className="text-[0.95rem] leading-7 tracking-[-0.01em] text-slate-400">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </SurfaceCard>
  )
}
