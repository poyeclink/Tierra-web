import type { ReactNode } from "react";

/** Small section label: aqua rule + uppercase text. */
export function Eyebrow({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "inverse" }) {
  const styles =
    tone === "inverse" ? { text: "text-paper", rule: "bg-paper" } : { text: "text-crimson", rule: "bg-aqua" };
  return (
    <p className={`flex items-center gap-3 text-xs font-medium tracking-[0.28em] uppercase ${styles.text}`}>
      <span aria-hidden className={`h-px w-10 ${styles.rule}`} />
      {children}
    </p>
  );
}
