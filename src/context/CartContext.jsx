import { createContext, useContext, useState, useCallback } from 'react'

const CART_KEY = 'bb2-cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

function lineTotal(item) {
  const addonsTotal = (item.addons || []).reduce((s, a) => s + a.price, 0)
  const combo = item.combo ? item.combo.extra : 0
  return (item.unitPrice + addonsTotal + combo) * item.qty
}

function cartTotal(cart) {
  return cart.reduce((s, it) => s + lineTotal(it), 0)
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)

  const save = useCallback((newCart) => {
    setCart(newCart)
    localStorage.setItem(CART_KEY, JSON.stringify(newCart))
  }, [])

  const addToCart = useCallback((item) => {
    save([...cart, item])
  }, [cart, save])

  const removeFromCart = useCallback((index) => {
    const c = [...cart]
    c.splice(index, 1)
    save(c)
  }, [cart, save])

  const updateQty = useCallback((index, qty) => {
    const c = [...cart]
    c[index] = { ...c[index], qty }
    save(c)
  }, [cart, save])

  const clearCart = useCallback(() => {
    save([])
  }, [save])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, lineTotal, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

export { lineTotal, cartTotal }
