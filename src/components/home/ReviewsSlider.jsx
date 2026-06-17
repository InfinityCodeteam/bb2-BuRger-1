import { useEffect, useRef, useState } from 'react'
import { supabase, isConfigured } from '../../lib/supabase'

const STATIC_IMAGES = [
  'https://i.postimg.cc/Pf6Vfw3g/IMG-20250827-WA0023.jpg',
  'https://i.postimg.cc/J4G6szSG/IMG-20250827-WA0024.jpg',
  'https://i.postimg.cc/LsMNQB51/IMG-20250827-WA0025.jpg',
  'https://i.postimg.cc/vHkPfddX/IMG-20250827-WA0026.jpg',
  'https://i.postimg.cc/G2LzdLk3/IMG-20250827-WA0027.jpg',
  'https://i.postimg.cc/76K9LFV3/IMG-20250827-WA0028.jpg',
  'https://i.postimg.cc/D0Dcr1Rm/IMG-20250827-WA0029.jpg',
  'https://i.postimg.cc/QCVbKf4R/IMG-20250827-WA0030.jpg',
  'https://i.postimg.cc/9XN1HjzV/IMG-20250827-WA0031.jpg',
]

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= rating ? 'text-brand' : 'text-dborder'}>★</span>
      ))}
    </div>
  )
}

export default function ReviewsSlider() {
  const swiperRef = useRef(null)
  const swiperInstance = useRef(null)
  const [textReviews, setTextReviews] = useState([])

  useEffect(() => {
    if (!isConfigured) return
    supabase.from('reviews').select('*').eq('is_approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setTextReviews(data) })
  }, [])

  useEffect(() => {
    let destroyed = false
    async function init() {
      try {
        const { Swiper } = await import('swiper')
        const { Navigation, Pagination } = await import('swiper/modules')
        await import('swiper/css')
        await import('swiper/css/navigation')
        await import('swiper/css/pagination')
        if (destroyed || !swiperRef.current) return
        swiperInstance.current = new Swiper(swiperRef.current, {
          modules: [Navigation, Pagination],
          slidesPerView: 2, spaceBetween: 12, loop: false,
          pagination: { el: '.swiper-pagination', clickable: true },
          navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
          breakpoints: {
            640:  { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          },
        })
      } catch {}
    }
    init()
    return () => { destroyed = true; swiperInstance.current?.destroy?.() }
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="tit">تقييمات عملائنا</h2>

      {/* Text reviews from DB */}
      {textReviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {textReviews.map(r => (
            <div key={r.id} className="bg-dcard border border-dborder rounded-2xl p-4 animate-fade-in-up">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dtext font-bold text-sm">{r.name}</span>
                <Stars rating={r.rating} />
              </div>
              {r.comment && <p className="text-dmuted text-sm leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Image slider */}
      <div className="swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {STATIC_IMAGES.map((src, i) => (
            <div key={i} className="swiper-slide">
              <div className="bg-dcard border border-dborder rounded-2xl overflow-hidden hover:border-brand/30 transition-colors">
                <img src={src} alt={`تقييم ${i + 1}`}
                  className="w-full object-contain max-h-72 bg-dcard2" />
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-button-next" />
        <div className="swiper-button-prev" />
        <div className="swiper-pagination !bottom-0 !mt-4" />
      </div>
    </section>
  )
}
