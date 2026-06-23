---
name: linkpage
description: "Linky — link-in-bio SaaS con Next.js, Supabase, Tailwind v4. Dashboard con 4 tabs, temas animados/foto/video, sin Tienda."
metadata: 
  node_type: memory
  type: project
  originSessionId: 3dc757f4-df6b-4700-99bb-316f1e3b5ed3
---

Proyecto en `/Users/mikerodriguez/Claude/linkpage`. App estilo Linktree (SaaS) donde cada usuario tiene una página pública en `/{username}`.
Repo: github.com/Heikeel/linky.git (main). Deploy: mylinky-eta.vercel.app

**Stack:**
- Next.js (App Router, JS — no TS)
- React 19
- Supabase (auth + DB): `@supabase/ssr`, `@supabase/supabase-js`
- Tailwind v4 con `@tailwindcss/postcss`
- Iconos: Tabler Icons (`ti-*` via CDN)
- Deploy: Vercel (git push a main → auto-deploy)

**Rutas principales:**
- `/` — landing page (fondo: `linky-bg.mp4` nebulosa morada fija)
- `/login`, `/register` — auth
- `/dashboard` — editor del perfil (protegido)
- `/[username]` — perfil público
- `/api/profile`, `/api/links`, `/api/upload` — endpoints
- `/auth/callback` — OAuth callback (Google)

**Estructura de componentes clave:**
- `components/Editor.js` — layout dashboard: sidebar (tabs) + preview. Tabs: Perfil | Links | Temas | Movimiento
- `components/PhonePreview.js` — preview en tiempo real del perfil
- `components/ProfilePage.js` — página pública del perfil (contiene todas las funciones ThemeXxx)
- `components/AnimatedBg.js` — fondos animados reutilizables (bg_motion)
- `components/tabs/ColorsTab.js` — temas, paletas, grupos Animados/Paisajes/Live
- `components/tabs/ProfileTab.js` — editar nombre, bio, foto
- `components/tabs/LinksTab.js` — gestionar links
- `components/tabs/MotionTab.js` — animación hover, border-radius, espaciado

**ELIMINADO (no existe más):**
- Tienda / StoreTab — eliminada completa
- Matrix, Abismo, Neon — temas eliminados
- ProductsSection — eliminada de ProfilePage.js
- Tab "Colores" → renombrada a "Temas"
- `products` prop en ProfilePage — eliminada

**Temas disponibles — grupos en ColorsTab:**
- **Diseño base:** light (Minimalista), dark (Dark mode), gradient (Degradado), custom (Personalizado)
- **Animados CSS:** tornasol, cosmos, cometas, sunset, olas, lava, polvo, cristal, lluvia
- **Paisajes (foto jpg):** montana, marte, aurora, desert, tormenta, glaciar, ocean, stars, zen, loto
- **Live (video mp4):** sakura, nebulosa

**Assets en /public/:**
- Videos: `linky-bg.mp4`, `sakura.mp4`, `nebulosa.mp4`
- Fotos: `stars.jpg`, `desert.jpg`, `aurora.jpg`, `ocean.jpg`, `glaciar.jpg`, `montana.jpg`, `zen.jpg`, `tormenta.jpg`, `marte.jpg`, `loto.jpg`

**Carpetas de assets del usuario:**
- `/Users/mikerodriguez/Google Veo/` — videos generados con Veo (via Gemini chat)
- `/Users/mikerodriguez/Google Banana/` — imágenes generadas con Google Banana

**Generación de videos (Veo):**
- Usar gemini.google.com (incluido en Google One Pro, gratis)
- NO usar AI Studio (cobra ~$0.12/seg en 1080p)
- Pedir siempre: `wallpaper-style, no camera movement, no people, 8 seconds seamless loop, 1080p quality`
- Verificar con ffprobe que sea 1080p mínimo antes de integrar

**Cómo agregar tema nuevo:**
1. Función `ThemeNombre` en ProfilePage.js
2. Entrada en ANIMATED_THEMES (animado) o botón inline (paisaje/live) en ColorsTab.js
3. Case en PhonePreview.js con animación o imagen/video
4. ID en `ANIMATED_IDS` en ColorsTab.js
5. `npm run build` → `git push`

**Base de datos Supabase:**
- Tabla `profiles`: id, username, name, bio, avatar_url, accent, bg, card, text_color, muted, icon_color, theme, bg_motion, animation, border_radius, link_gap
- Tabla `links`: id, profile_id, network_id, name, url, icon, color, order_index, active
- Tabla `analytics`: id, profile_id, link_id (nullable), type (view|click), created_at
- Storage bucket `avatars` (público) — fotos de perfil con RLS por userId
- RLS activado en todas las tablas
- Tabla `products` y columnas `paypal_email`/`store_terms_accepted_at` existen en DB pero la UI de Tienda fue eliminada
- SQLs en `/supabase/`: 01_schema, 02_icon_color, 03_bg_motion, 04_avatars_storage, 05_analytics

**Features implementadas (2026-06-21):**
- OG tags dinámicos por perfil (og:image usa avatar de Storage)
- Analytics: visitas + clicks registrados en ProfilePage, tab Stats en dashboard
- Save de links seguro: diff en lugar de delete-all
- Crop de avatar: cuadrado, boundary clamping, output 1200x1200
- Typing fluido en LinksTab: estado local en LinkRow + onBlur

**Fondos animados (bg_motion, solo en temas base estáticos):**
- aurora, bubbles, waves, gradient, sparkles, pulse, rays
- Implementados en `AnimatedBg.js` con CSS keyframes

**Auth:** Email/password + Google OAuth

**How to apply:** App Router, JS no TS, Tailwind v4. Colores dinámicos van como `style={{ color: accent }}`, no como clases Tailwind. Deploy siempre con git push (nunca solo localhost).
