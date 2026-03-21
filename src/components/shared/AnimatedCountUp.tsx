"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: AnimatedCountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (latest) => {
    const rounded =
      decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString();
    return `${prefix}${rounded}${suffix}`;
  });

  useEffect(() => {
    if (!inView) {
      return;
    }

    const controls = animate(motionValue, value, {
      duration: 1.1,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [inView, motionValue, value]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
