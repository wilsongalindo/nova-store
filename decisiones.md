# Nova Store — Decisiones Arquitectónicas

Documento de registro de las decisiones técnicas adoptadas en **Nova Store**, prueba técnica ecommerce frontend. Describe el *por qué* de cada elección, sus ventajas y los compromisos asumidos.

**Contexto:** aplicación single-brand con catálogo, filtros, detalle de producto y carrito. Restricción de alcance orientada a demostrar criterio senior en ~6 horas de implementación.

---

## Índice

1. [Arquitectura basada en features](#1-arquitectura-basada-en-features)
2. [Zustand](#2-zustand)
3. [Next.js App Router](#3-nextjs-app-router)
4. [TypeScript strict](#4-typescript-strict)
5. [Shadcn UI](#5-shadcn-ui)
6. [Dataset estático JSON](#6-dataset-estático-json)
7. [Estrategia de testing](#7-estrategia-de-testing)

---

## 1. Arquitectura basada en features

### Decisión

Organizar el código por dominio funcional bajo `src/features/{catalog, product, cart}`, con rutas delgadas en `src/app/`, tipos compartidos en `src/types/` y primitivas UI en `components/ui/`.

```
src/
├── app/                  # Rutas App Router (orquestación)
├── features/
│   ├── catalog/          # Catálogo, filtros, grid, cards
│   ├── product/          # PDP, galería, add-to-cart
│   └── cart/             # Store Zustand + UI del carrito
├── components/layout/    # Shell transversal (header)
├── lib/                  # Acceso a datos y utilidades
├── types/                # Contratos de dominio
└── data/                 # Dataset estático
```

Se descartaron, por alcance temporal, capas adicionales como barrels (`index.ts` por feature), subcarpetas `hooks/`/`utils/` por feature, o un feature `filters/` independiente del catálogo.

### Motivo

- El dominio ecommerce se divide en tres capacidades claras: **explorar catálogo**, **ver producto** y **gestionar carrito**.
- Una prueba senior debe demostrar **cohesión por feature** sin sobre-ingeniería.
- Los filtros solo existen en el contexto del catálogo; no justifican un módulo separado en esta fase.

### Beneficio

- **Localidad cognitiva:** un desarrollador encuentra todo lo relacionado con el carrito en `features/cart/`.
- **Escalabilidad razonable:** nuevas features (checkout, wishlist) pueden añadirse como carpetas hermanas sin reestructurar la app.
- **Rutas delgadas:** `page.tsx` solo orquesta datos y compone features; la lógica no vive en `app/`.
- **Separación UI / lógica pura:** funciones como `filter-products.ts` y `addItemToCart()` son testeables sin React.

### Tradeoff

| Compromiso | Impacto |
|------------|---------|
| Sin barrels ni API pública por feature | Imports más verbosos (`@/features/catalog/product-card`) |
| Features planos (sin subcarpetas) | A ~15 archivos por feature sigue siendo manejable; a escala mayor habría que subdividir |
| Helpers duplicados entre componentes (rating, badges) | Se priorizó entrega sobre DRY; refactor pendiente |
| `components/ui/` fuera de `src/` | Estructura híbrida (convención Shadcn); requiere paths alias conscientes |

---

## 2. Zustand

### Decisión

Usar **Zustand** como única fuente de estado global para el **carrito**. Los filtros del catálogo **no** viven en Zustand; derivan de **URL search params**.

El store (`cart-store.ts`) expone acciones (`addItem`, `removeItem`, `updateQuantity`, `clearCart`) y selectores (`useCartItems`, `useCartItemCount`, `useCartSubtotal`). Las operaciones de mutación están implementadas como **funciones puras** exportadas para testing.

### Motivo

- El carrito es el único estado **global, mutable y transversal** (header, sheet, cards, PDP).
- Los filtros son **derivables de la URL** y deben ser compartibles vía enlace; no requieren store global.
- Zustand ofrece API mínima, bundle pequeño y buena ergonomía con TypeScript frente a Redux o Context API para este caso.

### Beneficio

- **Mínima superficie de estado global:** menos riesgo de acoplamiento y re-renders innecesarios.
- **Integración simple con React 19:** hooks selectores sin boilerplate de Provider (salvo boundaries `"use client"`).
- **Testabilidad:** `addItemToCart`, `removeItemFromCart` y `updateCartItemQuantity` se prueban sin montar componentes.
- **Extensible:** preparado para middleware `persist` (localStorage) en una v2.

### Tradeoff

| Compromiso | Impacto |
|------------|---------|
| Carrito solo en memoria | Se pierde al refrescar la página (sin `persist`) |
| Sin validación de stock en incrementos | El store permite cantidades por encima del inventario |
| `"use client"` obligatorio en el módulo del store | Todo el archivo queda en boundary cliente, incluidas funciones puras |
| No hay DevTools ni time-travel | Aceptable para el alcance; Redux sería overkill |

---

## 3. Next.js App Router

### Decisión

Adoptar **Next.js 16 App Router** con **React Server Components (RSC) por defecto** y **Client Components** únicamente donde hay interactividad: filtros, carrito, galería, header.

| Capa | Tipo | Ejemplos |
|------|------|----------|
| Rutas | Server Component | `app/page.tsx`, `app/products/[slug]/page.tsx` |
| Layout | Server + client island | `layout.tsx` → `Header` (client) |
| Interactividad | Client Component | `CatalogView`, `FilterBar`, `ProductDetail`, `CartSheet` |

Patrones aplicados:

- **`Suspense`** alrededor de `CatalogView` por uso de `useSearchParams`.
- **`params: Promise<{ slug }>`** y `await params` (convención Next.js 15+).
- **`generateMetadata`** en PDP para SEO por producto.
- **`notFound()`** para slugs inválidos.

### Motivo

- App Router es el estándar actual de Next.js y el esperado en una prueba senior frontend.
- RSC reduce JavaScript enviado al cliente en páginas de contenido (catálogo shell, PDP shell, related products).
- La URL como fuente de verdad encaja naturalmente con `useSearchParams` + `router.replace`.

### Beneficio

- **Rendimiento inicial:** HTML del catálogo y PDP generado en servidor.
- **SEO:** metadata estática en layout + dinámica en PDP.
- **Modelo mental claro:** server para datos y composición; client para eventos y estado UI.
- **Deploy trivial en Vercel:** compatibilidad nativa con Next.js 16.

### Tradeoff

| Compromiso | Impacto |
|------------|---------|
| Complejidad server/client boundaries | Riesgo de importar hooks en Server Components si no se disciplina `"use client"` |
| `Suspense` obligatorio con `useSearchParams` | Sin boundary, error en runtime |
| PDP dinámica (`ƒ`) sin `generateStaticParams` | SSR on-demand; más latencia que ISR/SSG |
| Catálogo serializa 30 productos al cliente | Aceptable hoy; con miles de productos haría falta paginación server-side |
| Header client en layout global | Bundle cliente en todas las rutas (cart + sheet siempre cargados) |

---

## 4. TypeScript strict

### Decisión

Habilitar **`"strict": true`** en `tsconfig.json` y tipar el dominio con interfaces explícitas en `src/types/`. Prohibición implícita de `any` en todo el código de aplicación.

Contratos principales:

- `Product`, `ProductVariant`, `InventoryStatus`
- `CartItem` (snapshot desnormalizado)
- `FilterState`, `SortOption`

### Motivo

- La prueba exige demostrar **robustez de tipos** en un dominio ecommerce con variantes, filtros compuestos y líneas de carrito.
- TypeScript strict detecta nullability, implicit any y errores de props en compile time.
- Los contratos centralizados actúan como documentación viva entre features.

### Beneficio

- **Errores detectados antes de runtime:** props incorrectas, campos faltantes, union types inválidos.
- **Refactors más seguros:** cambiar `Product` propaga erroces a consumidores.
- **DX en IDE:** autocompletado y navegación en features, store y tests.
- **Alineación con Next.js 16:** el build ejecuta type-check integrado.

### Tradeoff

| Compromiso | Impacto |
|------------|---------|
| `products.json` tipado con `as Product[]` | Sin validación runtime; JSON malformado pasaría build y fallaría en ejecución |
| Más verbosidad en tipos de props y store | Coste de escritura mayor frente a JavaScript |
| Casts puntuales en parseo de URL (`as SortOption`) | Necesarios al leer search params; mitigados con listas canónicas (`SORT_OPTIONS`) |
| Configuración de paths alias no trivial | `@/*` apunta a raíz; `@/features/*` a `src/features` — curva de aprendizaje para nuevos contribuidores |

---

## 5. Shadcn UI

### Decisión

Utilizar **Shadcn UI** (Radix UI + Tailwind CSS 4) como sistema de componentes. Primitivas en `components/ui/`; composición en features.

Componentes utilizados: `Button`, `Card`, `Input`, `Select`, `Slider`, `Sheet`, `Badge`, `Separator`, `Skeleton`.

Estilo: preset **radix-nova**, variables CSS en `globals.css`, iconos **Lucide React**.

### Motivo

- Necesidad de UI **accesible** (Radix) con **control total del markup** (copia local, no npm opaco).
- Tailwind CSS 4 ya estaba en el stack del proyecto; Shadcn integra sin fricción.
- Acelera entrega de patrones ecommerce (cards, sheet lateral, selects, sliders) manteniendo calidad visual.

### Beneficio

- **Accesibilidad baseline:** focus trap en Sheet, roles ARIA en Select/Slider, keyboard navigation en Radix.
- **Personalización:** componentes viven en el repo; no hay theming fighting con librerías cerradas.
- **Bundle consciente:** solo se añaden los componentes usados.
- **Consistencia visual:** tokens compartidos (primary, muted, destructive) en toda la app.

### Tradeoff

| Compromiso | Impacto |
|------------|---------|
| Componentes copiados en el repo | Actualizaciones Shadcn requieren merge manual |
| Dependencia de Radix + Tailwind 4 | Acoplamiento al ecosistema; migrar sería costoso |
| `"use client"` en primitivas interactivas | Sheet, Select, Slider aumentan surface cliente |
| Estilo opinionado | Diferenciar visualmente requiere override consciente de tokens |
| `components/ui/` fuera de `src/features/` | Separación primitivas vs. dominio; convención híbrida de carpetas |

---

## 6. Dataset estático JSON

### Decisión

Servir el catálogo desde **`src/data/products.json`** (30 productos, 5 categorías) consumido por **`src/lib/products.ts`**: `getProducts()`, `getProductBySlug()`, `getCategories()`, `getRelatedProducts()`.

Imágenes referenciadas como URLs externas (`images.unsplash.com`) con `remotePatterns` en `next.config.ts`.

### Motivo

- La prueba evalúa **arquitectura frontend**, filtros, UX de carrito y calidad de código — no backend.
- Elimina dependencia de API, base de datos, auth y despliegue de infraestructura.
- Permite desarrollo y demo **offline-friendly** tras `npm install`.

### Beneficio

- **Cero infraestructura:** deploy inmediato en Vercel sin variables de entorno obligatorias.
- **Datos deterministas:** tests y demos reproducibles.
- **Capa de abstracción clara:** migrar a API real implica cambiar solo `lib/products.ts`.
- **Build predecible:** catálogo empaquetado en build; home estática (`○`).

### Tradeoff

| Compromiso | Impacto |
|------------|---------|
| Sin inventario real ni admin | Datos desactualizados requieren editar JSON manualmente |
| 13/40 URLs de imagen rotas (Unsplash) | UX visual degradada; dependencia externa frágil |
| Sin paginación ni búsqueda server-side | Todo el catálogo se filtra en cliente |
| Filtro de precio usa `product.price` base | Productos con variantes a precios distintos pueden filtrarse incorrectamente |
| Sin cache invalidation | A diferencia de un CMS/API, no hay freshness automático |

---

## 7. Estrategia de testing

### Decisión

Adoptar **Vitest** con enfoque en **lógica pura** (unit tests), no en componentes UI ni E2E en esta fase.

| Suite | Archivo | Qué cubre |
|-------|---------|-----------|
| Filtros URL | `__tests__/filter-params.test.ts` | Parse, serialize, defaults, merge, conteo activo |
| Pipeline catálogo | `__tests__/filter-products.test.ts` | Búsqueda, filtros combinados, ordenamiento |
| Carrito | `__tests__/cart-store.test.ts` | Add/remove/update, subtotal, item count, edge cases |

Configuración: `environment: "node"`, alias `@/` → `./src`, **37 tests** en el pipeline por defecto.

Excluido deliberadamente: E2E (Playwright), tests de componentes (`product-card.test.tsx` existe como stub vacío), tests de snapshot visual.

### Motivo

- En una ventana de ~6 horas, el mayor **ROI de testing** está en funciones puras: filtros URL y operaciones de carrito.
- La lógica de negocio crítica (serialización de params, merge de filtros, deduplicación de líneas por variante) es testeable sin DOM.
- Vitest es rápido, compatible con TypeScript y no requiere configuración pesada de JSDOM para estas suites.

### Beneficio

- **Feedback rápido:** suite completa en <1s.
- **Documentación ejecutable:** los tests describen comportamiento esperado de filtros y carrito.
- **Regresiones detectadas en CI:** cambios en `filter-params` o `cart-store` rompen build de tests.
- **Desacople UI / lógica:** valida la decisión arquitectónica de funciones puras exportadas.

### Tradeoff

| Compromiso | Impacto |
|------------|---------|
| Sin cobertura de componentes React | Bugs de renderizado, a11y o integración UI no detectados automáticamente |
| Sin E2E | Flujos catálogo → PDP → carrito no verificados de punta a punta |
| Vitest alias difiere de tsconfig app (`@` → `src` vs raíz) | Tests no validan resolución de imports de `components/ui/` |
| JSON no validado en tests | Integridad del dataset depende de revisión manual |
| Cobertura parcial del dominio | `lib/products.ts`, `format-price.ts` y UI sin tests dedicados |

---

## Resumen de interacción entre decisiones

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js App Router (RSC)                    │
│  page.tsx ──getProducts()──► lib/products.ts ──► products.json  │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   features/catalog    features/product    features/cart
   (URL params)        (PDP client)        (Zustand client)
         │                   │                   │
         └─────────┬─────────┴───────────────────┘
                   ▼
            src/types/ (TypeScript strict)
                   │
                   ▼
         __tests__/ (Vitest — lógica pura)
```

Las decisiones no son independientes: **App Router** habilita RSC + metadata; **features** organizan el código que **Zustand** y **URL params** consumen; **TypeScript strict** unifica contratos; **JSON estático** alimenta la capa server; **Shadcn** acelera la capa UI cliente; **Vitest** valida el núcleo lógico donde más importa.

---

## Decisiones pospuestas (v2)

| Decisión | Razón del aplazamiento |
|----------|------------------------|
| Zustand `persist` | Fuera del alcance mínimo viable |
| `generateStaticParams` / ISR en PDP | 30 productos toleran SSR dinámico |
| Assets locales en `/public/products/` | Requiere pipeline de assets; URLs rotas documentadas |
| Headless CMS / API REST | Sustitución de JSON planificada vía `lib/products.ts` |
| E2E con Playwright | Coste de setup > valor en ventana de 6h |
| Extracción de shared UI (rating, badges) | Refactor cosmético; no bloquea entrega |

---

## Referencias

- [`README.md`](./README.md) — Guía de instalación, deploy y limitaciones conocidas
- [`IA.md`](./IA.md) — Transparencia sobre uso de herramientas de IA en el desarrollo
- [`tracking.md`](./tracking.md) — Matriz de requisitos funcionales
