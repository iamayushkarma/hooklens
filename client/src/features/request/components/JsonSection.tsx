import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface JsonSectionProps {
  title: string;
  data: unknown;
}

export function JsonSection({ title, data }: JsonSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="overflow-hidden rounded-lg border border-border-default">
      <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
        <h2 className="font-medium">{title}</h2>

        <button
          onClick={handleCopy}
          className="rounded-md p-1 text-text-secondary transition-colors hover:bg-bg-sidebar hover:text-text-primary"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>

      <pre className="overflow-x-auto bg-background p-4 text-sm">
        {JSON.stringify(data ?? {}, null, 2)}
      </pre>
    </section>
  );
}
