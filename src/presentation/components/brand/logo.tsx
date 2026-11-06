import Image from "next/image";

/**
 * Official logos from brand-assets/logos/svg (synced to /brand/logos).
 * Never recolor or distort them; size only via `width`.
 */
const LOGOS = {
  principal: { file: "logo-principal", ratio: 336.15 / 341.81 },
  secundario: { file: "logo-secundario", ratio: 162.81 / 341.81 },
  isotipo: { file: "isotipo", ratio: 150.11 / 148.11 },
} as const;

export type LogoVariant = keyof typeof LOGOS;
/** `full-color` exists only for principal/secundario; isotipo falls back to aqua. */
export type LogoColor = "full-color" | "aqua" | "rojo" | "blanco" | "negro" | "gris";

/** Brand minimum size: 2 cm = 75.6 px. */
export const LOGO_MIN_WIDTH = 76;

type LogoProps = {
  variant?: LogoVariant;
  color?: LogoColor;
  width: number;
  priority?: boolean;
  className?: string;
};

export function Logo({ variant = "principal", color = "full-color", width, priority, className }: LogoProps) {
  const { file, ratio } = LOGOS[variant];
  const resolvedColor = variant === "isotipo" && color === "full-color" ? "aqua" : color;
  const safeWidth = Math.max(width, LOGO_MIN_WIDTH);

  return (
    <Image
      src={`/brand/logos/${file}-${resolvedColor}.svg`}
      alt="Tierra Coffee"
      width={safeWidth}
      height={Math.round(safeWidth * ratio)}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
