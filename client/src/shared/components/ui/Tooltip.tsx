import { useState, type ReactNode } from "react";

interface TooltipProp {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

function Tooltip({ content, children, position = "top" }: TooltipProp) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
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
        </div>
      )}
    </div>
  );
}

export default Tooltip;
