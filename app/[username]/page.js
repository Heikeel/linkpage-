import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfilePage from '@/components/ProfilePage'

export async function generateMetadata({ params }) {
  const { username } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('name, bio').eq('username', username).single()
  if (!profile) return { title: 'Página no encontrada' }
  return {
    title: `${profile.name || username} | Linky`,
    description: profile.bio || `Los links de ${profile.name || username}`,
  }
}

export default async function PublicProfilePage({ params }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('username', username).single()

  if (!profile) notFound()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user ?? null
  const isOwner = user?.id === profile.id

  const { data: links } = await supabase
    .from('links').select('*')
    .eq('profile_id', profile.id)
    .eq('active', true)
    .order('order_index')

  const { data: products } = await supabase
    .from('products').select('*')
    .eq('profile_id', profile.id)
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <ProfilePage
      profile={profile}
      links={links}
      isOwner={isOwner}
      username={username}
      products={products || []}
    />
  )
}
