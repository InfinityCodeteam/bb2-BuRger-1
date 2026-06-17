import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const egp = n => `${Number(n).toLocaleString('ar-EG')} ج`
const EMPTY = { name:'', description:'', category_id:'', price_single:'', price_double:'', image_url:'', available:true, featured:false }

export default function MenuManager() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [{ data: its }, { data: cats }] = await Promise.all([
      supabase.from('menu_items').select('*, categories(name)').order('name'),
      supabase.from('categories').select('*').order('name'),
    ])
    if (its) setItems(its)
    if (cats) setCategories(cats)
  }
  useEffect(() => { load() }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  function openNew() { setEditing(null); setForm(EMPTY); setModal(true) }
  function openEdit(it) {
    setEditing(it)
    setForm({ name:it.name||'', description:it.description||'', category_id:it.category_id||'',
      price_single:it.price_single||'', price_double:it.price_double||'',
      image_url:it.image_url||'', available:it.available??true, featured:it.featured??false })
    setModal(true)
  }
  function closeModal() { setModal(false); setEditing(null); setForm(EMPTY) }

  async function uploadImage(e) {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    const path = `menu/${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('images').upload(path, file)
    if (!error) { const { data } = supabase.storage.from('images').getPublicUrl(path); set('image_url', data.publicUrl) }
    setUploading(false)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.category_id) return
    setSaving(true)
    const payload = { name:form.name.trim(), description:form.description.trim(), category_id:form.category_id,
      price_single:Number(form.price_single)||0, price_double:form.price_double?Number(form.price_double):null,
      image_url:form.image_url.trim(), available:form.available, featured:form.featured }
    editing ? await supabase.from('menu_items').update(payload).eq('id', editing.id)
            : await supabase.from('menu_items').insert(payload)
    setSaving(false); closeModal(); load()
  }

  async function handleDelete(id) {
    if (!confirm('حذف هذا المنتج؟')) return
    await supabase.from('menu_items').delete().eq('id', id); load()
  }

  async function toggleAvail(it) {
    await supabase.from('menu_items').update({ available: !it.available }).eq('id', it.id); load()
  }

  const filtered = items.filter(it => it.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-dtext font-extrabold text-2xl">المنيو</h1>
          <p className="text-dmuted text-sm">{items.length} منتج</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-black font-bold px-4 py-2 rounded-xl text-sm transition-all hover:scale-[1.02]">
          <i className="fas fa-plus" /> منتج جديد
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <i className="fas fa-search absolute top-1/2 -translate-y-1/2 right-4 text-dmuted text-sm" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="pr-10" />
      </div>

      <div className="bg-dcard border border-dborder rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dcard2 border-b border-dborder">
              {['الصورة','الاسم','القسم','السعر','الحالة',''].map(h => (
                <th key={h} className="px-4 py-3 text-right text-dmuted text-xs font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((it, idx) => (
              <tr key={it.id} className={`border-b border-dborder/50 hover:bg-white/[0.02] transition-colors ${idx === filtered.length-1 ? 'border-b-0' : ''}`}>
                <td className="px-4 py-3">
                  <img src={it.image_url||'https://via.placeholder.com/48'} alt={it.name}
                    className="w-12 h-12 object-cover rounded-xl bg-dcard2" />
                </td>
                <td className="px-4 py-3">
                  <p className="text-dtext font-semibold text-sm">{it.name}</p>
                  {it.featured && <span className="text-brand text-[10px] font-bold">★ مميز</span>}
                </td>
                <td className="px-4 py-3 text-dmuted text-xs">{it.categories?.name||it.category_id}</td>
                <td className="px-4 py-3 text-brand font-bold text-sm">{egp(it.price_single)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleAvail(it)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      it.available ? 'bg-dsuccess/15 text-dsuccess border border-dsuccess/20'
                                   : 'bg-ddanger/10 text-ddanger border border-ddanger/20'}`}>
                    {it.available ? 'متاح' : 'غير متاح'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(it)}
                      className="bg-dbg hover:bg-dborder text-dmuted hover:text-dtext border border-dborder px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                      تعديل
                    </button>
                    <button onClick={() => handleDelete(it.id)}
                      className="bg-ddanger/10 hover:bg-ddanger/20 text-ddanger border border-ddanger/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-dmuted text-sm">لا توجد منتجات</div>}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-dcard border border-dborder rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-brand font-bold text-lg mb-5">{editing ? 'تعديل المنتج' : 'منتج جديد'}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-dmuted text-sm mb-1.5">الاسم *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-dmuted text-sm mb-1.5">الوصف</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div>
                <label className="block text-dmuted text-sm mb-1.5">القسم *</label>
                <select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                  <option value="">اختر القسم</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-dmuted text-sm mb-1.5">سعر سينجل *</label>
                  <input type="number" value={form.price_single} onChange={e => set('price_single', e.target.value)} />
                </div>
                <div>
                  <label className="block text-dmuted text-sm mb-1.5">سعر دابل</label>
                  <input type="number" value={form.price_double} onChange={e => set('price_double', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-dmuted text-sm mb-1.5">رابط الصورة</label>
                <input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-dmuted text-sm mb-1.5">
                  أو رفع صورة {uploading && <span className="text-brand">(جاري الرفع...)</span>}
                </label>
                <input type="file" accept="image/*" onChange={uploadImage}
                  className="bg-transparent border-none p-0 text-dmuted text-sm cursor-pointer" style={{ width:'auto' }} />
              </div>
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="w-20 h-20 object-cover rounded-xl border border-dborder" />
              )}
              <div className="flex gap-5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-dtext">
                  <input type="checkbox" checked={form.available} onChange={e => set('available', e.target.checked)} />
                  متاح للطلب
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-dtext">
                  <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                  مميز
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} disabled={saving || uploading}
                className="flex-1 bg-brand hover:bg-brand-dark text-black font-bold py-3 rounded-xl transition-all disabled:opacity-60">
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button onClick={closeModal}
                className="flex-1 bg-dbg border border-dborder text-dmuted hover:text-dtext py-3 rounded-xl transition-all text-sm font-semibold">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
