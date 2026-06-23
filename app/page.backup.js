'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const C1 = '#6c63ff'
const C2 = '#a855f7'
const BG = '#06060f'

/* ─── Particles ─── */
function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    const cvs = ref.current, ctx = cvs.getContext('2d')
    let raf, pts = []
    const resize = () => {
      cvs.width = innerWidth; cvs.height = innerHeight
      pts = Array.from({ length: 80 }, () => ({
        x: Math.random() * cvs.width, y: Math.random() * cvs.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2,
        a: Math.random() * .4 + .05,
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
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: .7 }} />
}

/* ─── Reveal on scroll (IntersectionObserver) ─── */
function Reveal({ children, delay = 0, from = 'up', style, className }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const hidden = { up: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.92)' }[from]
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : hidden,
      transition: `opacity .7s ease ${delay}ms, transform .8s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      willChange: 'opacity, transform',
    }}>{children}</div>
  )
}

/* ─── Phone mockup ─── */
const PROFILES = [
  {
    name: 'Carlos', handle: '@carlos.dev', bio: 'Dev & Gamer · México', avatar: 'C',
    avatarGrad: 'linear-gradient(135deg,#6c63ff,#2196f3)',
    links: [
      { icon: 'ti-brand-youtube',  name: 'YouTube',   color: '#ff4444' },
      { icon: 'ti-brand-twitch',   name: 'Twitch',    color: '#9146ff' },
      { icon: 'ti-brand-github',   name: 'GitHub',    color: '#fff' },
      { icon: 'ti-brand-linkedin', name: 'LinkedIn',  color: '#0a66c2' },
      { icon: 'ti-link',           name: 'Portfolio', color: C1 },
    ],
  },
  {
    name: 'Sara', handle: '@sara.creates', bio: 'Artista · España', avatar: 'S',
    avatarGrad: 'linear-gradient(135deg,#e1306c,#a855f7)',
    links: [
      { icon: 'ti-brand-instagram', name: 'Instagram',  color: '#e1306c' },
      { icon: 'ti-brand-tiktok',    name: 'TikTok',     color: '#fff' },
      { icon: 'ti-brand-spotify',   name: 'Spotify',    color: '#1db954' },
      { icon: 'ti-brand-pinterest', name: 'Pinterest',  color: '#e60023' },
      { icon: 'ti-shopping-cart',   name: 'Mi tienda',  color: C2 },
    ],
  },
  {
    name: 'Alex', handle: '@alex.fitness', bio: 'Coach · Argentina', avatar: 'A',
    avatarGrad: 'linear-gradient(135deg,#f7971e,#f44336)',
    links: [
      { icon: 'ti-brand-youtube',   name: 'YouTube',     color: '#ff4444' },
      { icon: 'ti-brand-instagram', name: 'Instagram',   color: '#e1306c' },
      { icon: 'ti-link',            name: 'Mi programa', color: '#f7971e' },
      { icon: 'ti-brand-whatsapp',  name: 'WhatsApp',    color: '#25d366' },
      { icon: 'ti-brand-tiktok',    name: 'TikTok',      color: '#fff' },
    ],
  },
  {
    name: 'Mia', handle: '@mia.music', bio: 'Cantante · Colombia', avatar: 'M',
    avatarGrad: 'linear-gradient(135deg,#11998e,#38ef7d)',
    links: [
      { icon: 'ti-brand-spotify',   name: 'Spotify',     color: '#1db954' },
      { icon: 'ti-brand-youtube',   name: 'YouTube',     color: '#ff4444' },
      { icon: 'ti-brand-apple',     name: 'Apple Music', color: '#fc3c44' },
      { icon: 'ti-brand-soundcloud',name: 'SoundCloud',  color: '#ff5500' },
      { icon: 'ti-brand-tiktok',    name: 'TikTok',      color: '#fff' },
    ],
  },
  {
    name: 'Luca', handle: '@luca.photo', bio: 'Fotógrafo · Italia', avatar: 'L',
    avatarGrad: 'linear-gradient(135deg,#c471ed,#f64f59)',
    links: [
      { icon: 'ti-brand-instagram', name: 'Instagram',  color: '#e1306c' },
      { icon: 'ti-link',            name: 'Portfolio',  color: '#c471ed' },
      { icon: 'ti-brand-behance',   name: 'Behance',    color: '#1769ff' },
      { icon: 'ti-brand-vsco',      name: 'VSCO',       color: '#fff' },
      { icon: 'ti-shopping-cart',   name: 'Prints',     color: C2 },
    ],
  },
  {
    name: 'Yuki', handle: '@yuki.design', bio: 'UI Designer · Japón', avatar: 'Y',
    avatarGrad: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    links: [
      { icon: 'ti-brand-dribbble',  name: 'Dribbble',   color: '#ea4c89' },
      { icon: 'ti-brand-behance',   name: 'Behance',    color: '#1769ff' },
      { icon: 'ti-brand-figma',     name: 'Figma',      color: '#a259ff' },
      { icon: 'ti-brand-linkedin',  name: 'LinkedIn',   color: '#0a66c2' },
      { icon: 'ti-link',            name: 'Portfolio',  color: '#4facfe' },
    ],
  },
]
const PHONE_BGS = ['#0f0f1a', 'linear-gradient(160deg,#0f0c29,#302b63)', 'linear-gradient(160deg,#11998e,#38ef7d20)', 'linear-gradient(160deg,#1a0533,#6c63ff22)']

function Phone({ visibleLinks = 5, bgIdx = 0, scale = 1, profileIdx = 0 }) {
  const [displayed, setDisplayed] = useState(profileIdx)
  const [fading, setFading] = useState(false)
  useEffect(() => {
    if (profileIdx === displayed) return
    setFading(true)
    const t = setTimeout(() => { setDisplayed(profileIdx); setFading(false) }, 350)
    return () => clearTimeout(t)
  }, [profileIdx])
  const prof = PROFILES[displayed] || PROFILES[0]
  const { name, handle, bio, avatar, avatarGrad, links } = prof
  return (
    <div style={{
      width: 210, height: 430, borderRadius: 38, flexShrink: 0,
      background: `linear-gradient(145deg,${C1},${C2})`,
      boxShadow: `0 40px 100px rgba(108,99,255,.45), 0 0 0 1px rgba(108,99,255,.2)`,
      padding: 3, transform: `scale(${scale})`, transition: 'transform .3s ease',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 36,
        background: PHONE_BGS[bgIdx], overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 40, paddingBottom: 18, paddingLeft: 16, paddingRight: 16,
        transition: 'background .8s ease',
        opacity: fading ? 0 : 1, transitionProperty: 'background, opacity',
      }}>
        <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 50, height: 5, borderRadius: 3, background: 'rgba(0,0,0,.3)' }} />
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: avatarGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 8, boxShadow: `0 6px 20px rgba(108,99,255,.4)` }}>{avatar}</div>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 11, color: C1, fontWeight: 600, marginBottom: 4 }}>{handle}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 16, textAlign: 'center', lineHeight: 1.4 }}>{bio}</div>
        {links.map((l, i) => (
          <div key={l.name} style={{
            width: '100%', padding: '8px 12px', borderRadius: 10,
            background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)',
            display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6,
            opacity: i < visibleLinks ? 1 : 0,
            transform: i < visibleLinks ? 'none' : 'translateY(8px)',
            transition: `opacity .25s ease ${i * 40}ms, transform .25s ease ${i * 40}ms`,
          }}>
            <i className={`ti ${l.icon}`} style={{ color: l.color, fontSize: 14 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{l.name}</span>
            <i className="ti ti-chevron-right" style={{ color: 'rgba(255,255,255,.25)', fontSize: 9, marginLeft: 'auto' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Blob ─── */
function Blob({ style, color = C1, size = 480, delay = 0 }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle,${color}28,transparent 70%)`,
      filter: 'blur(80px)', pointerEvents: 'none',
      animation: `blob ${18 + delay}s ease-in-out ${delay}s infinite`,
      ...style,
    }} />
  )
}

/* ─── Theme cards ─── */
const THEMES = [
  { bg: 'linear-gradient(160deg,#0f0c29,#302b63,#24243e)', label: 'Cosmos' },
  { bg: 'linear-gradient(160deg,#ff6ec4,#7873f5)',         label: 'Tornasol' },
  { bg: 'linear-gradient(160deg,#0d1117,#00ff4120)',       label: 'Matrix' },
  { bg: 'linear-gradient(160deg,#1a1a2e,#e94560)',         label: 'Sunset' },
  { bg: 'linear-gradient(160deg,#020024,#090979,#00d4ff)', label: 'Océano' },
  { bg: 'linear-gradient(160deg,#f7971e,#ffd200)',         label: 'Solar' },
]

/* ═══════════════════════════════════════════ PAGE ═══════════════════════════════════════════ */
export default function Home() {
  const [visibleLinks, setVisibleLinks]   = useState(0)
  const [phoneBgIdx,   setPhoneBgIdx]     = useState(0)
  const [profileBase,  setProfileBase]    = useState(0)
  const [headerSolid,  setHeaderSolid]    = useState(false)
  const linksSectionRef  = useRef(null)
  const themesSectionRef = useRef(null)

  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        setHeaderSolid(scrollY > 60)

        // Links section: reveal links progressively
        if (linksSectionRef.current) {
          const r = linksSectionRef.current.getBoundingClientRect()
          const p = Math.max(0, Math.min(1, (innerHeight * 0.8 - r.top) / (innerHeight * 0.45)))
          setVisibleLinks(Math.round(p * 5))
        }

        // Themes section: change phone bg on scroll
        if (themesSectionRef.current) {
          const r = themesSectionRef.current.getBoundingClientRect()
          const p = Math.max(0, Math.min(1, 1 - r.bottom / (r.height + innerHeight) * 1.2))
          setPhoneBgIdx(Math.min(Math.floor(p * PHONE_BGS.length), PHONE_BGS.length - 1))
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Pick a random profile pair on each page load
  useEffect(() => {
    setProfileBase(Math.floor(Math.random() * PROFILES.length))
  }, [])

  const p1Idx = profileBase % PROFILES.length
  const p2Idx = (profileBase + 1) % PROFILES.length

  return (
    <div style={{ background: BG, color: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @keyframes blob     { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(36px,-28px) scale(1.07)} 66%{transform:translate(-24px,22px) scale(.94)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes shimmer  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes bob      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
        @keyframes cardFloat{ 0%,100%{transform:rotate(var(--t)) translateY(0)} 50%{transform:rotate(var(--t)) translateY(-10px)} }
        @keyframes scrollLine{ 0%{opacity:1;transform:scaleY(1) translateY(0)} 100%{opacity:0;transform:scaleY(1) translateY(30px)} }
        .lk-cta { transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s; }
        .lk-cta:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 18px 50px rgba(108,99,255,.55) !important; }
        .lk-ghost { transition: background .2s, transform .2s; border-radius: 10px; }
        .lk-ghost:hover { background: rgba(108,99,255,.12) !important; }
        .lk-float { animation: float 6s ease-in-out infinite; }
        .lk-bob   { display:inline-block; animation: bob 1.6s ease-in-out infinite; }
        .lk-feat  { transition: transform .2s; }
        .lk-feat:hover { transform: translateX(5px); }
        @media(max-width:768px) {
          .lk-cols  { flex-direction:column !important; padding:80px 24px 60px !important; gap:40px !important; }
          .lk-h1    { font-size:38px !important; letter-spacing:-0.5px !important; }
          .lk-phone { display:none !important; }
          .lk-tcards{ display:none !important; }
          .lk-steps { grid-template-columns:1fr !important; }
          .lk-cta-wrap { padding:80px 24px !important; }
        }
      `}</style>

      {/* Nebulosa como fondo fijo de toda la página */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'url(/cta-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18, zIndex: 0, pointerEvents: 'none' }} />

      <Particles />

      {/* ── HEADER ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px',
        background: headerSolid ? 'rgba(6,6,15,.9)' : 'transparent',
        backdropFilter: headerSolid ? 'blur(20px)' : 'none',
        borderBottom: headerSolid ? '1px solid rgba(255,255,255,.06)' : 'none',
        transition: 'background .4s, backdrop-filter .4s, border-color .4s',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, background: `linear-gradient(90deg,${C1},${C2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Linky</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/login" className="lk-ghost" style={{ padding: '8px 20px', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.7)', border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)', textDecoration: 'none' }}>Iniciar sesión</Link>
          <Link href="/register" className="lk-cta" style={{ padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#fff', background: C1, textDecoration: 'none', boxShadow: `0 2px 16px rgba(108,99,255,.4)` }}>Crear cuenta gratis</Link>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {/* AI-generated background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/steps-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.75, zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,6,15,.8) 35%, rgba(6,6,15,.25) 100%)', zIndex: 0 }} />
        <Blob style={{ top: '-10%', left: '-8%' }} color={C1} size={520} delay={0} />
        <Blob style={{ bottom: '-15%', right: '-6%' }} color={C2} size={480} delay={6} />

        <div className="lk-cols" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '120px 80px 80px', maxWidth: 1200, width: '100%', margin: '0 auto', gap: 60 }}>
          <div style={{ flex: 1 }}>
            <Reveal from="up" delay={0}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(108,99,255,.18)', color: C1, marginBottom: 28, border: '1px solid rgba(108,99,255,.22)' }}>
                <i className="ti ti-sparkles" /> Tu link en bio, reinventado
              </div>
            </Reveal>
            <Reveal from="up" delay={80}>
              <h1 className="lk-h1" style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.08, marginBottom: 22, letterSpacing: '-1.5px' }}>
                Tu presencia<br />digital,{' '}
                <span style={{ background: `linear-gradient(90deg,${C1},${C2},${C1})`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmer 4s linear infinite' }}>en un solo link.</span>
              </h1>
            </Reveal>
            <Reveal from="up" delay={160}>
              <p style={{ fontSize: 18, color: 'rgba(255,255,255,.52)', marginBottom: 36, lineHeight: 1.7, maxWidth: 460 }}>
                Crea tu página personalizada con todos tus links, temas animados y colores únicos. Compártela desde cualquier red social.
              </p>
            </Reveal>
            <Reveal from="up" delay={220}>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link href="/register" className="lk-cta" style={{ padding: '16px 34px', borderRadius: 14, fontSize: 16, fontWeight: 700, color: '#fff', background: C1, textDecoration: 'none', boxShadow: `0 10px 36px rgba(108,99,255,.45)` }}>
                  Empezar gratis <span className="lk-bob">→</span>
                </Link>
                <Link href="/login" className="lk-ghost" style={{ padding: '16px 28px', borderRadius: 14, fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,.55)', textDecoration: 'none', border: '1px solid rgba(255,255,255,.1)', background: 'transparent' }}>
                  Ver demo
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal from="scale" delay={100} className="lk-phone lk-float" style={{ flexShrink: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -50, borderRadius: '50%', background: `radial-gradient(circle,${C1}45,transparent 70%)`, filter: 'blur(40px)' }} />
            <div style={{ position: 'relative' }}>
              <Phone visibleLinks={5} bgIdx={0} profileIdx={p1Idx} />
            </div>
          </Reveal>
        </div>

        {/* scroll cue */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.2)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase' }}>
          Scroll
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom,rgba(255,255,255,.3),transparent)', animation: 'scrollLine 1.8s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ══ LINKS SECTION ══ */}
      <section ref={linksSectionRef} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/links-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.55, zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,15,.5)', zIndex: 0 }} />
        <Blob style={{ top: '5%', right: '-5%' }} color={C2} size={440} delay={4} />

        <div className="lk-cols" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px', maxWidth: 1200, width: '100%', margin: '0 auto', gap: 80 }}>
          <Reveal from="left" style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(168,85,247,.18)', color: C2, marginBottom: 24, border: '1px solid rgba(168,85,247,.22)' }}>
              <i className="ti ti-link" /> Todos tus links
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: '-1px' }}>
              Un solo lugar<br /><span style={{ color: C2 }}>para todo.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.48)', lineHeight: 1.75, marginBottom: 36, maxWidth: 400 }}>
              Instagram, YouTube, TikTok, tu portfolio, tu tienda — todos en una sola página elegante que puedes compartir en segundos.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: 'ti-brand-instagram', text: '46+ redes sociales soportadas' },
                { icon: 'ti-palette',          text: 'Ícono y color personalizados por link' },
                { icon: 'ti-device-mobile',    text: 'Preview en tiempo real en el editor' },
              ].map(f => (
                <div key={f.text} className="lk-feat" style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'rgba(255,255,255,.7)' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(108,99,255,.14)', border: '1px solid rgba(108,99,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`ti ${f.icon}`} style={{ color: C1, fontSize: 18 }} />
                  </div>
                  <span style={{ fontSize: 15 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal from="right" delay={80} className="lk-phone" style={{ flexShrink: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -40, borderRadius: '50%', background: `radial-gradient(circle,${C2}30,transparent 70%)`, filter: 'blur(50px)' }} />
            <div style={{ position: 'relative' }}>
              <Phone visibleLinks={visibleLinks} bgIdx={0} profileIdx={p2Idx} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ THEMES SECTION ══ */}
      <section ref={themesSectionRef} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/themes-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%', opacity: 0.65, zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,15,.55)', zIndex: 0 }} />
        <Blob style={{ top: '15%', left: '20%' }} color={C1} size={400} delay={8} />
        <Blob style={{ bottom: '10%', right: '10%' }} color={C2} size={360} delay={2} />

        <div className="lk-cols" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px', maxWidth: 1200, width: '100%', margin: '0 auto', gap: 80 }}>
          <Reveal from="left" style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(108,99,255,.18)', color: C1, marginBottom: 24, border: '1px solid rgba(108,99,255,.2)' }}>
              <i className="ti ti-palette" /> Temas únicos
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: '-1px' }}>
              Tu estilo,<br />
              <span style={{ background: `linear-gradient(90deg,${C1},${C2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>tus reglas.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.48)', lineHeight: 1.75, marginBottom: 28, maxWidth: 400 }}>
              Temas visuales únicos — desde minimalista hasta galaxia animada. Cada uno completamente personalizable.
            </p>
          </Reveal>

          <Reveal from="right" delay={100} className="lk-tcards" style={{ flexShrink: 0, position: 'relative', width: 340, height: 320 }}>
            {THEMES.map((t, i) => {
              const pos = [{ top: 0, left: 0 }, { top: 20, left: 120 }, { top: 110, left: 55 }, { top: 55, left: 205 }, { top: 170, left: 10 }, { top: 150, left: 175 }]
              const tilts = [-12, 8, -6, 14, -10, 5]
              return (
                <div key={t.label} style={{
                  position: 'absolute', ...pos[i], width: 88, height: 125, borderRadius: 18,
                  background: t.bg, boxShadow: '0 12px 36px rgba(0,0,0,.4)',
                  border: '1px solid rgba(255,255,255,.13)',
                  '--t': `${tilts[i]}deg`, transform: `rotate(${tilts[i]}deg)`,
                  animation: `cardFloat ${6 + i * .7}s ease-in-out ${i * .4}s infinite`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 10,
                }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.75)', marginBottom: 7 }} />
                  <div style={{ width: 46, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.65)', marginBottom: 3 }} />
                  <div style={{ width: 30, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.35)', marginBottom: 11 }} />
                  {[1, 2, 3].map(j => <div key={j} style={{ width: '100%', height: 17, borderRadius: 6, background: 'rgba(255,255,255,.17)', border: '1px solid rgba(255,255,255,.18)', marginBottom: 4 }} />)}
                </div>
              )
            })}
          </Reveal>
        </div>
      </section>

      {/* ══ STEPS ══ */}
      <section style={{ padding: '100px 80px', position: 'relative', overflow: 'hidden' }}>
        <Blob style={{ top: '-10%', right: '5%' }} color={C1} size={400} delay={10} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <Reveal from="up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(108,99,255,.18)', color: C1, marginBottom: 20, border: '1px solid rgba(108,99,255,.2)' }}>
              <i className="ti ti-rocket" /> Simple y rápido
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 14, letterSpacing: '-1px' }}>Listo en 3 pasos.</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.42)', marginBottom: 56 }}>Sin configuraciones complicadas. Tu página en menos de 2 minutos.</p>
          </Reveal>
          <div className="lk-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { num: '01', icon: 'ti-user-plus', title: 'Crea tu cuenta',    desc: 'Regístrate gratis con email o Google. Elige tu nombre de usuario único.' },
              { num: '02', icon: 'ti-palette',   title: 'Personaliza',        desc: 'Agrega tus links, elige temas animados, colores y ajusta cada detalle.' },
              { num: '03', icon: 'ti-share',     title: 'Compártela',         desc: 'Pon tu link Linky en el bio de todas tus redes y lleva tráfico a todo.' },
            ].map((s, i) => (
              <Reveal key={s.num} from="up" delay={i * 120}>
                <div style={{ padding: 32, borderRadius: 24, textAlign: 'left', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', height: '100%' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C1, marginBottom: 16, letterSpacing: '.08em' }}>{s.num}</div>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(108,99,255,.14)', border: '1px solid rgba(108,99,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <i className={`ti ${s.icon}`} style={{ color: C1, fontSize: 22 }} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.42)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '24px 48px', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.18)', borderTop: '1px solid rgba(255,255,255,.05)', position: 'relative', zIndex: 1 }}>
        Linky · Hecho con ♥
      </footer>
    </div>
  )
}
