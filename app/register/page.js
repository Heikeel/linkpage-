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

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogle() {
    setGoogleLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function checkUsername(val) {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(clean)
    if (clean.length < 3) { setUsernameAvailable(null); return }
    setCheckingUsername(true)
    const supabase = createClient()
    const { data } = await supabase.from('profiles').select('username').eq('username', clean).single()
    setUsernameAvailable(!data)
    setCheckingUsername(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (step === 1) {
      if (!usernameAvailable) { setError('Elige un nombre de usuario disponible'); return }
      setStep(2); return
    }
    setLoading(true)
    const supabase = createClient()
    const { data, error: signupError } = await supabase.auth.signUp({ email, password })
    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      name,
      bio: '',
    })
    if (profileError) {
      setError('Error al crear el perfil: ' + profileError.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f4f3ff 0%, #ede9ff 100%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold" style={{ color: '#6c63ff' }}>
            Linky
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-4">Crea tu cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">
            Paso {step} de 2 — {step === 1 ? 'Tu perfil' : 'Tu acceso'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-100">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 mb-5"
              >
                <GoogleIcon />
                {googleLoading ? 'Redirigiendo...' : 'Registrarse con Google'}
              </button>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100"></div>
                <span className="text-xs text-gray-400">o con email</span>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {step === 1 ? (
              <>
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
                        {checkingUsername ? '...' : usernameAvailable ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                  {username.length >= 3 && !checkingUsername && (
                    <p className={`text-xs mt-1 ${usernameAvailable ? 'text-green-600' : 'text-red-500'}`}>
                      {usernameAvailable ? `linky.com/${username} está disponible` : 'Ese usuario ya está tomado'}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Solo letras, números y guión bajo</p>
                </div>
              </>
            ) : (
              <>
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
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-400 hover:text-gray-600 text-left"
                >
                  ← Volver
                </button>
              </>
            )}

            <button
              type="submit"
              disabled={loading || (step === 1 && !usernameAvailable)}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: '#6c63ff' }}
            >
              {loading ? 'Creando cuenta...' : step === 1 ? 'Continuar →' : 'Crear mi cuenta'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-semibold" style={{ color: '#6c63ff' }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
