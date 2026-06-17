import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError('البريد الإلكتروني أو كلمة المرور غير صحيحة'); return }
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-dbg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 border border-brand/30 rounded-2xl mb-4">
            <i className="fas fa-hamburger text-brand text-2xl" />
          </div>
          <h1 className="text-dtext font-extrabold text-2xl">BB2 Burger</h1>
          <p className="text-dmuted text-sm mt-1">لوحة تحكم الأدمن</p>
        </div>

        <div className="bg-dcard border border-dborder rounded-2xl p-6 shadow-2xl shadow-black/40">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-dmuted text-sm mb-1.5">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@bb2burger.com" autoComplete="email" />
            </div>
            <div>
              <label className="block text-dmuted text-sm mb-1.5">كلمة المرور</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••" autoComplete="current-password" />
            </div>
            {error && (
              <p className="bg-ddanger/10 border border-ddanger/30 text-ddanger text-sm px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-black font-bold py-3 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-60 mt-2">
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
