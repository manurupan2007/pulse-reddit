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
    <section className={`glass-panel p-6 shadow-sm border border-border bg-card/50 ${className}`}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {description ? (
            <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
        <div className="shrink-0">{rightSlot}</div>
      </div>
      <div className="relative">
        {children}
      </div>
    </section>
  );
}
