import type { ReactNode } from "react";

type SectionProps = {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export const Section = ({ title, eyebrow, children, className }: SectionProps) => {
  return (
    <section className={`py-16 md:py-24 ${className ?? ""}`}>
      <div className="mx-auto w-full max-w-6xl px-6">
        {eyebrow ? (
          <p className="text-sm uppercase tracking-[0.2em] text-ink/60 dark:text-white/50">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl dark:text-white">
            {title}
          </h2>
        ) : null}
        <div className="mt-8 space-y-6 text-base text-ink/70 dark:text-white/70 leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
};
