'use client'

import { safeIconColor } from '@/lib/colorUtils'
import AnimatedBg from '@/components/AnimatedBg'

export default function PhonePreview({ profile, links }) {
  const theme     = profile.theme || 'light'
  const accent    = profile.accent     || '#6c63ff'
  const bg        = profile.bg         || '#f4f3ff'
  const card      = profile.card       || '#ffffff'
  const textColor = profile.text_color || '#1a1a2e'
  const muted     = profile.muted      || '#888888'
  const anim      = profile.animation  || 'bounce'
  const radius    = profile.border_radius ?? 12
  const gap       = profile.link_gap   ?? 9

  const name     = profile.name || 'Tu nombre'
  const username = profile.username || ''
  const bio      = profile.bio || ''
  const iconOverride = profile.icon_color || null

  function Avatar({ size = 16, border = 'rgba(255,255,255,0.4)' }) {
    if (profile.avatar_url) {
      return (
        <img
          src={profile.avatar_url}
          alt="Avatar"
          className={`w-${size} h-${size} rounded-full object-cover mx-auto mb-3 border-2`}
          style={{ borderColor: border, width: size * 4, height: size * 4 }}
        />
      )
    }
    return (
      <div
        className="rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3 border-2"
        style={{ background: accent, borderColor: border, width: size * 4, height: size * 4, fontSize: size * 1.5 }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }

  function Links() {
    if (links.length === 0) {
      return <div className="text-center py-6 text-xs" style={{ color: muted }}>Añade links desde &quot;Links&quot;</div>
    }
    return (
      <div className="flex flex-col" style={{ gap }}>
        {links.map(link => (
          <div
            key={link.id}
            className={`flex items-center gap-2.5 px-3 py-2.5 border anim-${anim}`}
            style={{ background: card, borderRadius: radius, borderColor: 'rgba(0,0,0,0.04)', borderWidth: 1 }}
          >
            <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || link.color }} aria-hidden="true"></i>
            <span className="text-xs font-semibold flex-1" style={{ color: textColor }}>{link.name}</span>
            <i className="ti ti-chevron-right text-xs" style={{ color: '#ccc' }} aria-hidden="true"></i>
          </div>
        ))}
      </div>
    )
  }

  function renderContent() {
    if (theme === 'dark') {
      const darkBg   = profile.bg   || '#111111'
      const darkCard = profile.card || '#222222'
      const darkText = profile.text_color || '#eeeeee'
      const darkMuted = profile.muted || '#aaaaaa'
      return (
        <div className="p-4 pb-6 relative overflow-hidden" style={{ background: darkBg, minHeight: 520 }}>
          <AnimatedBg motion={profile.bg_motion} accent={accent} dark={true} />
          <div className="text-center mb-5 relative z-10">
            <Avatar size={16} border="rgba(255,255,255,0.15)" />
            <p className="text-sm font-bold" style={{ color: darkText }}>{name}</p>
            {username && <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>@{username}</p>}
            {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: darkMuted }}>{bio}</p>}
          </div>
          <div className="flex flex-col relative z-10" style={{ gap }}>
            {links.length === 0
              ? <div className="text-center py-6 text-xs" style={{ color: darkMuted }}>Añade links desde &quot;Links&quot;</div>
              : links.map(link => (
                <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                  style={{ background: darkCard, borderRadius: radius, border: '1px solid rgba(255,255,255,0.07)' }}>
                  <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || safeIconColor(link.color, darkBg) }} aria-hidden="true"></i>
                  <span className="text-xs font-semibold flex-1" style={{ color: darkText }}>{link.name}</span>
                  <i className="ti ti-chevron-right text-xs" style={{ color: '#555' }} aria-hidden="true"></i>
                </div>
              ))
            }
          </div>
        </div>
      )
    }

    if (theme === 'gradient') {
      return (
        <div className="relative overflow-hidden" style={{ background: bg, minHeight: 520 }}>
          <AnimatedBg motion={profile.bg_motion} accent={accent} dark={false} />
          <div className="p-4 pb-5 text-center relative z-10" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}>
            <Avatar size={16} border="rgba(255,255,255,0.5)" />
            <p className="text-sm font-bold text-white">{name}</p>
            {username && <p className="text-xs font-semibold mt-0.5 text-white/70">@{username}</p>}
            {bio && <p className="text-xs mt-1.5 leading-relaxed px-2 text-white/80">{bio}</p>}
          </div>
          <div className="p-4 relative z-10">
            <Links />
          </div>
        </div>
      )
    }

    if (theme === 'tornasol') {
      return (
        <>
          <style>{`
            @keyframes pv-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes pv-shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
            @keyframes pv-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
            .pv-orb { position:absolute;border-radius:50%;filter:blur(30px);opacity:0.55; }
            .pv-orb1 { width:200px;height:200px;top:-60px;left:-70px;background:conic-gradient(from 0deg,#ff0080,#7928ca,#0070f3,#00dfd8,#ff0080);animation:pv-spin 20s linear infinite; }
            .pv-orb2 { width:160px;height:160px;bottom:-40px;right:-50px;background:conic-gradient(from 180deg,#00dfd8,#7928ca,#ff0080,#f5a623,#00dfd8);animation:pv-spin 25s linear infinite reverse; }
            .pv-iri { background:linear-gradient(90deg,#ff9de2,#a78bfa,#67e8f9,#a7f3d0,#fde68a,#ff9de2);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:pv-shimmer 4s linear infinite; }
            .pv-float { animation:pv-float 4s ease-in-out infinite; }
          `}</style>
          <div style={{ background: 'linear-gradient(135deg, #0a0a1a, #1a0a2e)', minHeight: 520, position: 'relative', overflow: 'hidden' }}>
            <div className="pv-orb pv-orb1"></div>
            <div className="pv-orb pv-orb2"></div>
            <div className="pt-8 pb-5 text-center relative z-10">
              <div className="mx-auto mb-3 rounded-full flex items-center justify-center pv-float"
                style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #a78bfa, #ec4899, #06b6d4)', padding: 2 }}>
                {profile.avatar_url
                  ? <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  : <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: '#1a0a2e' }}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                }
              </div>
              <p className="pv-iri text-sm font-bold">{name}</p>
              {username && <p className="text-xs font-semibold mt-0.5" style={{ color: '#a78bfa' }}>@{username}</p>}
              {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: '#9d8fbe' }}>{bio}</p>}
            </div>
            <div className="p-4 flex flex-col relative z-10" style={{ gap }}>
              {links.length === 0
                ? <div className="text-center py-6 text-xs" style={{ color: '#9d8fbe' }}>Añade links desde &quot;Links&quot;</div>
                : links.map(link => (
                  <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                    style={{ background: 'rgba(167,139,250,0.12)', borderRadius: radius, border: '1px solid rgba(167,139,250,0.25)' }}>
                    <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || safeIconColor(link.color, '#0a0a1a') }} aria-hidden="true"></i>
                    <span className="text-xs font-semibold flex-1" style={{ color: '#e8d5ff' }}>{link.name}</span>
                    <i className="ti ti-chevron-right text-xs" style={{ color: '#6b5a8a' }} aria-hidden="true"></i>
                  </div>
                ))
              }
            </div>
          </div>
        </>
      )
    }

    if (theme === 'cosmos') {
      const starBg = `radial-gradient(1px 1px at 20px 30px, #fff, transparent),
                      radial-gradient(1px 1px at 80px 90px, #fff, transparent),
                      radial-gradient(1px 1px at 130px 50px, #fff, transparent),
                      radial-gradient(2px 2px at 50px 160px, #fff, transparent),
                      radial-gradient(1px 1px at 160px 200px, #fff, transparent),
                      radial-gradient(1px 1px at 30px 250px, #fff, transparent),
                      radial-gradient(2px 2px at 190px 320px, #fff, transparent),
                      radial-gradient(1px 1px at 100px 400px, #fff, transparent),
                      radial-gradient(1px 1px at 210px 460px, #fff, transparent)`
      return (
        <>
          <style>{`
            @keyframes pv-twinkle { 0%,100%{opacity:1} 50%{opacity:0.2} }
            @keyframes pv-nebula { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-15px) scale(1.08)} }
            .pv-neb1 { position:absolute;width:200px;height:200px;top:-60px;left:-50px;background:radial-gradient(circle,#7928ca,transparent 70%);opacity:0.4;border-radius:50%;animation:pv-nebula 18s ease-in-out infinite; }
            .pv-neb2 { position:absolute;width:180px;height:180px;bottom:-60px;right:-40px;background:radial-gradient(circle,#0070f3,transparent 70%);opacity:0.35;border-radius:50%;animation:pv-nebula 22s ease-in-out infinite reverse; }
            .pv-stars { animation:pv-twinkle 3s ease-in-out infinite; }
          `}</style>
          <div className="relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 20% 20%, #1a0b3e 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, #0d1b4b 0%, transparent 50%), #05060f', minHeight: 520 }}>
            <div className="pv-neb1"></div>
            <div className="pv-neb2"></div>
            <div className="absolute inset-0 pv-stars" style={{ background: starBg, opacity: 0.8 }}></div>
            <div className="relative z-10 p-4 pb-6">
              <div className="text-center mb-5">
                <Avatar size={16} border="rgba(167,139,250,0.5)" />
                <p className="text-sm font-bold" style={{ color: '#d8c9ff' }}>{name}</p>
                {username && <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>@{username}</p>}
                {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{bio}</p>}
              </div>
              <div className="flex flex-col" style={{ gap }}>
                {links.length === 0
                  ? <div className="text-center py-6 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Añade links desde &quot;Links&quot;</div>
                  : links.map(link => (
                    <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                      style={{ background: 'rgba(255,255,255,0.05)', borderRadius: radius, border: '1px solid rgba(255,255,255,0.1)' }}>
                      <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || safeIconColor(link.color, '#05060f') }} aria-hidden="true"></i>
                      <span className="text-xs font-semibold flex-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{link.name}</span>
                      <i className="ti ti-chevron-right text-xs" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true"></i>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </>
      )
    }

    if (theme === 'cometas') {
      const starBg = `radial-gradient(1px 1px at 25px 40px, #fff, transparent),
                      radial-gradient(1px 1px at 90px 110px, #fff, transparent),
                      radial-gradient(2px 2px at 150px 70px, #fff, transparent),
                      radial-gradient(1px 1px at 60px 180px, #fff, transparent),
                      radial-gradient(1px 1px at 200px 230px, #fff, transparent),
                      radial-gradient(2px 2px at 40px 300px, #fff, transparent),
                      radial-gradient(1px 1px at 170px 370px, #fff, transparent),
                      radial-gradient(1px 1px at 110px 440px, #fff, transparent)`
      return (
        <>
          <style>{`
            @keyframes pv-shoot { 0%{transform:translateX(0) translateY(0);opacity:1} 100%{transform:translateX(-180px) translateY(180px);opacity:0} }
            @keyframes pv-twinkle2 { 0%,100%{opacity:0.9} 50%{opacity:0.2} }
            .pv-comet { position:absolute;width:60px;height:2px;background:linear-gradient(90deg,#fff,transparent);transform:rotate(-35deg);filter:drop-shadow(0 0 4px #9bd3ff); }
            .pv-c1 { top:60px;right:30px;animation:pv-shoot 5s linear infinite; }
            .pv-c2 { top:180px;right:110px;animation:pv-shoot 5s linear infinite 2s; }
            .pv-stars2 { animation:pv-twinkle2 4s ease-in-out infinite; }
          `}</style>
          <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#080b1a 0%,#0d1330 50%,#10183d 100%)', minHeight: 520 }}>
            <div className="absolute inset-0 pv-stars2" style={{ background: starBg, opacity: 0.85 }}></div>
            <div className="pv-comet pv-c1"></div>
            <div className="pv-comet pv-c2"></div>
            <div className="relative z-10 p-4 pb-6">
              <div className="text-center mb-5">
                <Avatar size={16} border="rgba(56,189,248,0.5)" />
                <p className="text-sm font-bold" style={{ color: '#e0f2fe' }}>{name}</p>
                {username && <p className="text-xs font-semibold mt-0.5" style={{ color: '#38bdf8' }}>@{username}</p>}
                {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{bio}</p>}
              </div>
              <div className="flex flex-col" style={{ gap }}>
                {links.length === 0
                  ? <div className="text-center py-6 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Añade links desde &quot;Links&quot;</div>
                  : links.map(link => (
                    <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                      style={{ background: 'rgba(255,255,255,0.05)', borderRadius: radius, border: '1px solid rgba(255,255,255,0.1)' }}>
                      <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || safeIconColor(link.color, '#080b1a') }} aria-hidden="true"></i>
                      <span className="text-xs font-semibold flex-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{link.name}</span>
                      <i className="ti ti-chevron-right text-xs" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true"></i>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </>
      )
    }

    if (theme === 'matrix') {
      return (
        <div className="relative overflow-hidden" style={{ background: '#000000', minHeight: 520 }}>
          <div className="absolute inset-0" style={{ opacity: 0.5, fontFamily: 'Courier New, monospace', fontSize: 11, lineHeight: 1.6, color: '#00ff41', whiteSpace: 'pre', pointerEvents: 'none', padding: '0 2px', overflow: 'hidden' }}>
            {'1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 1 0 0 1\n0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1 0 1 0 1\n1 1 0 1 0 0 1 0 1 1 0 1 1 0 0 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0\n0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0\n1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 1 0 0 1 1 0 1 0 0 1 0 1\n0 1 1 0 1 0 1 1 0 0 1 0 1 0 1 1 0 0 1 0 1 0 0 1 1 0 1 0 1 1 0\n1 0 1 0 0 1 1 0 1 1 0 0 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 0 1\n0 1 0 1 1 0 0 1 0 1 0 1 1 0 0 1 0 1 1 0 0 1 0 1 0 1 1 0 0 1 0\n1 1 0 0 1 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1 0 1 0 0 1 1 0 1 0 0 1\n0 0 1 1 0 1 0 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 0 0 1 0 1 1 0\n1 0 1 0 1 0 1 1 0 1 0 0 1 0 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1\n0 1 0 0 1 1 0 0 1 0 1 0 1 1 0 1 0 1 0 0 1 1 0 1 0 1 1 0 1 0 0\n1 1 0 1 0 1 0 0 1 1 0 0 1 0 1 1 0 0 1 0 1 0 0 1 1 0 1 0 1 1 0\n0 0 1 0 1 0 1 1 0 0 1 1 0 1 0 1 0 1 1 0 0 1 0 1 0 0 1 1 0 1 0\n1 0 0 1 1 0 1 0 1 0 1 0 0 1 1 0 1 0 0 1 1 0 1 0 1 0 1 0 0 1 1'}
          </div>
          <div className="relative z-10 p-4 pb-6">
            <div className="text-center mb-5">
              <Avatar size={16} border="rgba(0,255,65,0.55)" />
              <p className="text-sm font-bold" style={{ color: '#00ff41', fontFamily: 'Courier New, monospace', textShadow: '0 0 8px #00ff41' }}>{name}</p>
              {username && <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(0,255,65,0.55)', fontFamily: 'Courier New, monospace' }}>@{username}</p>}
              {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: 'rgba(0,255,65,0.4)', fontFamily: 'Courier New, monospace' }}>{bio}</p>}
            </div>
            <div className="flex flex-col" style={{ gap }}>
              {links.length === 0
                ? <div className="text-center py-6 text-xs" style={{ color: 'rgba(0,255,65,0.3)' }}>Añade links desde &quot;Links&quot;</div>
                : links.map(link => (
                  <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                    style={{ background: 'rgba(0,255,65,0.04)', borderRadius: radius, border: '1px solid rgba(0,255,65,0.2)' }}>
                    <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || safeIconColor(link.color, '#000000') }} aria-hidden="true"></i>
                    <span className="text-xs font-semibold flex-1" style={{ color: 'rgba(0,255,65,0.9)' }}>{link.name}</span>
                    <i className="ti ti-chevron-right text-xs" style={{ color: 'rgba(0,255,65,0.3)' }} aria-hidden="true"></i>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )
    }

    if (theme === 'sunset') {
      return (
        <>
          <style>{`
            @keyframes pv-sunset-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
            @keyframes pv-sway1 { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-15px)} }
            @keyframes pv-sway2 { 0%,100%{transform:translateX(0)} 50%{transform:translateX(12px)} }
            @keyframes pv-sun-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
            .pv-sunset-bg { background:linear-gradient(160deg,#8b1a4a,#c2185b,#e84a0c,#f9a825,#c2185b,#8b1a4a);background-size:300% 300%;animation:pv-sunset-shift 10s ease infinite; }
            .pv-sun { animation:pv-sun-pulse 4s ease-in-out infinite; }
            .pv-sw1 { animation:pv-sway1 9s ease-in-out infinite; }
            .pv-sw2 { animation:pv-sway2 11s ease-in-out infinite; }
          `}</style>
          <div className="pv-sunset-bg relative overflow-hidden" style={{ minHeight: 520 }}>
            <div className="pv-sun absolute" style={{ top: -80, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,210,80,0.6) 0%,transparent 65%)', filter: 'blur(20px)' }}></div>
            <div className="pv-sw1 absolute" style={{ bottom: 0, left: '-10%', width: '120%', height: 100, background: 'rgba(140,20,40,0.25)', borderRadius: '50% 50% 0 0' }}></div>
            <div className="pv-sw2 absolute" style={{ bottom: 0, left: '-10%', width: '120%', height: 65, background: 'rgba(200,50,10,0.2)', borderRadius: '45% 55% 0 0' }}></div>
            <div className="relative z-10 p-4 pb-6">
              <div className="text-center mb-5">
                <Avatar size={16} border="rgba(255,200,80,0.6)" />
                <p className="text-sm font-bold text-white" style={{ textShadow: '0 2px 12px rgba(255,100,20,0.8)' }}>{name}</p>
                {username && <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,220,140,0.9)' }}>@{username}</p>}
                {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: 'rgba(255,240,200,0.7)' }}>{bio}</p>}
              </div>
              <div className="flex flex-col" style={{ gap }}>
                {links.length === 0
                  ? <div className="text-center py-6 text-xs" style={{ color: 'rgba(255,200,150,0.4)' }}>Añade links desde &quot;Links&quot;</div>
                  : links.map(link => (
                    <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                      style={{ background: 'rgba(255,255,255,0.14)', borderRadius: radius, border: '1px solid rgba(255,200,150,0.22)', backdropFilter: 'blur(12px)' }}>
                      <i className={`ti ${link.icon} text-lg flex-shrink-0 text-white`} aria-hidden="true"></i>
                      <span className="text-xs font-semibold flex-1 text-white">{link.name}</span>
                      <i className="ti ti-chevron-right text-xs" style={{ color: 'rgba(255,200,150,0.45)' }} aria-hidden="true"></i>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </>
      )
    }

    if (theme === 'olas') {
      return (
        <>
          <style>{`
            @keyframes pv-wave1 { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-20px)} }
            @keyframes pv-wave2 { 0%,100%{transform:translateX(0)} 50%{transform:translateX(16px)} }
            @keyframes pv-bubble { 0%{transform:translateY(0);opacity:0} 10%{opacity:0.6} 90%{opacity:0.2} 100%{transform:translateY(-380px);opacity:0} }
            .pv-ow1 { animation:pv-wave1 8s ease-in-out infinite; }
            .pv-ow2 { animation:pv-wave2 10s ease-in-out infinite; }
            .pv-ow3 { animation:pv-wave1 7s ease-in-out infinite reverse; }
            .pv-b1 { position:absolute;bottom:10px;left:30%;width:6px;height:6px;background:rgba(56,189,248,0.5);border-radius:50%;animation:pv-bubble 6s ease-in infinite; }
            .pv-b2 { position:absolute;bottom:10px;left:55%;width:4px;height:4px;background:rgba(56,189,248,0.4);border-radius:50%;animation:pv-bubble 8s ease-in infinite 2s; }
            .pv-b3 { position:absolute;bottom:10px;left:20%;width:5px;height:5px;background:rgba(56,189,248,0.35);border-radius:50%;animation:pv-bubble 7s ease-in infinite 4s; }
            .pv-olas-name { background:linear-gradient(90deg,#7dd3fc,#38bdf8,#bae6fd,#7dd3fc);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:pv-sunset-shift 5s linear infinite; }
          `}</style>
          <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#020d1f 0%,#061528 45%,#0a2a50 100%)', minHeight: 520 }}>
            <div className="pv-ow1 absolute" style={{ bottom: 0, left: '-10%', width: '120%', height: 140, background: 'rgba(10,80,140,0.3)', borderRadius: '55% 45% 0 0' }}></div>
            <div className="pv-ow2 absolute" style={{ bottom: 0, left: '-10%', width: '120%', height: 100, background: 'rgba(0,140,160,0.22)', borderRadius: '45% 55% 0 0' }}></div>
            <div className="pv-ow3 absolute" style={{ bottom: 0, left: '-10%', width: '120%', height: 60, background: 'rgba(80,210,220,0.12)', borderRadius: '50% 50% 0 0' }}></div>
            <div className="pv-b1"></div>
            <div className="pv-b2"></div>
            <div className="pv-b3"></div>
            <div className="relative z-10 p-4 pb-6">
              <div className="text-center mb-5">
                <Avatar size={16} border="rgba(56,189,248,0.5)" />
                <p className="pv-olas-name text-sm font-bold">{name}</p>
                {username && <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(125,211,252,0.7)' }}>@{username}</p>}
                {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: 'rgba(186,230,253,0.6)' }}>{bio}</p>}
              </div>
              <div className="flex flex-col" style={{ gap }}>
                {links.length === 0
                  ? <div className="text-center py-6 text-xs" style={{ color: 'rgba(125,211,252,0.3)' }}>Añade links desde &quot;Links&quot;</div>
                  : links.map(link => (
                    <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                      style={{ background: 'rgba(0,100,160,0.12)', borderRadius: radius, border: '1px solid rgba(80,180,240,0.18)' }}>
                      <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || safeIconColor(link.color, '#020d1f') }} aria-hidden="true"></i>
                      <span className="text-xs font-semibold flex-1" style={{ color: 'rgba(186,230,253,0.9)' }}>{link.name}</span>
                      <i className="ti ti-chevron-right text-xs" style={{ color: 'rgba(125,211,252,0.35)' }} aria-hidden="true"></i>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </>
      )
    }

    if (theme === 'stars') {
      return (
        <div className="relative overflow-hidden" style={{ background: '#05060f url(/stars.jpg) center/cover no-repeat', minHeight: 520 }}>
          <div className="relative z-10 p-4 pb-6">
            <div className="text-center mb-5">
              <Avatar size={16} border="rgba(255,255,255,0.2)" />
              <p className="text-sm font-bold text-white" style={{ textShadow: '0 0 20px rgba(167,139,250,0.6)' }}>{name}</p>
              {username && <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>@{username}</p>}
              {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{bio}</p>}
            </div>
            <div className="flex flex-col" style={{ gap }}>
              {links.length === 0
                ? <div className="text-center py-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Añade links desde &quot;Links&quot;</div>
                : links.map(link => (
                  <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                    style={{ background: 'rgba(255,255,255,0.06)', borderRadius: radius, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                    <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || safeIconColor(link.color, '#05060f') }} aria-hidden="true"></i>
                    <span className="text-xs font-semibold flex-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{link.name}</span>
                    <i className="ti ti-chevron-right text-xs" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true"></i>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )
    }

    if (theme === 'desert') {
      return (
        <div className="relative overflow-hidden" style={{ background: '#0a0300 url(/desert.jpg) center/cover no-repeat', minHeight: 520 }}>
          <div className="relative z-10 p-4 pb-6">
            <div className="text-center mb-5">
              <Avatar size={16} border="rgba(249,115,22,0.4)" />
              <p className="text-sm font-bold text-white" style={{ textShadow: '0 0 20px rgba(249,115,22,0.7)' }}>{name}</p>
              {username && <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>@{username}</p>}
              {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{bio}</p>}
            </div>
            <div className="flex flex-col" style={{ gap }}>
              {links.length === 0
                ? <div className="text-center py-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Añade links desde &quot;Links&quot;</div>
                : links.map(link => (
                  <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                    style={{ background: 'rgba(255,255,255,0.06)', borderRadius: radius, border: '1px solid rgba(255,140,0,0.15)', backdropFilter: 'blur(16px)' }}>
                    <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || safeIconColor(link.color, '#0a0300') }} aria-hidden="true"></i>
                    <span className="text-xs font-semibold flex-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{link.name}</span>
                    <i className="ti ti-chevron-right text-xs" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true"></i>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )
    }

    if (theme === 'aurora') {
      return (
        <div className="relative overflow-hidden" style={{ background: '#020b05 url(/aurora.jpg) center/cover no-repeat', minHeight: 520 }}>
          <div className="relative z-10 p-4 pb-6">
            <div className="text-center mb-5">
              <Avatar size={16} border="rgba(74,222,128,0.4)" />
              <p className="text-sm font-bold text-white" style={{ textShadow: '0 0 20px rgba(74,222,128,0.6)' }}>{name}</p>
              {username && <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>@{username}</p>}
              {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{bio}</p>}
            </div>
            <div className="flex flex-col" style={{ gap }}>
              {links.length === 0
                ? <div className="text-center py-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Añade links desde &quot;Links&quot;</div>
                : links.map(link => (
                  <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                    style={{ background: 'rgba(255,255,255,0.06)', borderRadius: radius, border: '1px solid rgba(74,222,128,0.15)', backdropFilter: 'blur(16px)' }}>
                    <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || safeIconColor(link.color, '#020b05') }} aria-hidden="true"></i>
                    <span className="text-xs font-semibold flex-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{link.name}</span>
                    <i className="ti ti-chevron-right text-xs" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true"></i>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )
    }

    if (theme === 'ocean') {
      return (
        <div className="relative overflow-hidden" style={{ background: '#000d12 url(/ocean.jpg) center/cover no-repeat', minHeight: 520 }}>
          <div className="relative z-10 p-4 pb-6">
            <div className="text-center mb-5">
              <Avatar size={16} border="rgba(34,211,238,0.4)" />
              <p className="text-sm font-bold text-white" style={{ textShadow: '0 0 20px rgba(34,211,238,0.6)' }}>{name}</p>
              {username && <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>@{username}</p>}
              {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{bio}</p>}
            </div>
            <div className="flex flex-col" style={{ gap }}>
              {links.length === 0
                ? <div className="text-center py-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Añade links desde &quot;Links&quot;</div>
                : links.map(link => (
                  <div key={link.id} className={`flex items-center gap-2.5 px-3 py-2.5 anim-${anim}`}
                    style={{ background: 'rgba(255,255,255,0.06)', borderRadius: radius, border: '1px solid rgba(34,211,238,0.15)', backdropFilter: 'blur(16px)' }}>
                    <i className={`ti ${link.icon} text-lg flex-shrink-0`} style={{ color: iconOverride || safeIconColor(link.color, '#000d12') }} aria-hidden="true"></i>
                    <span className="text-xs font-semibold flex-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{link.name}</span>
                    <i className="ti ti-chevron-right text-xs" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true"></i>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )
    }

    // light (default)
    return (
      <div className="p-4 pb-6 relative overflow-hidden" style={{ background: bg, minHeight: 520 }}>
        <AnimatedBg motion={profile.bg_motion} accent={accent} dark={false} />
        <div className="text-center mb-5 relative z-10">
          <Avatar size={16} border="rgba(255,255,255,0.4)" />
          <p className="text-sm font-bold" style={{ color: textColor }}>{name}</p>
          {username && <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>@{username}</p>}
          {bio && <p className="text-xs mt-1.5 leading-relaxed px-2" style={{ color: muted }}>{bio}</p>}
        </div>
        <div className="relative z-10"><Links /></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-64 rounded-[44px] p-3 shadow-2xl" style={{ background: '#1a1a2e' }}>
        <div className="rounded-[34px] overflow-hidden">
          <div className="h-7 flex items-center justify-center" style={{ background: '#1a1a2e' }}>
            <div className="w-20 h-2.5 rounded-full bg-gray-700"></div>
          </div>
          {renderContent()}
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3 font-medium">Vista previa en tiempo real</p>
    </div>
  )
}
