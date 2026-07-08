import { useEffect, useMemo, useRef } from "react";
import Prism from "prismjs";

import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";

interface JsonViewerProps {
  data: unknown;
}

function JsonViewer({ data }: JsonViewerProps) {
  const codeRef = useRef<HTMLElement>(null);

  const formattedJson = useMemo(() => {
    return JSON.stringify(data ?? {}, null, 2);
  }, [data]);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [formattedJson]);

  return (
    <pre className="overflow-auto bg-[#1e1e1e] p-4 text-sm rounded-b-lg">
      <code ref={codeRef} className="language-json">
        {formattedJson}
      </code>
    </pre>
  );
}

export default JsonViewer;
