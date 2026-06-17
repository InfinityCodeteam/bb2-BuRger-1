import { useEffect, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import { FALLBACK_ITEMS, FALLBACK_CATEGORIES } from '../lib/fallbackData'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import StickyCart from '../components/layout/StickyCart'
import ProductCard from '../components/ui/ProductCard'

export default function Menu() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isConfigured) {
      setCategories(FALLBACK_CATEGORIES)
      setItems(FALLBACK_ITEMS)
      return
    }
    Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('menu_items').select('*').eq('available', true),
    ]).then(([{ data: cats }, { data: its }]) => {
      setCategories(cats?.length ? cats : FALLBACK_CATEGORIES)
      setItems(its?.length ? its : FALLBACK_ITEMS)
    })
  }, [])

  const filtered = items
    .filter(i => activeCategory === 'all' || i.category_id === activeCategory)
    .filter(i => !search || (i.name + (i.description || '')).toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-dbg">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="tit">المنيو</h2>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6 relative">
          <i className="fas fa-search absolute top-1/2 -translate-y-1/2 right-4 text-dmuted text-sm" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="pr-10 pl-4"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[{ id: 'all', name: 'الكل' }, ...categories].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-brand text-black border-brand shadow-md shadow-brand/20 scale-105'
                  : 'border-brand text-brand hover:bg-brand hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <i className="fas fa-search text-4xl text-dmuted mb-4 block" />
            <p className="text-dmuted">لا توجد منتجات مطابقة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        )}
      </section>

      <Footer />
      <StickyCart />
    </div>
  )
}
