import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return NextResponse.json({
    url: url ? url.substring(0, 40) : 'MISSING',
    keyFirst20: key ? key.substring(0, 20) : 'MISSING',
    keyLast10: key ? key.slice(-10) : 'MISSING',
    keyLength: key ? key.length : 0,
  })
}
