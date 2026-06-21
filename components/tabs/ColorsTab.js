'use client'

import { useState } from 'react'
import { PALETTES_LIGHT, PALETTES_DARK, NEUTRALS } from '@/lib/networks'
import { adjustLightness } from '@/lib/colorUtils'

const THEMES = [
  { id: 'light',    label: 'Minimalista',      desc: 'Fondo claro · limpio' },
  { id: 'dark',     label: 'Dark mode',        desc: 'Fondo oscuro · elegante' },
  { id: 'gradient', label: 'Degradado',        desc: 'Header colorido · amigable' },
  { id: 'custom',   label: 'Personalizado',    desc: 'Elige cada color tú mismo' },
]

const ANIMATED_THEMES = [
  { id: 'tornasol', label: 'Burbuja tornasol', desc: 'Iridiscente · holográfico' },
  { id: 'cosmos',   label: 'Galaxia',          desc: 'Nebulosa · estrellas' },
  { id: 'cometas',  label: 'Meteoros',         desc: 'Cielo nocturno · cometas' },
  { id: 'sunset',   label: 'Atardecer',        desc: 'Cálido · olas al caer el sol' },
  { id: 'olas',     label: 'Olas',             desc: 'Océano profundo · burbujas' },
]

const FIELDS = [
  { key: 'accent',     label: 'Color acento',  hint: 'Botones y detalles' },
  { key: 'bg',         label: 'Fondo',         hint: 'Color de la página' },
  { key: 'card',       label: 'Tarjetas',      hint: 'Fondo de los links' },
  { key: 'text_color', label: 'Texto',         hint: 'Texto principal' },
  { key: 'muted',      label: 'Texto suave',   hint: 'Bio y subtítulos' },
]

const ANIMATED_IDS = ['stars', 'desert', 'aurora', 'ocean', 'sakura', 'nebulosa', 'glaciar', 'montana', 'zen', 'tormenta', 'marte', 'loto', ...ANIMATED_THEMES.map(t => t.id)]

const BG_MOTIONS = [
  { id: 'aurora',   label: 'Aurora',    icon: 'ti-sparkles' },
  { id: 'bubbles',  label: 'Burbujas',  icon: 'ti-circles' },
  { id: 'waves',    label: 'Ondas',     icon: 'ti-ripple' },
  { id: 'gradient', label: 'Degradado', icon: 'ti-gradienter' },
  { id: 'sparkles', label: 'Destellos', icon: 'ti-stars' },
  { id: 'pulse',    label: 'Pulso',     icon: 'ti-bolt' },
  { id: 'rays',     label: 'Rayos',     icon: 'ti-sun' },
]

export default function ColorsTab({ data, onChange }) {
  const theme = data.theme || 'light'
  const [brightness, setBrightness] = useState(0)
  const [basePalette, setBasePalette] = useState(null)
  const [hasPicked, setHasPicked] = useState(false)

  const palettes = theme === 'dark' ? PALETTES_DARK : PALETTES_LIGHT
  const isBaseTheme = theme === 'light' || theme === 'gradient' || theme === 'dark' || theme === 'custom'
  const showPalettes = hasPicked && isBaseTheme
  const iconOverride = !!data.icon_color
  const isAnimatedTheme = ANIMATED_IDS.includes(theme)
  const bgMotion = data.bg_motion || 'none'
  const motionOn = bgMotion !== 'none'

  function selectTheme(id) {
    onChange({ theme: id })
    setBasePalette(null)
    setBrightness(0)
    setHasPicked(true)
  }

  function applyPalette(p) {
    setBasePalette(p)
    setBrightness(0)
    onChange({ accent: p.accent, bg: p.bg, card: p.card, text_color: p.textColor, muted: p.muted })
  }

  // La intensidad solo cambia el FONDO, nunca el color de los botones/tarjetas
  function handleBrightness(val) {
    setBrightness(val)
    if (!basePalette) return
    onChange({ bg: adjustLightness(basePalette.bg, val) })
  }

  function ThemeButton({ t }) {
    return (
      <button
        onClick={() => selectTheme(t.id)}
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
        {theme === t.id && <i className="ti ti-check text-purple-500 text-base" aria-hidden="true"></i>}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Diseño de página</p>
        <div className="flex flex-col gap-2">
          {THEMES.map(t => <ThemeButton key={t.id} t={t} />)}
        </div>
      </div>

      {showPalettes && (
        <div className="flex flex-col gap-4">
          <div>
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

          {basePalette && (
            <div className="bg-gray-50 rounded-xl px-3 py-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Intensidad del fondo</p>
                <span className="text-xs text-gray-400 font-mono">
                  {brightness > 0 ? `+${brightness}` : brightness}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Oscuro</span>
                <input
                  type="range"
                  min={-40}
                  max={40}
                  step={1}
                  value={brightness}
                  onChange={e => handleBrightness(parseInt(e.target.value))}
                  className="flex-1 accent-purple-500"
                />
                <span className="text-xs text-gray-400">Claro</span>
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Color del texto</p>
            <p className="text-xs text-gray-400 mb-3">Tonos neutros para títulos y links</p>
            <div className="flex gap-2 flex-wrap">
              {NEUTRALS.map(n => (
                <button
                  key={n.value}
                  onClick={() => onChange({ text_color: n.value })}
                  title={n.name}
                  className={`w-8 h-8 rounded-full border-2 shadow-sm hover:scale-110 transition-transform ring-1 ring-gray-200 ${
                    data.text_color === n.value ? 'border-purple-500 ring-purple-300' : 'border-white'
                  }`}
                  style={{ background: n.value }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Color de los logos</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-gray-400">{iconOverride ? 'Activado' : 'Por marca'}</span>
                <button
                  onClick={() => onChange({ icon_color: iconOverride ? null : '#6b7280' })}
                  className={`relative w-9 h-5 rounded-full transition-colors ${iconOverride ? 'bg-purple-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${iconOverride ? 'translate-x-4' : ''}`} />
                </button>
              </label>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              {iconOverride ? 'Todos los logos en un mismo color' : 'Cada red social usa su color original'}
            </p>
            {iconOverride && (
              <div className="flex gap-2 flex-wrap">
                {NEUTRALS.map(n => (
                  <button
                    key={n.value}
                    onClick={() => onChange({ icon_color: n.value })}
                    title={n.name}
                    className={`w-8 h-8 rounded-full border-2 shadow-sm hover:scale-110 transition-transform ring-1 ring-gray-200 ${
                      data.icon_color === n.value ? 'border-purple-500 ring-purple-300' : 'border-white'
                    }`}
                    style={{ background: n.value }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Animados</p>
        <div className="flex flex-col gap-2">
          {ANIMATED_THEMES.map(t => <ThemeButton key={t.id} t={t} />)}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Paisajes</p>
        <div className="flex flex-col gap-2">
          <ThemeButton t={{ id: 'montana',  label: 'Montaña',   desc: 'Picos nevados · atardecer dorado' }} />
          <ThemeButton t={{ id: 'marte',    label: 'Marte',     desc: 'Desierto rojo · cielo carmesí' }} />
          <ThemeButton t={{ id: 'aurora',   label: 'Aurora',    desc: 'Luces del norte · lago' }} />
          <ThemeButton t={{ id: 'desert',   label: 'Desierto',  desc: 'Dunas al atardecer · cálido' }} />
          <ThemeButton t={{ id: 'tormenta', label: 'Tormenta',  desc: 'Océano oscuro · relámpago lejano' }} />
          <ThemeButton t={{ id: 'glaciar',  label: 'Glaciar',   desc: 'Hielo azul · reflejo en agua' }} />
          <ThemeButton t={{ id: 'ocean',    label: 'Océano',    desc: 'Profundidad marina · bioluminiscencia' }} />
          <ThemeButton t={{ id: 'stars',    label: 'Estrellas', desc: 'Cielo estrellado · noche real' }} />
          <ThemeButton t={{ id: 'zen',      label: 'Zen',       desc: 'Jardín japonés · amanecer' }} />
          <ThemeButton t={{ id: 'loto',     label: 'Loto',      desc: 'Flor rosa · lago neblinoso' }} />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Live</p>
        <div className="flex flex-col gap-2">
          <ThemeButton t={{ id: 'sakura',   label: 'Sakura',   desc: 'Cerezos japoneses · video al vivo' }} />
          <ThemeButton t={{ id: 'nebulosa', label: 'Nebulosa', desc: 'Galaxia morada · espacio profundo' }} />
        </div>
      </div>

      {ANIMATED_IDS.includes(theme) && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 text-center py-2">
            Este diseño usa colores fijos animados
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

      {/* Fondo animado (solo en temas estáticos; los de "Con movimiento" ya se mueven) */}
      {!isAnimatedTheme && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fondo animado</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-gray-400">{motionOn ? 'Activado' : 'Desactivado'}</span>
              <button
                onClick={() => onChange({ bg_motion: motionOn ? 'none' : 'aurora' })}
                className={`relative w-9 h-5 rounded-full transition-colors ${motionOn ? 'bg-purple-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${motionOn ? 'translate-x-4' : ''}`} />
              </button>
            </label>
          </div>
          <p className="text-xs text-gray-400 mb-3">Movimiento real detrás de tus links</p>
          {motionOn && (
            <div className="grid grid-cols-3 gap-2">
              {BG_MOTIONS.map(m => (
                <button
                  key={m.id}
                  onClick={() => onChange({ bg_motion: m.id })}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                    bgMotion === m.id
                      ? 'border-purple-400 bg-purple-50 text-purple-600'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <i className={`ti ${m.icon} text-xl`} aria-hidden="true"></i>
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
