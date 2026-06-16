'use client'

import { PALETTES_LIGHT, PALETTES_DARK } from '@/lib/networks'

const THEMES = [
  { id: 'light',    label: 'Minimalista',      desc: 'Fondo claro · limpio' },
  { id: 'dark',     label: 'Dark mode',        desc: 'Fondo oscuro · elegante' },
  { id: 'gradient', label: 'Degradado',        desc: 'Header colorido · amigable' },
  { id: 'tornasol', label: 'Burbuja tornasol', desc: 'Iridiscente · holográfico' },
  { id: 'custom',   label: 'Personalizado',    desc: 'Elige cada color tú mismo' },
]

const FIELDS = [
  { key: 'accent',     label: 'Color acento',  hint: 'Botones y detalles' },
  { key: 'bg',         label: 'Fondo',         hint: 'Color de la página' },
  { key: 'card',       label: 'Tarjetas',      hint: 'Fondo de los links' },
  { key: 'text_color', label: 'Texto',         hint: 'Texto principal' },
  { key: 'muted',      label: 'Texto suave',   hint: 'Bio y subtítulos' },
]

export default function ColorsTab({ data, onChange }) {
  const theme = data.theme || 'light'

  function applyPalette(p) {
    onChange({ accent: p.accent, bg: p.bg, card: p.card, text_color: p.textColor, muted: p.muted })
  }

  const palettes = theme === 'dark' ? PALETTES_DARK : PALETTES_LIGHT
  const showPalettes = theme === 'light' || theme === 'gradient' || theme === 'dark'

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Diseño de página</p>
        <div className="flex flex-col gap-2">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => onChange({ theme: t.id })}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-left ${
                theme === t.id
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div>
                <p className={`text-sm font-semibold ${theme === t.id ? 'text-purple-700' : 'text-gray-700'}`}>{t.label}</p>
                <p className="text-xs text-gray-400">{t.desc}</p>
              </div>
              {theme === t.id && (
                <i className="ti ti-check text-purple-500 text-base" aria-hidden="true"></i>
              )}
            </button>
          ))}
        </div>
      </div>

      {showPalettes && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {theme === 'dark' ? 'Paletas oscuras' : 'Paletas de colores'}
          </p>
          <div className="flex gap-2 flex-wrap">
            {palettes.map(p => (
              <button
                key={p.name}
                onClick={() => applyPalette(p)}
                title={p.name}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform ring-1 ring-gray-200"
                style={{ background: p.accent }}
              />
            ))}
          </div>
        </div>
      )}

      {theme === 'tornasol' && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 text-center py-2">
            El diseño Burbuja tornasol usa colores fijos iridiscentes ✨
          </p>
        </div>
      )}

      {theme === 'custom' && (
        <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
          {FIELDS.map(f => (
            <div key={f.key} className="flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50">
              <div>
                <p className="text-sm text-gray-700">{f.label}</p>
                <p className="text-xs text-gray-400">{f.hint}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">{data[f.key] || '#000000'}</span>
                <input
                  type="color"
                  value={data[f.key] || '#000000'}
                  onChange={e => onChange({ [f.key]: e.target.value })}
                  className="w-9 h-7 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
