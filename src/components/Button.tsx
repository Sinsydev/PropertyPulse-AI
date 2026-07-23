import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "px-6 py-3 rounded-xl font-semibold transition-colors duration-200";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#D4AF37] to-[#f5d76e] text-black hover:opacity-90",
    secondary:
      "bg-white/10 text-white border border-white/10 hover:bg-white/20",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
