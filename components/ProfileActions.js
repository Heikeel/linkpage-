'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProfileActions({ username, isOwner, accent }) {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
      <button
        onClick={copyLink}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all"
        style={{
          background: copied ? accent : 'rgba(255,255,255,0.6)',
          color: copied ? 'white' : '#555',
          borderColor: copied ? accent : 'rgba(0,0,0,0.1)',
        }}
      >
        <i className={`ti ${copied ? 'ti-check' : 'ti-copy'} text-sm`} aria-hidden="true"></i>
        {copied ? 'Link copiado' : 'Compartir perfil'}
      </button>

      {isOwner && (
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: accent }}
        >
          <i className="ti ti-edit text-sm" aria-hidden="true"></i>
          Editar perfil
        </Link>
      )}

      {!isOwner && (
        <a
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors"
          style={{ background: 'rgba(255,255,255,0.6)', color: '#555', borderColor: 'rgba(0,0,0,0.1)' }}
        >
          Crear mi Linky gratis →
        </a>
      )}
    </div>
  )
}
