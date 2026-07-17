import { useRef, useState, useLayoutEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { BsStripe } from "react-icons/bs";
import { FaGithub, FaSlack } from "react-icons/fa";
import { TbBrandTwilio } from "react-icons/tb";
import HookLensLogo from "@/assets/icons/logo-icon.png";
import CardLayout from "../CardLayout";

export default function IntegrationsCard({ style }: { style: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isHovered, setIsHovered] = useState(false);
  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  const EASE = [0.22, 1, 0.36, 1] as const;

  const badges = [
    { label: "Stripe", style: "top-9 left-22", icon: <BsStripe /> },
    { label: "GitHub", style: "top-9 right-43", icon: <FaGithub /> },
    { label: "Slack", style: "bottom-6 left-40", icon: <FaSlack /> },
    { label: "Twilio", style: "bottom-4 right-25", icon: <TbBrandTwilio /> },
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
    <CardLayout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={style}
      heading="Connect in seconds"
      subHeading="Add your webhook endpoint once and start capturing incoming requests instantly. No SDKs, no configuration, just point and receive."
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute! left-1/2 top-1/3 h-44 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[50px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(37,99,235,0.5), rgba(37,99,235,0) 70%)",
        }}
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.85,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-4 h-52 w-52 rounded-full bg-danger-bg blur-[80px]"
        initial={false}
        animate={{
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1.1 : 0.75,
        }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-16 h-40 w-64 rounded-full bg-warning-bg blur-[90px]"
        initial={false}
        animate={{
          opacity: isHovered ? 0.5 : 0,
          scale: isHovered ? 1.05 : 0.8,
        }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      />

      <div
        ref={containerRef}
        className="relative h-52 flex items-center justify-center group-hover:scale-[1.04] transition-all duration-500 ease-in-out"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {lines.map((line, i) => {
            return (
              <motion.path
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
                stroke={isHovered ? "#213fd1" : "#E5E7EB"}
                strokeWidth="1.5"
                strokeDasharray={isHovered ? "4 4" : "0"}
                animate={
                  isHovered
                    ? { strokeDashoffset: [0, -8] }
                    : { strokeDashoffset: 0 }
                }
                transition={
                  isHovered
                    ? { duration: 0.5, repeat: Infinity, ease: "linear" }
                    : { duration: 0.2 }
                }
                style={{ transition: "stroke 0.2s ease" }}
              />
            );
          })}
        </svg>

        <div
          ref={iconRef}
          className={`size-11 flex items-center justify-center rounded-sm relative z-10 transition-shadow duration-200 `}
        >
          <img src={HookLensLogo} className="size-12" />
        </div>

        {badges.map(({ label, style, icon }) => (
          <BadgePill
            key={label}
            label={label}
            style={style}
            icon={icon}
            refCallback={(el) => (badgeRefs.current[label] = el)}
          />
        ))}
      </div>
    </CardLayout>
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
  icon,
  refCallback,
}: {
  label: string;
  style: string;
  icon: ReactNode;
  refCallback: (el: HTMLDivElement | null) => void;
}) => {
  return (
    <div
      ref={refCallback}
      className={`${style} flex items-center justify-between gap-1.5 bg-white rounded-lg px-5 py-2 absolute border border-border-default shadow-md z-10`}
    >
      {icon}
      {label}
    </div>
  );
};
