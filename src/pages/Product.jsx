import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, isConfigured } from '../lib/supabase'
import { FALLBACK_ITEMS, FALLBACK_ADDONS } from '../lib/fallbackData'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import StickyCart from '../components/layout/StickyCart'

const egp = n => `${Number(n).toLocaleString('ar-EG')} ج`

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  const [item, setItem] = useState(null)
  const [addons, setAddons] = useState([])
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState('single')
  const [combo, setCombo] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [qty, setQty] = useState(1)

  useEffect(() => {
    const numId = parseInt(id)
    if (!isConfigured) {
      setItem(FALLBACK_ITEMS.find(i => i.id === numId) || null)
      setAddons(FALLBACK_ADDONS)
      setLoading(false)
      return
    }
    Promise.all([
      supabase.from('menu_items').select('*').eq('id', numId).single(),
      supabase.from('addons').select('*').order('name'),
    ]).then(([{ data: it }, { data: ad }]) => {
      setItem(it || FALLBACK_ITEMS.find(i => i.id === numId) || null)
      setAddons(ad?.length ? ad : FALLBACK_ADDONS)
      setLoading(false)
    })
  }, [id])

  const isAppetizer = item?.category_id === 'e'
  const basePrice = isAppetizer
    ? (item?.price_single || 0)
    : (size === 'single' ? (item?.price_single || 0) : (item?.price_double || item?.price_single || 0))
  const addonsTotal = selectedAddons.reduce((s, a) => s + a.price, 0)
  const total = (basePrice + addonsTotal + (combo ? 30 : 0)) * qty

  function toggleAddon(addon) {
    setSelectedAddons(prev =>
      prev.find(a => a.id === addon.id) ? prev.filter(a => a.id !== addon.id) : [...prev, addon]
    )
  }

  function handleAdd() {
    const sizeLabel = isAppetizer ? 'واحد' : (size === 'single' ? 'سينجل' : 'دابل')
    addToCart({ id: item.id, name: item.name, size: sizeLabel, unitPrice: basePrice, qty,
      addons: selectedAddons, combo: combo ? { id: 'combo', name: 'كومبو', extra: 30 } : null, category: item.category_id })
    showToast('تمت الإضافة إلى السلة ✓')
  }

  function handleFav() {
    const wasFav = isFavorite(item.id)
    toggleFavorite(item.id)
    showToast(wasFav ? 'أزيل من المفضلة' : 'أضيف للمفضلة ❤️')
  }

  if (loading) return (
    <div className="min-h-screen bg-dbg">
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-dborder border-t-brand rounded-full animate-spin" />
      </div>
    </div>
  )

  if (!item) return (
    <div className="min-h-screen bg-dbg">
      <Navbar />
      <div className="text-center py-20 text-dmuted">
        <i className="fas fa-exclamation-circle text-4xl mb-3 block" />
        المنتج غير موجود
        <button onClick={() => navigate('/menu')} className="block mt-4 mx-auto text-brand underline text-sm">
          العودة للمنيو
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dbg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-dmuted hover:text-brand transition-colors text-sm mb-6">
          <i className="fas fa-arrow-right" /> العودة
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: image + info */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-dcard border border-dborder mb-4">
              <img
                src={item.image_url || 'https://via.placeholder.com/400x300'}
                alt={item.name}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="bg-dcard border border-dborder rounded-2xl p-5">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-dtext font-extrabold text-2xl">{item.name}</h1>
                <button onClick={handleFav}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isFavorite(item.id) ? 'bg-ddanger text-white' : 'bg-dborder/50 text-dmuted hover:bg-ddanger hover:text-white'
                  }`}>
                  <i className="fas fa-heart text-sm" />
                </button>
              </div>
              {item.description && <p className="text-dmuted text-sm leading-relaxed">{item.description}</p>}
            </div>
          </div>

          {/* Right: customization */}
          <div className="bg-dcard border border-dborder rounded-2xl p-5 space-y-5">
            {/* Size */}
            {!isAppetizer && (
              <div>
                <h3 className="text-dtext font-bold mb-3 text-sm">الحجم</h3>
                <div className="flex gap-3">
                  {[
                    { val: 'single', label: 'سينجل', price: item.price_single },
                    ...(item.price_double ? [{ val: 'double', label: 'دابل', price: item.price_double }] : []),
                  ].map(opt => (
                    <button key={opt.val} onClick={() => setSize(opt.val)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                        size === opt.val
                          ? 'bg-brand text-black border-brand'
                          : 'border-dborder text-dmuted hover:border-brand hover:text-brand'
                      }`}>
                      {opt.label}<br />
                      <span className="text-xs font-normal">{egp(opt.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Combo */}
            <label className="flex items-center justify-between p-3 bg-dbg rounded-xl border border-dborder cursor-pointer hover:border-brand/50 transition-colors">
              <div>
                <span className="text-dtext font-semibold text-sm">أضف كومبو</span>
                <p className="text-dmuted text-xs">مشروب + بطاطس</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand font-bold text-sm">+30 ج</span>
                <input type="checkbox" checked={combo} onChange={e => setCombo(e.target.checked)} className="w-5 h-5" />
              </div>
            </label>

            {/* Addons */}
            <div>
              <h3 className="text-dtext font-bold mb-3 text-sm">الإضافات</h3>
              <div className="grid grid-cols-2 gap-2">
                {addons.map(addon => {
                  const selected = !!selectedAddons.find(a => a.id === addon.id)
                  return (
                    <label key={addon.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${
                        selected ? 'bg-brand/10 border-brand/50 text-dtext' : 'border-dborder text-dmuted hover:border-brand/40'
                      }`}>
                      <input type="checkbox" checked={selected} onChange={() => toggleAddon(addon)} className="w-3.5 h-3.5" />
                      <span className="flex-1 font-medium">{addon.name}</span>
                      <span className="text-brand font-bold">+{egp(addon.price)}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-dtext font-bold mb-3 text-sm">الكمية</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}
                  className="w-11 h-11 bg-ddanger text-white rounded-xl font-bold text-xl disabled:opacity-40 hover:bg-red-700 transition-colors">
                  −
                </button>
                <span className="w-16 h-11 flex items-center justify-center bg-dbg border-2 border-dborder rounded-xl font-extrabold text-xl text-dtext">
                  {qty}
                </span>
                <button onClick={() => setQty(q => Math.min(99, q + 1))} disabled={qty >= 99}
                  className="w-11 h-11 bg-brand text-black rounded-xl font-bold text-xl disabled:opacity-40 hover:bg-brand-dark transition-colors">
                  +
                </button>
              </div>
            </div>

            {/* Total + Add */}
            <div className="border-t border-dborder pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-dmuted text-sm">الإجمالي</span>
                <span className="text-brand font-extrabold text-2xl">{egp(total)}</span>
              </div>
              <button onClick={handleAdd}
                className="w-full bg-brand hover:bg-brand-dark text-black font-extrabold py-3.5 rounded-2xl transition-all hover:scale-[1.02] text-base shadow-lg shadow-brand/20">
                <i className="fas fa-cart-plus ml-2" />
                أضف للسلة
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <StickyCart />
    </div>
  )
}
