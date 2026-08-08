"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  type: "tent" | "extra" | "service"
}

// Podsumowanie wysłanego zapytania — pokazywane w sekcji "Rezerwacja online"
export type BookingSummary = {
  orderNumber: string
  tentLabel: string
  tentSize: string
  tentPrice: number
  extras: { label: string; price: number }[]
  dateLabel: string
  total: number
}

// Wstępne wypełnienie konfiguratora (np. z quizu "Edytuj zestaw")
export type ConfiguratorPrefill = { tentId: string; extraIds: string[] }

export type CartContextType = {
  items: CartItem[]
  selectedDate: { day: number; month: number; year: number } | null
  guestCount: number | null
  eventType: string | null
  scenario: string | null
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<CartItem>) => void
  clearCart: () => void
  setSelectedDate: (date: { day: number; month: number; year: number } | null) => void
  setGuestCount: (count: number | null) => void
  setEventType: (type: string | null) => void
  setScenario: (scenario: string | null) => void
  getTotalPrice: () => number
  getDepositPrice: () => number
  hasItem: (id: string) => boolean
  setCartFromQuiz: (tentSize: string, extras: CartItem[]) => void
  setCartFromConfigurator: (items: CartItem[]) => void
  // Wysłane zapytanie
  confirmedBooking: BookingSummary | null
  confirmBooking: (summary: BookingSummary) => void
  clearConfirmedBooking: () => void
  // Prefill konfiguratora
  configuratorPrefill: ConfiguratorPrefill | null
  setConfiguratorPrefill: (prefill: ConfiguratorPrefill | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: number; year: number } | null>(null)
  const [guestCount, setGuestCount] = useState<number | null>(null)
  const [eventType, setEventType] = useState<string | null>(null)
  const [scenario, setScenario] = useState<string | null>(null)
  const [confirmedBooking, setConfirmedBooking] = useState<BookingSummary | null>(null)
  const [configuratorPrefill, setConfiguratorPrefill] = useState<ConfiguratorPrefill | null>(null)

  const confirmBooking = useCallback((summary: BookingSummary) => {
    setConfirmedBooking(summary)
  }, [])

  const clearConfirmedBooking = useCallback(() => {
    setConfirmedBooking(null)
  }, [])

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev
      // If adding a tent, remove other tents first
      if (item.type === "tent") {
        return [...prev.filter(i => i.type !== "tent"), item]
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const updateItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setSelectedDate(null)
    setGuestCount(null)
    setEventType(null)
    setScenario(null)
  }, [])

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price, 0)
  }, [items])

  const getDepositPrice = useCallback(() => {
    return Math.round(items.reduce((sum, item) => sum + item.price, 0) * 0.3)
  }, [items])

  const hasItem = useCallback((id: string) => {
    return items.some(item => item.id === id)
  }, [items])

  const setCartFromQuiz = useCallback((tentSize: string, extras: CartItem[]) => {
    const tentItem: CartItem = { id: tentSize, name: getTentName(tentSize), price: getTentPrice(tentSize), type: "tent" }
    setItems([tentItem, ...extras])
  }, [])

  const setCartFromConfigurator = useCallback((newItems: CartItem[]) => {
    setItems(newItems)
  }, [])

  return (
    <CartContext.Provider value={{
      items,
      selectedDate,
      guestCount,
      eventType,
      scenario,
      addItem,
      removeItem,
      updateItem,
      clearCart,
      setSelectedDate,
      setGuestCount,
      setEventType,
      setScenario,
      getTotalPrice,
      getDepositPrice,
      hasItem,
      setCartFromQuiz,
      setCartFromConfigurator,
      confirmedBooking,
      confirmBooking,
      clearConfirmedBooking,
      configuratorPrefill,
      setConfiguratorPrefill,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

function getTentName(size: string): string {
  const names: Record<string, string> = {
    "tent-small": "Namiot Maly (3x6m)",
    "tent-medium": "Namiot Sredni (5x8m)",
    "tent-large": "Namiot Duzy (6x12m)",
    "tent-premium": "Namiot Premium (10x15m)",
  }
  return names[size] || "Namiot"
}

function getTentPrice(size: string): number {
  const prices: Record<string, number> = {
    "tent-small": 400,
    "tent-medium": 700,
    "tent-large": 1200,
    "tent-premium": 2500,
  }
  return prices[size] || 700
}
