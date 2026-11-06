# 02 · Identidad visual

## Logotipo

El **isotipo** une dos símbolos:

| Símbolo | Representa |
|---|---|
| Sol | Inicio del día, energía y calidez del ritual del café |
| Torii japonés | Entrar, detenerse y vivir una experiencia distinta |

*"Un café que convierte lo cotidiano en ritual."*

**Claves de diseño:**
- fusión simbólica
- equilibrio entre lo orgánico y lo geométrico
- contraste tipográfico (artesanal + contemporáneo)
- jerarquía clara

| Versión | Archivo | Uso |
|---|---|---|
| Principal | `logo-principal-*.svg` | Uso por defecto: isotipo + "TIERRA coffee" |
| Secundario | `logo-secundario-*.svg` | Solo wordmark, para formatos horizontales |
| Isotipo | `isotipo-*.svg` | Favicon, avatar, espacios reducidos |

**Variantes de color y cuándo usarlas:**

| Variante | Uso |
|---|---|
| `full-color` | Aqua + Crimson; fondos claros |
| `aqua` | Monocromática |
| `rojo` | Versión roja |
| `blanco` | Fondos Aqua, Crimson u oscuros |
| `negro`, `gris` | Escala de grises |

**Reglas:**
- Área libre: el espacio "x" del guideline.
- Tamaño mínimo: **2 cm / 75.6 px**.
- Los SVG del repo tienen el `viewBox` recortado al contenido; el área libre se maneja con CSS.

## Paleta

La paleta es compartida con Sunrise Taquitos para conectar ambas marcas, pero en Tierra el Aqua es el color dominante.

| Nombre | Hex | RGB | CMYK | Pantone | Rol |
|---|---|---|---|---|---|
| Aqua Sunrise | `#2ea589` | 46, 165, 137 | 79, 13, 59, 0 | 3435 C | Primario: frescura, naturaleza, origen del café |
| Crimson Red | `#bb0d2f` | 187, 13, 47 | 18, 100, 87, 9 | 200 C | Primario: energía en los elementos expresivos |

> **Falta un neutro para texto.** El guideline no define uno. Como **propuesta** se usa `#454545`, el gris de las variantes en escala de grises del logo. Hay que validarlo con el diseñador.

### Contraste (WCAG)

| Combinación | Ratio | Uso permitido |
|---|---|---|
| `#454545` sobre blanco (propuesta) | 9.59:1 | Cualquier texto |
| Crimson sobre blanco / blanco sobre Crimson | 6.54:1 | Cualquier texto |
| Negro sobre Aqua | 6.86:1 | Cualquier texto |
| Aqua sobre blanco / blanco sobre Aqua | 3.06:1 | Solo texto grande (≥ 24 px, o 18.66 px en bold) y gráficos |
| Crimson sobre Aqua | 2.14:1 | **No usar** para texto |

## Tipografía

| Rol | Fuente | Uso en web |
|---|---|---|
| Logo "TIERRA" | Germinabunt Regular Rough | No se carga: va en el SVG. **Versión DEMO**, ver pendientes |
| Secundaria | Gill Sans Regular | Opcional y solo con licencia web; el logo ya la incluye en SVG |
| Uso diario | **Satoshi** | Toda la interfaz |

**Jerarquía:**

| Elemento | Peso | Tamaño |
|---|---|---|
| `h1` | Black | ≥ 300 % del cuerpo |
| `h2` | Medium | 200 % del cuerpo |
| `p` | Regular | Base |
| Pie de nota | Medium | — |

## Iconografía

Son 35 íconos en Aqua, con estas características:

- trazos lineales de grosor constante
- terminaciones redondeadas
- formas simplificadas

**Temas:** café, preparación (espresso, chemex, pour over, prensa francesa, moka, aeropress, cezve), bebidas, comida y servicios (delivery, wifi, ubicación, tienda).

Sirven para menús, empaques, señalización y la web.

## Textura

`texturas/textura-aqua.svg`: patrón Aqua con el motivo del isotipo.

## Brand statements

Frases cortas, editoriales y minimalistas, con la estética Japandi. Se usan como imagen. Ver `03-voz-y-mensajes.md`.
