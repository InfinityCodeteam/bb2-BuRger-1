import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const egp = n => `${Number(n).toLocaleString('ar-EG')} ج`

export default function StickyCart() {
  const { cart, cartTotal } = useCart()
  if (cart.length === 0) return null
  const total = cartTotal(cart)

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-dcard/95 backdrop-blur-md border-t border-dborder shadow-2xl shadow-black/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-brand text-black text-xs font-extrabold px-2.5 py-1 rounded-full">
            {cart.length} عناصر
          </span>
          <span className="text-brand font-bold text-lg">{egp(total)}</span>
        </div>
        <Link
          to="/cart"
          className="bg-brand hover:bg-brand-dark text-black font-bold px-5 py-2 rounded-xl transition-all duration-200 hover:scale-105 text-sm flex items-center gap-2"
        >
          <i className="fas fa-shopping-cart" />
          إتمام الطلب
        </Link>
      </div>
    </div>
  )
}
