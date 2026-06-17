import { useState, useEffect } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import { useCart, lineTotal, cartTotal } from '../context/CartContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const egp = n => `${Number(n).toLocaleString('ar-EG')} ج`
const encode = str => encodeURIComponent(str)

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart()
  const [phone, setPhone] = useState('201006473229')
  const [brand, setBrand] = useState('BB2 Burger')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [payment, setPayment] = useState('كاش عند الاستلام')

  useEffect(() => {
    if (!isConfigured) return
    supabase.from('settings').select('key,value').then(({ data }) => {
      if (!data) return
      const m = {}; data.forEach(r => { m[r.key] = r.value })
      if (m.whatsapp_number) setPhone(m.whatsapp_number)
      if (m.brand) setBrand(m.brand)
    })
  }, [])

  function handleWhatsApp() {
    const lines = [`*طلب جديد - ${brand}*`]
    cart.forEach((it, idx) => {
      const addonsStr = (it.addons || []).map(a => a.name).join('، ') || 'بدون إضافات'
      const sizeDisplay = it.category === 'e' ? '' : ` - ${it.size}`
      const comboStr = it.combo ? ' + كومبو' : ''
      lines.push(`${idx + 1}) ${it.name}${sizeDisplay}${comboStr} عدد (${it.qty})`)
      lines.push(`   إضافات: ${addonsStr}`)
      lines.push(`   السعر: ${egp(lineTotal(it))}`)
    })
    lines.push('—', `*الإجمالي*: ${egp(cartTotal(cart))}`, '—',
      `الاسم: ${name}`, `موبايل: ${mobile}`, `العنوان: ${address}`)
    if (notes) lines.push(`ملاحظات: ${notes}`)
    lines.push(`*طريقة الدفع*: ${payment}`)
    window.location.href = `https://wa.me/${phone}?text=${encode(lines.join('\n'))}`
    clearCart()
  }

  const total = cartTotal(cart)

  return (
    <div className="min-h-screen bg-dbg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="tit">سلة التسوق</h2>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <i className="fas fa-shopping-cart text-5xl text-dborder mb-4 block" />
            <p className="text-dmuted text-lg mb-4">السلة فارغة</p>
            <a href="/menu" className="bg-brand text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-brand-dark transition-colors">
              ابدأ الطلب
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Cart items — 3 cols */}
            <div className="lg:col-span-3 space-y-3">
              {cart.map((it, i) => {
                const sizeDisplay = it.category === 'e' ? '' : ` — ${it.size}`
                return (
                  <div key={i} className="bg-dcard border border-dborder rounded-2xl p-4 flex gap-4 items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-dtext font-bold text-sm mb-0.5">{it.name}{sizeDisplay}</h4>
                      <p className="text-dmuted text-xs">
                        {(it.addons || []).map(a => a.name).join(' · ') || 'بدون إضافات'}
                        {it.combo ? ' · كومبو' : ''}
                      </p>
                      <p className="text-brand font-bold text-sm mt-1">{egp(lineTotal(it))}</p>
                    </div>
                    {/* Qty */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => it.qty > 1 ? updateQty(i, it.qty - 1) : removeFromCart(i)}
                        className="w-7 h-7 bg-ddanger text-white rounded-lg flex items-center justify-center text-sm font-bold">
                        −
                      </button>
                      <span className="w-7 text-center text-dtext font-bold text-sm">{it.qty}</span>
                      <button onClick={() => updateQty(i, it.qty + 1)}
                        className="w-7 h-7 bg-brand text-black rounded-lg flex items-center justify-center text-sm font-bold">
                        +
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(i)}
                      className="text-dmuted hover:text-ddanger transition-colors shrink-0">
                      <i className="fas fa-times" />
                    </button>
                  </div>
                )
              })}

              {/* Total */}
              <div className="bg-dcard border border-brand/20 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-dmuted font-semibold">الإجمالي</span>
                <span className="text-brand font-extrabold text-2xl">{egp(total)}</span>
              </div>
            </div>

            {/* Order form — 2 cols */}
            <div className="lg:col-span-2">
              <div className="bg-dcard border border-dborder rounded-2xl p-5 sticky top-20">
                <h3 className="text-dtext font-bold mb-4 flex items-center gap-2">
                  <i className="fas fa-user text-brand" /> بيانات الطلب
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-dmuted text-xs mb-1.5">الاسم *</label>
                    <input value={name} onChange={e => setName(e.target.value)} required placeholder="اسمك الكامل" />
                  </div>
                  <div>
                    <label className="block text-dmuted text-xs mb-1.5">رقم الموبايل *</label>
                    <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} required placeholder="01xxxxxxxxx" />
                  </div>
                  <div>
                    <label className="block text-dmuted text-xs mb-1.5">العنوان *</label>
                    <input value={address} onChange={e => setAddress(e.target.value)} required placeholder="عنوانك بالتفصيل" />
                  </div>
                  <div>
                    <label className="block text-dmuted text-xs mb-1.5">ملاحظات</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="أي طلب خاص..." className="min-h-[70px]" />
                  </div>
                  <div>
                    <label className="block text-dmuted text-xs mb-1.5">طريقة الدفع</label>
                    <select value={payment} onChange={e => setPayment(e.target.value)}>
                      <option>كاش عند الاستلام</option>
                      <option>انستا باي</option>
                      <option>فودافون كاش</option>
                      <option>اتصالات كاش</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleWhatsApp} disabled={cart.length === 0}
                  className="w-full mt-5 bg-dsuccess hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-dsuccess/20 disabled:opacity-50">
                  <i className="fab fa-whatsapp text-lg" />
                  إرسال الطلب عبر واتساب
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
