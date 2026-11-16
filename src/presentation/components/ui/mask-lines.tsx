import type { CSSProperties } from "react";

/**
 * Heading lines that rise out of a mask, one after another, when the parent
 * `<Reveal className="mask-reveal">` enters the viewport (globals.css).
 */
export function MaskLines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, index) => (
    <span key={line} className="mask-line block overflow-hidden pb-[0.1em]" style={{ "--line": index } as CSSProperties}>
      <span className="block">{line}</span>
    </span>
  ));
}
