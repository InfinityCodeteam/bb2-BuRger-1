import { useState, useEffect } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

const DEFAULT_SETTINGS = {
  brand: 'BB2 Burger',
  whatsapp_number: '201006473229',
  address: 'الساحه-شارع الاوقاف-عمارات الاستثمار عمارة 2 امام مدرسة التجارة',
  hours: '',
  logo: 'https://i.postimg.cc/90b37MGv/Whats-App-Image-2025-08-22-at-10-03-25-621ae7a1-removebg-preview.png',
  facebook: 'https://www.facebook.com/share/1EhgB6LvHR/',
  instagram: 'https://www.instagram.com/bb2burger?igsh=MWhuenhwcWJ4YjFqMQ==',
  banners: JSON.stringify([
    'https://i.postimg.cc/HxPmgwWW/IMG-20250826-WA0003.jpg',
    'https://i.postimg.cc/zBLz3tcH/IMG-20250826-WA0019.jpg',
    'https://i.postimg.cc/6QMJrrvV/IMG-20250826-WA0007.jpg',
    'https://i.postimg.cc/y6T6C6Mq/Whats-App-Image-2025-08-22-at-09-59-53-5ae70d60.jpg',
  ]),
}

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return }
    supabase
      .from('settings')
      .select('key, value')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const obj = { ...DEFAULT_SETTINGS }
          data.forEach(row => { obj[row.key] = row.value })
          setSettings(obj)
        }
        setLoading(false)
      })
  }, [])

  return { settings, loading }
}
