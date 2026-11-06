/** UI-level settings (not business data). */
export const siteConfig = {
  // TODO: site language(s) pending — docs/brand/05-pendientes.md.
  // Locale also drives price formatting ("es-US" formats USD as $4.50).
  locale: "es-US",
  lang: "es",
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/menu", label: "Menú" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ],
} as const;
