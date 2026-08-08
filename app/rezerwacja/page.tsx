"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Download,
  Home,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  Printer
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart, CartItem } from "@/lib/cart-context"

const months = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
]

const availableServices: CartItem[] = [
  { id: "tent-small", name: "Namiot 3x6m", price: 400, type: "tent" },
  { id: "tent-medium", name: "Namiot 5x8m", price: 700, type: "tent" },
  { id: "tent-large", name: "Namiot 6x12m", price: 1200, type: "tent" },
  { id: "tent-premium", name: "Namiot 10x15m", price: 2500, type: "tent" },
  { id: "dmuchaniec", name: "Zamek dmuchany", price: 350, type: "extra" },
  { id: "animator", name: "Animator dla dzieci", price: 400, type: "service" },
  { id: "wata-cukrowa", name: "Wata cukrowa", price: 300, type: "extra" },
  { id: "popcorn", name: "Maszyna do popcornu", price: 250, type: "extra" },
  { id: "oswietlenie-led", name: "Oświetlenie LED", price: 200, type: "extra" },
  { id: "girlandy", name: "Girlandy świetlne", price: 150, type: "extra" },
  { id: "naglosnienie", name: "Nagłośnienie", price: 500, type: "extra" },
  { id: "rollbar", name: "Rollbar mobilny", price: 600, type: "extra" },
  { id: "stolik-koktajlowy", name: "Stoliki koktajlowe", price: 150, type: "extra" },
  { id: "strefa-chill", name: "Strefa chill", price: 400, type: "extra" },
  { id: "muzyka-dj", name: "DJ na imprezę", price: 800, type: "service" },
  { id: "dekoracje", name: "Pakiet dekoracji", price: 300, type: "extra" },
]

export default function RezerwacjaPage() {
  const router = useRouter()
  const confirmationRef = useRef<HTMLDivElement>(null)
  
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [showAddService, setShowAddService] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  })

  const { items, addItem, removeItem, getTotalPrice, getDepositPrice, selectedDate, clearCart } = useCart()

  // Check if mounted (client-side)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if no date selected
  useEffect(() => {
    if (mounted && !selectedDate) {
      router.push("/#rezerwacja")
    }
  }, [mounted, selectedDate, router])

  const totalPrice = getTotalPrice()
  const depositPrice = getDepositPrice()

  const handleAddService = (service: CartItem) => {
    addItem(service)
    setShowAddService(false)
  }

  const handleSubmit = () => {
    if (formData.name && formData.phone && formData.email && formData.address) {
      // Generate order number
      const orderNum = `ZAM-${Date.now().toString(36).toUpperCase()}`
      setOrderNumber(orderNum)
      setIsConfirmed(true)
    }
  }

  const handleNewOrder = () => {
    clearCart()
    router.push("/")
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    // In production, this would generate a PDF
    // For now, we'll use the print functionality
    window.print()
  }

  // Show loading until mounted and cart is ready
  if (!mounted || !selectedDate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Ładowanie...</p>
        </div>
      </div>
    )
  }

  const stepLabels = ["Przegląd usług", "Dane kontaktowe"]

  // Confirmation Page
  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold">
              <Home className="w-4 h-4" />
              <span className="text-sm">Postawie Ci Namiot</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div ref={confirmationRef} className="print:p-8">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Rezerwacja przyjęta!</h1>
              <p className="text-muted-foreground text-sm">
                Potwierdzenie zostanie wysłane na adres email
              </p>
            </div>

            {/* Order Details Card */}
            <Card className="mb-4 print:shadow-none print:border-2">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Szczegóły zamówienia</CardTitle>
                  <Badge variant="secondary" className="font-mono text-xs">{orderNumber}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Data imprezy</p>
                    <p className="font-semibold text-sm">
                      {selectedDate.day} {months[selectedDate.month]} {selectedDate.year}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Imię i nazwisko</p>
                      <p className="font-medium text-sm">{formData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Telefon</p>
                      <p className="font-medium text-sm">{formData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium text-sm">{formData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Adres imprezy</p>
                      <p className="font-medium text-sm">{formData.address}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {formData.notes && (
                  <div className="flex items-start gap-3 pt-2 border-t">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Dodatkowe uwagi</p>
                      <p className="text-sm">{formData.notes}</p>
                    </div>
                  </div>
                )}

                {/* Services */}
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Zamówione usługi</p>
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-1.5 px-2 bg-muted/50 rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.name}</span>
                          {item.type === "tent" && (
                            <Badge variant="outline" className="text-[9px]">namiot</Badge>
                          )}
                        </div>
                        <span className="font-semibold text-sm">{item.price} zł</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Suma całkowita</span>
                    <span className="font-bold text-lg">{totalPrice} zł</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Zaliczka do zapłaty (30%)</span>
                    <span className="font-bold text-lg text-primary">{depositPrice} zł</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mb-4 print:shadow-none">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2">Dane do przelewu</h3>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p><span className="text-foreground font-medium">Nazwa:</span> Postawie Ci Namiot</p>
                  <p><span className="text-foreground font-medium">Nr konta:</span> 00 1234 5678 9012 3456 7890 1234</p>
                  <p><span className="text-foreground font-medium">Tytuł:</span> Zaliczka {orderNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions - hide on print */}
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
                <Printer className="w-4 h-4" />
                Drukuj
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4" />
                Pobierz PDF
              </Button>
            </div>

            <Button className="w-full mt-3 print:hidden" onClick={handleNewOrder}>
              <Home className="w-4 h-4 mr-2" />
              Wróć na stronę główną
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold">
            <Home className="w-4 h-4" />
            <span className="text-sm">Postawie Ci Namiot</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-foreground">
              {selectedDate.day} {months[selectedDate.month]} {selectedDate.year}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all",
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className={cn(
                  "text-xs mt-1 font-medium",
                  step >= s ? "text-primary" : "text-muted-foreground"
                )}>
                  {stepLabels[s - 1]}
                </span>
              </div>
              {s < 2 && (
                <div className={cn(
                  "w-16 h-0.5 mx-2 rounded-full transition-colors",
                  step > s ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="pb-3 border-b bg-muted/30">
                <CardTitle className="text-base flex items-center gap-2">
                  {step === 1 ? (
                    <>
                      <ShoppingCart className="w-4 h-4 text-primary" />
                      Przegląd usług
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-primary" />
                      Dane kontaktowe
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {/* Step 1: Services */}
                {step === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {items.length} {items.length === 1 ? "usługa" : items.length < 5 ? "usługi" : "usług"} w koszyku
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => setShowAddService(true)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Dodaj usługę
                      </Button>
                    </div>

                    {items.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm mb-3">Koszyk jest pusty</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAddService(true)}
                          className="gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Dodaj usługi
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{item.name}</p>
                                {item.type === "tent" && (
                                  <Badge variant="outline" className="text-[9px]">namiot</Badge>
                                )}
                              </div>
                              <p className="text-primary font-bold text-sm">{item.price} zł</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" asChild className="gap-1">
                        <Link href="/#rezerwacja">
                          <ChevronLeft className="w-4 h-4" />
                          Zmień datę
                        </Link>
                      </Button>
                      <Button 
                        className="flex-1 gap-1" 
                        onClick={() => setStep(2)} 
                        disabled={items.length === 0}
                      >
                        Dalej
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Form */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name" className="text-xs font-medium">Imię i nazwisko *</Label>
                        <Input 
                          id="name" 
                          placeholder="Jan Kowalski" 
                          className="mt-1"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-xs font-medium">Telefon *</Label>
                        <Input 
                          id="phone" 
                          placeholder="+48 512 345 678" 
                          className="mt-1"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="email" className="text-xs font-medium">Email *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="jan@email.com" 
                          className="mt-1"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="address" className="text-xs font-medium">Adres imprezy *</Label>
                        <Input 
                          id="address" 
                          placeholder="ul. Przykładowa 15, 44-200 Rybnik" 
                          className="mt-1"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="notes" className="text-xs font-medium">Dodatkowe uwagi</Label>
                        <Textarea 
                          id="notes" 
                          placeholder="Np. preferowana godzina dostawy, szczegóły dojazdu, specjalne życzenia..." 
                          className="mt-1 min-h-[80px]"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" onClick={() => setStep(1)} className="gap-1">
                        <ChevronLeft className="w-4 h-4" />
                        Wstecz
                      </Button>
                      <Button 
                        className="flex-1 gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        onClick={handleSubmit}
                        disabled={!formData.name || !formData.phone || !formData.email || !formData.address}
                      >
                        Zarezerwuj - wpłać {depositPrice} zł zaliczki
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <Card className="h-fit shadow-lg sticky top-20">
            <CardHeader className="pb-3 border-b bg-muted/30">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-secondary" />
                Podsumowanie
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {/* Date */}
              <div className="pb-3 border-b">
                <p className="text-xs text-muted-foreground mb-1">Data imprezy</p>
                <p className="font-bold text-sm">
                  {selectedDate.day} {months[selectedDate.month]} {selectedDate.year}
                </p>
              </div>

              {/* Items */}
              {items.length > 0 && (
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm py-1">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium">{item.price} zł</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Suma</span>
                  <span className="font-bold text-lg">{totalPrice} zł</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Zaliczka (30%)</span>
                  <span className="font-bold text-lg text-primary">{depositPrice} zł</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add Service Dialog */}
      <Dialog open={showAddService} onOpenChange={setShowAddService}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">Dodaj usługę</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {availableServices
              .filter(s => !items.some(i => i.id === s.id))
              .map((service) => (
                <button
                  key={service.id}
                  className="w-full flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left"
                  onClick={() => handleAddService(service)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{service.name}</p>
                      {service.type === "tent" && (
                        <Badge variant="outline" className="text-[9px]">namiot</Badge>
                      )}
                    </div>
                    <p className="text-primary font-bold text-sm">{service.price} zł</p>
                  </div>
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
