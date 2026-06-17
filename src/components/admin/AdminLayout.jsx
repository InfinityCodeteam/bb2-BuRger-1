import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const links = [
  { to: '/admin',            label: 'لوحة التحكم', icon: 'fas fa-chart-bar',    end: true },
  { to: '/admin/categories', label: 'الأقسام',     icon: 'fas fa-tags' },
  { to: '/admin/menu',       label: 'المنيو',       icon: 'fas fa-hamburger' },
  { to: '/admin/reviews',    label: 'التقييمات',    icon: 'fas fa-star' },
  { to: '/admin/settings',   label: 'الإعدادات',   icon: 'fas fa-cog' },
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  async function logout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-dbg flex" style={{ direction: 'rtl' }}>
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-dcard2 border-l border-dborder flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-dborder">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand/10 border border-brand/30 rounded-xl flex items-center justify-center">
              <i className="fas fa-hamburger text-brand text-sm" />
            </div>
            <div>
              <p className="text-brand font-extrabold text-sm leading-none">BB2 Burger</p>
              <p className="text-dmuted text-xs">لوحة التحكم</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand/10 text-brand border border-brand/20'
                    : 'text-dmuted hover:text-dtext hover:bg-white/5'
                }`
              }>
              <i className={`${l.icon} w-4 text-center`} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-dborder">
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-dmuted hover:text-ddanger hover:bg-ddanger/5 transition-all">
            <i className="fas fa-sign-out-alt w-4 text-center" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
