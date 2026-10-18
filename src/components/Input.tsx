import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({
  className = "",
  error = false,
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-[var(--radius-md)] border bg-[var(--color-surface-muted)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] transition-colors duration-200 outline-none",
        "border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)]",
        error ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger-soft)]" : "",
        className,
      ].join(" ")}
    />
  );
}
