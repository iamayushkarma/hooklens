interface JsonSectionProps {
  title: string;
  data: unknown;
}

export function JsonSection({ title, data }: JsonSectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border-default">
      <div className="border-b border-border-default px-4 py-3">
        <h2 className="font-medium">{title}</h2>
      </div>

      <pre className="overflow-x-auto p-4 text-sm">
        {JSON.stringify(data ?? {}, null, 2)}
      </pre>
    </section>
  );
}
