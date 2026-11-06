import type { Establishment } from "@/core/establishment/domain/establishment";

/**
 * Brand content taken from docs/brand/01-concepto.md.
 * Business data (address, hours, contact, social) is pending from the client:
 * see docs/brand/05-pendientes.md. Leave it undefined — the UI shows a TODO.
 */
export const establishmentData: Establishment = {
  name: "Tierra Coffee",
  // TODO: confirm exact tagline ("Stay grounded"?) — docs/brand/05-pendientes.md
  tagline: undefined,
  description:
    "Un universo de café japonés-latino. Calma, ritual y balance: donde el origen se encuentra con la precisión.",
  mission:
    "Crear experiencias contemporáneas que fusionen la calidez latinoamericana con la precisión japonesa, transformando los rituales cotidianos en momentos de calma y conexión.",
  vision:
    "Ser una marca referente en experiencia y lifestyle, que inspire balance, comunidad y conexión con lo esencial.",
  principles: [
    { title: "Intentional by nature", description: "Cada detalle pensado y equilibrado." },
    { title: "Calm in the everyday", description: "Espacios que invitan a desacelerar." },
    { title: "Craft & precision", description: "La técnica y la calidad como parte de la experiencia." },
    { title: "Rooted in origin", description: "Raíces latinoamericanas con inspiración japonesa contemporánea." },
    { title: "Modern rituals", description: "Acompañamos rituales y momentos cotidianos." },
    { title: "Warm minimalism", description: "Sofisticación cercana, humana y auténtica." },
  ],
  sisterBrand: { name: "Sunrise Taquitos" },
  address: undefined,
  contact: undefined,
  social: undefined,
  openingHours: [],
};
