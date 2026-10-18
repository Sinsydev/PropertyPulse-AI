import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-soft)] disabled:cursor-not-allowed disabled:opacity-60";

  const variantClasses = {
    primary:
      "bg-[var(--color-accent)] text-[#101827] hover:brightness-105 shadow-[0_10px_22px_rgba(212,175,91,0.22)]",
    secondary:
      "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-strong)]",
    ghost:
      "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
    danger:
      "bg-[var(--color-danger)] text-white hover:brightness-110",
  };

  return (
    <button
      className={[baseClasses, variantClasses[variant], className].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
