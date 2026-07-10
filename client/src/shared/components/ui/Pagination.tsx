import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationData {
  page: number;
  pages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

interface PaginationProps {
  pagination: PaginationData;
  setPage: (updater: number | ((p: number) => number)) => void;
}

function Pagination({ pagination, setPage }: PaginationProps) {
  const { page, pages, hasPrev, hasNext } = pagination;

  const getPageNumbers = () => {
    const nums: (number | "...")[] = [];
    const range = new Set([1, pages, page - 1, page, page + 1]);
    let prev = 0;
    for (const n of Array.from(range)
      .filter((n) => n >= 1 && n <= pages)
      .sort((a, b) => a - b)) {
      if (prev && n - prev > 1) nums.push("...");
      nums.push(n);
      prev = n;
    }
    return nums;
  };

  return (
    <div className="mt-6 flex items-center justify-between rounded-xl border border-border-default bg-bg-card px-4 py-3">
      <button
        disabled={!hasPrev}
        onClick={() => setPage((p) => p - 1)}
        className="flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-1.5 text-sm text-text-primary transition-colors hover:bg-bg-sidebar disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="size-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((n, i) =>
          n === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1.5 text-sm text-text-muted"
            >
              …
            </span>
          ) : (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`flex size-8 items-center justify-center rounded-lg text-sm transition-colors ${
                n === page
                  ? "bg-accent text-white font-medium"
                  : "text-text-secondary hover:bg-bg-sidebar hover:text-text-primary"
              }`}
            >
              {n}
            </button>
          ),
        )}
      </div>

      <button
        disabled={!hasNext}
        onClick={() => setPage((p) => p + 1)}
        className="flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-1.5 text-sm text-text-primary transition-colors hover:bg-bg-sidebar disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

export default Pagination;
