import { Link } from 'react-router-dom'
import { useSettings } from '../../hooks/useSettings'

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="bg-dcard border-t border-dborder mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-right">

          {/* Navigation */}
          <div>
            <h3 className="text-dtext font-bold mb-4 text-base">التنقل</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'الرئيسية' },
                { to: '/menu', label: 'المنيو' },
                { to: '/favorites', label: 'المفضلة' },
                { to: '/cart', label: 'السلة' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-dmuted hover:text-brand text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-dtext font-bold mb-4 text-base">تواصلوا معنا</h3>
            <ul className="space-y-2">
              {settings.facebook && (
                <li>
                  <a href={settings.facebook} target="_blank" rel="noreferrer"
                    className="text-dmuted hover:text-brand text-sm transition-colors duration-200 flex items-center gap-2 justify-end">
                    فيسبوك <i className="fab fa-facebook text-base" />
                  </a>
                </li>
              )}
              {settings.instagram && (
                <li>
                  <a href={settings.instagram} target="_blank" rel="noreferrer"
                    className="text-dmuted hover:text-brand text-sm transition-colors duration-200 flex items-center gap-2 justify-end">
                    إنستجرام <i className="fab fa-instagram text-base" />
                  </a>
                </li>
              )}
              {settings.whatsapp_number && (
                <li>
                  <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noreferrer"
                    className="text-dmuted hover:text-dsuccess text-sm transition-colors duration-200 flex items-center gap-2 justify-end">
                    واتساب <i className="fab fa-whatsapp text-base" />
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-dtext font-bold mb-4 text-base">عن المطعم</h3>
            {settings.address && (
              <p className="text-dmuted text-sm leading-relaxed mb-2">{settings.address}</p>
            )}
            {settings.hours && (
              <p className="text-dmuted text-sm mb-2">{settings.hours}</p>
            )}
            <p className="text-dmuted text-xs mt-4">
              © 2025 {settings.brand || 'BB2 Burger'}. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-8 pt-6 border-t border-dborder text-center">
          <span className="text-dmuted text-xs">
            صُمِّم بـ ❤️ لـ BB2 Burger
          </span>
        </div>
      </div>
    </footer>
  )
}
