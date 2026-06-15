import { useState, type ReactNode } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";
interface TooltipProp {
  content: string;
  children: ReactNode;
  position?: TooltipPosition;
}

function Tooltip({ content, children, position = "top" }: TooltipProp) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };
  const arrowClasses: Record<TooltipPosition, string> = {
    top: `
    absolute
    top-[85%]
    left-1/2
    -translate-x-1/2
    border-l-4 border-r-4 border-t-4
    border-l-transparent
    border-r-transparent
    border-t-black
  `,
    bottom: `
    absolute
    bottom-[85%]
    left-1/2
    -translate-x-1/2
    border-l-4 border-r-4 border-b-4
    border-l-transparent
    border-r-transparent
    border-b-black
  `,
    left: `
    absolute
    left-[85%]
    top-1/2
    -translate-y-1/2
    border-t-4 border-b-4 border-l-4
    border-t-transparent
    border-b-transparent
    border-l-black
  `,
    right: `
    absolute
    right-[95%]
    top-1/2
    -translate-y-1/2
    border-t-4 border-b-4 border-r-4
    border-t-transparent
    border-b-transparent
    border-r-black
  `,
  };
  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative inline-block"
    >
      {children}
      {isVisible && (
        <div
          className={` absolute
            z-50
            whitespace-nowrap
            rounded-md
            bg-black
            px-3
            py-2
            text-sm
            text-white
            shadow-md
            ${positionClasses[position]}`}
        >
          {content}
          {/* Arrow */}
          <div
            className={`
              h-2
              w-2
              rotate-45
              bg-black
              ${arrowClasses[position]}
            `}
          />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
