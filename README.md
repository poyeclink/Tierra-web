# Tierra Coffee · Web

Sitio web de Tierra Coffee. Next.js 16 (App Router, Cache Components), TypeScript y Tailwind CSS v4.
Reglas del repo y de marca: [AGENTS.md](AGENTS.md) y [docs/](docs/README.md).

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

`dev` y `build` copian antes `brand-assets/` a `public/brand/` (`npm run brand:sync`). `public/brand/` está en `.gitignore`: la fuente de verdad sigue siendo `brand-assets/`.

## Fases

1. Menú publicado (`/menu`).
2. Sitio institucional: inicio, nosotros (misión, visión, principios), contacto.
3. Integración con Toast POS: menú sincronizado y recepción de órdenes.

## Arquitectura (Clean Architecture)

```
src/
├── core/                 Dominio + casos de uso. TypeScript puro, sin Next/React.
│   ├── shared/           Money (centavos), DomainError
│   ├── menu/             domain/ (entidades, puerto MenuRepository) · application/ (getMenu)
│   ├── establishment/    domain/ (Establishment, puerto) · application/
│   └── ordering/         domain/ (Order, puerto OrderGateway) · application/ (placeOrder)
├── infrastructure/       Adaptadores que implementan los puertos
│   ├── local/            Contenido local (data/*.data.ts)
│   └── toast/            Adaptadores Toast POS (pendientes, fase 3)
├── di/container.ts       Composition root: elige qué adaptador usa cada puerto
├── config/               env.ts (variables de servidor) · site.ts (navegación, idioma)
├── presentation/         UI
│   ├── data/             Loaders con "use cache" + cacheTag
│   ├── components/       brand/ (Logo) · ui/ · layout/ · menu/ · establishment/
│   └── lib/              Formateo, etiquetas de caché
└── app/                  Rutas (capa delgada)
```

**Regla de dependencias:** `app → presentation → di → core ← infrastructure`. ESLint impide que `src/core` importe Next, React o capas externas.

### Marca en el código

- `src/app/globals.css` importa `brand-assets/tokens/tokens.css` y expone utilidades: `bg-aqua`, `text-crimson`, `text-ink`, `text-ink-muted`, `border-line`, `bg-tint`. No se escriben hex en componentes.
- Tipografía: Satoshi variable (`src/app/fonts/`), cargada con `next/font/local` en `src/app/layout.tsx`. Licencia ITF Free Font License (`src/app/fonts/Satoshi-LICENSE.txt`): permite autoalojarla en el sitio, pero **no redistribuirla**; el repositorio debe ser privado.
- `<Logo variant="principal|secundario|isotipo" color="…" />` usa los SVG oficiales y respeta el ancho mínimo (75.6 px).
- Los datos del negocio que faltan se muestran con `<Todo>` (borde rojo punteado) en vez de inventarlos.

### Pasar a Toast

Variables en `.env.example`: `MENU_SOURCE=toast` y `ORDER_PROVIDER=toast`. Falta implementar `src/infrastructure/toast/*` y un webhook que llame a `revalidateTag("menu", "max")`.
