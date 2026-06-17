import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Favorites from './pages/Favorites'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import Toast from './components/ui/Toast'

function App() {
  return (
    <>
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
