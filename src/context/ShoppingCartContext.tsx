import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProvidderProps = {
    children: ReactNode
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    cartQuantity: number
    cartItems: CartItem[]
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id:number) => void    
    decreaseCartQuantity: (id:number) => void
    removeFromCart: (id:number) => void
}

type CartItem = {
    id: number
    quantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}



export function ShoppingCartProvider({ children }: ShoppingCartProvidderProps) {
    const [cartItems,
        setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[])
    const [isOpen, setOpen
    ] = useState(false)
    
    const openCart = () => setOpen(true)
    const closeCart = () => setOpen(false)

    
    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }
    function increaseCartQuantity(id: number) {
    setCartItems(currItems => {
      if (currItems.find(item => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }]
      } else {
        return currItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 }
          } else {
            return item
          }
        })
      }
    })
    }
    function decreaseCartQuantity(id: number) {
        setCartItems(currItems => {
        if (currItems.find(item => item.id === id)?.quantity === 1) {
            return currItems.filter(item => item.id !== id)
        } else {
            return currItems.map(item => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity - 1 }
            } else {
                return item
            }
            })
        }
        })
    }    
    function removeFromCart(id: number) {
        setCartItems(currItems => {
        return currItems.filter(item => item.id !== id)
        })
    }

    const cartQuantity = cartItems.reduce((quantity, item) => quantity + item.quantity, 0)
    
    
    
    return <ShoppingCartContext.Provider value={{getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartItems, cartQuantity, openCart, closeCart}}>
        {children}
        <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
}