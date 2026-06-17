import { useState } from 'react'
import { supabase, isConfigured } from '../../lib/supabase'

export default function ReviewForm() {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    if (!isConfigured) { setSent(true); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.from('reviews').insert({
      name: name.trim(), rating, comment: comment.trim(), is_approved: false,
    })
    setLoading(false)
    if (err) { setError('حدث خطأ، حاول مرة أخرى'); return }
    setSent(true)
  }

  if (sent) return (
    <div className="bg-dcard border border-dsuccess/30 rounded-2xl p-8 text-center max-w-xl mx-auto">
      <div className="w-16 h-16 bg-dsuccess/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="fas fa-check text-dsuccess text-2xl" />
      </div>
      <h3 className="text-dtext font-bold text-xl mb-2">شكراً لتقييمك!</h3>
      <p className="text-dmuted text-sm">سيتم مراجعة تقييمك ونشره قريباً.</p>
    </div>
  )

  return (
    <div className="bg-dcard border border-dborder rounded-2xl p-6 max-w-xl mx-auto">
      <h3 className="text-brand font-bold text-xl mb-5 flex items-center gap-2">
        <i className="fas fa-star" /> أضف تقييمك
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-dmuted text-sm mb-1.5">الاسم *</label>
          <input value={name} onChange={e => setName(e.target.value)} required placeholder="اسمك" />
        </div>

        <div>
          <label className="block text-dmuted text-sm mb-2">التقييم *</label>
          <div className="flex flex-row-reverse justify-end gap-1">
            {[5,4,3,2,1].map(n => (
              <button key={n} type="button" onClick={() => setRating(n)}
                className={`text-3xl transition-all duration-150 hover:scale-125 ${n <= rating ? 'text-brand' : 'text-dborder'}`}>
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-dmuted text-sm mb-1.5">تعليق (اختياري)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="شاركنا رأيك في التجربة..." className="min-h-[90px]" />
        </div>

        {error && <p className="text-ddanger text-sm">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-brand hover:bg-brand-dark text-black font-bold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-60">
          {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
        </button>
      </form>
    </div>
  )
}
