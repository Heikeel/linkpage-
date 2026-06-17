import Link from 'next/link'

export const metadata = {
  title: 'Términos de Uso — Linky',
  description: 'Términos y condiciones de uso de la plataforma Linky, incluyendo la política de tienda y pagos.',
}

const PROHIBITED = [
  { icon: '🚫', title: 'Drogas y sustancias controladas', desc: 'Narcóticos, estupefacientes, precursores químicos o cualquier sustancia cuya venta requiera prescripción o esté prohibida por ley.' },
  { icon: '🔫', title: 'Armas y municiones', desc: 'Armas de fuego, municiones, explosivos, armas blancas ilegales o accesorios para eludir controles de seguridad.' },
  { icon: '🔞', title: 'Contenido adulto no permitido', desc: 'Material pornográfico, de explotación o que involucre menores de edad de cualquier forma.' },
  { icon: '🏴‍☠️', title: 'Productos falsificados o pirateados', desc: 'Artículos con marcas falsificadas, software pirata, cursos copiados sin derechos o cualquier violación de propiedad intelectual.' },
  { icon: '🎰', title: 'Apuestas y juegos de azar ilegales', desc: 'Servicios de apuestas, loterías o juegos de azar que no cuenten con las licencias requeridas en la jurisdicción del vendedor.' },
  { icon: '💊', title: 'Medicamentos sin prescripción', desc: 'Fármacos que requieran receta médica, suplementos con declaraciones médicas no comprobadas o productos milagro.' },
  { icon: '🐾', title: 'Animales o productos de fauna ilegal', desc: 'Especies protegidas, animales vivos sin permisos o productos derivados de fauna en peligro de extinción.' },
  { icon: '💳', title: 'Servicios financieros fraudulentos', desc: 'Esquemas ponzi, pirámides, venta de cuentas bancarias, préstamos usureros o cualquier instrumento financiero no regulado.' },
  { icon: '🕵️', title: 'Servicios de vigilancia o hacking', desc: 'Software espía, acceso no autorizado a sistemas, servicios de hackeo, venta de datos personales de terceros.' },
  { icon: '🗂️', title: 'Bienes robados o de origen ilícito', desc: 'Cualquier producto cuya procedencia sea ilegal, robado o que haya sido obtenido mediante actividades delictivas.' },
  { icon: '💬', title: 'Odio, discriminación o acoso', desc: 'Contenido que promueva violencia, odio racial, discriminación por género, religión, orientación sexual u otras características protegidas.' },
  { icon: '🃏', title: 'Monedas virtuales no reguladas o fraude', desc: 'Criptomonedas vendidas de forma engañosa, tokens sin valor real o esquemas de inversión garantizada sin respaldo legal.' },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8f7ff' }}>
      <div className="max-w-2xl mx-auto px-4 py-14">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-2xl font-bold" style={{ color: '#6c63ff' }}>Linky</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Términos de Uso</h1>
          <p className="text-sm text-gray-400">Última actualización: junio 2026</p>
        </div>

        <div className="flex flex-col gap-8 text-gray-700">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Qué es Linky</h2>
            <p className="text-sm leading-relaxed">
              Linky es una plataforma que permite a creadores de contenido e individuos crear una página pública
              de links y, opcionalmente, ofrecer productos o servicios digitales a su audiencia mediante pagos
              procesados directamente por PayPal. Linky actúa como intermediario tecnológico — no procesa pagos,
              no retiene fondos ni es parte de ninguna transacción entre vendedor y comprador.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Responsabilidades del creador (vendedor)</h2>
            <p className="text-sm leading-relaxed mb-3">
              Al activar la tienda en tu perfil de Linky, aceptas que:
            </p>
            <ul className="text-sm leading-relaxed flex flex-col gap-2">
              <li className="flex gap-2"><span className="text-purple-500 flex-shrink-0">•</span> Eres el único responsable de los productos o servicios que ofreces.</li>
              <li className="flex gap-2"><span className="text-purple-500 flex-shrink-0">•</span> Tienes los derechos legales para vender lo que publicas.</li>
              <li className="flex gap-2"><span className="text-purple-500 flex-shrink-0">•</span> Cumples con las leyes fiscales de tu país (declaración de ingresos, facturación, etc.).</li>
              <li className="flex gap-2"><span className="text-purple-500 flex-shrink-0">•</span> Entregas lo que prometes al comprador, en las condiciones descritas.</li>
              <li className="flex gap-2"><span className="text-purple-500 flex-shrink-0">•</span> Gestionas tú mismo cualquier disputa, reembolso o queja de compradores.</li>
              <li className="flex gap-2"><span className="text-purple-500 flex-shrink-0">•</span> Tu cuenta de PayPal está correctamente configurada y verificada para recibir pagos.</li>
            </ul>
          </section>

          {/* 3 — Prohibited */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-1">3. Productos y servicios prohibidos</h2>
            <p className="text-sm text-gray-500 mb-5">
              De acuerdo con la{' '}
              <a href="https://www.paypal.com/mx/legalhub/acceptableuse-full" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#6c63ff' }}>
                Política de Uso Aceptable de PayPal
              </a>{' '}
              y las leyes aplicables, está absolutamente prohibido vender a través de Linky:
            </p>
            <div className="flex flex-col gap-3">
              {PROHIBITED.map((item, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl border border-gray-200 bg-white">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Pagos y comisiones</h2>
            <p className="text-sm leading-relaxed">
              Los pagos van directamente de los compradores a la cuenta PayPal del vendedor. Linky no cobra
              comisión sobre las ventas. PayPal aplica sus propias tarifas de transacción (generalmente 2.9% + $0.30 USD).
              Linky no garantiza que PayPal procese ningún pago y no es responsable de fondos retenidos, disputas
              o cierres de cuentas de PayPal.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Suspensión de cuenta</h2>
            <p className="text-sm leading-relaxed">
              Linky se reserva el derecho de suspender o eliminar cualquier cuenta o producto que viole estos
              términos, sin previo aviso y sin obligación de reembolso de ningún plan de suscripción activo.
              Las violaciones graves pueden ser reportadas a las autoridades competentes.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Limitación de responsabilidad</h2>
            <p className="text-sm leading-relaxed">
              Linky no es parte de ninguna transacción entre vendedor y comprador. No somos responsables por
              pérdidas económicas, disputas de pago, incumplimiento de entregas, daños directos o indirectos
              derivados del uso de la plataforma o de las transacciones realizadas a través de ella.
              Toda la responsabilidad comercial y legal recae en el vendedor.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Cambios a estos términos</h2>
            <p className="text-sm leading-relaxed">
              Podemos actualizar estos términos en cualquier momento. Los cambios sustanciales serán notificados
              por email. El uso continuado de la plataforma después de la notificación implica aceptación.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Contacto</h2>
            <p className="text-sm leading-relaxed">
              Para preguntas sobre estos términos, dudas legales o reporte de violaciones, escríbenos a{' '}
              <a href="mailto:hola@linky.com" className="underline" style={{ color: '#6c63ff' }}>hola@linky.com</a>.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Volver a Linky
          </Link>
        </div>
      </div>
    </div>
  )
}
