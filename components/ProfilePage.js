'use client'

import { useState } from 'react'
import Link from 'next/link'
import { safeIconColor, generateStars } from '@/lib/colorUtils'
import AnimatedBg from '@/components/AnimatedBg'

function ShareButton({ dark }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all"
      style={{
        background: copied ? '#6c63ff' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'),
        color: copied ? '#fff' : (dark ? 'rgba(255,255,255,0.8)' : '#555'),
        borderColor: copied ? '#6c63ff' : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
      }}
    >
      <i className={`ti ${copied ? 'ti-check' : 'ti-copy'} text-sm`} aria-hidden="true"></i>
      {copied ? 'Link copiado' : 'Compartir perfil'}
    </button>
  )
}

function ProductsSection({ products, dark, paypalEmail }) {
  if (!products || products.length === 0) return null
  const cardBg     = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'
  const cardBorder = dark ? 'rgba(255,255,255,0.1)'  : 'rgba(0,0,0,0.08)'
  const titleColor = dark ? 'rgba(255,255,255,0.9)'  : '#1f2937'
  const descColor  = dark ? 'rgba(255,255,255,0.4)'  : '#6b7280'
  const labelColor = dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.3)'
  return (
    <div className="mt-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4" style={{ color: labelColor }}>
        Tienda
      </p>
      <div className="flex flex-col gap-3">
        {products.map(p => {
          const email = paypalEmail || ''
          const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(email)}&amount=${p.price}&currency_code=USD&item_name=${encodeURIComponent(p.title)}&no_note=1&no_shipping=2`
          return (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3.5 rounded-xl" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: titleColor }}>{p.title}</p>
                {p.description && <p className="text-xs mt-0.5 truncate" style={{ color: descColor }}>{p.description}</p>}
              </div>
              <a
                href={paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-85"
                style={{ background: '#0070ba' }}
              >
                <i className="ti ti-brand-paypal text-sm" aria-hidden="true"></i>
                ${Number(p.price).toFixed(2)}
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ThemeLight({ profile, links, isOwner, username, products }) {
  const accent = profile.accent || '#6c63ff'
  const anim   = profile.animation || 'bounce'
  const radius = profile.border_radius ?? 12
  const gap    = profile.link_gap ?? 9

  return (
    <main className="min-h-screen flex flex-col items-center py-14 px-4 relative overflow-hidden" style={{ background: '#f5f5f7' }}>
      <AnimatedBg motion={profile.bg_motion} accent={accent} dark={false} />
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name || username} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-sm" />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 border-4 border-white shadow-sm" style={{ background: accent }}>
              {(profile.name || username).charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-xl font-bold mb-1" style={{ color: profile.text_color || '#111827' }}>{profile.name || username}</h1>
          <p className="text-sm font-semibold mb-3" style={{ color: accent }}>@{username}</p>
          {profile.bio && <p className="text-sm leading-relaxed max-w-xs mx-auto text-gray-500">{profile.bio}</p>}
        </div>

        <div className="flex flex-col" style={{ gap }}>
          {links?.map(link => (
            <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-100 shadow-sm anim-${anim} transition-all`}
              style={{ borderRadius: radius, textDecoration: 'none' }}>
              <i className={`ti ${link.icon} text-xl flex-shrink-0`} style={{ color: profile.icon_color || link.color }} aria-hidden="true"></i>
              <span className="font-semibold text-sm flex-1" style={{ color: profile.text_color || '#1f2937' }}>{link.name}</span>
              <i className="ti ti-chevron-right text-sm text-gray-300" aria-hidden="true"></i>
            </a>
          ))}
          {(!links || links.length === 0) && <p className="text-center text-sm py-6 text-gray-400">Sin links por ahora</p>}
        </div>

        <ProductsSection products={products} dark={false} paypalEmail={profile.paypal_email} />

        <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
          <ShareButton dark={false} />
          {isOwner ? (
            <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: accent }}>
              <i className="ti ti-edit text-sm" aria-hidden="true"></i> Editar perfil
            </Link>
          ) : (
            <a href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
              Crear mi Linky →
            </a>
          )}
        </div>
      </div>
    </main>
  )
}

function ThemeDark({ profile, links, isOwner, username, products }) {
  const accent = profile.accent || '#6c63ff'
  const anim   = profile.animation || 'bounce'
  const radius = profile.border_radius ?? 12
  const gap    = profile.link_gap ?? 9

  return (
    <main className="min-h-screen flex flex-col items-center py-14 px-4 relative overflow-hidden" style={{ background: '#0f0f13' }}>
      <AnimatedBg motion={profile.bg_motion} accent={accent} dark={true} />
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name || username} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" style={{ border: '3px solid rgba(255,255,255,0.12)' }} />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4" style={{ background: accent, border: '3px solid rgba(255,255,255,0.12)' }}>
              {(profile.name || username).charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-xl font-bold mb-1" style={{ color: '#fff' }}>{profile.name || username}</h1>
          <p className="text-sm font-semibold mb-3" style={{ color: accent }}>@{username}</p>
          {profile.bio && <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>{profile.bio}</p>}
        </div>

        <div className="flex flex-col" style={{ gap }}>
          {links?.map(link => (
            <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3.5 anim-${anim} transition-all`}
              style={{ borderRadius: radius, textDecoration: 'none', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <i className={`ti ${link.icon} text-xl flex-shrink-0`} style={{ color: profile.icon_color || safeIconColor(link.color, '#0f0f13') }} aria-hidden="true"></i>
              <span className="font-semibold text-sm flex-1" style={{ color: 'rgba(255,255,255,0.88)' }}>{link.name}</span>
              <i className="ti ti-chevron-right text-sm" style={{ color: 'rgba(255,255,255,0.2)' }} aria-hidden="true"></i>
            </a>
          ))}
          {(!links || links.length === 0) && <p className="text-center text-sm py-6" style={{ color: 'rgba(255,255,255,0.2)' }}>Sin links por ahora</p>}
        </div>

        <ProductsSection products={products} dark={true} paypalEmail={profile.paypal_email} />

        <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
          <ShareButton dark={true} />
          {isOwner ? (
            <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: accent }}>
              <i className="ti ti-edit text-sm" aria-hidden="true"></i> Editar perfil
            </Link>
          ) : (
            <a href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
              Crear mi Linky →
            </a>
          )}
        </div>
      </div>
    </main>
  )
}

function ThemeGradient({ profile, links, isOwner, username, products }) {
  const accent = profile.accent || '#6c63ff'
  const anim   = profile.animation || 'bounce'
  const radius = profile.border_radius ?? 12
  const gap    = profile.link_gap ?? 9

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4 relative overflow-hidden" style={{ background: '#f5f5f7' }}>
      <AnimatedBg motion={profile.bg_motion} accent={accent} dark={false} />
      <div className="w-full max-w-sm relative z-10 rounded-3xl overflow-hidden shadow-xl" style={{ background: '#fff' }}>
        <div className="w-full h-36" style={{ background: `linear-gradient(135deg, ${accent}, #a855f7)` }}></div>
        <div className="flex flex-col items-center px-5 pb-12" style={{ background: '#fff' }}>
          <div className="flex justify-center -mt-12 mb-3">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name || username} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md" style={{ background: accent }}>
                {(profile.name || username).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold mb-1 text-gray-900">{profile.name || username}</h1>
          <p className="text-sm font-semibold mb-3" style={{ color: accent }}>@{username}</p>
          {profile.bio && <p className="text-sm leading-relaxed max-w-xs mx-auto text-center text-gray-500 mb-2">{profile.bio}</p>}

          <div className="flex flex-col w-full mt-5" style={{ gap }}>
            {links?.map(link => (
              <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3.5 anim-${anim} transition-all`}
                style={{ borderRadius: radius, textDecoration: 'none', background: '#f5f3ff', border: '1px solid #ede9fe' }}>
                <i className={`ti ${link.icon} text-xl flex-shrink-0`} style={{ color: profile.icon_color || link.color }} aria-hidden="true"></i>
                <span className="font-semibold text-sm flex-1 text-gray-800">{link.name}</span>
                <i className="ti ti-chevron-right text-sm text-gray-300" aria-hidden="true"></i>
              </a>
            ))}
            {(!links || links.length === 0) && <p className="text-center text-sm py-6 text-gray-400">Sin links por ahora</p>}
          </div>

          <ProductsSection products={products} dark={false} paypalEmail={profile.paypal_email} />

          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <ShareButton dark={false} />
            {isOwner ? (
              <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: accent }}>
                <i className="ti ti-edit text-sm" aria-hidden="true"></i> Editar perfil
              </Link>
            ) : (
              <a href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
                Crear mi Linky →
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function ThemeTornasol({ profile, links, isOwner, username, products }) {
  const accent = profile.accent || '#6c63ff'
  const anim   = profile.animation || 'bounce'
  const radius = profile.border_radius ?? 12
  const gap    = profile.link_gap ?? 9

  return (
    <>
      <style>{`
        @keyframes aurora {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .aurora-bg {
          background: linear-gradient(-45deg, #0f0c29, #1a0533, #0d1b4b, #0a2a1a, #1a0533, #2d0b45, #041a3d);
          background-size: 400% 400%;
          animation: aurora 12s ease infinite;
          min-height: 100vh;
        }
        .bubble-orb {
          position: fixed; border-radius: 50%; filter: blur(60px);
          opacity: 0.35; pointer-events: none; z-index: 0;
        }
        .orb1 { width:500px;height:500px;top:-100px;left:-150px;background:conic-gradient(from 0deg,#ff0080,#7928ca,#0070f3,#00dfd8,#ff0080);animation:spin-slow 20s linear infinite; }
        .orb2 { width:400px;height:400px;bottom:-80px;right:-100px;background:conic-gradient(from 180deg,#00dfd8,#7928ca,#ff0080,#f5a623,#00dfd8);animation:spin-slow 25s linear infinite reverse; }
        .orb3 { width:300px;height:300px;top:40%;left:60%;background:conic-gradient(from 90deg,#7928ca,#0070f3,#00dfd8,#7928ca);animation:spin-slow 18s linear infinite;opacity:0.2; }
        .glass-card { background:rgba(255,255,255,0.06);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.12);transition:all 0.3s ease; }
        .glass-card:hover { background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.25);transform:translateY(-1px); }
        .glass-btn { background:rgba(255,255,255,0.1);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.85);transition:all 0.2s; }
        .glass-btn:hover { background:rgba(255,255,255,0.18);border-color:rgba(255,255,255,0.35); }
        .iridescent-text { background:linear-gradient(90deg,#ff9de2,#a78bfa,#67e8f9,#a7f3d0,#fde68a,#ff9de2);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite; }
        .avatar-ring { background:conic-gradient(from 0deg,#ff0080,#7928ca,#0070f3,#00dfd8,#ff0080);padding:3px;border-radius:50%; }
        .avatar-inner { border-radius:50%;overflow:hidden;background:#1a1a2e; }
        .float-avatar { animation:float 4s ease-in-out infinite; }
        .link-icon-shine { filter:drop-shadow(0 0 6px currentColor); }
        .glass-copy-btn { background:rgba(255,255,255,0.1);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.85); }
        .glass-copy-btn:hover { background:rgba(255,255,255,0.18); }
      `}</style>

      <div className="aurora-bg relative overflow-hidden">
        <div className="bubble-orb orb1"></div>
        <div className="bubble-orb orb2"></div>
        <div className="bubble-orb orb3"></div>

        <div className="relative z-10 flex flex-col items-center pt-40 pb-14 px-4 min-h-screen">
          <div className="w-full max-w-sm">
            <div className="text-center mb-10">
              <div className="float-avatar flex justify-center mb-5">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name || username} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: accent }}>
                    {(profile.name || username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="iridescent-text text-2xl font-bold mb-1">{profile.name || username}</h1>
              <p className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>@{username}</p>
              {profile.bio && <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>{profile.bio}</p>}
            </div>

            <div className="flex flex-col" style={{ gap }}>
              {links?.map(link => (
                <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
                  className={`glass-card flex items-center gap-3 px-4 py-3.5 anim-${anim}`}
                  style={{ borderRadius: radius, textDecoration: 'none' }}>
                  <i className={`ti ${link.icon} text-xl flex-shrink-0 link-icon-shine`} style={{ color: profile.icon_color || safeIconColor(link.color, '#0f0c29') }} aria-hidden="true"></i>
                  <span className="font-semibold text-sm flex-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{link.name}</span>
                  <i className="ti ti-chevron-right text-sm" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true"></i>
                </a>
              ))}
              {(!links || links.length === 0) && <p className="text-center text-sm py-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Sin links por ahora</p>}
            </div>

            <ProductsSection products={products} dark={true} paypalEmail={profile.paypal_email} />

            <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
              <ShareButton dark={true} />
              {isOwner ? (
                <Link href="/dashboard" className="glass-btn flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold">
                  <i className="ti ti-edit text-sm" aria-hidden="true"></i> Editar perfil
                </Link>
              ) : (
                <a href="/" className="glass-btn flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold">
                  Crear mi Linky →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Campos de estrellas deterministas (compartidos para evitar errores de hidratación)
const STARS_SMALL  = generateStars(120, 2000, 2000, 7)
const STARS_MEDIUM = generateStars(50, 2000, 2000, 31)
const STARS_BIG    = generateStars(20, 2000, 2000, 97)

// Generador determinista de streams binarios (mismo resultado server/client)
function makeBinaryStream(seed, count) {
  let s = seed
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  return Array.from({ length: count }, () => rand() > 0.5 ? '1' : '0').join('\n')
}

// 30 columnas de fondo tenues — cubren toda la pantalla densamente
const MATRIX_BG_COLS = Array.from({ length: 30 }, (_, i) => ({
  left:  `${1.2 + i * 3.3}%`,
  str:   makeBinaryStream(i * 137 + 7, 32),
  dur:   5.5 + (i % 6) * 1.1,
  delay: (i * 0.43) % 6,
}))

// 12 highlights brillantes con rastro que se desvanece hacia arriba
const MATRIX_HL_COLS = Array.from({ length: 12 }, (_, i) => ({
  left:  `${4 + i * 8}%`,
  str:   makeBinaryStream(i * 53 + 11, 7),
  dur:   2.0 + (i % 4) * 0.85,
  delay: (i * 0.68) % 5,
}))

// Burbujas para ThemeOlas — posiciones fijas
const OLAS_BUBBLES = [
  { left: '8%',  size: 12, dur: 8,  delay: 0   },
  { left: '22%', size: 18, dur: 11, delay: 1.5  },
  { left: '40%', size: 8,  dur: 7,  delay: 3.0  },
  { left: '58%', size: 22, dur: 13, delay: 0.8  },
  { left: '72%', size: 10, dur: 9,  delay: 2.2  },
  { left: '85%', size: 16, dur: 10, delay: 1.0  },
  { left: '30%', size: 14, dur: 12, delay: 4.5  },
  { left: '65%', size: 6,  dur: 8,  delay: 2.8  },
]

function ThemeCosmos({ profile, links, isOwner, username, products }) {
  const accent = profile.accent || '#a78bfa'
  const anim   = profile.animation || 'bounce'
  const radius = profile.border_radius ?? 12
  const gap    = profile.link_gap ?? 9
  const iconColor = c => profile.icon_color || safeIconColor(c, '#0a0e27')

  return (
    <>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes drift   { from{transform:translateY(0)} to{transform:translateY(-1000px)} }
        @keyframes nebula-move { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-30px) scale(1.1)} }
        .cosmos-bg { background: radial-gradient(ellipse at 20% 20%, #1a0b3e 0%, transparent 50%),
                                 radial-gradient(ellipse at 80% 60%, #0d1b4b 0%, transparent 50%),
                                 radial-gradient(ellipse at 50% 100%, #2d0b45 0%, transparent 60%),
                                 #05060f;
                     min-height:100vh; }
        .nebula { position:fixed; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:0; }
        .neb1 { width:480px;height:480px;top:-120px;left:-100px;background:radial-gradient(circle,#7928ca,transparent 70%);opacity:0.4;animation:nebula-move 18s ease-in-out infinite; }
        .neb2 { width:420px;height:420px;bottom:-120px;right:-80px;background:radial-gradient(circle,#0070f3,transparent 70%);opacity:0.35;animation:nebula-move 22s ease-in-out infinite reverse; }
        .star-layer { position:fixed; top:0; left:0; width:1px; height:1px; border-radius:50%; pointer-events:none; z-index:1; }
        .s-small  { background:#fff; box-shadow:${STARS_SMALL};  animation:twinkle 3s ease-in-out infinite, drift 90s linear infinite; }
        .s-medium { width:2px;height:2px; background:#fff; box-shadow:${STARS_MEDIUM}; animation:twinkle 5s ease-in-out infinite, drift 140s linear infinite; }
        .s-big    { width:3px;height:3px; background:#fff; box-shadow:${STARS_BIG}; animation:twinkle 4s ease-in-out infinite; }
        .cosmos-card { background:rgba(255,255,255,0.05);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.1);transition:all .3s; }
        .cosmos-card:hover { background:rgba(255,255,255,0.1);transform:translateY(-1px); }
        .cosmos-name { background:linear-gradient(90deg,#c4b5fd,#93c5fd,#a7f3d0,#c4b5fd);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
      `}</style>

      <div className="cosmos-bg relative overflow-hidden">
        <div className="nebula neb1"></div>
        <div className="nebula neb2"></div>
        <div className="star-layer s-small"></div>
        <div className="star-layer s-medium"></div>
        <div className="star-layer s-big"></div>

        <div className="relative z-10 flex flex-col items-center pt-20 pb-14 px-4 min-h-screen">
          <div className="w-full max-w-sm">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-5">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name || username} className="w-24 h-24 rounded-full object-cover" style={{ border: '3px solid rgba(167,139,250,0.5)', boxShadow: '0 0 30px rgba(167,139,250,0.4)' }} />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: accent, boxShadow: '0 0 30px rgba(167,139,250,0.5)' }}>
                    {(profile.name || username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="cosmos-name text-2xl font-bold mb-1">{profile.name || username}</h1>
              <p className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>@{username}</p>
              {profile.bio && <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>{profile.bio}</p>}
            </div>

            <div className="flex flex-col" style={{ gap }}>
              {links?.map(link => (
                <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
                  className={`cosmos-card flex items-center gap-3 px-4 py-3.5 anim-${anim}`}
                  style={{ borderRadius: radius, textDecoration: 'none' }}>
                  <i className={`ti ${link.icon} text-xl flex-shrink-0`} style={{ color: iconColor(link.color) }} aria-hidden="true"></i>
                  <span className="font-semibold text-sm flex-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{link.name}</span>
                  <i className="ti ti-chevron-right text-sm" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true"></i>
                </a>
              ))}
              {(!links || links.length === 0) && <p className="text-center text-sm py-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Sin links por ahora</p>}
            </div>

            <ProductsSection products={products} dark={true} paypalEmail={profile.paypal_email} />

            <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
              <ShareButton dark={true} />
              {isOwner ? (
                <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: accent }}>
                  <i className="ti ti-edit text-sm" aria-hidden="true"></i> Editar perfil
                </Link>
              ) : (
                <a href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Crear mi Linky →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ThemeCometas({ profile, links, isOwner, username, products }) {
  const accent = profile.accent || '#38bdf8'
  const anim   = profile.animation || 'bounce'
  const radius = profile.border_radius ?? 12
  const gap    = profile.link_gap ?? 9
  const iconColor = c => profile.icon_color || safeIconColor(c, '#080b1a')

  return (
    <>
      <style>{`
        @keyframes twinkle2 { 0%,100%{opacity:0.9} 50%{opacity:0.2} }
        @keyframes shoot {
          0%   { transform: translate(0,0) rotate(-35deg); opacity:0; }
          5%   { opacity:1; }
          70%  { opacity:1; }
          100% { transform: translate(-700px,500px) rotate(-35deg); opacity:0; }
        }
        .comet-bg { background: linear-gradient(180deg,#080b1a 0%,#0d1330 50%,#10183d 100%); min-height:100vh; }
        .star-layer-c { position:fixed; top:0; left:0; width:1px; height:1px; border-radius:50%; background:#fff; pointer-events:none; z-index:1; }
        .sc-small  { box-shadow:${STARS_SMALL};  animation:twinkle2 4s ease-in-out infinite; }
        .sc-medium { width:2px;height:2px; box-shadow:${STARS_MEDIUM}; animation:twinkle2 6s ease-in-out infinite; }
        .comet { position:fixed; top:-10%; width:140px; height:2px; z-index:2; pointer-events:none;
                 background:linear-gradient(90deg,#fff,rgba(255,255,255,0)); border-radius:2px;
                 filter:drop-shadow(0 0 6px #9bd3ff); }
        .comet::after { content:''; position:absolute; right:0; top:-1px; width:4px; height:4px; border-radius:50%; background:#fff; box-shadow:0 0 8px 2px #9bd3ff; }
        .comet1 { right:10%;  animation: shoot 6s linear infinite; }
        .comet2 { right:45%;  animation: shoot 6s linear infinite 2.5s; }
        .comet3 { right:75%;  animation: shoot 6s linear infinite 4s; }
        .comet-card { background:rgba(255,255,255,0.05);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);transition:all .3s; }
        .comet-card:hover { background:rgba(255,255,255,0.1);transform:translateY(-1px); }
      `}</style>

      <div className="comet-bg relative overflow-hidden">
        <div className="star-layer-c sc-small"></div>
        <div className="star-layer-c sc-medium"></div>
        <div className="comet comet1"></div>
        <div className="comet comet2"></div>
        <div className="comet comet3"></div>

        <div className="relative z-10 flex flex-col items-center pt-20 pb-14 px-4 min-h-screen">
          <div className="w-full max-w-sm">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-5">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name || username} className="w-24 h-24 rounded-full object-cover" style={{ border: '3px solid rgba(56,189,248,0.5)', boxShadow: '0 0 30px rgba(56,189,248,0.4)' }} />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: accent, boxShadow: '0 0 30px rgba(56,189,248,0.5)' }}>
                    {(profile.name || username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#e0f2fe' }}>{profile.name || username}</h1>
              <p className="text-sm font-semibold mb-4" style={{ color: accent }}>@{username}</p>
              {profile.bio && <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>{profile.bio}</p>}
            </div>

            <div className="flex flex-col" style={{ gap }}>
              {links?.map(link => (
                <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
                  className={`comet-card flex items-center gap-3 px-4 py-3.5 anim-${anim}`}
                  style={{ borderRadius: radius, textDecoration: 'none' }}>
                  <i className={`ti ${link.icon} text-xl flex-shrink-0`} style={{ color: iconColor(link.color) }} aria-hidden="true"></i>
                  <span className="font-semibold text-sm flex-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{link.name}</span>
                  <i className="ti ti-chevron-right text-sm" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true"></i>
                </a>
              ))}
              {(!links || links.length === 0) && <p className="text-center text-sm py-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Sin links por ahora</p>}
            </div>

            <ProductsSection products={products} dark={true} paypalEmail={profile.paypal_email} />

            <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
              <ShareButton dark={true} />
              {isOwner ? (
                <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: accent }}>
                  <i className="ti ti-edit text-sm" aria-hidden="true"></i> Editar perfil
                </Link>
              ) : (
                <a href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Crear mi Linky →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ThemeMatrix({ profile, links, isOwner, username, products }) {
  const anim   = profile.animation || 'bounce'
  const radius = profile.border_radius ?? 12
  const gap    = profile.link_gap ?? 9
  const iconColor = c => profile.icon_color || safeIconColor(c, '#000000')

  return (
    <>
      <style>{`
        @keyframes matrix-fall { from { top: -30%; } to { top: 115%; } }
        @keyframes matrix-glow { 0%,100%{text-shadow:0 0 8px #00ff41,0 0 20px #00ff41} 50%{text-shadow:0 0 14px #00ff41,0 0 40px #00ff41,0 0 60px #00ff4140} }
        .matrix-bg { background:#000000; min-height:100vh; }
        .matrix-col { position:fixed;font-family:'Courier New',monospace;font-size:13px;line-height:1.65;text-align:center;white-space:pre;pointer-events:none;user-select:none; }
        .matrix-card { background:rgba(0,255,65,0.04);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(0,255,65,0.18);transition:all .3s; }
        .matrix-card:hover { background:rgba(0,255,65,0.1);border-color:rgba(0,255,65,0.45); }
        .matrix-name { color:#00ff41;font-family:'Courier New',monospace;animation:matrix-glow 3s ease-in-out infinite; }
        .matrix-user { color:rgba(0,255,65,0.5);font-family:'Courier New',monospace; }
      `}</style>

      <div className="matrix-bg relative overflow-hidden">

        {/* Capa 1: 30 columnas tenues — pantalla llena de código */}
        {MATRIX_BG_COLS.map((col, i) => (
          <div key={`bg${i}`} className="matrix-col" style={{
            left: col.left, color: '#00aa33', opacity: 0.14, zIndex: 1,
            animation: `matrix-fall ${col.dur}s linear infinite`,
            animationDelay: `${col.delay}s`,
          }}>{col.str}</div>
        ))}

        {/* Capa 2: 12 highlights brillantes con rastro que se desvanece hacia arriba */}
        {MATRIX_HL_COLS.map((col, i) => (
          <div key={`hl${i}`} className="matrix-col" style={{
            left: col.left, color: '#00ff41', opacity: 0.95, zIndex: 2,
            textShadow: '0 0 8px #00ff41, 0 0 18px #00ff4180',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
            animation: `matrix-fall ${col.dur}s linear infinite`,
            animationDelay: `${col.delay}s`,
          }}>{col.str}</div>
        ))}

        <div className="relative z-10 flex flex-col items-center pt-20 pb-14 px-4 min-h-screen">
          <div className="w-full max-w-sm">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-5">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name || username} className="w-24 h-24 rounded-full object-cover" style={{ border: '2px solid rgba(0,255,65,0.55)', boxShadow: '0 0 22px rgba(0,255,65,0.4)' }} />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold" style={{ background: '#001400', border: '2px solid rgba(0,255,65,0.5)', color: '#00ff41', fontFamily: 'Courier New, monospace', boxShadow: '0 0 22px rgba(0,255,65,0.4)' }}>
                    {(profile.name || username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="matrix-name text-2xl font-bold mb-1">{profile.name || username}</h1>
              <p className="matrix-user text-sm font-semibold mb-4">@{username}</p>
              {profile.bio && <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(0,255,65,0.4)', fontFamily: 'Courier New, monospace' }}>{profile.bio}</p>}
            </div>

            <div className="flex flex-col" style={{ gap }}>
              {links?.map(link => (
                <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
                  className={`matrix-card flex items-center gap-3 px-4 py-3.5 anim-${anim}`}
                  style={{ borderRadius: radius, textDecoration: 'none' }}>
                  <i className={`ti ${link.icon} text-xl flex-shrink-0`} style={{ color: iconColor(link.color) }} aria-hidden="true"></i>
                  <span className="font-semibold text-sm flex-1" style={{ color: 'rgba(0,255,65,0.9)' }}>{link.name}</span>
                  <i className="ti ti-chevron-right text-sm" style={{ color: 'rgba(0,255,65,0.3)' }} aria-hidden="true"></i>
                </a>
              ))}
              {(!links || links.length === 0) && <p className="text-center text-sm py-6" style={{ color: 'rgba(0,255,65,0.3)', fontFamily: 'Courier New, monospace' }}>Sin links por ahora</p>}
            </div>

            <ProductsSection products={products} dark={true} paypalEmail={profile.paypal_email} />

            <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
              <ShareButton dark={true} />
              {isOwner ? (
                <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'rgba(0,255,65,0.1)', color: '#00ff41', border: '1px solid rgba(0,255,65,0.35)', fontFamily: 'Courier New, monospace' }}>
                  <i className="ti ti-edit text-sm" aria-hidden="true"></i> Editar perfil
                </Link>
              ) : (
                <a href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'rgba(0,255,65,0.06)', color: 'rgba(0,255,65,0.7)', border: '1px solid rgba(0,255,65,0.2)' }}>
                  Crear mi Linky →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ThemeSunset({ profile, links, isOwner, username, products }) {
  const anim   = profile.animation || 'bounce'
  const radius = profile.border_radius ?? 12
  const gap    = profile.link_gap ?? 9

  return (
    <>
      <style>{`
        @keyframes sunset-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes sunset-sway  { 0%,100%{transform:translateX(0) scaleY(1)} 50%{transform:translateX(-25px) scaleY(1.04)} }
        @keyframes sunset-sway2 { 0%,100%{transform:translateX(0) scaleY(1)} 50%{transform:translateX(20px) scaleY(0.96)} }
        @keyframes sun-pulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
        .sunset-bg {
          background:linear-gradient(-45deg,#1a0533,#b5134f,#e84a0c,#f9a825,#e84a0c,#b5134f);
          background-size:400% 400%;
          animation:sunset-shift 18s ease infinite;
          min-height:100vh;
        }
        .sunset-orb { position:fixed;top:-140px;left:50%;transform:translateX(-50%);
          width:360px;height:360px;border-radius:50%;
          background:radial-gradient(circle,rgba(255,200,80,0.55) 0%,rgba(255,100,30,0.25) 50%,transparent 70%);
          filter:blur(25px);pointer-events:none;z-index:0;
          animation:sun-pulse 5s ease-in-out infinite; }
        .sunset-wave { position:fixed;bottom:0;left:-10%;width:120%;pointer-events:none;z-index:0;border-radius:50% 50% 0 0; }
        .sw1 { height:180px;background:rgba(180,30,50,0.22);animation:sunset-sway 9s ease-in-out infinite; }
        .sw2 { height:130px;background:rgba(220,60,20,0.18);animation:sunset-sway2 11s ease-in-out infinite; }
        .sw3 { height:80px;background:rgba(150,20,60,0.18);animation:sunset-sway 8s ease-in-out infinite reverse; }
        .sunset-card { background:rgba(255,255,255,0.12);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,200,150,0.22);transition:all .3s; }
        .sunset-card:hover { background:rgba(255,255,255,0.22);transform:translateY(-1px); }
        .sunset-name { color:#fff;text-shadow:0 2px 20px rgba(255,120,30,0.9); }
      `}</style>

      <div className="sunset-bg relative overflow-hidden">
        <div className="sunset-orb"></div>
        <div className="sunset-wave sw3"></div>
        <div className="sunset-wave sw2"></div>
        <div className="sunset-wave sw1"></div>

        <div className="relative z-10 flex flex-col items-center pt-20 pb-14 px-4 min-h-screen">
          <div className="w-full max-w-sm">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-5">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name || username} className="w-24 h-24 rounded-full object-cover" style={{ border: '3px solid rgba(255,190,80,0.6)', boxShadow: '0 0 30px rgba(255,120,30,0.5)' }} />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'rgba(220,70,20,0.7)', border: '3px solid rgba(255,200,80,0.5)' }}>
                    {(profile.name || username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="sunset-name text-2xl font-bold mb-1">{profile.name || username}</h1>
              <p className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,220,140,0.9)' }}>@{username}</p>
              {profile.bio && <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(255,240,200,0.7)' }}>{profile.bio}</p>}
            </div>

            <div className="flex flex-col" style={{ gap }}>
              {links?.map(link => (
                <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
                  className={`sunset-card flex items-center gap-3 px-4 py-3.5 anim-${anim}`}
                  style={{ borderRadius: radius, textDecoration: 'none' }}>
                  <i className={`ti ${link.icon} text-xl flex-shrink-0`} style={{ color: profile.icon_color || '#fff' }} aria-hidden="true"></i>
                  <span className="font-semibold text-sm flex-1" style={{ color: 'rgba(255,255,255,0.95)' }}>{link.name}</span>
                  <i className="ti ti-chevron-right text-sm" style={{ color: 'rgba(255,200,150,0.45)' }} aria-hidden="true"></i>
                </a>
              ))}
              {(!links || links.length === 0) && <p className="text-center text-sm py-6" style={{ color: 'rgba(255,200,150,0.4)' }}>Sin links por ahora</p>}
            </div>

            <ProductsSection products={products} dark={true} paypalEmail={profile.paypal_email} />

            <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
              <ShareButton dark={true} />
              {isOwner ? (
                <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,220,150,0.35)' }}>
                  <i className="ti ti-edit text-sm" aria-hidden="true"></i> Editar perfil
                </Link>
              ) : (
                <a href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,240,200,0.8)', border: '1px solid rgba(255,200,100,0.25)' }}>
                  Crear mi Linky →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ThemeOlas({ profile, links, isOwner, username, products }) {
  const anim   = profile.animation || 'bounce'
  const radius = profile.border_radius ?? 12
  const gap    = profile.link_gap ?? 9
  const iconColor = c => profile.icon_color || safeIconColor(c, '#020d1f')

  return (
    <>
      <style>{`
        @keyframes wave-ola1 { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-35px)} }
        @keyframes wave-ola2 { 0%,100%{transform:translateX(0)} 50%{transform:translateX(28px)} }
        @keyframes bubble-rise { 0%{transform:translateY(0);opacity:0} 10%{opacity:0.65} 85%{opacity:0.35} 100%{transform:translateY(-105vh);opacity:0} }
        @keyframes olas-shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes olas-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .olas-bg {
          background:linear-gradient(180deg,#020d1f 0%,#061528 40%,#082040 75%,#0a2a50 100%);
          min-height:100vh;
        }
        .olas-deep { position:fixed;inset:0;pointer-events:none;z-index:0;
          background:radial-gradient(ellipse at 50% 70%,rgba(0,100,180,0.15) 0%,transparent 65%);
          animation:olas-glow 8s ease-in-out infinite; }
        .olas-wave { position:fixed;bottom:0;left:-10%;width:120%;border-radius:55% 45% 0 0;pointer-events:none;z-index:0; }
        .ow1 { height:220px;background:rgba(10,80,140,0.3);animation:wave-ola1 8s ease-in-out infinite; }
        .ow2 { height:170px;background:rgba(0,140,160,0.22);animation:wave-ola2 10s ease-in-out infinite; }
        .ow3 { height:120px;background:rgba(20,180,190,0.15);animation:wave-ola1 7s ease-in-out infinite reverse; }
        .ow4 { height:70px;background:rgba(80,210,220,0.1);animation:wave-ola2 12s ease-in-out infinite; }
        .olas-bubble { position:fixed;border-radius:50%;background:rgba(100,200,255,0.18);pointer-events:none;z-index:1;border:1px solid rgba(100,220,255,0.3); }
        .olas-card { background:rgba(0,100,160,0.1);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(80,180,240,0.15);transition:all .3s; }
        .olas-card:hover { background:rgba(0,150,200,0.18);border-color:rgba(100,220,255,0.3);transform:translateY(-1px); }
        .olas-name { background:linear-gradient(90deg,#7dd3fc,#38bdf8,#bae6fd,#7dd3fc);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:olas-shimmer 5s linear infinite; }
      `}</style>

      <div className="olas-bg relative overflow-hidden">
        <div className="olas-deep"></div>
        <div className="olas-wave ow1"></div>
        <div className="olas-wave ow2"></div>
        <div className="olas-wave ow3"></div>
        <div className="olas-wave ow4"></div>
        {OLAS_BUBBLES.map((b, i) => (
          <div key={i} className="olas-bubble" style={{
            left: b.left, bottom: 0,
            width: b.size, height: b.size,
            animation: `bubble-rise ${b.dur}s ease-in infinite`,
            animationDelay: `${b.delay}s`,
          }}></div>
        ))}

        <div className="relative z-10 flex flex-col items-center pt-20 pb-14 px-4 min-h-screen">
          <div className="w-full max-w-sm">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-5">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name || username} className="w-24 h-24 rounded-full object-cover" style={{ border: '3px solid rgba(56,189,248,0.5)', boxShadow: '0 0 28px rgba(56,189,248,0.4)' }} />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'radial-gradient(circle,#0369a1,#0c4a6e)', boxShadow: '0 0 28px rgba(56,189,248,0.4)' }}>
                    {(profile.name || username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="olas-name text-2xl font-bold mb-1">{profile.name || username}</h1>
              <p className="text-sm font-semibold mb-4" style={{ color: 'rgba(125,211,252,0.7)' }}>@{username}</p>
              {profile.bio && <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(186,230,253,0.6)' }}>{profile.bio}</p>}
            </div>

            <div className="flex flex-col" style={{ gap }}>
              {links?.map(link => (
                <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
                  className={`olas-card flex items-center gap-3 px-4 py-3.5 anim-${anim}`}
                  style={{ borderRadius: radius, textDecoration: 'none' }}>
                  <i className={`ti ${link.icon} text-xl flex-shrink-0`} style={{ color: iconColor(link.color) }} aria-hidden="true"></i>
                  <span className="font-semibold text-sm flex-1" style={{ color: 'rgba(186,230,253,0.9)' }}>{link.name}</span>
                  <i className="ti ti-chevron-right text-sm" style={{ color: 'rgba(125,211,252,0.35)' }} aria-hidden="true"></i>
                </a>
              ))}
              {(!links || links.length === 0) && <p className="text-center text-sm py-6" style={{ color: 'rgba(125,211,252,0.3)' }}>Sin links por ahora</p>}
            </div>

            <ProductsSection products={products} dark={true} paypalEmail={profile.paypal_email} />

            <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
              <ShareButton dark={true} />
              {isOwner ? (
                <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'rgba(56,189,248,0.15)', color: '#7dd3fc', border: '1px solid rgba(56,189,248,0.35)' }}>
                  <i className="ti ti-edit text-sm" aria-hidden="true"></i> Editar perfil
                </Link>
              ) : (
                <a href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'rgba(56,189,248,0.1)', color: 'rgba(125,211,252,0.7)', border: '1px solid rgba(56,189,248,0.2)' }}>
                  Crear mi Linky →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ProfilePage({ profile, links, isOwner, username, products }) {
  const theme = profile.theme || 'light'
  const p = { profile, links, isOwner, username, products }
  if (theme === 'dark')      return <ThemeDark      {...p} />
  if (theme === 'gradient')  return <ThemeGradient  {...p} />
  if (theme === 'tornasol')  return <ThemeTornasol  {...p} />
  if (theme === 'cosmos')    return <ThemeCosmos    {...p} />
  if (theme === 'cometas')   return <ThemeCometas   {...p} />
  if (theme === 'matrix')    return <ThemeMatrix    {...p} />
  if (theme === 'sunset')    return <ThemeSunset    {...p} />
  if (theme === 'olas')      return <ThemeOlas      {...p} />
  return <ThemeLight {...p} />
}
