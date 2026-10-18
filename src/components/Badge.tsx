import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "accent";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    "border border-slate-500/25 bg-slate-500/10 text-slate-200",
  success:
    "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
  warning:
    "border border-yellow-500/25 bg-yellow-500/10 text-yellow-100",
  danger:
    "border border-red-500/25 bg-red-500/10 text-red-100",
  accent:
    "border border-yellow-400/30 bg-yellow-500/10 text-yellow-100",
};

export default function Badge({
  children,
  className = "",
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.12em] uppercase",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
