'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function StoreTab({ userId, paypalEmail: initialPaypalEmail, onChange }) {
  const [verified, setVerified]       = useState(null)
  const [userEmail, setUserEmail]     = useState('')
  const [resending, setResending]     = useState(false)
  const [resent, setResent]           = useState(false)
  const [products, setProducts]       = useState([])
  const [showForm, setShowForm]       = useState(false)
  const [saving, setSaving]           = useState(false)
  const [paypalEmail, setPaypalEmail] = useState(initialPaypalEmail || '')
  const [form, setForm]               = useState({ title: '', description: '', price: '' })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      setUserEmail(user?.email || '')
      setVerified(!!user?.email_confirmed_at)
      if (user?.email_confirmed_at) {
        const { data: prods } = await supabase
          .from('products')
          .select('*')
          .eq('profile_id', userId)
          .order('created_at', { ascending: false })
        setProducts(prods || [])
      }
    }
    load()
  }, [userId])

  async function resendVerification() {
    setResending(true)
    const supabase = createClient()
    await supabase.auth.resend({ type: 'signup', email: userEmail })
    setResending(false)
    setResent(true)
  }

  async function savePaypalEmail() {
    onChange({ paypal_email: paypalEmail })
  }

  async function addProduct() {
    if (!form.title || !form.price || !paypalEmail) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .insert({ profile_id: userId, title: form.title, description: form.description, price: parseFloat(form.price) })
      .select()
      .single()
    if (!error) {
      setProducts(prev => [data, ...prev])
      setForm({ title: '', description: '', price: '' })
      setShowForm(false)
    }
    setSaving(false)
  }

  async function toggleProduct(id, active) {
    const supabase = createClient()
    await supabase.from('products').update({ active: !active }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !active } : p))
  }

  async function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  if (verified === null) {
    return (
      <div className="flex items-center justify-center py-16">
        <i className="ti ti-loader-2 animate-spin text-gray-300 text-2xl" aria-hidden="true"></i>
      </div>
    )
  }

  if (!verified) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-10 px-2">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#fef3c7' }}>
          <i className="ti ti-mail text-2xl" style={{ color: '#d97706' }} aria-hidden="true"></i>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">Verifica tu correo</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Para activar la tienda necesitas confirmar tu dirección de email.
          </p>
          {userEmail && (
            <p className="text-xs text-gray-400 mt-1 font-mono">{userEmail}</p>
          )}
        </div>
        {resent ? (
          <p className="text-sm font-medium" style={{ color: '#059669' }}>
            <i className="ti ti-check mr-1" aria-hidden="true"></i>Correo enviado — revisa tu bandeja
          </p>
        ) : (
          <button
            onClick={resendVerification}
            disabled={resending}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-opacity"
            style={{ background: '#6c63ff' }}
          >
            {resending ? 'Enviando...' : 'Reenviar verificación'}
          </button>
        )}
        <p className="text-xs text-gray-400">Una vez verificado, recarga la página.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">

      {/* PayPal email */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tu email de PayPal</label>
        <p className="text-xs text-gray-400">Los pagos van directo a esta cuenta</p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="tu@paypal.com"
            value={paypalEmail}
            onChange={e => setPaypalEmail(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 bg-gray-50 focus:bg-white transition-colors"
          />
          <button
            onClick={savePaypalEmail}
            disabled={!paypalEmail}
            className="px-3 py-2.5 rounded-xl text-white text-xs font-semibold disabled:opacity-40"
            style={{ background: '#6c63ff' }}
          >
            Guardar
          </button>
        </div>
        {!paypalEmail && (
          <p className="text-xs text-amber-600 flex items-center gap-1">
            <i className="ti ti-alert-triangle text-xs" aria-hidden="true"></i>
            Agrega tu PayPal para poder crear productos
          </p>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* Add product */}
      <button
        onClick={() => setShowForm(v => !v)}
        disabled={!paypalEmail}
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed text-sm font-semibold transition-colors disabled:opacity-40"
        style={{ borderColor: '#c4b5fd', color: '#6c63ff' }}
      >
        <i className="ti ti-plus text-base" aria-hidden="true"></i>
        Agregar producto
      </button>

      {showForm && (
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nuevo producto</p>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 bg-white transition-colors"
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 bg-white resize-none transition-colors"
          />
          <div className="flex items-center gap-2">
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 bg-white transition-colors"
                min="0.01" step="0.01"
              />
            </div>
            <span className="text-xs text-gray-400">USD</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(false); setForm({ title: '', description: '', price: '' }) }}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={addProduct}
              disabled={saving || !form.title || !form.price}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-opacity"
              style={{ background: '#6c63ff' }}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Products list */}
      {products.length === 0 && !showForm && (
        <p className="text-center text-sm text-gray-400 py-4">Aún no tienes productos</p>
      )}

      {products.map(p => (
        <div key={p.id} className="flex items-center gap-3 px-3 py-3 rounded-xl border border-gray-200 bg-white">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
            <p className="text-xs text-gray-400">${Number(p.price).toFixed(2)} USD</p>
            {p.description && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{p.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {p.active ? 'Activo' : 'Oculto'}
            </span>
            <button
              onClick={() => toggleProduct(p.id, p.active)}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              title={p.active ? 'Ocultar' : 'Mostrar'}
            >
              <i className={`ti ${p.active ? 'ti-eye-off' : 'ti-eye'} text-sm`} aria-hidden="true"></i>
            </button>
            <button
              onClick={() => deleteProduct(p.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
              title="Eliminar"
            >
              <i className="ti ti-trash text-sm" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
