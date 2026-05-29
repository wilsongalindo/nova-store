# Nova Store — Uso de Inteligencia Artificial

Documento de transparencia sobre el uso de herramientas de IA durante el desarrollo de **Nova Store**, prueba técnica ecommerce frontend.

**Proyecto:** Nova Store  
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · Zustand · Shadcn UI  
**Fecha:** Mayo 2026

---

## 1. Propósito de este documento

Este archivo describe de forma explícita:

- Qué herramientas de IA se utilizaron.
- Cómo se integraron en el flujo de trabajo.
- Qué partes del código fueron generadas o asistidas por IA.
- Qué decisiones permanecieron bajo criterio humano.
- Cómo se validó el código antes de considerarlo listo para entrega.

El objetivo es garantizar transparencia académica y profesional en una prueba técnica senior.

---

## 2. Herramientas de IA utilizadas

| Herramienta | Rol en el proyecto |
|-------------|-------------------|
| **Cursor IDE** | Entorno principal de desarrollo con agente de IA integrado |
| **Cursor Agent (Auto / Composer)** | Generación de código, revisiones, auditorías y documentación mediante prompts estructurados |
| **Modelos de lenguaje vía Cursor** | Asistencia en arquitectura, implementación TypeScript/React, tests unitarios y análisis estático |

No se utilizaron servicios externos adicionales (Copilot standalone, ChatGPT web, generadores de imágenes, etc.) fuera del flujo de Cursor.

---

## 3. Metodología de uso

La IA se empleó como **asistente de implementación bajo supervisión humana**, no como autor autónomo del producto.

### 3.1 Flujo de trabajo

1. **Definición de requisitos** — El desarrollador estableció el alcance funcional (`tracking.md`), stack tecnológico y restricciones (≈6 horas, nivel senior).
2. **Prompts con rol explícito** — Cada tarea se formuló con un perfil concreto (*Principal Architect*, *Senior Frontend Engineer*, *Staff Engineer*) y criterios de aceptación claros.
3. **Iteración incremental** — Implementación por capas: arquitectura → tipos → datos → UI → estado → integración → hardening.
4. **Revisión y acotación** — En múltiples fases se indicó explícitamente: *no refactorizar*, *no modificar arquitectura*, *solo mejoras seguras*, *no tocar código*.
5. **Validación automatizada** — Tras cada entrega relevante se ejecutaron `npm run build`, `npm run lint` y `npm test`.

### 3.2 Tipo de interacción

| Patrón | Ejemplo |
|--------|---------|
| **Diseño sin código** | Arquitectura inicial y simplificación para 6h |
| **Implementación guiada** | “Implementa `cart-store.ts` con estos requisitos…” |
| **Auditoría / informe** | Revisión responsive, pre-producción, evaluación staff |
| **Corrección acotada** | Fix de lint en 2 archivos; `"use client"` en cart store |
| **Documentación** | `README.md`, checklist Vercel, este `IA.md` |

---

## 4. Partes asistidas por IA

### 4.1 Arquitectura y scaffold

| Área | Archivos / artefactos | Nivel de asistencia |
|------|----------------------|---------------------|
| Diseño de arquitectura feature-based | Plan de carpetas, convenciones, estrategia de testing | **Generado por IA**, revisado y simplificado por solicitud explícita del desarrollador |
| Estructura inicial del proyecto | `src/features/*`, `src/types/*`, `src/lib/*`, `src/app/*` | **Generado por IA** (exports mínimos para compilar) |
| Matriz de seguimiento | `tracking.md` | **Asistido** (plantilla inicial); contenido ampliado manualmente |

### 4.2 Dominio y datos

| Área | Archivos | Nivel de asistencia |
|------|----------|---------------------|
| Modelo de dominio TypeScript | `src/types/product.ts`, `cart.ts`, `filters.ts`, `index.ts` | **Generado por IA** según contrato definido en el prompt |
| Dataset estático | `src/data/products.json` (30 productos) | **Generado por IA** |
| Capa de acceso a datos | `src/lib/products.ts`, `src/lib/format-price.ts` | **Generado por IA** |

### 4.3 Catálogo y filtros

| Área | Archivos | Nivel de asistencia |
|------|----------|---------------------|
| UI de catálogo | `product-card.tsx`, `product-grid.tsx`, `catalog-view.tsx` | **Generado por IA** |
| Lógica de filtros (URL como fuente de verdad) | `filter-params.ts`, `filter-products.ts`, `use-filters.ts`, `filter-bar.tsx` | **Generado por IA** |
| Página principal | `src/app/page.tsx` (RSC + Suspense) | **Generado por IA** |
| Tests de filtros | `__tests__/filter-params.test.ts`, `filter-products.test.ts` | **Generado por IA** |

### 4.4 Detalle de producto

| Área | Archivos | Nivel de asistencia |
|------|----------|---------------------|
| PDP y galería | `product-detail.tsx`, `product-gallery.tsx`, `add-to-cart-button.tsx` | **Generado por IA** |
| Ruta dinámica | `src/app/products/[slug]/page.tsx` | **Generado por IA**; `generateMetadata` añadido en fase posterior |
| Productos relacionados | Sección en `[slug]/page.tsx` | **Generado por IA** |

### 4.5 Carrito (Zustand)

| Área | Archivos | Nivel de asistencia |
|------|----------|---------------------|
| Store y operaciones puras | `cart-store.ts` | **Generado por IA** |
| UI del carrito | `cart-trigger.tsx`, `cart-item.tsx`, `cart-summary.tsx`, `cart-sheet.tsx` | **Generado por IA** |
| Integración Add to Cart | `product-card.tsx`, `add-to-cart-button.tsx`, `product-detail.tsx` | **Asistido** (conexión UI ↔ store en fase dedicada) |
| Tests del carrito | `__tests__/cart-store.test.ts` | **Generado por IA** |
| Directiva `"use client"` | `cart-store.ts` | **Asistido** (corrección de boundary tras auditoría) |

### 4.6 Layout, SEO y UX global

| Área | Archivos | Nivel de asistencia |
|------|----------|---------------------|
| Header | `src/components/layout/header.tsx` | **Generado por IA** |
| Metadata raíz | `src/app/layout.tsx` | **Generado por IA** |
| Metadata por producto | `generateMetadata` en `[slug]/page.tsx` | **Generado por IA** |
| Página 404 | `src/app/not-found.tsx` | **Generado por IA** |
| Ajustes responsive | Múltiples componentes (header, filters, cart, PDP, grid) | **Asistido** (auditoría + parches Tailwind acotados) |

### 4.7 Documentación y revisiones

| Artefacto | Nivel de asistencia |
|-----------|---------------------|
| `README.md` | **Generado por IA** |
| Informes de revisión (staff, pre-producción, responsive) | **Generado por IA** (sin modificar código cuando se indicó) |
| Checklist de despliegue Vercel | **Generado por IA** |
| Corrección lint (`filter-bar.tsx`, `verify-candidates.mjs`) | **Asistido** |

### 4.8 No implementado / pendiente (con asistencia de análisis)

| Tema | Estado |
|------|--------|
| Corrección de 13 URLs de imagen rotas en `products.json` | **Analizado por IA**; fix **no aplicado** (decisión de posponer) |
| Migración a assets locales `/public/products/` | **Estrategia propuesta por IA**; **no implementada** |
| Persistencia del carrito | **Pospuesto** |
| Checkout real | **Placeholder** |
| Tests E2E | **Pospuesto** |
| `product-card.test.tsx` | Stub vacío; **no incluido** en Vitest |

---

## 5. Decisiones tomadas manualmente

Las siguientes decisiones fueron establecidas por el desarrollador y **no** delegadas a la IA:

### 5.1 Stack y restricciones del proyecto

- Uso de **Next.js App Router**, **TypeScript strict**, **Tailwind CSS 4**, **Zustand** y **Shadcn UI** como stack obligatorio.
- Alcance funcional definido en **`tracking.md`** (catálogo, filtros, PDP, carrito, responsive, calidad técnica).
- Restricción temporal de **≈6 horas** que motivó la **simplificación arquitectónica** (eliminar barrels, subcarpetas prematuras, feature `filters` separado, E2E completo).

### 5.2 Aprobación de diseño antes de implementar

- Revisión y **aprobación explícita** de la arquitectura simplificada antes del scaffold.
- Implementación **por fases** con prompts acotados (*“no implementar Zustand todavía”*, *“no implementar filtros todavía”*).

### 5.3 Control de alcance en revisiones

- Solicitud de **solo mejoras seguras** en auditorías de catálogo, PDP y carrito.
- Informes **sin modificar código** (revisión staff, pre-producción, imágenes).
- Correcciones **limitadas a archivos concretos** (lint en 2 archivos; `"use client"` solo en `cart-store.ts`).

### 5.4 Git y entrega

- Operaciones de git (`add`, `commit`, `push`) ejecutadas **bajo instrucción explícita** del desarrollador.
- Commits no automatizados por la IA sin solicitud.

### 5.5 Deuda técnica aceptada

- **No corregir** URLs de Unsplash rotas en el dataset (priorización del tiempo).
- Mantener **checkout placeholder** y **carrito sin persistencia** como tradeoffs documentados.
- Mantener scripts de verificación de imágenes en `scripts/` aunque algunos quedaron incompletos.

---

## 6. Validación del código generado

Todo código asistido por IA se sometió a validación antes de considerarse entregable.

### 6.1 Validación automatizada

| Comando | Resultado esperado | Estado al entregar |
|---------|-------------------|-------------------|
| `npm run build` | Compilación Next.js 16 sin errores | ✅ Pasa |
| `npx tsc --noEmit` | TypeScript strict sin errores | ✅ Pasa |
| `npm run lint` | ESLint sin errores bloqueantes | ✅ Pasa (2 warnings en `scripts/` no bloqueantes) |
| `npm test` | Tests unitarios Vitest | ✅ 37/37 pasan |

### 6.2 Validación por revisión asistida

- **Revisión de catálogo y header** — imports, a11y, Suspense, aria-live.
- **Revisión de PDP y product features** — tipado, estados vacíos, rendimiento básico.
- **Auditoría responsive** — breakpoints mobile/tablet/desktop en 12+ archivos.
- **Revisión pre-producción (Staff)** — App Router boundaries, metadata, rutas dinámicas, imports.
- **Auditoría de carrito** — operaciones puras + tests de edge cases.

### 6.3 Validación manual recomendada (checklist del desarrollador)

- [ ] Navegar catálogo y aplicar filtros; verificar sincronización URL.
- [ ] Abrir PDP, cambiar variantes, añadir al carrito.
- [ ] Verificar badge del carrito, sheet, cantidades y subtotal.
- [ ] Probar slug inválido → 404.
- [ ] Inspeccionar `<title>` y meta OG en PDP.
- [ ] Revisar imágenes rotas conocidas (13/40 URLs externas).

### 6.4 Verificación de datos externos

- Script local `scripts/check-images.mjs` y comprobaciones puntuales con `fetch HEAD` confirmaron **13 URLs rotas** en `products.json`.
- La IA **identificó el riesgo**; la **corrección no se aplicó** por decisión de alcance.

---

## 7. Limitaciones y responsabilidad

### 7.1 Limitaciones inherentes al uso de IA

- El dataset JSON **no fue validado en runtime** contra un schema; solo tipado con `as Product[]` en compile time.
- Las URLs de Unsplash fueron generadas por IA **sin verificación exhaustiva** en el momento de creación; parte de ellas están rotas hoy.
- Puede existir **duplicación de UI helpers** (rating, badges de inventario) entre componentes — detectada en revisiones, no refactorizada por restricción de alcance.
- La IA **no sustituye** pruebas E2E ni validación visual humana completa.

### 7.2 Responsabilidad del desarrollador

El desarrollador es responsable de:

- Revisar y aprobar cada entrega asistida por IA.
- Definir alcance, prioridades y tradeoffs.
- Validar el comportamiento en navegador y en despliegue.
- Asegurar que la entrega cumple los requisitos de la prueba técnica.

---

## 8. Resumen ejecutivo

| Métrica | Valor |
|---------|-------|
| **Herramienta principal** | Cursor IDE + Agent |
| **Cobertura estimada asistida por IA** | ~85–90 % del código de aplicación y tests unitarios |
| **Decisiones arquitectónicas clave** | Humanas (stack, simplificación 6h, fases de implementación) |
| **Validación mínima** | Build + TypeScript + Lint + 37 tests unitarios |
| **Deuda conocida documentada** | Imágenes rotas, checkout placeholder, carrito sin persist |

Nova Store fue desarrollado como ejercicio senior frontend con **IA como acelerador de implementación**, manteniendo criterio humano en arquitectura, alcance, validación y entrega.

---

## 9. Referencias internas

- [`README.md`](./README.md) — Documentación técnica del proyecto
- [`tracking.md`](./tracking.md) — Matriz de requisitos e implementación
- [`AGENTS.md`](./AGENTS.md) — Reglas del agente para Next.js 16 en este repositorio
