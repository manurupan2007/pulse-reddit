import { ReactNode } from "react";

type SectionCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  rightSlot,
  children,
  className = ""
}: SectionCardProps) {
  return (
    <section className={`glass-panel rounded-tile panel-glow p-5 md:p-6 ${className}`}>
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          {eyebrow ? (
            <div className="font-display text-[10px] uppercase tracking-[0.42em] text-accent/80">
              {eyebrow}
            </div>
          ) : null}
          <div>
            <h2 className="font-display text-xl text-white md:text-2xl">{title}</h2>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
            ) : null}
          </div>
        </div>
        {rightSlot}
      </div>
      {children}
    </section>
  );
}
