import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f4f3ff 0%, #ede9ff 100%)' }}>
      <header className="flex items-center justify-between px-8 py-5">
        <div className="text-2xl font-bold" style={{ color: '#6c63ff' }}>
          Linky
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            Iniciar sesión
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ background: '#6c63ff' }}>
            Crear cuenta gratis
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: '#ece9ff', color: '#6c63ff' }}>
          <i className="ti ti-sparkles" aria-hidden="true"></i>
          La forma más simple de compartir tus links
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight max-w-2xl">
          Todos tus links en{' '}
          <span style={{ color: '#6c63ff' }}>un solo lugar</span>
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed">
          Crea tu página personalizada con todas tus redes sociales, colores y animaciones. Compártela con un solo link.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/register" className="px-8 py-4 rounded-xl text-base font-semibold text-white shadow-lg transition-all hover:scale-105" style={{ background: '#6c63ff' }}>
            Empezar gratis →
          </Link>
          <Link href="/mike" className="px-8 py-4 rounded-xl text-base font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            Ver ejemplo
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg">
          {[
            { icon: 'ti-link', title: '46+ redes', desc: 'Todas las plataformas principales' },
            { icon: 'ti-palette', title: 'Personalizable', desc: 'Colores, animaciones y más' },
            { icon: 'ti-share', title: 'Link único', desc: 'linky.com/tuusuario' },
          ].map(f => (
            <div key={f.title} className="text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#ece9ff' }}>
                <i className={`ti ${f.icon} text-xl`} style={{ color: '#6c63ff' }} aria-hidden="true"></i>
              </div>
              <div className="font-semibold text-gray-800 text-sm">{f.title}</div>
              <div className="text-gray-400 text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-400">
        Linky · Hecho con ♥
      </footer>
    </div>
  )
}
