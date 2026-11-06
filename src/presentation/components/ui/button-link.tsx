import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

const VARIANTS = {
  // Crimson + white: 6.54:1, valid for any text size.
  primary:
    "bg-crimson text-on-crimson shadow-[0_10px_30px_-12px_var(--brand-crimson)] hover:shadow-[0_16px_36px_-12px_var(--brand-crimson)] hover:-translate-y-0.5",
  ghost: "border border-aqua text-ink hover:bg-tint",
} as const;

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-calm ${VARIANTS[variant]} ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-500 ease-calm group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
