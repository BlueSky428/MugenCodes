type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  items: FAQItem[];
};

export const FAQ = ({ items }: FAQProps) => {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div
          key={item.question}
          className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft"
        >
          <h3 className="text-2xl font-semibold text-ink dark:text-white">
            {item.question}
          </h3>
          <p className="mt-4 text-ink/70 dark:text-white/70">{item.answer}</p>
        </div>
      ))}
    </div>
  );
};
