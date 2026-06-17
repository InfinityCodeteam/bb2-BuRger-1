import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext'
import { useToast } from '../../context/ToastContext'

const egp = n => `${Number(n).toLocaleString('ar-EG')} ج`

export default function ProductCard({ item, showRemove = false, onRemove }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const isAppetizer = item.category_id === 'e' || item.category === 'e'
  const favorited = isFavorite(item.id)
  const single = item.price?.single ?? item.price_single ?? 0
  const double = item.price?.double ?? item.price_double ?? null

  function handleFav(e) {
    e.stopPropagation()
    const wasFav = isFavorite(item.id)
    toggleFavorite(item.id)
    showToast(wasFav ? 'أزيل من المفضلة' : 'أضيف للمفضلة ❤️')
  }

  function handleAddToCart(e) {
    e.stopPropagation()
    navigate(`/product/${item.id}`)
  }

  return (
    <div
      className="bg-dcard rounded-2xl overflow-hidden border border-dborder hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-brand/30 transition-all duration-300 cursor-pointer flex flex-col animate-fade-in-up"
      onClick={() => navigate(`/product/${item.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-dcard2">
        <img
          src={item.image_url || item.image || 'https://via.placeholder.com/400x300?text=BB2'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {/* Favorite button overlay */}
        <button
          onClick={handleFav}
          className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            favorited
              ? 'bg-ddanger text-white scale-110'
              : 'bg-black/50 text-white/70 hover:bg-ddanger hover:text-white hover:scale-110'
          }`}
        >
          <i className={`fas fa-heart text-xs ${favorited ? '' : 'opacity-80'}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-dtext font-bold text-base mb-1 leading-snug">{item.name}</h3>
        <p className="text-dmuted text-xs line-clamp-2 mb-3 leading-relaxed flex-1">
          {item.desc || item.description || ''}
        </p>

        {/* Price */}
        <div className="mb-3">
          {isAppetizer ? (
            <span className="text-brand font-extrabold text-lg">{egp(single)}</span>
          ) : (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-brand/10 text-brand font-bold px-2 py-0.5 rounded-lg">
                سينجل {egp(single)}
              </span>
              {double && (
                <span className="bg-brand/10 text-brand font-bold px-2 py-0.5 rounded-lg">
                  دابل {egp(double)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action */}
        {showRemove ? (
          <button
            onClick={e => { e.stopPropagation(); onRemove && onRemove(item.id) }}
            className="w-full bg-ddanger hover:bg-red-700 text-white font-bold py-2 rounded-xl transition-all duration-200 text-sm"
          >
            إزالة من المفضلة
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-brand hover:bg-brand-dark text-black font-bold py-2 rounded-xl transition-all duration-200 text-sm hover:scale-[1.02]"
          >
            أضف للسلة
          </button>
        )}
      </div>
    </div>
  )
}
