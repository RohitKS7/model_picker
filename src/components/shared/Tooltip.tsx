"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  label: string;
  description: string;
}

export function Tooltip({ children, label, description }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <span ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(event) => {
          event.preventDefault();
          setOpen((current) => !current);
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
      >
        {children}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-full z-[70] mt-2 w-64 -translate-x-1/2 rounded-md border border-border bg-background/95 p-3 text-left text-xs leading-relaxed text-foreground shadow-lg"
          >
            <span className="block font-semibold text-foreground">{label}</span>
            <span className="mt-1 block text-muted-foreground">{description}</span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
