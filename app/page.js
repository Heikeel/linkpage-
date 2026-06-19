'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const C1 = '#6c63ff'
const C2 = '#a855f7'
const BG = '#06060f'

/* ─────────────────────── Particle Canvas ─────────────────────── */
function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    const cvs = ref.current, ctx = cvs.getContext('2d')
    let raf, pts = []
    const resize = () => {
      cvs.width = innerWidth; cvs.height = innerHeight
      pts = Array.from({ length: 90 }, () => ({
        x: Math.random() * cvs.width,
        y: Math.random() * cvs.height,
        r: Math.random() * 1.6 + 0.3,
        vx: (Math.random() - .5) * .22,
        vy: (Math.random() - .5) * .22,
        a: Math.random() * .45 + .06,
        c: Math.random() > .6 ? C2 : C1,
      }))
    }
    const tick = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      pts.forEach(p => {
        ctx.globalAlpha = p.a; ctx.fillStyle = p.c
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = cvs.width; if (p.x > cvs.width) p.x = 0
        if (p.y < 0) p.y = cvs.height; if (p.y > cvs.height) p.y = 0
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    resize(); tick()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: .75 }} />
}

/* ─────────────────────── Phone Mockup ─────────────────────── */
const LINKS = [
  { icon: 'ti-brand-instagram', name: 'Instagram', color: '#e1306c' },
  { icon: 'ti-brand-youtube',   name: 'YouTube',   color: '#ff4444' },
  { icon: 'ti-brand-tiktok',    name: 'TikTok',    color: '#fff' },
  { icon: 'ti-brand-spotify',   name: 'Spotify',   color: '#1db954' },
  { icon: 'ti-link',            name: 'Mi portfolio', color: C1 },
]

const PHONE_THEMES = [
  '#0f0f1a',
  'linear-gradient(160deg,#0f0c29,#302b63)',
  'linear-gradient(160deg,#11998e,#38ef7d20)',
  'linear-gradient(160deg,#1a0533,#6c63ff22)',
]

function PhoneMockup({ visibleLinks = 5, themeIdx = 0 }) {
  return (
    <div style={{
      width: 230, height: 462, borderRadius: 40, flexShrink: 0,
      background: `linear-gradient(145deg,${C1},${C2})`,
      boxShadow: `0 50px 130px rgba(108,99,255,.5), 0 0 0 1px rgba(108,99,255,.2)`,
      padding: 3,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 38,
        background: PHONE_THEMES[themeIdx],
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        alignItems: 'center', paddingTop: 44, paddingBottom: 20, paddingLeft: 18, paddingRight: 18,
        transition: 'background 1s ease',
      }}>
        <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', width: 54, height: 5, borderRadius: 3, background: 'rgba(0,0,0,.35)' }} />
        <div style={{ width: 66, height: 66, borderRadius: '50%', background: `linear-gradient(135deg,${C1},${C2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 10, boxShadow: `0 8px 24px rgba(108,99,255,.4)` }}>M</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 2 }}>Mike</div>
        <div style={{ fontSize: 11, color: C1, fontWeight: 600, marginBottom: 5 }}>@mike</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 18, textAlign: 'center', lineHeight: 1.4 }}>Creador de contenido · México</div>
        {LINKS.map((l, i) => (
          <div key={l.name} style={{
            width: '100%', padding: '9px 13px', borderRadius: 11,
            background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7,
            opacity: i < visibleLinks ? 1 : 0,
            transform: i < visibleLinks ? 'none' : 'translateY(10px)',
            transition: `opacity .45s ease ${i * 90}ms, transform .45s ease ${i * 90}ms`,
          }}>
            <i className={`ti ${l.icon}`} style={{ color: l.color, fontSize: 15 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{l.name}</span>
            <i className="ti ti-chevron-right" style={{ color: 'rgba(255,255,255,.25)', fontSize: 10, marginLeft: 'auto' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────── Scene wrapper (sticky) ─────────────────────── */
function Scene({ h = '220vh', children, style }) {
  return (
    <div style={{ height: h, position: 'relative', ...style }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

/* ─────────────────────── Gradient blobs ─────────────────────── */
function Blob({ top, left, right, bottom, size = 500, color = C1, delay = 0 }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', top, left, right, bottom,
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle, ${color}30, transparent 70%)`,
      filter: 'blur(80px)',
      animation: `blob ${18 + delay}s ease-in-out ${delay}s infinite`,
      pointerEvents: 'none',
    }} />
  )
}

/* ─────────────────────── THEME CARDS (section 3) ─────────────────────── */
const THEME_CARDS = [
  { bg: 'linear-gradient(160deg,#0f0c29,#302b63,#24243e)', label: 'Cosmos' },
  { bg: 'linear-gradient(160deg,#ff6ec4,#7873f5)', label: 'Tornasol' },
  { bg: 'linear-gradient(160deg,#0d1117,#00ff4120)', label: 'Matrix' },
  { bg: 'linear-gradient(160deg,#1a1a2e,#e94560)', label: 'Sunset' },
  { bg: 'linear-gradient(160deg,#020024,#090979,#00d4ff)', label: 'Océano' },
  { bg: 'linear-gradient(160deg,#f7971e,#ffd200)', label: 'Solar' },
]

/* ─────────────────────── PAGE ─────────────────────── */
export default function Home() {
  const [visibleLinks, setVisibleLinks] = useState(0)
  const [themeIdx, setThemeIdx] = useState(0)
  const [headerSolid, setHeaderSolid] = useState(false)

  // Scene refs (wrapper divs — not sticky inner)
  const heroWrap   = useRef(null)
  const linksWrap  = useRef(null)
  const themesWrap = useRef(null)
  const stepsWrap  = useRef(null)

  // Animated element refs
  const heroTag    = useRef(null)
  const heroH1     = useRef(null)
  const heroSub    = useRef(null)
  const heroBtn    = useRef(null)
  const heroPhone  = useRef(null)
  const linksLeft  = useRef(null)
  const linksPhone = useRef(null)
  const themesLeft = useRef(null)
  const themeCards = useRef(null)
  const step1 = useRef(null)
  const step2 = useRef(null)
  const step3 = useRef(null)

  useEffect(() => {
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
    const prog = (wrap) => {
      if (!wrap.current) return 0
      const el = wrap.current
      return clamp((scrollY - el.offsetTop) / (el.offsetHeight - innerHeight), 0, 1)
    }

    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const sy = scrollY

        setHeaderSolid(sy > 40)

        /* ── Scene 1: Hero — visible desde el inicio, sale al scrollear ── */
        const p1 = prog(heroWrap)
        const fadeOut = clamp((p1 - .6) / .3, 0, 1)
        const slideUp = fadeOut * 50

        const heroEls = [heroTag, heroH1, heroSub, heroBtn]
        heroEls.forEach((r, i) => {
          if (!r.current) return
          r.current.style.opacity = 1 - fadeOut
          r.current.style.transform = `translateY(${-slideUp * (1 + i * .15)}px)`
        })
        if (heroPhone.current) {
          heroPhone.current.style.opacity = 1 - fadeOut * .8
          heroPhone.current.style.transform = `translateY(${-slideUp * .5}px)`
        }

        /* ── Scene 2: Links animate ── */
        const p2 = prog(linksWrap)
        const newCount = Math.round(p2 * 5)
        setVisibleLinks(newCount)

        if (linksLeft.current) {
          const op = clamp(p2 / .15, 0, 1)
          linksLeft.current.style.opacity = op
          linksLeft.current.style.transform = `translateX(${(1 - op) * -40}px)`
        }
        if (linksPhone.current) {
          const op = clamp(p2 / .12, 0, 1)
          linksPhone.current.style.opacity = op
          linksPhone.current.style.transform = `translateX(${(1 - op) * 40}px)`
        }

        /* ── Scene 3: Themes ── */
        const p3 = prog(themesWrap)
        const ti = Math.floor(p3 * PHONE_THEMES.length)
        setThemeIdx(Math.min(ti, PHONE_THEMES.length - 1))

        if (themesLeft.current) {
          const op = clamp(p3 / .15, 0, 1)
          themesLeft.current.style.opacity = op
          themesLeft.current.style.transform = `translateY(${(1 - op) * 30}px)`
        }
        if (themeCards.current) {
          const op = clamp(p3 / .18, 0, 1)
          themeCards.current.style.opacity = op
          themeCards.current.style.transform = `translateX(${(1 - op) * 60}px)`
        }

        /* ── Scene 4: Steps ── */
        const p4 = prog(stepsWrap)
        const applyStep = (r, threshold) => {
          if (!r.current) return
          const op = clamp((p4 - threshold) / .2, 0, 1)
          r.current.style.opacity = op
          r.current.style.transform = `translateY(${(1 - op) * 44}px)`
        }
        applyStep(step1, .02)
        applyStep(step2, .2)
        applyStep(step3, .38)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: BG, color: '#fff', overflowX: 'hidden' }}>

      <style>{`
        @keyframes blob { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.08)} 66%{transform:translate(-28px,24px) scale(.94)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
        @keyframes cardFloat { 0%,100%{transform:rotate(var(--t)) translateY(0)} 50%{transform:rotate(var(--t)) translateY(-10px)} }
        .lk-cta { transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s; }
        .lk-cta:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 18px 50px rgba(108,99,255,.55) !important; }
        .lk-ghost { transition: background .2s, transform .2s; }
        .lk-ghost:hover { background: rgba(108,99,255,.15) !important; transform: translateY(-1px); }
        .lk-float { animation: float 6s ease-in-out infinite; }
        .lk-bob { display:inline-block; animation: bob 1.6s ease-in-out infinite; }
        .lk-step { transition: box-shadow .3s; }
        .lk-step:hover { box-shadow: 0 0 0 1px rgba(108,99,255,.4), 0 20px 60px rgba(108,99,255,.15) !important; }
        @media(max-width:768px){
          .lk-hero-cols { flex-direction:column !important; padding:80px 24px 40px !important; gap:40px !important; }
          .lk-hero-h1   { font-size:38px !important; }
          .lk-hero-phone{ display:none !important; }
          .lk-2cols     { flex-direction:column !important; padding:60px 24px !important; gap:40px !important; }
          .lk-steps-grid{ grid-template-columns:1fr !important; }
          .lk-theme-grid{ display:none !important; }
          .lk-cta-sec   { padding:60px 24px !important; }
        }
      `}</style>

      {/* Fixed particles */}
      <Particles />

      {/* ── HEADER ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px',
        background: headerSolid ? 'rgba(6,6,15,.88)' : 'transparent',
        backdropFilter: headerSolid ? 'blur(20px)' : 'none',
        borderBottom: headerSolid ? '1px solid rgba(255,255,255,.06)' : 'none',
        transition: 'background .4s, border-color .4s, backdrop-filter .4s',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, background: `linear-gradient(90deg,${C1},${C2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Linky</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" className="lk-ghost" style={{
            padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            color: 'rgba(255,255,255,.75)', border: '1px solid rgba(255,255,255,.1)',
            background: 'rgba(255,255,255,.04)', textDecoration: 'none',
          }}>Iniciar sesión</Link>
          <Link href="/register" className="lk-cta" style={{
            padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            color: '#fff', background: C1, textDecoration: 'none',
            boxShadow: `0 2px 16px rgba(108,99,255,.4)`,
          }}>Crear cuenta gratis</Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          SCENE 1 — HERO
      ══════════════════════════════════════════════════════ */}
      <div ref={heroWrap} style={{ height: '180vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* blobs */}
          <Blob top="-10%" left="-8%" color={C1} size={520} delay={0} />
          <Blob bottom="-15%" right="-6%" color={C2} size={480} delay={6} />

          <div className="lk-hero-cols" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px', maxWidth: 1200, width: '100%', gap: 60 }}>
            {/* Left */}
            <div style={{ flex: 1 }}>
              <div ref={heroTag} style={{ opacity: 1, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(108,99,255,.18)', color: C1, marginBottom: 28, border: '1px solid rgba(108,99,255,.25)' }}>
                <i className="ti ti-sparkles" /> Tu link en bio, reinventado
              </div>

              <h1 ref={heroH1} className="lk-hero-h1" style={{ opacity: 1, fontSize: 62, fontWeight: 900, lineHeight: 1.08, marginBottom: 22, letterSpacing: '-1.5px' }}>
                Tu presencia<br />digital,{' '}
                <span style={{ background: `linear-gradient(90deg,${C1},${C2},${C1})`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmer 4s linear infinite' }}>en un solo link.</span>
              </h1>

              <p ref={heroSub} style={{ opacity: 1, fontSize: 18, color: 'rgba(255,255,255,.55)', marginBottom: 36, lineHeight: 1.7, maxWidth: 460 }}>
                Crea tu página personalizada con todos tus links, temas animados y colores únicos. Compártela desde cualquier red social.
              </p>

              <div ref={heroBtn} style={{ opacity: 1, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link href="/register" className="lk-cta" style={{
                  padding: '16px 34px', borderRadius: 14, fontSize: 16, fontWeight: 700,
                  color: '#fff', background: C1, textDecoration: 'none',
                  boxShadow: `0 10px 36px rgba(108,99,255,.45)`,
                }}>
                  Empezar gratis <span className="lk-bob">→</span>
                </Link>
                <Link href="/login" className="lk-ghost" style={{
                  padding: '16px 28px', borderRadius: 14, fontSize: 16, fontWeight: 500,
                  color: 'rgba(255,255,255,.6)', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,.12)', background: 'transparent',
                }}>Ver demo</Link>
              </div>
            </div>

            {/* Right: Phone */}
            <div ref={heroPhone} className="lk-hero-phone lk-float" style={{ opacity: 1, flexShrink: 0, position: 'relative' }}>
              {/* glow halo */}
              <div style={{ position: 'absolute', inset: -50, borderRadius: '50%', background: `radial-gradient(circle,${C1}50,transparent 70%)`, filter: 'blur(40px)' }} />
              <div style={{ position: 'relative' }}>
                <PhoneMockup visibleLinks={5} themeIdx={0} />
              </div>
            </div>
          </div>

          {/* scroll cue */}
          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.2)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase' }}>
            Scroll
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,.25), transparent)', animation: 'bob 2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SCENE 2 — LINKS ANIMATE
      ══════════════════════════════════════════════════════ */}
      <div ref={linksWrap} style={{ height: '200vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, transparent, rgba(108,99,255,.04) 50%, transparent)' }}>
          <Blob top="10%" right="-5%" color={C2} size={440} delay={4} />

          <div className="lk-2cols" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px', maxWidth: 1200, width: '100%', gap: 80 }}>
            {/* Left text */}
            <div ref={linksLeft} style={{ opacity: 0, flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(168,85,247,.18)', color: C2, marginBottom: 24, border: '1px solid rgba(168,85,247,.25)' }}>
                <i className="ti ti-link" /> Todos tus links
              </div>
              <h2 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: '-1px' }}>
                Un solo lugar<br />
                <span style={{ color: C2 }}>para todo.</span>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,.5)', lineHeight: 1.75, marginBottom: 32, maxWidth: 400 }}>
                Instagram, YouTube, TikTok, tu portfolio, tu tienda — todos en una sola página elegante que puedes compartir en segundos.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: 'ti-brand-instagram', text: '46+ redes sociales soportadas' },
                  { icon: 'ti-palette',          text: 'Ícono y color personalizados por link' },
                  { icon: 'ti-device-mobile',    text: 'Preview en tiempo real en el editor' },
                ].map(f => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'rgba(255,255,255,.7)' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(108,99,255,.15)', border: '1px solid rgba(108,99,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`ti ${f.icon}`} style={{ color: C1, fontSize: 18 }} />
                    </div>
                    <span style={{ fontSize: 15 }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Phone with animated links */}
            <div ref={linksPhone} style={{ opacity: 0, flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: -40, borderRadius: '50%', background: `radial-gradient(circle,${C2}35,transparent 70%)`, filter: 'blur(50px)' }} />
                <div style={{ position: 'relative' }}>
                  <PhoneMockup visibleLinks={visibleLinks} themeIdx={0} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SCENE 3 — THEMES
      ══════════════════════════════════════════════════════ */}
      <div ref={themesWrap} style={{ height: '200vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.35)' }}>
          <Blob top="20%" left="25%" color={C1} size={400} delay={8} />
          <Blob bottom="10%" right="15%" color={C2} size={380} delay={2} />

          <div className="lk-2cols" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px', maxWidth: 1200, width: '100%', gap: 80 }}>
            {/* Left text */}
            <div ref={themesLeft} style={{ opacity: 0, flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(108,99,255,.18)', color: C1, marginBottom: 24, border: '1px solid rgba(108,99,255,.2)' }}>
                <i className="ti ti-palette" /> Temas únicos
              </div>
              <h2 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: '-1px' }}>
                Tu estilo,<br />
                <span style={{ background: `linear-gradient(90deg,${C1},${C2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>tus reglas.</span>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,.5)', lineHeight: 1.75, marginBottom: 32, maxWidth: 400 }}>
                7 temas visuales únicos — desde minimalista hasta galaxia animada. Cada uno completamente personalizable con tus colores.
              </p>
              {/* Theme pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {THEME_CARDS.map((t, i) => (
                  <div key={t.label} style={{
                    padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                    background: i === themeIdx % THEME_CARDS.length ? t.bg : 'rgba(255,255,255,.06)',
                    color: '#fff', border: '1px solid rgba(255,255,255,.1)',
                    transition: 'background .5s',
                  }}>{t.label}</div>
                ))}
              </div>
            </div>

            {/* Right: floating theme cards + phone */}
            <div ref={themeCards} className="lk-theme-grid" style={{ opacity: 0, flexShrink: 0, position: 'relative', width: 340 }}>
              {THEME_CARDS.map((t, i) => {
                const angles = [-12, 8, -6, 14, -10, 5]
                const pos = [
                  { top: 0,   left: 0   },
                  { top: 30,  left: 120 },
                  { top: 120, left: 60  },
                  { top: 60,  left: 210 },
                  { top: 180, left: 10  },
                  { top: 160, left: 180 },
                ]
                return (
                  <div key={t.label} style={{
                    position: 'absolute', ...pos[i],
                    width: 90, height: 130, borderRadius: 18,
                    background: t.bg, boxShadow: '0 14px 40px rgba(0,0,0,.4)',
                    border: '1px solid rgba(255,255,255,.14)',
                    '--t': `${angles[i]}deg`,
                    transform: `rotate(${angles[i]}deg)`,
                    animation: `cardFloat ${6 + i * .8}s ease-in-out ${i * .5}s infinite`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 10,
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.8)', marginBottom: 8 }} />
                    <div style={{ width: 48, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.7)', marginBottom: 4 }} />
                    <div style={{ width: 32, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.4)', marginBottom: 12 }} />
                    {[1,2,3].map(j => <div key={j} style={{ width: '100%', height: 18, borderRadius: 6, background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.2)', marginBottom: 5 }} />)}
                  </div>
                )
              })}
              <div style={{ height: 320 }} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SCENE 4 — STEPS
      ══════════════════════════════════════════════════════ */}
      <div ref={stepsWrap} style={{ height: '180vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Blob top="-5%" right="10%" color={C1} size={420} delay={10} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, width: '100%', padding: '0 80px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(108,99,255,.18)', color: C1, marginBottom: 24, border: '1px solid rgba(108,99,255,.2)' }}>
              <i className="ti ti-rocket" /> Simple y rápido
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 16, letterSpacing: '-1px' }}>Listo en 3 pasos.</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.45)', marginBottom: 56 }}>Sin configuraciones complicadas. Tu página en menos de 2 minutos.</p>

            <div className="lk-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {[
                { ref: step1, num: '01', icon: 'ti-user-plus', title: 'Crea tu cuenta', desc: 'Regístrate gratis con email o Google. Elige tu nombre de usuario único en segundos.' },
                { ref: step2, num: '02', icon: 'ti-palette',   title: 'Personaliza',    desc: 'Agrega tus links, elige temas animados, colores y ajusta cada detalle visualmente.' },
                { ref: step3, num: '03', icon: 'ti-share',     title: 'Compártela',     desc: 'Pon tu link Linky en el bio de todas tus redes sociales y lleva tráfico a todo.' },
              ].map(s => (
                <div key={s.num} ref={s.ref} className="lk-step" style={{
                  opacity: 0,
                  padding: 32, borderRadius: 24, textAlign: 'left',
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.07)',
                  boxShadow: '0 4px 30px rgba(0,0,0,.3)',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C1, marginBottom: 18, letterSpacing: '.08em' }}>{s.num}</div>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(108,99,255,.15)', border: '1px solid rgba(108,99,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <i className={`ti ${s.icon}`} style={{ color: C1, fontSize: 22 }} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SCENE 5 — CTA FINAL
      ══════════════════════════════════════════════════════ */}
      <section className="lk-cta-sec" style={{ position: 'relative', padding: '120px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <Blob top="-30%" left="50%" style={{ transform: 'translateX(-50%)' }} color={C1} size={600} delay={0} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(108,99,255,.18)', color: C1, marginBottom: 28, border: '1px solid rgba(108,99,255,.2)' }}>
            <i className="ti ti-sparkles" /> Es gratis
          </div>
          <h2 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.08, marginBottom: 20, letterSpacing: '-1.5px' }}>
            ¿Listo para tu<br />
            <span style={{ background: `linear-gradient(90deg,${C1},${C2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>página Linky?</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,.45)', marginBottom: 40, lineHeight: 1.7 }}>
            Crea tu página de links personalizada hoy mismo. Sin tarjeta de crédito.
          </p>
          <Link href="/register" className="lk-cta" style={{
            display: 'inline-block', padding: '20px 48px', borderRadius: 16, fontSize: 18, fontWeight: 700,
            color: '#fff', background: `linear-gradient(135deg,${C1},${C2})`, textDecoration: 'none',
            boxShadow: `0 14px 48px rgba(108,99,255,.5)`,
          }}>
            Crear mi Linky gratis <span className="lk-bob">→</span>
          </Link>
          <div style={{ marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,.25)' }}>
            Sin tarjeta · Sin compromisos · Siempre gratis
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '28px 48px', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.18)', borderTop: '1px solid rgba(255,255,255,.05)', background: 'rgba(0,0,0,.3)', position: 'relative', zIndex: 1 }}>
        Linky · Hecho con ♥
      </footer>

    </div>
  )
}
