'use client'

// Genera posiciones deterministas (mismo server/client) para puntos con box-shadow.
function dotShadows(count, color, seed) {
  let s = seed
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  const out = []
  for (let i = 0; i < count; i++) {
    out.push(`${Math.floor(rand() * 1400)}px ${Math.floor(rand() * 1800)}px ${color}`)
  }
  return out.join(', ')
}

// Fondo animado reutilizable. Se posiciona absoluto dentro de un contenedor
// `relative overflow-hidden`; el contenido debe ir en una capa `relative z-10`.
// motion: 'none' | 'aurora' | 'bubbles' | 'waves' | 'gradient' | 'sparkles' | 'pulse' | 'rays'
export default function AnimatedBg({ motion, accent = '#6c63ff', dark = false }) {
  if (!motion || motion === 'none') return null

  const blobOpacity = dark ? 0.5 : 0.4
  // Tinte base constante: el color SIEMPRE está presente aunque las formas se muevan,
  // así nunca "se pierde" el color que se está animando.
  const baseTint = dark ? 0.12 : 0.08
  // El degradado lleva su propio fondo, no necesita tinte base
  const showBaseTint = motion !== 'gradient'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes ab-drift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(18px,-14px) scale(1.08); }
          66%     { transform: translate(-14px,12px) scale(0.96); }
        }
        @keyframes ab-rise {
          0%   { transform: translateY(110%) scale(0.6); opacity:0; }
          15%  { opacity:1; }
          85%  { opacity:1; }
          100% { transform: translateY(-20%) scale(1.1); opacity:0; }
        }
        @keyframes ab-wave { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ab-gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes ab-twinkle { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes ab-pulse { 0%,100%{transform:scale(0.85);opacity:0.55} 50%{transform:scale(1.15);opacity:0.95} }
        @keyframes ab-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .ab-blob { position:absolute; border-radius:50%; filter: blur(55px); }
        .ab-bubble { position:absolute; bottom:0; border-radius:50%; }
        .ab-wave-sheet { position:absolute; border-radius:45%; filter: blur(40px); }
        .ab-dot { position:absolute; top:0; left:0; width:2px; height:2px; border-radius:50%; }
      `}</style>

      {/* Capa de color base siempre visible */}
      {showBaseTint && <div className="absolute inset-0" style={{ background: accent, opacity: baseTint }}></div>}

      {motion === 'aurora' && (
        <>
          <div className="ab-blob" style={{ width: 380, height: 380, top: '-6%', left: '-8%', background: accent, opacity: blobOpacity, animation: 'ab-drift 16s ease-in-out infinite' }}></div>
          <div className="ab-blob" style={{ width: 340, height: 340, bottom: '-6%', right: '-6%', background: accent, opacity: blobOpacity * 0.85, animation: 'ab-drift 20s ease-in-out infinite reverse' }}></div>
          <div className="ab-blob" style={{ width: 300, height: 300, top: '35%', left: '40%', background: accent, opacity: blobOpacity * 0.7, animation: 'ab-drift 14s ease-in-out infinite' }}></div>
        </>
      )}

      {motion === 'bubbles' && (
        [
          { left: '8%',  size: 70,  dur: 9,  delay: 0 },
          { left: '22%', size: 40,  dur: 12, delay: 2 },
          { left: '38%', size: 90,  dur: 14, delay: 1 },
          { left: '55%', size: 50,  dur: 10, delay: 3 },
          { left: '70%', size: 75,  dur: 13, delay: 0.5 },
          { left: '85%', size: 35,  dur: 11, delay: 2.5 },
          { left: '48%', size: 60,  dur: 16, delay: 4 },
          { left: '92%', size: 55,  dur: 12, delay: 1.5 },
        ].map((b, i) => (
          <div key={i} className="ab-bubble" style={{
            left: b.left, width: b.size, height: b.size,
            background: accent, opacity: dark ? 0.22 : 0.18,
            animation: `ab-rise ${b.dur}s linear infinite`, animationDelay: `${b.delay}s`,
          }}></div>
        ))
      )}

      {motion === 'waves' && (
        <>
          <div className="ab-wave-sheet" style={{ width: '170%', height: '170%', top: '15%', left: '-35%', background: `linear-gradient(120deg, ${accent}, transparent 60%)`, opacity: blobOpacity * 0.8, animation: 'ab-wave 30s linear infinite' }}></div>
          <div className="ab-wave-sheet" style={{ width: '150%', height: '150%', bottom: '5%', right: '-30%', background: `linear-gradient(300deg, ${accent}, transparent 60%)`, opacity: blobOpacity * 0.6, animation: 'ab-wave 24s linear infinite reverse' }}></div>
        </>
      )}

      {motion === 'gradient' && (
        <div className="absolute inset-0" style={{
          background: `linear-gradient(-45deg, ${accent}, ${accent}55, ${accent}aa, ${accent}33)`,
          backgroundSize: '400% 400%',
          opacity: dark ? 0.55 : 0.4,
          animation: 'ab-gradient 14s ease infinite',
        }}></div>
      )}

      {motion === 'sparkles' && (
        <>
          <div className="ab-dot" style={{ boxShadow: dotShadows(60, accent, 13), animation: 'ab-twinkle 3s ease-in-out infinite' }}></div>
          <div className="ab-dot" style={{ width: 3, height: 3, boxShadow: dotShadows(30, accent, 71), animation: 'ab-twinkle 5s ease-in-out infinite' }}></div>
          <div className="ab-dot" style={{ boxShadow: dotShadows(25, dark ? '#ffffff' : accent, 49), animation: 'ab-twinkle 4s ease-in-out infinite' }}></div>
        </>
      )}

      {motion === 'pulse' && (
        <>
          <div className="absolute" style={{ width: 380, height: 380, top: '15%', left: '20%', borderRadius: '50%', background: `radial-gradient(circle, ${accent}, transparent 70%)`, opacity: blobOpacity, filter: 'blur(30px)', animation: 'ab-pulse 6s ease-in-out infinite' }}></div>
          <div className="absolute" style={{ width: 300, height: 300, bottom: '12%', right: '15%', borderRadius: '50%', background: `radial-gradient(circle, ${accent}, transparent 70%)`, opacity: blobOpacity * 0.8, filter: 'blur(30px)', animation: 'ab-pulse 8s ease-in-out infinite', animationDelay: '1.5s' }}></div>
        </>
      )}

      {motion === 'rays' && (
        <div className="absolute" style={{
          width: '200%', height: '200%', top: '-50%', left: '-50%',
          background: `repeating-conic-gradient(from 0deg at 50% 50%, ${accent} 0deg 8deg, transparent 8deg 22deg)`,
          opacity: dark ? 0.18 : 0.12,
          filter: 'blur(6px)',
          animation: 'ab-spin 40s linear infinite',
        }}></div>
      )}
    </div>
  )
}
