import { useEffect, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import { FALLBACK_ITEMS } from '../lib/fallbackData'
import { useSettings } from '../hooks/useSettings'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import StickyCart from '../components/layout/StickyCart'
import HeroBanner from '../components/home/HeroBanner'
import ReviewsSlider from '../components/home/ReviewsSlider'
import ReviewForm from '../components/home/ReviewForm'
import ProductCard from '../components/ui/ProductCard'

export default function Home() {
  const { settings } = useSettings()
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    if (!isConfigured) {
      setFeatured(FALLBACK_ITEMS.filter(i => i.featured).slice(0, 6))
      return
    }
    supabase.from('menu_items').select('*').eq('featured', true).eq('available', true).limit(6)
      .then(({ data }) => setFeatured(data?.length ? data : FALLBACK_ITEMS.filter(i => i.featured).slice(0, 6)))
  }, [])

  let banners = []
  try { banners = settings.banners ? JSON.parse(settings.banners) : [] } catch {}
  const waNumber = settings.whatsapp_number || '201006473229'

  return (
    <div className="min-h-screen bg-dbg">
      <Navbar />
      <HeroBanner banners={banners} />

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="tit">منتجات مميزة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(item => <ProductCard key={item.id} item={item} />)}
        </div>
        {/* View all button */}
        <div className="text-center mt-8">
          <a href="/menu"
            className="inline-flex items-center gap-2 bg-transparent border border-brand text-brand hover:bg-brand hover:text-black font-bold px-8 py-3 rounded-2xl transition-all duration-200">
            عرض كل المنيو <i className="fas fa-arrow-left" />
          </a>
        </div>
      </section>

      {/* Reviews */}
      <div className="bg-dcard2">
        <ReviewsSlider />
      </div>

      {/* Review form */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="tit">شاركنا رأيك</h2>
        <ReviewForm />
      </section>

      <Footer />
      <StickyCart />

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer"
        className="fixed bottom-20 left-4 z-50 w-13 h-13 bg-dsuccess hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl shadow-dsuccess/30 transition-all duration-200 hover:scale-110"
        style={{ width: '52px', height: '52px' }}>
        <i className="fab fa-whatsapp text-white text-2xl" />
      </a>
    </div>
  )
}
