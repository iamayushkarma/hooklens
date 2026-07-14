import { useRef, useState, useLayoutEffect } from "react";

export default function IntegrationsCard({ style }: { style: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  const badges = [
    { label: "slack", style: "top-9 left-22" },
    { label: "Stripe", style: "bottom-6 left-40" },
    { label: "Github", style: "top-9 right-43" },
    { label: "Adidas", style: "bottom-4 right-25" },
  ];
  const buildRoundedElbowPath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius = 8,
  ) => {
    const midY = (y1 + y2) / 2;
    const dir1 = y2 > y1 ? 1 : -1; // vertical direction of travel
    const dirX = x2 > x1 ? 1 : -1; // horizontal direction of travel

    // if start and end are basically aligned, just draw a straight line
    if (Math.abs(x1 - x2) < 1) {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    const r = Math.min(radius, Math.abs(midY - y1), Math.abs(x2 - x1) / 2);

    return `
    M ${x1} ${y1}
    L ${x1} ${midY - r * dir1}
    Q ${x1} ${midY} ${x1 + r * dirX} ${midY}
    L ${x2 - r * dirX} ${midY}
    Q ${x2} ${midY} ${x2} ${midY + r * dir1}
    L ${x2} ${y2}
  `;
  };
  useLayoutEffect(() => {
    const measure = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const iconRect = iconRef.current?.getBoundingClientRect();
      if (!containerRect || !iconRect) return;

      const iconCenter = {
        x: iconRect.left + iconRect.width / 2 - containerRect.left,
        y: iconRect.top + iconRect.height / 2 - containerRect.top,
      };

      const newLines = badges.map(({ label }) => {
        const el = badgeRefs.current[label];
        const rect = el?.getBoundingClientRect();
        if (!rect) return { x1: 0, y1: 0, x2: 0, y2: 0 };
        // connect to nearest edge of badge (bottom edge if badge is above icon, top edge if below)
        const isAbove = rect.top < iconRect.top;
        return {
          x1: rect.left + rect.width / 2 - containerRect.left,
          y1: isAbove
            ? rect.bottom - containerRect.top
            : rect.top - containerRect.top,
          x2: iconCenter.x,
          y2: iconCenter.y,
        };
      });

      setLines(newLines);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className={`${style} h-83 bg-gray-50 rounded-md border border-border-default`}
    >
      <div
        ref={containerRef}
        className="relative h-3/4 flex items-center justify-center"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {lines.map((line, i) => (
            <path
              key={i}
              d={buildRoundedElbowPath(line.x1, line.y1, line.x2, line.y2, 10)}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        <div
          ref={iconRef}
          className="size-12 bg-accent rounded-sm relative z-10"
        ></div>

        {badges.map(({ label, style }) => (
          <BadgePill
            key={label}
            label={label}
            style={style}
            refCallback={(el) => (badgeRefs.current[label] = el)}
          />
        ))}
      </div>
      <div></div>
    </div>
  );
}

const BadgePill = ({
  label,
  style,
  refCallback,
}: {
  label: string;
  style: string;
  refCallback: (el: HTMLDivElement | null) => void;
}) => {
  return (
    <div
      ref={refCallback}
      className={`${style} bg-white rounded-lg px-5 py-2 absolute border border-border-default shadow-md z-10`}
    >
      {label}
    </div>
  );
};
