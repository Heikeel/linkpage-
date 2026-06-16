'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f4f3ff 0%, #ede9ff 100%)' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Iniciando sesión...</p>
      </div>
    </div>
  )
}

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function handleCallback() {
      const supabase = createClient()
      const code = searchParams.get('code')

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          console.error('exchangeCodeForSession error:', exchangeError.message, exchangeError.status)
          router.push('/login?error=' + encodeURIComponent(exchangeError.message))
          return
        }
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?error=no_user'); return }

      const { data: profile } = await supabase
        .from('profiles').select('id').eq('id', user.id).single()

      router.push(profile ? '/dashboard' : '/auth/username')
    }
    handleCallback()
  }, [router, searchParams])

  return <Spinner />
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackHandler />
    </Suspense>
  )
}
