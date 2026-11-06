import type { ReactNode } from "react";

const SIZES = {
  default: "max-w-5xl",
  wide: "max-w-7xl",
} as const;

type ContainerProps = {
  children: ReactNode;
  className?: string;
  size?: keyof typeof SIZES;
};

export function Container({ children, className = "", size = "default" }: ContainerProps) {
  return <div className={`mx-auto w-full ${SIZES[size]} px-5 sm:px-8 ${className}`}>{children}</div>;
}
