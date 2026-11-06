/**
 * TODO: fotografía provisional de Unsplash (licencia Unsplash: uso libre, sin atribución obligatoria).
 * Cuando el cliente entregue fotos propias, reemplaza `src` por la ruta local
 * (p. ej. "/photos/hero.jpg") y elimina `source`. Los componentes no cambian.
 * Para retirar Unsplash por completo, quita también `images.remotePatterns` en next.config.ts.
 */

export type Photo = {
  readonly src: string;
  readonly alt: string;
  /** Página original del placeholder, para rastrearlo y sustituirlo. */
  readonly source?: string;
};

const unsplash = (id: string, slug: string, alt: string): Photo => ({
  // Keep the query in sync with images.remotePatterns in next.config.ts.
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=max&w=2400&q=80`,
  alt,
  source: `https://unsplash.com/photos/${slug}`,
});

export const photos = {
  pourOver: unsplash("1759259639356-7c6e74eed1ec", "F0XGFD9Z1Uk", "Agua caliente vertida en espiral sobre un filtro de café"),
  latteArt: unsplash("1541167760496-1628856ab772", "nzyzAUsbV0M", "Leche vertida sobre un espresso para formar latte art"),
  matchaLatte: unsplash("1515823064-d6e0c04616a7", "Z-hvocTfR_s", "Matcha latte con latte art en una taza blanca"),
  croissant: unsplash("1565252556328-92ee4a9a0983", "12z0NP3X3LI", "Capuchino junto a un croissant sobre una mesa de madera"),
  icedCoffee: unsplash("1562447457-579fc34967fb", "02O1bXB_fgk", "Leche vertiéndose sobre un café helado"),
  interiorTables: unsplash("1613274554329-70f997f5789f", "ZimlF1xeZ8k", "Mesas de madera y sillas claras en un espacio luminoso"),
  interiorWindow: unsplash("1624878359797-3fa83912b96a", "4bKpMYjVquo", "Mesas de madera junto a grandes ventanales"),
  interiorBright: unsplash("1567880905822-56f8e06fe630", "ZZxmc66SjfM", "Interior luminoso de cafetería con barra curva"),
  filterTop: unsplash("1521677446241-d182a96ec49f", "BVuXUt4Q43o", "Café molido en un filtro de papel, visto desde arriba"),
  matchaWhisk: unsplash("1624893578106-a98840591afc", "QAYLR4oSK6Q", "Manos tamizando matcha sobre un cuenco"),
  flatlay: unsplash("1511920170033-f8396924c348", "Y3AqmbmtLQI", "Latte, café molido y granos sobre una superficie clara"),
  chemex: unsplash("1534516484460-0b6099615d5a", "HRk3IvAWSOs", "Cafetera de vidrio para método de filtrado"),
  coffeeCherries: unsplash("1586095516671-d085ff58cdd4", "vJ3KldG86Eo", "Cerezas de café maduras en la rama"),
  espressoLight: unsplash("1559496417-e7f25cb247f3", "IhqDpFz7I8Q", "Café en vaso de vidrio bajo luz natural y sombras de hojas"),
  beans: unsplash("1773894480003-955c58ddf4af", "_rUfjdvUlkE", "Granos de café tostados sobre una superficie clara"),
  cappuccino: unsplash("1593443320739-77f74939d0da", "3n3mPoGko8g", "Capuchino en taza blanca sobre mesa de madera"),
} satisfies Record<string, Photo>;
