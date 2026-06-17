import { useEffect, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import { FALLBACK_ITEMS } from '../lib/fallbackData'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import StickyCart from '../components/layout/StickyCart'
import ProductCard from '../components/ui/ProductCard'

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites()
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) { setItems([]); setLoading(false); return }
    if (!isConfigured) {
      setItems(FALLBACK_ITEMS.filter(i => favorites.includes(i.id)))
      setLoading(false)
      return
    }
    supabase.from('menu_items').select('*').in('id', favorites)
      .then(({ data }) => {
        setItems(data?.length ? data : FALLBACK_ITEMS.filter(i => favorites.includes(i.id)))
        setLoading(false)
      })
  }, [favorites])

  return (
    <div className="min-h-screen bg-dbg">
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="tit">المفضلة</h2>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-dborder border-t-brand rounded-full animate-spin" />
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <i className="fas fa-heart text-5xl text-dborder mb-4 block" />
            <p className="text-dmuted text-lg mb-4">لا توجد منتجات في المفضلة</p>
            <a href="/menu" className="bg-brand text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-brand-dark transition-colors">
              تصفح المنيو
            </a>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => (
              <ProductCard key={item.id} item={item} showRemove
                onRemove={id => { toggleFavorite(id); showToast('أزيل من المفضلة') }} />
            ))}
          </div>
        )}
      </section>
      <Footer />
      <StickyCart />
    </div>
  )
}
