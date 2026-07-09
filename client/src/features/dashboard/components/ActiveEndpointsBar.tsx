interface ActiveEndpointsBarProps {
  active: number;
  total: number;
}

export function ActiveEndpointsBar({ active, total }: ActiveEndpointsBarProps) {
  const squares = Array.from({ length: total }, (_, i) => i < active);

  return (
    <div className="flex gap-1 h-10 items-center">
      {squares.map((filled, i) => (
        <div
          key={i}
          className={`h-6 flex-1 rounded-sm ${
            filled ? "bg-indigo-600" : "bg-bg-sidebar"
          }`}
        />
      ))}
    </div>
  );
}
