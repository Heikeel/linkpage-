'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PickUsernamePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setName(user.user_metadata?.full_name || user.user_metadata?.name || '')
    }
    getUser()
  }, [router])

  async function checkUsername(val) {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(clean)
    setAvailable(null)
    if (clean.length < 3) return
    setChecking(true)
    const supabase = createClient()
    const { data } = await supabase.from('profiles').select('username').eq('username', clean).single()
    setAvailable(!data)
    setChecking(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!available) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      username,
      name: name.trim(),
      bio: '',
      avatar_url: user.user_metadata?.avatar_url || null,
    })
    if (profileError) {
      setError('Error al guardar: ' + profileError.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f4f3ff 0%, #ede9ff 100%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold mb-4" style={{ color: '#6c63ff' }}>
            Linky
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Elige tu usuario</h1>
          <p className="text-gray-500 text-sm mt-1">Este será tu link único para compartir</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-100">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tu nombre</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Nombre que verán tus seguidores"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nombre de usuario</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => checkUsername(e.target.value)}
                  required
                  placeholder="tuusuario"
                  className="w-full pl-7 pr-10 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 bg-gray-50 focus:bg-white transition-colors"
                />
                {username.length >= 3 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                    {checking ? '...' : available ? '✅' : '❌'}
                  </span>
                )}
              </div>
              {username.length >= 3 && !checking && (
                <p className={`text-xs mt-1 ${available ? 'text-green-600' : 'text-red-500'}`}>
                  {available ? `linky.com/${username} está disponible` : 'Ese usuario ya está tomado'}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !available}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: '#6c63ff' }}
            >
              {loading ? 'Guardando...' : 'Crear mi Linky →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
