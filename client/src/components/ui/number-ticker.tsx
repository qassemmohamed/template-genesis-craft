import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  suffix = "", // Added suffix prop
  prefix = "", // Added prefix prop
}: {
  value: number | string; // Allow both number and string
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  decimalPlaces?: number;
  suffix?: string; // New prop to add text after the value
  prefix?: string; // New prop to add text before the value
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? Number(value) : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : Number(value));
      }, delay * 1000);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = `${prefix} ${Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)))}${suffix}`; // Include prefix and suffix
        }
      }),
    [springValue, decimalPlaces, prefix, suffix],
  );

  return (
    <span
      className={cn(
        "text-4xl font-bold text-[var(--card-headline)]",
        className, // Allow the className to be passed and applied
      )}
      ref={ref}
    >
      {typeof value === "string" ? value : ""}
    </span>
  );
}
