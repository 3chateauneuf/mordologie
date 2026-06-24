# Plan — Extensión Chrome "Contexte + Minuteur" (estilo Toggl)

Estado: **cadrage / propuesta** (doc only, sin código aún).
Decisiones tomadas: auth = **magic link / OTP Supabase** · audiencia = **solo Eduardo por ahora** · arranque = **plan primero**.

---

## 1. Objetivo

Popup de extensión Chrome (MV3), accesible al lado de la barra de direcciones,
que replique el **Contexte** (sujet, client, catégorie, tags, lien, notes) y el
**minuteur** (start/stop/pause) de Mordologie, con:

- **Badge de tiempo** en el icono de la extensión (estilo Toggl).
- **Sincronización en vivo** con la web (arrancar en una, parar en otra).
- **Lógica compartida** con la web (sin duplicar canonicalización ni save pipeline).

## 2. Principio rector: un núcleo compartido

El problema de fondo: `app.js` (~480 KB) acopla UI + lógica. "Hacerlo bien" =
extraer un **core sin DOM** reutilizable por web y extensión.

```
/core/                      ← módulos ES puros, sin document/window directos
  supabase.js               ← createClient(URL, PUBLISHABLE_KEY) + adaptador de storage
  auth.js                   ← OTP email (signInWithOtp + verifyOtp), resolución de app-user
  catalog.js                ← carga categories / projects / users (referenceCatalog)
  canonical.js              ← normalizeCategorySelection, normalizeCategoryAndTags, buildCanonicalSessionDraft
  categories.js             ← createCategoryReference, getCategorySuggestionLabels
  memory.js                 ← getProjectMemories / resolveProjectMemory (reprise)
  timer.js                  ← start / pause / stop, active_sessions ↔ time_entries, getNextTimeEntryId, idempotencia
  ids.js                    ← getNextPrefixedId
/web/                       ← la web actual consume /core (app.js adelgaza)
/extension/                 ← nueva extensión MV3 consume /core
```

La web y la extensión son **dos vistas** sobre el mismo core + el mismo Supabase.

## 3. Auth en una extensión (detalle importante)

El "magic link" clásico abre una URL y deja la sesión en el navegador — **no**
funciona bien dentro del popup de una extensión (storage aislado, sin redirect
capturable cómodamente).

➡️ **Recomendación: OTP por email con código** (Supabase lo soporta):
1. Usuario escribe su email → `supabase.auth.signInWithOtp({ email })`.
2. Recibe un **código de 6 dígitos** por correo.
3. Lo pega en el popup → `supabase.auth.verifyOtp({ email, token, type: 'email' })`.
4. Sesión guardada en `chrome.storage.local` (adaptador de storage custom).

Esto da `auth.uid()` real → mapea a `users.auth_user_id` → rol correcto (admin).

## 4. Contrato de sincronización

- **`active_sessions`** = fuente de verdad del crono en curso (ya existe). Web y
  extensión leen/escriben ahí. localStorage NO se comparte entre orígenes.
- **Stop** → escribe en `time_entries` con `getNextTimeEntryId` + guardas de
  idempotencia/conflictos (las que ya afinamos). Esta es la parte más delicada a
  extraer sin regresiones.
- **Tiempo real**: suscripción Supabase Realtime a `active_sessions` del usuario
  → la web y la extensión reflejan al instante arranques/paradas. (Fallback:
  polling cada ~15 s, como `REMOTE_SYNC_INTERVAL_MS` hoy.)

## 5. ⚠️ Implicación: RLS empieza a aplicar de verdad

Hoy el desktop es **name-based / anónimo** (RLS apenas aplica; varias tablas
permisivas). Con auth real (`auth.uid()`), las políticas de `auth_rls.sql`
**sí** se evalúan. Antes de migrar hay que verificar/ajustar que el usuario
autenticado pueda: leer catálogo, crear/leer/actualizar `time_entries` y
`active_sessions`, y (admin) crear `categories`. Relacionado con el pendiente
`db/category_requests_rls.sql`.

Estrategia segura: durante la transición, **web sigue anónima** y **extensión
usa auth real**. El core soporta ambos contextos (auth opcional). Migrar la web
a auth real es una fase posterior, separada.

## 6. Estructura de la extensión (MV3)

```
/extension/
  manifest.json        ← action.default_popup, permissions: [storage, alarms],
                         host_permissions: [https://<proj>.supabase.co/*]
  popup.html / popup.js ← UI Contexte + minuteur (consume /core)
  background.js        ← service worker: badge de tiempo (chrome.alarms cada 30s),
                         escucha active_session, setBadgeText
  popup.css            ← estilo compacto (reutiliza tokens visuales de la web)
  /core (symlink o build) 
```

Detalles: badge muestra `Hh`/`mm` del crono activo; clic en icono abre popup;
opción de "ouvrir l'app complète" para edición rica.

## 7. Fases (cada una es un PR, la web nunca se rompe)

| Fase | Entrega | Riesgo |
|------|---------|--------|
| **F1 — Extracción del core** | Mover funciones puras de `app.js` a `/core/*.js` como módulos ES; `app.js` las **importa** (sin cambiar comportamiento). Verificar web intacta. | Alto (toca save pipeline) → hacer incremental, función por función, probando |
| **F2 — Shell extensión** | manifest + popup vacío + service worker + cliente Supabase + **auth OTP**; resolver app-user/rol | Medio (auth en extensión) |
| **F3 — Minuteur** | Leer catálogo + `active_sessions`; start/stop/pause con `timer.js`; badge de tiempo | Medio (sync) |
| **F4 — Contexte** | Campos sujet/catégorie/tags/lien/notes + autocomplete + chips de reprise (core `catalog`/`memory`/`canonical`) | Bajo-medio |
| **F5 — Realtime + pulido** | Suscripción `active_sessions`; conflictos; estados de error; onboarding mínimo | Medio |

## 8. Riesgos y mitigaciones

- **Regresión del save pipeline** (recién estabilizado): F1 incremental, mantener
  `app.js` delegando, probar arranque/parada/conflictos en la web tras cada paso.
- **Auth en extensión**: usar OTP código (no magic-link redirect).
- **RLS al activar auth real**: auditar políticas antes; mantener web anónima
  durante la transición.
- **Build/empaquetado**: módulos ES nativos en MV3 (`type: module` en SW y popup)
  evitan bundler; si crece, añadir esbuild.
- **Duplicación de estilos**: extraer tokens CSS comunes (variables) a un archivo
  compartido.

## 9. Fuera de alcance (por ahora)

- Publicación en Chrome Web Store (solo carga en modo desarrollador).
- Migrar la web entera a auth real (fase futura separada).
- Edición rica (manual dialog, agenda) → se queda en la web; la extensión enlaza a ella.

## 10. Primer paso propuesto

Arrancar **F1**: extraer a `/core` los módulos más aislados primero
(`ids.js`, `canonical.js`, `catalog.js`), con `app.js` importándolos y la web
verificada, antes de tocar `timer.js` (lo más sensible).
