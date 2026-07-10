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
    <div className="flex items-center justify-end gap-1.5">
      <button
        disabled={!hasPrev}
        onClick={() => setPage((p) => p - 1)}
        className="flex h-8 items-center gap-1 rounded-md border border-border-default bg-bg-card px-3 text-sm font-medium text-text-primary transition-colors hover:bg-base-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-bg-card"
      >
        <ChevronLeft className="size-3.5" />
        Back
      </button>

      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((n, i) =>
          n === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-text-muted"
            >
              …
            </span>
          ) : (
            <button
              key={n}
              onClick={() => setPage(n)}
              aria-current={n === page ? "page" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                n === page
                  ? "bg-text-primary text-bg-base"
                  : "border border-border-default bg-bg-card text-text-primary hover:bg-base-hover"
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
        className="flex h-8 items-center gap-1 rounded-md border border-border-default bg-bg-card px-3 text-sm font-medium text-text-primary transition-colors hover:bg-base-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-bg-card"
      >
        Next
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}

export default Pagination;
