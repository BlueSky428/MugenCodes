type CTAProps = {
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export const CTA = ({
  title,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref
}: CTAProps) => {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-10 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
      <h3 className="text-2xl font-semibold text-ink dark:text-white">{title}</h3>
      <p className="mt-4 text-lg text-ink/70 dark:text-white/70">{body}</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href={primaryHref}
          className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
        >
          {primaryLabel}
        </a>
        {secondaryLabel && secondaryHref ? (
          <a
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-full border border-ink/20 px-6 py-3 text-base font-semibold text-ink transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:border-white/20 dark:text-white dark:hover:border-white/40 dark:focus-visible:ring-offset-night"
          >
            {secondaryLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
};
