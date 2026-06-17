import { NavLink } from 'react-router-dom'
import { useSettings } from '../../hooks/useSettings'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { settings } = useSettings()
  const { cart } = useCart()
  const count = cart.length

  return (
    <nav className="sticky top-0 z-50 bg-dcard/95 backdrop-blur-md border-b border-dborder shadow-lg shadow-black/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <NavLink to="/" className="shrink-0">
          <img
            src={settings.logo || ''}
            alt="BB2 Burger"
            className="h-12 w-auto object-contain"
          />
        </NavLink>

        {/* Links */}
        <ul className="flex items-center gap-1 sm:gap-2">
          {[
            { to: '/', label: 'الرئيسية', end: true },
            { to: '/menu', label: 'المنيو' },
            { to: '/favorites', label: 'المفضلة' },
          ].map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-brand border-b-2 border-brand'
                      : 'text-dmuted hover:text-dtext'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}

          {/* Cart with badge */}
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive ? 'text-brand bg-brand/10' : 'text-dmuted hover:text-dtext'
                }`
              }
            >
              <i className="fas fa-shopping-cart text-base" />
              <span className="hidden sm:inline">السلة</span>
              {count > 0 && (
                <span className="absolute -top-1 -left-1 bg-brand text-black text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
