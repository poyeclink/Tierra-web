import type { ReactNode } from "react";

/** Visible placeholder for business data still pending from the client (AGENTS.md, rule 4). */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-md border border-dashed border-crimson px-2 py-1 text-sm text-crimson">
      TODO: {children}
    </span>
  );
}
