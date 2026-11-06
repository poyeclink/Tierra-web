# Tierra Coffee — Web

Instrucciones para cualquier agente de código (Claude Code, Cursor, Codex, etc.) que trabaje en este repositorio.

## Contexto

- **Marca:** Tierra Coffee, marca de café contemporánea japonesa-latina ("Jatina") nacida del ADN de Sunrise Taquitos.
- **Relación con Sunrise Taquitos:** son marcas independientes de la misma franquicia. **Este repo es solo de Tierra Coffee.**
- **Fase actual:** recursos de marca y documentación. Todavía no existe código de la aplicación.
- **Stack previsto:** Next.js (por confirmar).
- **Alcance previsto:** sitio web con menú desde Toast POS, panel de administración y programa de lealtad por fases.

## Mapa del repo

| Ruta | Contenido |
|---|---|
| `AGENTS.md` | Este archivo: reglas generales |
| `CLAUDE.md` | Importa este archivo para Claude Code |
| `.claude/skills/brand-tierra/` | Skill de marca: se usa al diseñar o escribir UI y copy |
| `.claude/agents/` | Subagentes especializados (vacío por ahora) |
| `docs/brand/` | Concepto, identidad visual, voz, inventario de assets y pendientes |
| `docs/referencias/` | Dónde están los archivos fuente (PDF, AI, PSD) |
| `brand-assets/` | Logos, íconos, frases, texturas, tokens y notas de fuentes, listos para usar en la web |

## Reglas

1. **Una marca por repo.** No uses assets, fuentes, íconos ni copys de Sunrise Taquitos. La paleta Aqua + Crimson es compartida por diseño, pero Tierra la aplica a su manera: Aqua dominante y Crimson como acento expresivo.
2. **Los tokens son la fuente de verdad.** Colores y tipografía salen de `brand-assets/tokens/`; no escribas valores hex sueltos en componentes.
3. **No alteres los logos.** Usa las variantes de `brand-assets/logos/` tal como están. Respeta el tamaño mínimo (75.6 px) y el área libre.
4. **No inventes datos del negocio.** Precios, horarios, direcciones, cifras y testimonios deben venir del cliente. Si faltan, deja un `TODO:` visible.
5. **El copy sigue `docs/brand/03-voz-y-mensajes.md`:** calmado, intencional, sensorial y minimalista.
6. **Fuentes:** revisa `brand-assets/fonts/README.md`. **Germinabunt es versión DEMO: prohibido usarla como fuente web.**
7. **Accesibilidad:** mínimo WCAG AA. Aqua `#2ea589` sobre blanco no sirve para texto normal (3.06:1).
8. **Estética:** warm minimalism (Japandi latino). Mucho espacio en blanco, composición equilibrada, sin saturar.
9. **Performance y SEO son requisitos, no extras.**
10. **Flujo de trabajo:** todo cambio va en una rama y por Pull Request a `main`. No toques producción directamente.
11. **Credenciales:** las claves (Toast POS u otras) van en variables de entorno, nunca en el repo.
12. **Antes de asumir algo, revisa `docs/brand/05-pendientes.md`.**
