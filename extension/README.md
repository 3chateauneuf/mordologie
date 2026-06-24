# Mordologie — Extensión Chrome (minuteur)

Estado: **Fase 1 — autenticación OTP** (el minuteur + contexte llegan después).
Ver el plan completo en [`../docs/plan-extension-chrome.md`](../docs/plan-extension-chrome.md).

## Cargar en Chrome (modo desarrollador)

1. Abre `chrome://extensions`.
2. Activa **"Modo de desarrollador"** (arriba a la derecha).
3. **"Cargar descomprimida"** → selecciona esta carpeta `extension/`.
4. Aparecerá el icono al lado de la barra de direcciones. Clic → popup.

Tras cambios en los archivos: botón **recargar** (↻) en la tarjeta de la extensión.

## ⚠️ Requisito en Supabase para el código OTP

Por defecto Supabase envía un **enlace mágico**, no un código. Para recibir el
**código de 6 dígitos** que pide el popup:

1. Supabase Dashboard → **Authentication → Email Templates → "Magic Link"**.
2. Asegúrate de que la plantilla incluya el token, p. ej.:
   ```
   Tu code de connexion : {{ .Token }}
   ```
   (Puedes dejar también el enlace; lo que importa es que `{{ .Token }}` aparezca.)
3. Guarda.

Sin esto, el email no traerá código y `verifyOtp` no tendrá qué validar.

Nota: el login usa `shouldCreateUser: false` → el email debe existir ya como
usuario en **Authentication → Users**. (eduardo@cargonautes.fr ya está mapeado.)

## Estructura

```
manifest.json     MV3: popup + service worker + permisos
popup.html/.css/.js   UI del popup (fase 1: login OTP)
background.js     service worker (badge de tiempo — fase minuteur)
core/             lógica sin DOM (config, storage, auth) — reutilizable
vendor/supabase.js  supabase-js 2.x vendorizado (MV3 no permite CDN)
icons/            iconos de la extensión
```

## Privacidad

Usa la **clave pública** de Supabase (la misma que la web, ya expuesta en
`index.html`). La sesión se guarda en `chrome.storage.local`.
