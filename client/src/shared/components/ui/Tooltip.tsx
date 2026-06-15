import { useState, type ReactNode } from "react";

interface TooltipProp {
  content: string;
  children: ReactNode;
}

function Tooltip({ content, children }: TooltipProp) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative inline-block"
    >
      {children}
      {isVisible && (
        <div
          className="absolute
            bottom-full
            left-1/2
            -translate-x-1/2
            mb-2
            whitespace-nowrap
            rounded-md
            bg-black
            px-3
            py-2
            text-sm
            text-white"
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
