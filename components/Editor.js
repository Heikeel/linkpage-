'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PhonePreview from '@/components/PhonePreview'
import ProfileTab from '@/components/tabs/ProfileTab'
import LinksTab from '@/components/tabs/LinksTab'
import ColorsTab from '@/components/tabs/ColorsTab'
import MotionTab from '@/components/tabs/MotionTab'

const TABS = [
  { id: 'profile', label: 'Perfil',     icon: 'ti-user' },
  { id: 'links',   label: 'Links',      icon: 'ti-link' },
  { id: 'colors',  label: 'Colores',    icon: 'ti-palette' },
  { id: 'motion',  label: 'Movimiento', icon: 'ti-activity' },
]

export default function Editor({ profile: initialProfile, links: initialLinks, userId }) {
  const router = useRouter()
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState(initialProfile || {})
  const [links, setLinks] = useState(initialLinks || [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [origin, setOrigin] = useState('')

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

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8f7ff' }}>
      <aside className="w-96 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="text-lg font-bold" style={{ color: '#6c63ff' }}>
            Linky
          </div>
          <div className="flex gap-2">
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
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

        <div className="flex border-b border-gray-100 px-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all border-b-2 ${
                tab === t.id ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <i className={`ti ${t.icon} text-base`} aria-hidden="true"></i>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'profile' && <ProfileTab data={profile} onChange={updateProfile} userId={userId} />}
          {tab === 'links'   && <LinksTab links={links} onLinksChange={handleLinksChange} />}
          {tab === 'colors'  && <ColorsTab data={profile} onChange={updateProfile} />}
          {tab === 'motion'  && <MotionTab data={profile} onChange={updateProfile} />}
        </div>

        <div className="border-t border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <i className="ti ti-link text-gray-300 text-sm flex-shrink-0" aria-hidden="true"></i>
            <span className="text-xs text-gray-400 truncate">/{profile.username}</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1 flex-shrink-0">
            <i className="ti ti-logout text-sm" aria-hidden="true"></i> Salir
          </button>
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8 overflow-y-auto" style={{ background: '#ede9ff' }}>
        <div className="flex flex-col items-center gap-6">
          <PhonePreview profile={profile} links={links} />

          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-mono">{shareUrl}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(shareUrl); setSaved(true); setTimeout(() => setSaved(false), 1500) }}
              className="ml-1 text-gray-400 hover:text-purple-500 transition-colors"
              title="Copiar link"
            >
              <i className="ti ti-copy text-sm" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
