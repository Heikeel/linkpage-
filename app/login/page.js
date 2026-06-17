'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [remember, setRemember] = useState(true)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    } else {
      if (!remember) {
        // Si no quiere recordar sesión, la cerramos al cerrar pestaña
        supabase.auth.onAuthStateChange(() => {})
      }
      router.push('/dashboard')
      router.refresh()
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError('Error con Google: ' + error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f4f3ff 0%, #ede9ff 100%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold" style={{ color: '#6c63ff' }}>
            Linky
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-4">Bienvenido de vuelta</h1>
          <p className="text-gray-500 text-sm mt-1">Inicia sesión en tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-100">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 mb-5"
          >
            <GoogleIcon />
            {googleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-xs text-gray-400">o con email</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => setRemember(r => !r)}
                className="w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0"
                style={{ background: remember ? '#6c63ff' : 'transparent', borderColor: remember ? '#6c63ff' : '#d1d5db' }}
              >
                {remember && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-sm text-gray-600">Mantener sesión iniciada</span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: '#6c63ff' }}
            >
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-semibold" style={{ color: '#6c63ff' }}>
            Crear cuenta gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
