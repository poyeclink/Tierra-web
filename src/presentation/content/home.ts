/**
 * Home page copy and asset references.
 * Copy comes from docs/brand/ (concept, voice and manifesto). Assets come from
 * brand-assets/ (synced to /brand). Nothing here is business data.
 */

import { type Photo, photos } from "./photos";

export type BrandArt = {
  readonly src: string;
  readonly alt: string;
  /** width / height of the SVG viewBox */
  readonly ratio: number;
};

const frase = (name: string, alt: string, w: number, h: number, color = "blanco"): BrandArt => ({
  src: `/brand/frases/frase-${name}-${color}.svg`,
  alt,
  ratio: w / h,
});

export const icon = (name: string) => `/brand/iconos/icono-${name}.svg`;
/** All icons share this viewBox (390.87 × 337.76). */
export const ICON_RATIO = 390.87 / 337.76;

export const heroContent = {
  eyebrow: "Café japonés-latino",
  titleStart: "Donde el origen se encuentra con la",
  titleAccent: "precisión.",
  lead: "Calma, ritual y balance. Un café que convierte lo cotidiano en ritual.",
  /** Official brand statements (docs/brand/03-voz-y-mensajes.md). */
  badgeText: "Stay grounded · Calm. Brewed. · Coffee & calm · ",
};

/** docs/brand/03-voz-y-mensajes.md — "Frases oficiales". White variants, for aqua backgrounds. */
export const brandStatements: readonly BrandArt[] = [
  frase("stay-grounded", "Stay grounded", 360.19, 164.52),
  frase("calm-brewed", "Calm. Brewed.", 396.24, 160.24),
  frase("coffee-and-calm", "Coffee & calm", 443.39, 275.39),
  frase("matcha-mood-only", "Matcha mood only", 414.96, 93.63),
  frase("tierra-state-of-mind", "Tierra state of mind", 370.59, 166.59),
  frase("crafted-for-today", "Crafted for today", 320.67, 315.33),
  frase("root-and-tradition", "Root & tradition", 445.47, 148.13),
  frase("slow-morning-club", "Slow morning club", 268.88, 395.55),
  frase("your-grounded-moment", "Your grounded moment", 454.48, 225.15),
];

export const visitStatement = frase("your-grounded-moment", "Your grounded moment", 454.48, 225.15);

/** docs/brand/01-concepto.md — Concepto "Jatina". */
export const jatinaContent = {
  eyebrow: "Concepto",
  title: "Jatina",
  lead: "Una interpretación latina del Japandi: donde el movimiento y el ritual se encuentran.",
  columns: { left: "Japón", right: "Latinoamérica" },
  pairs: [
    { japan: "Precisión", latam: "Calidez" },
    { japan: "Minimalismo", latam: "Cercanía" },
    { japan: "Tradición", latam: "Contemporaneidad" },
  ],
};

/** docs/brand/01-concepto.md — Propuesta gastronómica. */
export const offeringContent = {
  eyebrow: "Propuesta",
  title: "Sabores de dos orígenes",
  lead: "Café de especialidad, matcha, postres y bebidas inspiradas en sabores japoneses y latinoamericanos.",
  items: [
    { title: "Café de especialidad", text: "Origen y precisión en cada taza.", icon: icon("taza-humeante"), photo: photos.latteArt },
    { title: "Matcha", text: "Un ritual japonés, a nuestro ritmo.", icon: icon("te"), photo: photos.matchaLatte },
    { title: "Postres", text: "Un momento dulce para hacer una pausa.", icon: icon("croissant"), photo: photos.croissant },
    { title: "Bebidas inspiradas", text: "Sabores japoneses y latinoamericanos.", icon: icon("iced-coffee"), photo: photos.icedCoffee },
  ],
};

export const heroPhoto = photos.pourOver;
export const jatinaPhoto = photos.interiorTables;
export const visitPhoto = photos.interiorWindow;

/** Icon for each principle title in establishment data (docs/brand/01-concepto.md). */
export const principleIcons: Record<string, string> = {
  "Intentional by nature": icon("granos-de-cafe"),
  "Calm in the everyday": icon("taza-vista-superior"),
  "Craft & precision": icon("pour-over"),
  "Rooted in origin": icon("rama-de-cafe"),
  "Modern rituals": icon("sol-amanecer"),
  "Warm minimalism": icon("cappuccino"),
};

export const principlePhotos: Record<string, Photo> = {
  "Intentional by nature": photos.beans,
  "Calm in the everyday": photos.cappuccino,
  "Craft & precision": photos.chemex,
  "Rooted in origin": photos.coffeeCherries,
  "Modern rituals": photos.matchaWhisk,
  "Warm minimalism": photos.interiorBright,
};

/** "El ritual": photo strip. Captions are brand vocabulary (docs/brand/03), not business data. */
export const ritualContent = {
  eyebrow: "El ritual",
  title: "Pequeños momentos que lo cambian todo",
  moments: [
    { caption: "Origen", photo: photos.coffeeCherries },
    { caption: "Precisión", photo: photos.filterTop },
    { caption: "Ritual", photo: photos.matchaWhisk },
    { caption: "Balance", photo: photos.flatlay },
    { caption: "Calma", photo: photos.espressoLight },
    { caption: "Encuentro", photo: photos.interiorBright },
  ],
};

/** docs/brand/03-voz-y-mensajes.md — Manifiesto (extracto). */
export const manifestoContent = {
  eyebrow: "Manifiesto",
  text: "En un mundo que nunca se detiene, decidimos consentirnos con un buen café. Creemos en los pequeños momentos que lo cambian todo: una bebida caliente, una conversación tranquila, el balance entre energía y calma.",
  closing: "Más que un café, Tierra es un espacio para conectar con lo esencial.",
};
