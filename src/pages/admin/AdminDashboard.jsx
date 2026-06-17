import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import DashboardOverview from '../../components/admin/DashboardOverview'
import CategoriesManager from '../../components/admin/CategoriesManager'
import MenuManager from '../../components/admin/MenuManager'
import ReviewsManager from '../../components/admin/ReviewsManager'
import SettingsManager from '../../components/admin/SettingsManager'

export default function AdminDashboard() {
  const [session, setSession] = useState(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) navigate('/admin/login')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
      if (!sess) navigate('/admin/login')
    })
    return () => listener.subscription.unsubscribe()
  }, [navigate])

  if (session === undefined) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>جاري التحقق...</div>
  }

  if (!session) return null

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="menu" element={<MenuManager />} />
        <Route path="reviews" element={<ReviewsManager />} />
        <Route path="settings" element={<SettingsManager />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}
