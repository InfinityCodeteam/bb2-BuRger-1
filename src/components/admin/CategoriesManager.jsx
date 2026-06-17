import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function CategoriesManager() {
  const [categories, setCategories] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
  }
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setName(''); setModal(true) }
  function openEdit(cat) { setEditing(cat); setName(cat.name); setModal(true) }
  function closeModal() { setModal(false); setEditing(null); setName('') }

  async function handleSave() {
    if (!name.trim()) return
    setLoading(true)
    editing
      ? await supabase.from('categories').update({ name: name.trim() }).eq('id', editing.id)
      : await supabase.from('categories').insert({ name: name.trim() })
    setLoading(false); closeModal(); load()
  }

  async function handleDelete(id) {
    if (!confirm('حذف هذا القسم؟')) return
    await supabase.from('categories').delete().eq('id', id); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-dtext font-extrabold text-2xl">الأقسام</h1>
          <p className="text-dmuted text-sm">{categories.length} قسم</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-black font-bold px-4 py-2 rounded-xl text-sm transition-all hover:scale-[1.02]">
          <i className="fas fa-plus" /> قسم جديد
        </button>
      </div>

      <div className="bg-dcard border border-dborder rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dcard2 border-b border-dborder">
              <th className="px-5 py-3 text-right text-dmuted text-xs font-semibold">الاسم</th>
              <th className="px-5 py-3 text-right text-dmuted text-xs font-semibold">المعرف</th>
              <th className="px-5 py-3 text-right text-dmuted text-xs font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={cat.id} className={`border-b border-dborder/50 hover:bg-white/[0.02] transition-colors ${idx === categories.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-5 py-4 text-dtext font-semibold text-sm">{cat.name}</td>
                <td className="px-5 py-4">
                  <code className="bg-dbg text-dmuted text-xs px-2 py-1 rounded-lg">{cat.id}</code>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(cat)}
                      className="bg-dbg hover:bg-dborder text-dmuted hover:text-dtext border border-dborder px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                      تعديل
                    </button>
                    <button onClick={() => handleDelete(cat.id)}
                      className="bg-ddanger/10 hover:bg-ddanger/20 text-ddanger border border-ddanger/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center py-12 text-dmuted text-sm">لا توجد أقسام</div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-dcard border border-dborder rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-brand font-bold text-lg mb-4">
              {editing ? 'تعديل القسم' : 'قسم جديد'}
            </h3>
            <label className="block mb-4">
              <span className="block text-dmuted text-sm mb-1.5">اسم القسم *</span>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="مثال: برجر ع الفحم" />
            </label>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={loading}
                className="flex-1 bg-brand hover:bg-brand-dark text-black font-bold py-2.5 rounded-xl transition-all disabled:opacity-60">
                {loading ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button onClick={closeModal}
                className="flex-1 bg-dbg border border-dborder text-dmuted hover:text-dtext py-2.5 rounded-xl transition-all text-sm font-semibold">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
