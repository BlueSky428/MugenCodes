import type { ReactNode } from "react";

type SectionProps = {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export const Section = ({ title, eyebrow, children, className }: SectionProps) => {
  return (
    <section className={`section ${className ?? ""}`}>
      <div className="container-page">
        {eyebrow ? (
          <p className="section-eyebrow animate-fade-in">{eyebrow}</p>
        ) : null}
        {title ? (
          <h2 className="section-title animate-fade-in-up">{title}</h2>
        ) : null}
        <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>
    </section>
  );
};
