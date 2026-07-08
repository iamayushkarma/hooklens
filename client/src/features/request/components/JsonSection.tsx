import CopyButton from "@/shared/components/ui/CopyButton";
import JsonViewer from "./JsonViewer";

interface JsonSectionProps {
  title: string;
  data: unknown;
}

export function JsonSection({ title, data }: JsonSectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border-default">
      <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
        <h2 className="font-medium">{title}</h2>
        <CopyButton content={JSON.stringify(data, null, 2)} />
      </div>

      <JsonViewer data={data} />
    </section>
  );
}
