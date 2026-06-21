'use client'

import { useState } from 'react'
import NetworkModal from '@/components/NetworkModal'

// Tipos de contenido manual (además de redes sociales)
const CUSTOM_TYPES = [
  { id: 'custom',   network_id: 'custom',   label: 'Link',      icon: 'ti-link',           color: '#6c63ff' },
  { id: 'video',    network_id: 'video',    label: 'Video',     icon: 'ti-brand-youtube',  color: '#FF0000' },
  { id: 'document', network_id: 'document', label: 'Documento', icon: 'ti-file-type-pdf',  color: '#E2574C' },
]

// Orden y etiqueta de las secciones
const SECTIONS = [
  { key: 'social',    label: 'Redes sociales', icon: 'ti-users' },
  { key: 'video',     label: 'Videos',         icon: 'ti-brand-youtube' },
  { key: 'document',  label: 'Documentos',     icon: 'ti-file-type-pdf' },
  { key: 'other',     label: 'Otros',          icon: 'ti-link' },
]

function sectionOf(link) {
  if (link.network_id === 'video')    return 'video'
  if (link.network_id === 'document') return 'document'
  if (link.network_id === 'custom')   return 'other'
  return 'social'
}

function LinkRow({ link, idx, onUpdate, onRemove, onDragStart, onDragOver, onDragEnd }) {
  const [url, setUrl] = useState(link.url || '')
  return (
    <div
      draggable
      onDragStart={() => onDragStart(idx)}
      onDragOver={e => onDragOver(e, idx)}
      onDragEnd={onDragEnd}
      className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-xl bg-gray-50 cursor-grab active:cursor-grabbing"
    >
      <i className="ti ti-grip-vertical text-gray-300 text-base flex-shrink-0" aria-hidden="true"></i>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: link.color + '22', color: link.color }}>
        <i className={`ti ${link.icon} text-base`} aria-hidden="true"></i>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-700">{link.name}</p>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onBlur={() => onUpdate(link.id, url)}
          placeholder="https://..."
          onClick={e => e.stopPropagation()}
          className="w-full text-xs text-gray-400 bg-transparent outline-none placeholder:text-gray-300 mt-0.5"
        />
      </div>
      <button onClick={() => onRemove(link.id)} className="p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0">
        <i className="ti ti-x text-sm" aria-hidden="true"></i>
      </button>
    </div>
  )
}

export default function LinksTab({ links, onLinksChange }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customType, setCustomType] = useState('custom')
  const [customName, setCustomName] = useState('')
  const [customUrl, setCustomUrl] = useState('')
  const [dragIdx, setDragIdx] = useState(null)

  function addNetwork(net) {
    if (links.find(l => l.network_id === net.id)) return
    onLinksChange([...links, {
      id: `tmp_${Date.now()}`,
      network_id: net.id,
      name: net.name,
      icon: net.icon,
      color: net.color,
      url: '',
      order_index: links.length,
      active: true,
    }])
  }

  function removeLink(id) {
    onLinksChange(links.filter(l => l.id !== id))
  }

  function updateUrl(id, url) {
    onLinksChange(links.map(l => l.id === id ? { ...l, url } : l))
  }

  function openCustomForm(type) {
    setCustomType(type)
    setCustomName('')
    setCustomUrl('')
    setShowCustomForm(true)
  }

  function addCustomLink() {
    if (!customName.trim()) return
    const t = CUSTOM_TYPES.find(c => c.id === customType) || CUSTOM_TYPES[0]
    onLinksChange([...links, {
      id: `tmp_${Date.now()}`,
      network_id: t.network_id,
      name: customName.trim(),
      icon: t.icon,
      color: t.color,
      url: customUrl.trim(),
      order_index: links.length,
      active: true,
    }])
    setShowCustomForm(false)
    setCustomName('')
    setCustomUrl('')
  }

  function onDragStart(idx) { setDragIdx(idx) }
  function onDragOver(e, idx) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const reordered = [...links]
    const [moved] = reordered.splice(dragIdx, 1)
    reordered.splice(idx, 0, moved)
    onLinksChange(reordered)
    setDragIdx(idx)
  }

  const activeType = CUSTOM_TYPES.find(c => c.id === customType) || CUSTOM_TYPES[0]

  // Agrupar conservando el índice real dentro del array plano (para el drag)
  const grouped = SECTIONS.map(sec => ({
    ...sec,
    items: links.map((link, idx) => ({ link, idx })).filter(({ link }) => sectionOf(link) === sec.key),
  })).filter(g => g.items.length > 0)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-400">Arrastra para reordenar · Escribe la URL de cada elemento</p>

      {grouped.map(group => (
        <div key={group.key} className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <i className={`ti ${group.icon} text-sm`} aria-hidden="true"></i>
            {group.label}
            <span className="text-gray-300 font-normal">· {group.items.length}</span>
          </p>
          {group.items.map(({ link, idx }) => (
            <LinkRow key={link.id} link={link} idx={idx}
              onUpdate={updateUrl}
              onRemove={removeLink}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={() => setDragIdx(null)}
            />
          ))}
        </div>
      ))}

      {links.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">Aún no has añadido nada</p>
      )}

      {showCustomForm && (
        <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {CUSTOM_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setCustomType(t.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all ${
                  customType === t.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <i className={`ti ${t.icon} text-lg`} style={{ color: t.color }} aria-hidden="true"></i>
                <span className={`text-xs font-medium ${customType === t.id ? 'text-purple-600' : 'text-gray-500'}`}>{t.label}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder={
                customType === 'video' ? 'Título (ej: Mi último video)'
                : customType === 'document' ? 'Título (ej: Mi CV en PDF)'
                : 'Nombre (ej: Mi Blog)'
              }
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-purple-400 bg-white"
            />
            <input
              type="url"
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              placeholder={
                customType === 'video' ? 'https://youtube.com/...'
                : customType === 'document' ? 'https://... (enlace al PDF)'
                : 'https://...'
              }
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-purple-400 bg-white"
            />
            <div className="flex gap-2">
              <button onClick={addCustomLink} className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5" style={{ background: activeType.color }}>
                <i className={`ti ${activeType.icon} text-sm`} aria-hidden="true"></i> Añadir {activeType.label.toLowerCase()}
              </button>
              <button onClick={() => setShowCustomForm(false)} className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-100">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setModalOpen(true)}
        className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
        style={{ color: '#6c63ff' }}
      >
        <i className="ti ti-plus" aria-hidden="true"></i> Añadir red social
      </button>

      <div className="grid grid-cols-3 gap-2">
        {CUSTOM_TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => openCustomForm(t.id)}
            className="py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-1"
          >
            <i className={`ti ${t.icon} text-base`} style={{ color: t.color }} aria-hidden="true"></i>
            {t.label}
          </button>
        ))}
      </div>

      <NetworkModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addNetwork}
        activeIds={links.map(l => l.network_id)}
      />
    </div>
  )
}
