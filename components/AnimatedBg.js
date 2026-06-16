'use client'

// Fondo animado reutilizable. Se posiciona absoluto dentro de un contenedor
// `relative overflow-hidden`; el contenido debe ir en una capa `relative z-10`.
// motion: 'none' | 'aurora' | 'bubbles' | 'waves'
export default function AnimatedBg({ motion, accent = '#6c63ff', dark = false }) {
  if (!motion || motion === 'none') return null

  const blobOpacity = dark ? 0.5 : 0.4
  // Tinte base constante: el color SIEMPRE está presente aunque las formas se muevan,
  // así nunca "se pierde" el color que se está animando.
  const baseTint = dark ? 0.12 : 0.08

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
        @keyframes ab-wave {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .ab-blob { position:absolute; border-radius:50%; filter: blur(55px); }
        .ab-bubble { position:absolute; bottom:0; border-radius:50%; }
        .ab-wave-sheet { position:absolute; border-radius:45%; filter: blur(40px); }
      `}</style>

      {/* Capa de color base siempre visible */}
      <div className="absolute inset-0" style={{ background: accent, opacity: baseTint }}></div>

      {motion === 'aurora' && (
        <>
          {/* Posiciones que se mantienen dentro de la vista durante todo el ciclo */}
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
    </div>
  )
}
