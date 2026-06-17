import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function HeroBanner({ banners = [] }) {
  const currentRef = useRef(0)
  const imgsRef = useRef([])

  useEffect(() => {
    if (banners.length < 2) return
    const cycle = () => {
      imgsRef.current[currentRef.current]?.classList.remove('active')
      currentRef.current = (currentRef.current + 1) % banners.length
      imgsRef.current[currentRef.current]?.classList.add('active')
    }
    const id = setInterval(cycle, 5000)
    return () => clearInterval(id)
  }, [banners])

  return (
    <section className="relative min-h-[480px] md:min-h-[560px] flex items-center justify-center overflow-hidden bg-dcard2">
      {/* Banner images */}
      {banners.map((src, i) => (
        <img
          key={i}
          src={src}
          ref={el => { imgsRef.current[i] = el }}
          className={`banner-img${i === 0 ? ' active' : ''}`}
          alt=""
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dbg/95 via-black/50 to-black/20 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-2xl mx-auto">
        <div className="inline-block mb-4 px-3 py-1 bg-brand/10 border border-brand/30 rounded-full">
          <span className="text-brand text-sm font-semibold">🍔 BB2 Burger — جودة لا مثيل لها</span>
        </div>
        <h1 className="tit text-4xl sm:text-5xl md:text-6xl !my-3">
          الجودة هي طعمنا المفضل
        </h1>
        <p className="text-dtext/70 text-base mb-6 leading-relaxed">
          برجر طازج على الفحم، سماش برجر، تشيكن — كل حاجة بطعم مختلف
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/menu"
            className="bg-brand hover:bg-brand-dark text-black font-bold px-7 py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg shadow-brand/20"
          >
            شوف المنيو
          </Link>
          <Link
            to="/cart"
            className="bg-white/10 hover:bg-white/20 text-dtext font-bold px-7 py-3 rounded-2xl border border-white/20 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
          >
            سلة التسوق
          </Link>
        </div>
      </div>
    </section>
  )
}
