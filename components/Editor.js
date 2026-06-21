'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PhonePreview from '@/components/PhonePreview'
import ProfileTab from '@/components/tabs/ProfileTab'
import LinksTab from '@/components/tabs/LinksTab'
import ColorsTab from '@/components/tabs/ColorsTab'
import MotionTab from '@/components/tabs/MotionTab'
import StoreTab from '@/components/tabs/StoreTab'

const TABS = [
  { id: 'profile', label: 'Perfil',     icon: 'ti-user' },
  { id: 'links',   label: 'Links',      icon: 'ti-link' },
  { id: 'colors',  label: 'Temas',       icon: 'ti-palette' },
  { id: 'motion',  label: 'Movimiento', icon: 'ti-activity' },
  { id: 'store',   label: 'Tienda',     icon: 'ti-shopping-bag' },
]

export default function Editor({ profile: initialProfile, links: initialLinks, userId }) {
  const router = useRouter()
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState(initialProfile || {})
  const [links, setLinks] = useState(initialLinks || [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [origin, setOrigin] = useState('')
  const [darkEditor] = useState(true)

  useEffect(() => { setOrigin(window.location.origin) }, [])

  function updateProfile(changes) {
    setProfile(prev => ({ ...prev, ...changes }))
  }

  const handleLinksChange = useCallback((newLinks) => {
    setLinks(newLinks)
  }, [])

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name:          profile.name,
        bio:           profile.bio,
        avatar_url:    profile.avatar_url,
        accent:        profile.accent,
        bg:            profile.bg,
        card:          profile.card,
        text_color:    profile.text_color,
        muted:         profile.muted,
        icon_color:    profile.icon_color || null,
        bg_motion:     profile.bg_motion || 'none',
        animation:     profile.animation,
        border_radius: profile.border_radius,
        link_gap:      profile.link_gap,
        theme:         profile.theme || 'light',
        paypal_email:  profile.paypal_email || null,
      })
      .eq('id', userId)

    if (profileError) {
      alert('Error al guardar perfil: ' + profileError.message)
      setSaving(false)
      return
    }

    await supabase.from('links').delete().eq('profile_id', userId)
    if (links.length > 0) {
      const { error: linksError } = await supabase.from('links').insert(
        links.map((l, i) => ({
          profile_id:  userId,
          network_id:  l.network_id,
          name:        l.name,
          url:         l.url || '',
          icon:        l.icon,
          color:       l.color,
          order_index: i,
          active:      true,
        }))
      )
      if (linksError) {
        alert('Error al guardar links: ' + linksError.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    router.refresh()
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const shareUrl = `${origin}/${profile.username}`
  const D = darkEditor

  return (
    <>
      {D && (
        <style>{`
          .editor-dark aside .bg-white       { background: #1e1e2a !important; }
          .editor-dark aside .bg-gray-50     { background: #232330 !important; }
          .editor-dark aside .bg-gray-100    { background: #2a2a38 !important; }
          .editor-dark aside .border-gray-100 { border-color: rgba(255,255,255,0.06) !important; }
          .editor-dark aside .border-gray-200 { border-color: rgba(255,255,255,0.1) !important; }
          .editor-dark aside .ring-gray-200  { --tw-ring-color: rgba(255,255,255,0.1) !important; }
          .editor-dark aside .text-gray-900  { color: #e8eaf6 !important; }
          .editor-dark aside .text-gray-800  { color: #d0d4e8 !important; }
          .editor-dark aside .text-gray-700  { color: #c4c8e0 !important; }
          .editor-dark aside .text-gray-600  { color: #a4a8c4 !important; }
          .editor-dark aside .text-gray-500  { color: #8488a8 !important; }
          .editor-dark aside .text-gray-400  { color: #64688a !important; }
          .editor-dark aside .hover\:bg-gray-50:hover  { background: #2a2a38 !important; }
          .editor-dark aside .hover\:bg-gray-100:hover { background: #303044 !important; }
          .editor-dark aside input[type=text],
          .editor-dark aside input[type=url],
          .editor-dark aside textarea {
            background: #232330 !important;
            color: #d0d4e8 !important;
            border-color: rgba(255,255,255,0.1) !important;
          }
          .editor-dark aside input::placeholder,
          .editor-dark aside textarea::placeholder { color: rgba(180,185,220,0.35) !important; }
          .editor-dark aside .shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.5) !important; }
        `}</style>
      )}

      <style>{`
        @media (max-width: 768px) {
          .editor-aside   { width: 100% !important; }
          .editor-preview { display: none !important; }
        }
      `}</style>

      <div className={`flex h-screen overflow-hidden${D ? ' editor-dark' : ''}`} style={{ background: D ? '#0f0f13' : '#f8f7ff' }}>
        <aside className="editor-aside w-96 flex-shrink-0 flex flex-col h-full" style={{ background: D ? '#1a1a22' : '#ffffff', borderRight: `1px solid ${D ? 'rgba(255,255,255,0.07)' : '#f3f4f6'}` }}>

          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${D ? 'rgba(255,255,255,0.07)' : '#f3f4f6'}` }}>
            <div className="text-lg font-bold" style={{ color: '#6c63ff' }}>Linky</div>
            <div className="flex gap-2 items-center">
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                style={{ color: D ? 'rgba(255,255,255,0.55)' : '#6b7280', border: `1px solid ${D ? 'rgba(255,255,255,0.12)' : '#e5e7eb'}` }}
              >
                <i className="ti ti-external-link text-sm" aria-hidden="true"></i> Ver
              </a>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all disabled:opacity-60 flex items-center gap-1"
                style={{ background: saved ? '#00b894' : '#6c63ff' }}
              >
                {saving ? (
                  <><i className="ti ti-loader-2 animate-spin text-sm" aria-hidden="true"></i> Guardando</>
                ) : saved ? (
                  <><i className="ti ti-check text-sm" aria-hidden="true"></i> Guardado</>
                ) : (
                  <><i className="ti ti-device-floppy text-sm" aria-hidden="true"></i> Guardar</>
                )}
              </button>
            </div>
          </div>

          <div className="flex px-2" style={{ borderBottom: `1px solid ${D ? 'rgba(255,255,255,0.07)' : '#f3f4f6'}` }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all border-b-2 ${
                  tab === t.id
                    ? 'border-purple-500 text-purple-500'
                    : `border-transparent ${D ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`
                }`}
              >
                <i className={`ti ${t.icon} text-base`} aria-hidden="true"></i>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {tab === 'profile'    && <ProfileTab    data={profile} onChange={updateProfile} userId={userId} />}
            {tab === 'links'      && <LinksTab      links={links} onLinksChange={handleLinksChange} />}
            {tab === 'colors'     && <ColorsTab     data={profile} onChange={updateProfile} />}
            {tab === 'motion'  && <MotionTab  data={profile} onChange={updateProfile} />}
            {tab === 'store'   && <StoreTab   userId={userId} paypalEmail={profile.paypal_email} onChange={updateProfile} />}
          </div>

          <div className="p-4 flex items-center justify-between" style={{ borderTop: `1px solid ${D ? 'rgba(255,255,255,0.07)' : '#f3f4f6'}` }}>
            <div className="flex items-center gap-2 min-w-0">
              <i className="ti ti-link text-sm flex-shrink-0" style={{ color: D ? 'rgba(255,255,255,0.18)' : '#d1d5db' }} aria-hidden="true"></i>
              <span className="text-xs truncate" style={{ color: D ? 'rgba(255,255,255,0.32)' : '#9ca3af' }}>/{profile.username}</span>
            </div>
            <button onClick={handleLogout} className="text-xs flex items-center gap-1 flex-shrink-0 transition-colors hover:text-red-400" style={{ color: D ? 'rgba(255,255,255,0.32)' : '#9ca3af' }}>
              <i className="ti ti-logout text-sm" aria-hidden="true"></i> Salir
            </button>
          </div>
        </aside>

        <main className="editor-preview flex-1 flex items-center justify-center p-8 overflow-y-auto" style={{ background: D ? '#13131a' : '#ede9ff' }}>
          <div className="flex flex-col items-center gap-6">
            <PhonePreview profile={profile} links={links} />

            <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 border shadow-sm"
              style={{ background: D ? '#1a1a22' : '#ffffff', borderColor: D ? 'rgba(255,255,255,0.08)' : '#e5e7eb' }}>
              <span className="text-xs font-mono" style={{ color: D ? 'rgba(255,255,255,0.4)' : '#9ca3af' }}>{shareUrl}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(shareUrl); setSaved(true); setTimeout(() => setSaved(false), 1500) }}
                className="ml-1 hover:text-purple-500 transition-colors"
                style={{ color: D ? 'rgba(255,255,255,0.28)' : '#9ca3af' }}
                title="Copiar link"
              >
                <i className="ti ti-copy text-sm" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
