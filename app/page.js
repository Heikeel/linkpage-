'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const ACCENT = '#6c63ff'

/* ───────────────────────── Animation primitives ───────────────────────── */

// Revela su contenido al entrar al viewport. variant controla el gesto de entrada.
function Reveal({ children, delay = 0, variant = 'up', style, className }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hidden = {
    up:    'translateY(48px)',
    left:  'translateX(-56px)',
    right: 'translateX(56px)',
    scale: 'scale(0.86)',
    blur:  'translateY(36px)',
  }[variant]

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        filter: shown ? 'blur(0px)' : (variant === 'blur' ? 'blur(14px)' : 'blur(0px)'),
        transform: shown ? 'none' : hidden,
        transition: `opacity 0.8s ease ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter 0.8s ease ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

// Mueve su contenido a distinta velocidad que el scroll (parallax). Escribe el
// transform directamente en el DOM para no re-renderizar en cada frame.
function Parallax({ children, speed = 0.15, style, className }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = null
    const update = () => {
      const rect = el.getBoundingClientRect()
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2
      el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`
      raf = null
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])
  return <div ref={ref} className={className} style={style}>{children}</div>
}

// Tarjeta que se inclina siguiendo el cursor (efecto 3D tipo Apple).
function Tilt({ children, max = 10, style }) {
  const ref = useRef(null)
  function onMove(e) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(1.03)`
  }
  function reset() {
    const el = ref.current
    if (el) el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)'
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ ...style, transition: 'transform 0.25s ease', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

/* ───────────────────────── Mockups ───────────────────────── */

function PhoneMockup({ darkMode }) {
  const phoneBg    = darkMode ? '#1a1a2e' : '#fff'
  const linkBg     = darkMode ? 'rgba(255,255,255,0.07)' : '#f5f3ff'
  const linkBorder = darkMode ? 'rgba(255,255,255,0.1)'  : '#ede9fe'
  const textColor  = darkMode ? '#fff'                   : '#1f2937'
  const mutedColor = darkMode ? 'rgba(255,255,255,0.45)' : '#6b7280'

  return (
    <div className="lk-float" style={{
      width: 220, height: 430, borderRadius: 36, flexShrink: 0,
      background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)',
      boxShadow: darkMode
        ? '0 40px 100px rgba(108,99,255,0.5), 0 0 0 1px rgba(108,99,255,0.3)'
        : '0 40px 80px rgba(108,99,255,0.3)',
      padding: 3, position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 56, height: 5, borderRadius: 3, background: 'rgba(0,0,0,0.2)', zIndex: 10 }} />
      <div style={{
        width: '100%', height: '100%', borderRadius: 34, background: phoneBg,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        alignItems: 'center', paddingTop: 36, paddingBottom: 20, paddingLeft: 16, paddingRight: 16,
      }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #a855f7)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 700 }}>M</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: textColor, marginBottom: 2 }}>Mike</div>
        <div style={{ fontSize: 11, color: ACCENT, marginBottom: 5, fontWeight: 600 }}>@mike</div>
        <div style={{ fontSize: 10, color: mutedColor, marginBottom: 16, textAlign: 'center', lineHeight: 1.4 }}>Creador de contenido · México</div>
        {[
          { icon: 'ti-brand-instagram', name: 'Instagram', color: '#e1306c' },
          { icon: 'ti-brand-youtube',   name: 'YouTube',   color: '#ff0000' },
          { icon: 'ti-brand-tiktok',    name: 'TikTok',    color: darkMode ? '#fff' : '#000' },
          { icon: 'ti-brand-spotify',   name: 'Spotify',   color: '#1db954' },
        ].map((l, i) => (
          <div key={l.name} className="lk-linkrow" style={{
            width: '100%', padding: '9px 12px', borderRadius: 10,
            background: linkBg, marginBottom: 7,
            display: 'flex', alignItems: 'center', gap: 10,
            border: `1px solid ${linkBorder}`,
            animation: `lk-pop 0.5s ease ${0.4 + i * 0.12}s both`,
          }}>
            <i className={`ti ${l.icon}`} style={{ color: l.color, fontSize: 15 }} aria-hidden="true" />
            <span style={{ fontSize: 11, fontWeight: 600, color: textColor }}>{l.name}</span>
            <i className="ti ti-chevron-right" style={{ color: mutedColor, fontSize: 10, marginLeft: 'auto' }} aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Fondos coloridos variados estilo mosaico — sin nombres, puro color.
const THEMES_SHOWCASE = [
  { bg: 'linear-gradient(160deg, #ff6ec4, #7873f5)', accent: '#fff',    dark: true,  tilt: -4 },
  { bg: 'linear-gradient(160deg, #11998e, #38ef7d)', accent: '#fff',    dark: true,  tilt:  3 },
  { bg: '#f5f5f7',                                    accent: '#6c63ff', dark: false, tilt: -2 },
  { bg: 'linear-gradient(160deg, #0f0c29, #302b63, #24243e)', accent: '#ff0080', dark: true, tilt: 4 },
  { bg: 'linear-gradient(160deg, #f7971e, #ffd200)', accent: '#fff',    dark: true,  tilt:  2 },
  { bg: 'linear-gradient(160deg, #2193b0, #6dd5ed)', accent: '#fff',    dark: true,  tilt: -3 },
]

function ThemeCard({ theme, index }) {
  return (
    <div
      className="lk-float lk-themecard"
      style={{
        width: 100, borderRadius: 20, padding: 12,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: theme.bg, flexShrink: 0,
        '--tilt': `${theme.tilt}deg`,
        transform: `rotate(${theme.tilt}deg)`,
        boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
        border: theme.dark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.06)',
        animationDelay: `${index * 0.4}s`,
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: theme.dark ? 'rgba(255,255,255,0.85)' : theme.accent, marginBottom: 8 }} />
      <div style={{ width: 52, height: 7, borderRadius: 3, background: theme.dark ? 'rgba(255,255,255,0.85)' : '#1f2937', marginBottom: 4 }} />
      <div style={{ width: 36, height: 5, borderRadius: 2.5, background: theme.dark ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 12 }} />
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          width: '100%', height: 22, borderRadius: 7, marginBottom: 6,
          background: theme.dark ? 'rgba(255,255,255,0.22)' : '#f5f3ff',
          border: theme.dark ? '1px solid rgba(255,255,255,0.25)' : '1px solid #e5e7eb',
        }} />
      ))}
    </div>
  )
}

/* ───────────────────────── Page ───────────────────────── */

export default function Home() {
  const [dark, setDark] = useState(false)

  const bg          = dark ? '#0f0f13'                : '#f4f3ff'
  const text        = dark ? '#fff'                   : '#111827'
  const muted       = dark ? 'rgba(255,255,255,0.5)'  : '#6b7280'
  const cardBg      = dark ? '#1a1a2e'                : '#fff'
  const border      = dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
  const pillBg      = dark ? 'rgba(108,99,255,0.2)'   : '#ece9ff'
  const headerBg    = dark ? 'rgba(15,15,19,0.85)'    : 'rgba(244,243,255,0.85)'

  return (
    <div style={{ background: bg, color: text, transition: 'background 0.4s, color 0.4s', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* keyframes globales para todo el movimiento */}
      <style>{`
        @keyframes lk-float      { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        @keyframes lk-floatcard  { 0%,100% { transform: rotate(var(--tilt)) translateY(0); } 50% { transform: rotate(var(--tilt)) translateY(-12px); } }
        @keyframes lk-blob       { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-30px) scale(1.1); } 66% { transform: translate(-30px,25px) scale(0.95); } }
        @keyframes lk-gradient   { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes lk-pop        { from { opacity: 0; transform: translateY(10px) scale(0.96); } to { opacity: 1; transform: none; } }
        @keyframes lk-spin       { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes lk-bob        { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
        .lk-float     { animation: lk-float 6s ease-in-out infinite; }
        .lk-themecard { animation: lk-floatcard 7s ease-in-out infinite; }
        .lk-cta { transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease; }
        .lk-cta:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 16px 44px rgba(108,99,255,0.5) !important; }
        .lk-ghost { transition: transform 0.25s ease, background 0.25s ease; }
        .lk-ghost:hover { transform: translateY(-2px); }
        .lk-linkrow { transition: transform 0.2s ease; }
        .lk-feat { transition: transform 0.25s ease; }
        .lk-feat:hover { transform: translateX(6px); }
        .lk-arrow { display: inline-block; animation: lk-bob 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .lk-float, .lk-themecard, .lk-arrow { animation: none !important; }
        }
        @media (max-width: 768px) {
          .lk-header       { padding: 14px 20px !important; }
          .lk-header-login { display: none !important; }
          .lk-hero-inner   { flex-direction: column !important; padding: 52px 24px 40px !important; gap: 36px !important; }
          .lk-hero-phone   { display: none !important; }
          .lk-hero-h1      { font-size: 36px !important; line-height: 1.15 !important; }
          .lk-hero-p       { font-size: 15px !important; }
          .lk-s2           { padding: 52px 24px !important; }
          .lk-s2-inner     { flex-direction: column !important; gap: 40px !important; }
          .lk-s2-h2        { font-size: 30px !important; }
          .lk-s3           { padding: 52px 24px !important; }
          .lk-s3-inner     { flex-direction: column !important; gap: 36px !important; }
          .lk-s3-h2        { font-size: 30px !important; }
          .lk-theme-cards  { display: none !important; }
          .lk-s4           { padding: 52px 24px !important; }
          .lk-three-grid   { grid-template-columns: 1fr !important; gap: 16px !important; }
          .lk-cta-sec      { padding: 52px 24px !important; }
          .lk-cta-h2       { font-size: 30px !important; }
          .lk-footer       { padding: 20px !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header className="lk-header" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 40px', position: 'sticky', top: 0, zIndex: 50,
        background: headerBg, backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${border}`,
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: ACCENT }}>Linky</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => setDark(d => !d)}
            aria-label="Cambiar tema"
            className="lk-ghost"
            style={{
              width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: dark ? 'rgba(255,255,255,0.1)' : '#ece9ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: dark ? '#fff' : ACCENT, fontSize: 18,
            }}
          >
            <i className={`ti ${dark ? 'ti-sun' : 'ti-moon'}`} aria-hidden="true" />
          </button>
          <Link href="/login" className="lk-ghost lk-header-login" style={{
            padding: '8px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            color: dark ? 'rgba(255,255,255,0.8)' : '#374151',
            border: `1px solid ${border}`, background: cardBg, textDecoration: 'none',
          }}>
            Iniciar sesión
          </Link>
          <Link href="/register" className="lk-cta" style={{
            padding: '8px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            color: '#fff', background: ACCENT, textDecoration: 'none',
            boxShadow: '0 2px 14px rgba(108,99,255,0.4)',
          }}>
            Crear cuenta gratis
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* blobs animados de fondo */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-8%', width: 460, height: 460, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT}40, transparent 70%)`, filter: 'blur(60px)', animation: 'lk-blob 18s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-15%', right: '-6%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)', filter: 'blur(60px)', animation: 'lk-blob 22s ease-in-out infinite reverse' }} />
        </div>

        <div className="lk-hero-inner" style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '90px 80px', maxWidth: 1200, margin: '0 auto', gap: 60,
        }}>
          <Reveal variant="left" style={{ flex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
              background: pillBg, color: ACCENT, marginBottom: 28,
            }}>
              <i className="ti ti-sparkles" aria-hidden="true" /> Tu link en bio, reinventado
            </div>

            <h1 className="lk-hero-h1" style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.1, marginBottom: 22, color: text }}>
              Tu presencia digital,<br />
              <span style={{
                background: 'linear-gradient(90deg, #6c63ff, #a855f7, #6c63ff)',
                backgroundSize: '200% auto', WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                animation: 'lk-gradient 5s linear infinite',
              }}>en un solo link.</span>
            </h1>

            <p className="lk-hero-p" style={{ fontSize: 18, color: muted, marginBottom: 36, lineHeight: 1.7, maxWidth: 480 }}>
              Crea tu página personalizada con todos tus links, temas animados y colores únicos. Compártela desde Instagram, TikTok o donde quieras.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/register" className="lk-cta" style={{
                padding: '16px 32px', borderRadius: 14, fontSize: 16, fontWeight: 700,
                color: '#fff', background: ACCENT, textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
              }}>
                Empezar gratis <span className="lk-arrow">→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={200} className="lk-hero-phone" style={{ flexShrink: 0 }}>
            <Parallax speed={0.12}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: -40, borderRadius: '50%',
                  background: `radial-gradient(circle, ${ACCENT}50 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                }} />
                <PhoneMockup darkMode={dark} />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* ── SECCIÓN 2 — Crea en minutos ── */}
      <section className="lk-s2" style={{ background: dark ? '#1a1a2e' : ACCENT, padding: '80px', overflow: 'hidden' }}>
        <div className="lk-s2-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 80 }}>
          <Reveal variant="left" style={{ flex: 1 }}>
            <Tilt max={8}>
              <div style={{
                borderRadius: 24, padding: 28,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  {['Perfil', 'Links', 'Colores', 'Movimiento'].map((t, i) => (
                    <div key={t} style={{
                      padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: i === 1 ? '#fff' : 'rgba(255,255,255,0.15)',
                      color: i === 1 ? ACCENT : 'rgba(255,255,255,0.7)',
                    }}>{t}</div>
                  ))}
                </div>
                {['Instagram', 'YouTube', 'TikTok', 'Mi portfolio'].map((n, i) => (
                  <div key={n} style={{
                    padding: '12px 16px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    animation: `lk-pop 0.5s ease ${i * 0.1}s both`,
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{n}</span>
                    <div style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.15)' }} />
                  </div>
                ))}
              </div>
            </Tilt>
          </Reveal>

          <Reveal variant="right" delay={120} style={{ flex: 1 }}>
            <h2 className="lk-s2-h2" style={{ fontSize: 46, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 18 }}>
              Crea y personaliza<br />en minutos
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 30 }}>
              Editor visual intuitivo con preview en tiempo real. Elige temas animados, paletas de colores y ajusta cada detalle de tu página.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {[
                { icon: 'ti-palette',  text: '7 temas únicos: Galaxia, Meteoros, Tornasol y más' },
                { icon: 'ti-activity', text: '6 fondos animados: Aurora, Destellos, Rayos...' },
                { icon: 'ti-link',     text: '46+ redes sociales soportadas' },
              ].map(f => (
                <div key={f.text} className="lk-feat" style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'rgba(255,255,255,0.85)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`ti ${f.icon}`} style={{ fontSize: 18 }} aria-hidden="true" />
                  </div>
                  <span style={{ fontSize: 15 }}>{f.text}</span>
                </div>
              ))}
            </div>
            <Link href="/register" className="lk-cta" style={{
              display: 'inline-block', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: '#fff', color: ACCENT, textDecoration: 'none',
            }}>
              Empezar gratis <span className="lk-arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── SECCIÓN 3 — Temas ── */}
      <section className="lk-s3" style={{ background: dark ? '#0d0d18' : '#1a1a2e', padding: '80px', overflow: 'hidden', position: 'relative' }}>
        <div aria-hidden style={{ position: 'absolute', top: '20%', left: '30%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.3), transparent 70%)', filter: 'blur(70px)', animation: 'lk-blob 20s ease-in-out infinite' }} />
        <div className="lk-s3-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60, position: 'relative', zIndex: 1 }}>
          <Reveal variant="left" style={{ flex: 1 }}>
            <h2 className="lk-s3-h2" style={{ fontSize: 46, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 18 }}>
              Tu estilo,<br />
              <span style={{ color: ACCENT }}>tus reglas.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>
              Elige entre 7 temas visuales únicos — desde minimalista hasta galaxia animada. Cada uno completamente personalizable.
            </p>
            <Link href="/register" className="lk-cta" style={{
              display: 'inline-block', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: ACCENT, color: '#fff', textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
            }}>
              Elegir mi tema <span className="lk-arrow">→</span>
            </Link>
          </Reveal>

          <Parallax speed={0.08} className="lk-theme-cards" style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {THEMES_SHOWCASE.map((t, i) => (
                <Reveal key={i} variant="scale" delay={i * 80}><ThemeCard theme={t} index={i} /></Reveal>
              ))}
            </div>
          </Parallax>
        </div>
      </section>

      {/* ── SECCIÓN 4 — Cómo funciona ── */}
      <section className="lk-s4" style={{ padding: '80px', background: bg }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <Reveal variant="up">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
              background: pillBg, color: ACCENT, marginBottom: 20,
            }}>
              <i className="ti ti-rocket" aria-hidden="true" /> Simple y rápido
            </div>
            <h2 style={{ fontSize: 46, fontWeight: 800, color: text, lineHeight: 1.15, marginBottom: 16 }}>
              Listo en 3 pasos
            </h2>
            <p style={{ fontSize: 17, color: muted, marginBottom: 56, maxWidth: 460, margin: '0 auto 56px' }}>
              Sin configuraciones complicadas. Tu página en menos de 2 minutos.
            </p>
          </Reveal>

          <div className="lk-three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { num: '01', icon: 'ti-user-plus',  title: 'Crea tu cuenta',       desc: 'Regístrate gratis con email o Google. Elige tu nombre de usuario único.' },
              { num: '02', icon: 'ti-palette',    title: 'Personaliza tu página', desc: 'Agrega tus links, elige temas animados, colores y ajusta cada detalle.' },
              { num: '03', icon: 'ti-share',      title: 'Compártela',            desc: 'Pon tu link de Linky en el bio de todas tus redes sociales y listo.' },
            ].map((step, i) => (
              <Reveal key={step.num} variant="up" delay={i * 130}>
                <Tilt max={6} style={{ height: '100%' }}>
                  <div style={{
                    padding: 32, borderRadius: 24, textAlign: 'left', height: '100%',
                    background: cardBg, border: `1px solid ${border}`,
                    boxShadow: dark ? 'none' : '0 4px 20px rgba(0,0,0,0.06)',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT, marginBottom: 16, letterSpacing: '0.05em' }}>{step.num}</div>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, background: pillBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                    }}>
                      <i className={`ti ${step.icon}`} style={{ color: ACCENT, fontSize: 22 }} aria-hidden="true" />
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 10 }}>{step.title}</h3>
                    <p style={{ fontSize: 14, color: muted, lineHeight: 1.65 }}>{step.desc}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="lk-cta-sec" style={{
        padding: '80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        background: dark ? '#1a1a2e' : 'linear-gradient(135deg, #f4f3ff, #ede9ff)',
      }}>
        <div aria-hidden style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT}30, transparent 70%)`, filter: 'blur(70px)', animation: 'lk-blob 16s ease-in-out infinite' }} />
        <Reveal variant="scale" style={{ maxWidth: 580, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 className="lk-cta-h2" style={{ fontSize: 46, fontWeight: 800, color: text, lineHeight: 1.15, marginBottom: 18 }}>
            ¿Listo para tu<br />
            <span style={{ color: ACCENT }}>página Linky?</span>
          </h2>
          <p style={{ fontSize: 17, color: muted, marginBottom: 36, lineHeight: 1.7 }}>
            Crea tu página de links personalizada hoy. Es gratis.
          </p>
          <Link href="/register" className="lk-cta" style={{
            display: 'inline-block', padding: '18px 40px', borderRadius: 16, fontSize: 17, fontWeight: 700,
            color: '#fff', background: ACCENT, textDecoration: 'none',
            boxShadow: '0 12px 40px rgba(108,99,255,0.4)',
          }}>
            Crear mi Linky gratis <span className="lk-arrow">→</span>
          </Link>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lk-footer" style={{
        padding: '24px 40px', textAlign: 'center', fontSize: 13, color: muted,
        borderTop: `1px solid ${border}`,
        background: dark ? '#0f0f13' : '#f4f3ff',
      }}>
        Linky · Hecho con ♥
      </footer>
    </div>
  )
}
