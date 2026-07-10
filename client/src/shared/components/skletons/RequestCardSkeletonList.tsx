import RequestCardSkeleton from "./RequestCardSkeleton";

function RequestCardSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-in fade-in"
          style={{
            animationDelay: `${i * 60}ms`,
            animationFillMode: "backwards",
          }}
        >
          <RequestCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export default RequestCardSkeletonList;
