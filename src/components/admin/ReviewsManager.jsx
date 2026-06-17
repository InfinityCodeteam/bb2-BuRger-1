import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= n ? 'text-brand text-sm' : 'text-dborder text-sm'}>★</span>
      ))}
    </div>
  )
}

const TABS = [
  { key: 'pending',  label: 'في الانتظار', color: 'text-yellow-400' },
  { key: 'approved', label: 'معتمدة',       color: 'text-dsuccess' },
  { key: 'all',      label: 'الكل',         color: 'text-dmuted' },
]

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('pending')

  const load = async () => {
    const q = supabase.from('reviews').select('*').order('created_at', { ascending: false })
    const { data } = filter === 'all' ? await q : await q.eq('is_approved', filter === 'approved')
    if (data) setReviews(data)
  }
  useEffect(() => { load() }, [filter])

  async function approve(id) { await supabase.from('reviews').update({ is_approved: true }).eq('id', id); load() }
  async function reject(id) { if (!confirm('حذف هذا التقييم؟')) return; await supabase.from('reviews').delete().eq('id', id); load() }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-dtext font-extrabold text-2xl mb-1">التقييمات</h1>
        <p className="text-dmuted text-sm">{reviews.length} تقييم</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-all ${
              filter === t.key
                ? 'bg-brand text-black border-brand'
                : 'border-dborder text-dmuted hover:border-brand hover:text-brand'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-16 text-dmuted">
          <i className="fas fa-star text-3xl mb-3 block" />
          لا توجد تقييمات
        </div>
      )}

      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-dcard border border-dborder rounded-2xl p-4 hover:border-dborder/80 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-dtext font-bold text-sm">{r.name}</span>
                  <Stars n={r.rating} />
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    r.is_approved
                      ? 'bg-dsuccess/10 text-dsuccess border border-dsuccess/20'
                      : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                  }`}>
                    {r.is_approved ? 'معتمد' : 'في الانتظار'}
                  </span>
                </div>
                {r.comment && <p className="text-dmuted text-sm">{r.comment}</p>}
                <p className="text-dmuted text-xs mt-2">{new Date(r.created_at).toLocaleDateString('ar-EG')}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!r.is_approved && (
                  <button onClick={() => approve(r.id)}
                    className="bg-dsuccess/10 hover:bg-dsuccess/20 text-dsuccess border border-dsuccess/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                    اعتماد
                  </button>
                )}
                <button onClick={() => reject(r.id)}
                  className="bg-ddanger/10 hover:bg-ddanger/20 text-ddanger border border-ddanger/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
