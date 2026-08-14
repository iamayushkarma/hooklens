import { useCallback, useEffect, useRef, useState } from "react";

export function useCardInteraction(autoResetMs = 2400) {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    clear();
    setActive(true);
  }, [clear]);

  const handleMouseLeave = useCallback(() => {
    clear();
    setActive(false);
  }, [clear]);

  const handleTouchStart = useCallback(() => {
    clear();
    setActive(true);
  }, [clear]);

  const handleTouchEnd = useCallback(() => {
    clear();
    timeoutRef.current = setTimeout(() => setActive(false), autoResetMs);
  }, [clear, autoResetMs]);

  useEffect(() => clear, [clear]);

  return {
    active,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  };
}
