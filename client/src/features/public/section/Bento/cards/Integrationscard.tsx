import { useRef, useState, useLayoutEffect } from "react";

export default function IntegrationsCard({ style }: { style: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isHovered, setIsHovered] = useState(false);
  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  const badges = [
    { label: "MCP", style: "top-9 left-22" },
    { label: "API", style: "top-9 right-43" },
    { label: "OpenClaw", style: "bottom-6 left-40" },
    { label: "Claude", style: "bottom-4 right-25" },
  ];

  useLayoutEffect(() => {
    const measure = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const iconRect = iconRef.current?.getBoundingClientRect();
      if (!containerRect || !iconRect) return;

      const iconCenterY =
        iconRect.top + iconRect.height / 2 - containerRect.top;
      const iconLeft = iconRect.left - containerRect.left;
      const iconRight = iconRect.right - containerRect.left;

      const newLines = badges.map(({ label }) => {
        const el = badgeRefs.current[label];
        const rect = el?.getBoundingClientRect();
        if (!rect) return { x1: 0, y1: 0, x2: 0, y2: 0 };

        const isAbove = rect.top < iconRect.top;
        const badgeCenterX = rect.left + rect.width / 2 - containerRect.left;
        const isLeftSide = badgeCenterX < iconLeft + (iconRight - iconLeft) / 2;

        return {
          x1: badgeCenterX,
          y1: isAbove
            ? rect.bottom - containerRect.top
            : rect.top - containerRect.top,
          x2: isLeftSide ? iconLeft : iconRight,
          y2: iconCenterY,
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
              d={buildRoundedElbowPath(
                line.x1,
                line.y1,
                line.x2,
                line.y2,
                line.y2,
                10,
              )}
              fill="none"
              stroke={isHovered ? "#3B82F6" : "#E5E7EB"}
              strokeWidth="1.5"
              strokeDasharray={isHovered ? "4 4" : "0"}
              style={{ transition: "stroke 0.2s ease" }}
            />
          ))}
        </svg>

        <div
          ref={iconRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`size-12 bg-accent rounded-sm relative z-10 transition-shadow duration-200 ${
            isHovered ? "ring-4 ring-accent/30" : ""
          }`}
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

const buildRoundedElbowPath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bendY: number,
  radius = 8,
) => {
  if (Math.abs(x1 - x2) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;

  const dir1 = bendY > y1 ? 1 : -1;
  const dirX = x2 > x1 ? 1 : -1;
  const r = Math.min(radius, Math.abs(bendY - y1), Math.abs(x2 - x1) / 2);

  const sameLevel = Math.abs(bendY - y2) < 0.5;

  if (sameLevel) {
    return `
      M ${x1} ${y1}
      L ${x1} ${bendY - r * dir1}
      Q ${x1} ${bendY} ${x1 + r * dirX} ${bendY}
      L ${x2} ${bendY}
    `;
  }

  return `
    M ${x1} ${y1}
    L ${x1} ${bendY - r * dir1}
    Q ${x1} ${bendY} ${x1 + r * dirX} ${bendY}
    L ${x2 - r * dirX} ${bendY}
    Q ${x2} ${bendY} ${x2} ${bendY + r * dir1}
    L ${x2} ${y2}
  `;
};

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
