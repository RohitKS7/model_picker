import type { CSSProperties } from "react";

interface MotionSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function MotionSection({ children, delay = 0, className }: MotionSectionProps) {
  const style = delay > 0 ? ({ ["--anim-delay" as string]: `${delay}s` } as CSSProperties) : undefined;

  return (
    <section className={["gc-anim-reveal", delay > 0 ? "gc-anim-delay" : "", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </section>
  );
}
