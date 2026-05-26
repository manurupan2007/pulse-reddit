import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  rightSlot,
  children,
  className = ""
}: SectionCardProps) {
  return (
    <section className={`glass-panel p-6 shadow-sm border border-border/50 bg-card/30 flex flex-col ${className}`}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between shrink-0">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground leading-none">{title}</h2>
          {description ? (
            <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed font-medium opacity-80">
              {description}
            </p>
          ) : null}
        </div>
        {rightSlot && <div className="shrink-0 flex items-center">{rightSlot}</div>}
      </div>
      <div className="relative flex-1 min-h-0">
        {children}
      </div>
    </section>
  );
}
