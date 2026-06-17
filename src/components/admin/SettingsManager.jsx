import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const FIELDS = [
  { key: 'brand',           label: 'اسم المطعم',                   type: 'text',     icon: 'fas fa-store' },
  { key: 'whatsapp_number', label: 'رقم واتساب (بدون +)',           type: 'text',     icon: 'fab fa-whatsapp',  placeholder: '201006473229' },
  { key: 'address',         label: 'العنوان',                      type: 'textarea', icon: 'fas fa-map-marker-alt' },
  { key: 'hours',           label: 'ساعات العمل',                  type: 'text',     icon: 'fas fa-clock',     placeholder: '12 ظهراً - 2 صباحاً' },
  { key: 'logo',            label: 'رابط اللوجو',                  type: 'text',     icon: 'fas fa-image' },
  { key: 'facebook',        label: 'رابط فيسبوك',                  type: 'text',     icon: 'fab fa-facebook' },
  { key: 'instagram',       label: 'رابط إنستجرام',               type: 'text',     icon: 'fab fa-instagram' },
  { key: 'banners',         label: 'روابط البانر (JSON Array)',    type: 'textarea', icon: 'fas fa-images',    placeholder: '["https://...", "https://..."]' },
]

export default function SettingsManager() {
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('key,value').then(({ data }) => {
      if (data) { const o = {}; data.forEach(r => { o[r.key] = r.value || '' }); setValues(o) }
    })
  }, [])

  const setV = (k, v) => setValues(p => ({ ...p, [k]: v }))

  async function uploadLogo(e) {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    const path = `logos/${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('images').upload(path, file)
    if (!error) { const { data } = supabase.storage.from('images').getPublicUrl(path); setV('logo', data.publicUrl) }
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('settings').upsert(
      Object.entries(values).map(([key, value]) => ({ key, value: value||'' })),
      { onConflict: 'key' }
    )
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-dtext font-extrabold text-2xl">الإعدادات</h1>
          <p className="text-dmuted text-sm">إعدادات المطعم والموقع</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className={`flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-60 ${
            saved ? 'bg-dsuccess text-white' : 'bg-brand hover:bg-brand-dark text-black hover:scale-[1.02]'
          }`}>
          <i className={`fas ${saved ? 'fa-check' : 'fa-save'}`} />
          {saving ? 'جاري الحفظ...' : saved ? 'تم الحفظ' : 'حفظ التغييرات'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {FIELDS.map(field => (
          <div key={field.key} className={`bg-dcard border border-dborder rounded-2xl p-4 ${field.type === 'textarea' ? 'lg:col-span-2' : ''}`}>
            <label className="block">
              <div className="flex items-center gap-2 mb-2">
                <i className={`${field.icon} text-brand text-sm w-4 text-center`} />
                <span className="text-dtext font-semibold text-sm">{field.label}</span>
              </div>
              {field.type === 'textarea' ? (
                <textarea value={values[field.key]||''} onChange={e => setV(field.key, e.target.value)}
                  placeholder={field.placeholder} />
              ) : (
                <input type="text" value={values[field.key]||''} onChange={e => setV(field.key, e.target.value)}
                  placeholder={field.placeholder} />
              )}
            </label>
            {field.key === 'logo' && (
              <div className="mt-3 flex items-center gap-3">
                <label className="cursor-pointer bg-dbg border border-dborder text-dmuted hover:text-brand text-xs px-3 py-2 rounded-lg transition-colors font-semibold">
                  <i className="fas fa-upload ml-1" />
                  {uploading ? 'جاري الرفع...' : 'رفع صورة'}
                  <input type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
                </label>
                {values.logo && (
                  <img src={values.logo} alt="logo" className="h-10 w-auto rounded-lg border border-dborder object-contain bg-dcard2" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
