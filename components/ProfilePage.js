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

function ThemeLight({ profile, links, isOwner, username }) {
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

function ThemeDark({ profile, links, isOwner, username }) {
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

function ThemeGradient({ profile, links, isOwner, username }) {
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

function ThemeTornasol({ profile, links, isOwner, username }) {
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

function ThemeCosmos({ profile, links, isOwner, username }) {
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

function ThemeCometas({ profile, links, isOwner, username }) {
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

export default function ProfilePage({ profile, links, isOwner, username }) {
  const theme = profile.theme || 'light'
  if (theme === 'dark')      return <ThemeDark      profile={profile} links={links} isOwner={isOwner} username={username} />
  if (theme === 'gradient')  return <ThemeGradient  profile={profile} links={links} isOwner={isOwner} username={username} />
  if (theme === 'tornasol')  return <ThemeTornasol  profile={profile} links={links} isOwner={isOwner} username={username} />
  if (theme === 'cosmos')    return <ThemeCosmos    profile={profile} links={links} isOwner={isOwner} username={username} />
  if (theme === 'cometas')   return <ThemeCometas   profile={profile} links={links} isOwner={isOwner} username={username} />
  return <ThemeLight profile={profile} links={links} isOwner={isOwner} username={username} />
}
