import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const STAT_CARDS = [
  { key: 'items',      label: 'عناصر المنيو',    icon: 'fas fa-hamburger',   color: 'text-brand bg-brand/10 border-brand/20' },
  { key: 'categories', label: 'الأقسام',          icon: 'fas fa-tags',        color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  { key: 'reviews',    label: 'تقييمات معتمدة',   icon: 'fas fa-star',        color: 'text-dsuccess bg-dsuccess/10 border-dsuccess/20' },
  { key: 'pending',    label: 'تقييمات معلقة',    icon: 'fas fa-clock',       color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
]

export default function DashboardOverview() {
  const [stats, setStats] = useState({ items: 0, categories: 0, reviews: 0, pending: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('menu_items').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', true),
      supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
    ]).then(([a, b, c, d]) => setStats({ items: a.count||0, categories: b.count||0, reviews: c.count||0, pending: d.count||0 }))
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-dtext font-extrabold text-2xl">لوحة التحكم</h1>
          <p className="text-dmuted text-sm mt-0.5">مرحباً بك في إدارة BB2 Burger</p>
        </div>
        <a href="/" target="_blank"
          className="flex items-center gap-2 bg-brand/10 border border-brand/30 text-brand px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand/20 transition-colors">
          <i className="fas fa-external-link-alt text-xs" /> عرض الموقع
        </a>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(card => (
          <div key={card.key} className="bg-dcard border border-dborder rounded-2xl p-5 hover:border-dborder/80 transition-colors">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${card.color}`}>
              <i className={`${card.icon} text-sm`} />
            </div>
            <p className="text-3xl font-extrabold text-dtext mb-1">{stats[card.key]}</p>
            <p className="text-dmuted text-xs">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-dcard border border-dborder rounded-2xl p-5">
        <h2 className="text-dtext font-bold mb-4">روابط سريعة</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/admin/menu',       label: 'إضافة منتج',     icon: 'fas fa-plus-circle' },
            { to: '/admin/categories', label: 'إدارة الأقسام',  icon: 'fas fa-tags' },
            { to: '/admin/reviews',    label: 'التقييمات',       icon: 'fas fa-star' },
            { to: '/admin/settings',   label: 'الإعدادات',       icon: 'fas fa-cog' },
          ].map(item => (
            <a key={item.to} href={item.to}
              className="flex flex-col items-center gap-2 p-4 bg-dbg border border-dborder rounded-xl hover:border-brand/30 hover:bg-brand/5 transition-all text-center group">
              <i className={`${item.icon} text-xl text-dmuted group-hover:text-brand transition-colors`} />
              <span className="text-dmuted group-hover:text-dtext text-xs font-semibold transition-colors">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
