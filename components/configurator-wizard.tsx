"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Tent,
  Search,
  Plus,
  X,
  Ruler,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { tents, extras, extraCategories, months, weekDays, bookedDates, steps } from "@/lib/booking-data"
import type { BookingSummary } from "@/lib/cart-context"
import { useWizardHistory } from "@/lib/use-wizard-history"

type ConfiguratorWizardProps = {
  initialTentId?: string
  initialExtraIds?: string[]
  onClose: () => void
  onSubmit: (summary: BookingSummary) => void
  onStepChange?: (step: number) => void
}

export function ConfiguratorWizard({
  initialTentId = "tent-medium",
  initialExtraIds = [],
  onClose,
  onSubmit,
  onStepChange,
}: ConfiguratorWizardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const [step, setStep] = useState(0)

  // Zgłaszamy bieżący krok rodzicowi, aby wiedział ile wpisów historii cofnąć
  // przy powrocie na stronę główną.
  useEffect(() => {
    onStepChange?.(step)
  }, [step, onStepChange])
  const [tentId, setTentId] = useState<string>(initialTentId)
  const [selectedExtras, setSelectedExtras] = useState<string[]>(initialExtraIds)
  const [extraQuery, setExtraQuery] = useState("")
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" })

  const selectedTent = useMemo(() => tents.find((t) => t.id === tentId)!, [tentId])

  const total = useMemo(() => {
    let sum = selectedTent.price
    selectedExtras.forEach((id) => {
      const extra = extras.find((e) => e.id === id)
      if (extra) sum += extra.price
    })
    return sum
  }, [selectedTent, selectedExtras])

  const deposit = Math.round(total * 0.3)

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]))
  }

  const normalizedQuery = extraQuery.trim().toLowerCase()
  const isSearching = normalizedQuery.length > 0

  // Grupujemy dodatki po kategoriach, uwzględniając filtr wyszukiwania.
  const groupedExtras = useMemo(() => {
    return extraCategories
      .map((category) => {
        const items = extras.filter((extra) => {
          if (extra.category !== category.id) return false
          if (!normalizedQuery) return true
          return (
            extra.label.toLowerCase().includes(normalizedQuery) ||
            (extra.description?.toLowerCase().includes(normalizedQuery) ?? false)
          )
        })
        return { category, items }
      })
      .filter((group) => group.items.length > 0)
  }, [normalizedQuery])

  // Kalendarz
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayRaw = new Date(currentYear, currentMonth, 1).getDay()
  const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1

  const isDateBooked = (day: number) => bookedDates.includes(day)
  const isDatePast = (day: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(currentYear, currentMonth, day) < today
  }
  const isWeekend = (day: number) => {
    const d = new Date(currentYear, currentMonth, day).getDay()
    return d === 0 || d === 6
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else setCurrentMonth((m) => m - 1)
    setSelectedDay(null)
  }
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else setCurrentMonth((m) => m + 1)
    setSelectedDay(null)
  }

  const canProceed = () => {
    if (step === 2) return selectedDay !== null
    if (step === 3) return form.name.trim() && form.phone.trim()
    return true
  }

  // Zamiast scrollowania całej strony — przewijamy tylko wewnętrzny kontener kreatora.
  const scrollWizardTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Synchronizacja kroków z historią przeglądarki — gest „wstecz" cofa o jeden
  // etap, zamiast od razu opuszczać konfigurator.
  const applyScreen = (target: number) => {
    setStep(Math.min(3, Math.max(0, target)))
    scrollWizardTop()
  }
  const { navigate } = useWizardHistory({
    screen: step,
    applyScreen,
    basePath: "/rezerwacja/konfigurator",
  })

  const goNext = () => {
    if (step < 3) {
      navigate(step + 1)
    } else {
      const summary: BookingSummary = {
        orderNumber: `ZAP-${Date.now().toString(36).toUpperCase()}`,
        tentLabel: selectedTent.label,
        tentSize: selectedTent.size,
        tentPrice: selectedTent.price,
        extras: selectedExtras.map((id) => {
          const extra = extras.find((e) => e.id === id)!
          return { label: extra.label, price: extra.price }
        }),
        dateLabel:
          selectedDay !== null
            ? `${selectedDay} ${months[currentMonth]} ${currentYear}`
            : "Termin elastyczny — ustalimy telefonicznie",
        total,
      }
      onSubmit(summary)
    }
  }

  const goBack = () => {
    if (step > 0) navigate(step - 1)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Nagłówek + wskaźnik kroków (przyklejony) */}
      <header className="shrink-0 border-b border-border/60 bg-card px-4 pb-3 pt-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          {/* Pasek górny: X po lewej, tytuł na środku, element równoważący po prawej */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Zamknij konfigurator"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground shadow-sm transition-colors hover:bg-muted md:h-11 md:w-11 md:rounded-2xl"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <span className="flex-1 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground md:text-[15px]">
              Konfigurator
            </span>

            <span className="h-9 w-9 shrink-0 md:h-11 md:w-11" aria-hidden />
          </div>

          {/* Wskaźnik kroków — kompaktowe „kulki" z ikonami i łączącymi liniami */}
          <div className="mt-4 flex items-start">
            {steps.map((s, i) => {
              const StepIcon = s.icon
              const done = step > s.id
              const active = step === s.id
              return (
                <div key={s.id} className="flex flex-1 items-start last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 md:h-10 md:w-10",
                        active && "bg-accent text-accent-foreground shadow-md",
                        done && "bg-accent/70 text-accent-foreground",
                        !active && !done && "bg-muted text-muted-foreground",
                      )}
                    >
                      {done ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <StepIcon className="h-4 w-4" strokeWidth={1.75} />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium leading-none transition-colors md:text-[11px]",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "mx-1.5 mt-4 h-0.5 flex-1 rounded-full transition-colors duration-300 sm:mx-2 md:mt-5",
                        step > s.id ? "bg-accent" : "bg-muted-foreground/25",
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </header>

      {/* Treść kroku (jedyny scrollowalny obszar) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
          <div key={step} className="animate-fade-in-up">
            {/* KROK 1: NAMIOT */}
            {step === 0 && (
              <div>
                <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
                  Krok 1 z 4
                </span>
                <h3 className="mt-3 text-3xl font-bold leading-tight text-foreground">Wybierz namiot</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">Dopasuj wielkość namiotu do liczby gości.</p>

                <div className="mt-5 space-y-3">
                  {tents.map((tent) => {
                    const isActive = tent.id === tentId
                    return (
                      <button
                        key={tent.id}
                        onClick={() => setTentId(tent.id)}
                        aria-pressed={isActive}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-2xl border-2 p-2.5 text-left transition-all duration-200 sm:gap-4 sm:p-3",
                          isActive
                            ? "border-accent bg-accent/[0.06] shadow-sm"
                            : "border-border bg-card hover:border-accent/40",
                        )}
                      >
                        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-36">
                          <Image
                            src={tent.image}
                            alt={`Namiot ${tent.label}`}
                            fill
                            className="object-cover"
                            sizes="144px"
                          />
                          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-card/95 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm backdrop-blur-sm">
                            <Users className="h-3 w-3" />
                            {tent.capacity}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-base font-bold leading-tight text-foreground sm:text-lg">
                            {tent.label}
                          </h4>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Ruler className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                            {tent.size}
                          </p>
                          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground text-pretty">
                            {tent.tagline}
                          </p>
                          <p className="mt-1 text-sm font-bold text-foreground">{tent.price} zł</p>
                        </div>

                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                            isActive
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-muted-foreground/30 text-transparent",
                          )}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* KROK 2: DODATKI */}
            {step === 1 && (
              <div>
                <h3 className="font-semibold text-base mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">2</span>
                  Dobierz dodatki
                </h3>
                <p className="text-xs text-muted-foreground mb-4 ml-8">Wybierz dodatki, które uzupełnią Twoją imprezę.</p>

                {/* Pasek wyszukiwania */}
                <div className="relative mb-4">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={extraQuery}
                    onChange={(e) => setExtraQuery(e.target.value)}
                    placeholder="Szukaj dodatków..."
                    aria-label="Szukaj dodatków"
                    className="h-12 rounded-xl pl-10 pr-10"
                  />
                  {extraQuery && (
                    <button
                      type="button"
                      onClick={() => setExtraQuery("")}
                      aria-label="Wyczyść wyszukiwanie"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Lista kategorii z rozwijanymi dodatkami */}
                {groupedExtras.length === 0 ? (
                  <div className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
                    Brak dodatków pasujących do „{extraQuery}".
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {groupedExtras.map(({ category, items }) => {
                      const CatIcon = category.icon
                      // Podczas wyszukiwania kategorie rozwijają się automatycznie.
                      const isOpen = isSearching || openCategory === category.id
                      const selectedCount = items.filter((i) => selectedExtras.includes(i.id)).length
                      return (
                        <div
                          key={category.id}
                          className={cn(
                            "rounded-xl border overflow-hidden transition-colors",
                            isOpen ? "border-accent/40 bg-card" : "border-border bg-card",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => !isSearching && setOpenCategory((prev) => (prev === category.id ? null : category.id))}
                            aria-expanded={isOpen}
                            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                          >
                            <div className="w-9 h-9 shrink-0 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                              <CatIcon className="w-4 h-4" />
                            </div>
                            <span className="flex-1 font-medium text-sm text-foreground">{category.label}</span>
                            {selectedCount > 0 && (
                              <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                                {selectedCount}
                              </span>
                            )}
                            <span className="shrink-0 text-sm font-medium text-muted-foreground tabular-nums">
                              {items.length}
                            </span>
                            {!isSearching && (
                              <ChevronDown
                                className={cn(
                                  "shrink-0 w-4 h-4 text-muted-foreground transition-transform duration-200",
                                  isOpen && "rotate-180",
                                )}
                              />
                            )}
                          </button>

                          {isOpen && (
                            <div className="border-t px-2 pb-2 pt-1">
                              {items.map((extra) => {
                                const isSelected = selectedExtras.includes(extra.id)
                                return (
                                  <button
                                    key={extra.id}
                                    type="button"
                                    onClick={() => toggleExtra(extra.id)}
                                    aria-pressed={isSelected}
                                    className={cn(
                                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                                      isSelected ? "bg-primary/5" : "hover:bg-muted/60",
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-colors",
                                        isSelected
                                          ? "border-primary bg-primary text-primary-foreground"
                                          : "border-border text-transparent",
                                      )}
                                    >
                                      {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-muted-foreground" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[13px] font-medium text-foreground leading-tight">{extra.label}</p>
                                      {extra.description && (
                                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                                          {extra.description}
                                        </p>
                                      )}
                                    </div>
                                    <span
                                      className={cn(
                                        "shrink-0 text-[13px] font-bold tabular-nums",
                                        isSelected ? "text-primary" : "text-foreground",
                                      )}
                                    >
                                      +{extra.price} zł
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* KROK 3: TERMIN */}
            {step === 2 && (
              <div>
                <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">3</span>
                  Wybierz termin
                </h3>

                <div className="max-w-sm mx-auto">
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={handlePrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-semibold">
                        {months[currentMonth]} {currentYear}
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mb-1 grid grid-cols-7 gap-1">
                      {weekDays.map((d, i) => (
                        <div
                          key={d}
                          className={cn(
                            "py-1 text-center text-[10px] font-medium uppercase",
                            i >= 5 ? "text-foreground/70" : "text-muted-foreground",
                          )}
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`e-${i}`} className="aspect-square" />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const booked = isDateBooked(day)
                        const past = isDatePast(day)
                        const selected = selectedDay === day
                        const weekend = isWeekend(day)
                        return (
                          <button
                            key={day}
                            disabled={booked || past}
                            onClick={() => setSelectedDay(day)}
                            className={cn(
                              "flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-all duration-200",
                              booked && "cursor-not-allowed border border-destructive/40 bg-destructive/[0.06] text-destructive/60 line-through",
                              past && !booked && "cursor-not-allowed text-muted-foreground/30",
                              !booked && !past && !selected && "cursor-pointer hover:bg-accent/15 hover:text-accent",
                              !booked && !past && !selected && weekend && "bg-foreground/[0.07] font-semibold text-foreground/80",
                              selected && "bg-accent text-accent-foreground shadow-md",
                            )}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-accent" />
                      <span>Wybrany</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded border border-destructive/40 bg-destructive/[0.06]" />
                      <span>Zajęty</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-foreground/[0.07]" />
                      <span>Weekend</span>
                    </div>
                  </div>

                  {selectedDay !== null && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm rounded-lg bg-accent/10 text-foreground py-2 px-3">
                      <Check className="w-4 h-4 shrink-0 text-accent" />
                      <span>
                        <span className="font-semibold">{selectedDay} {months[currentMonth]}</span> — termin dostępny
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KROK 4: DANE */}
            {step === 3 && (
              <div className="mx-auto max-w-md">
                <div className="text-center">
                  <h3 className="text-balance text-xl font-bold leading-tight text-foreground sm:text-2xl">
                    Zostaw kontakt, a my się odezwiemy
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-pretty text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                    Twój zestaw jest gotowy. Zostaw namiary, a odezwiemy się, żeby dopiąć szczegóły.
                  </p>
                </div>

                {/* Mini-podsumowanie wybranego zestawu */}
                <div className="mt-4 flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Tent className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] leading-tight text-muted-foreground">Twój zestaw</p>
                    <p className="truncate text-sm font-semibold leading-tight text-foreground">
                      Namiot {selectedTent.size} · {total.toLocaleString("pl-PL")} zł
                      {selectedDay !== null && (
                        <span className="font-normal text-muted-foreground">
                          {" · "}
                          {selectedDay} {months[currentMonth]}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3.5">
                  <div>
                    <Label htmlFor="bf-name" className="text-xs font-medium text-foreground">
                      Imię
                    </Label>
                    <Input
                      id="bf-name"
                      placeholder="Jan"
                      className="mt-1.5"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bf-phone" className="text-xs font-medium text-foreground">
                      Telefon
                    </Label>
                    <Input
                      id="bf-phone"
                      type="tel"
                      placeholder="512 345 678"
                      className="mt-1.5"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bf-email" className="text-xs font-medium text-foreground">
                      E-mail (opcjonalnie)
                    </Label>
                    <Input
                      id="bf-email"
                      type="email"
                      placeholder="jan.kowalski@mail.pl"
                      className="mt-1.5"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bf-notes" className="text-xs font-medium text-foreground">
                      Uwagi (opcjonalnie)
                    </Label>
                    <Textarea
                      id="bf-notes"
                      placeholder="Napisz, jeśli masz dodatkowe informacje dla nas"
                      className="mt-1.5 min-h-[84px]"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pasek podsumowania (przyklejony na dole) */}
      <footer className="shrink-0 border-t border-border/60 bg-card px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5">
            {step > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                aria-label="Wstecz"
                className="h-9 w-9 shrink-0 text-muted-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="min-w-0">
              <p className="text-[11px] leading-tight text-muted-foreground">Twój zestaw</p>
              <p className="text-xl font-bold leading-tight text-foreground">
                {total.toLocaleString("pl-PL")} zł
              </p>
              <p className="text-[11px] leading-tight text-muted-foreground">
                Zaliczka {deposit.toLocaleString("pl-PL")} zł
              </p>
            </div>
          </div>

          <Button
            onClick={goNext}
            disabled={!canProceed()}
            className="h-11 shrink-0 gap-1.5 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-accent/90 sm:px-6"
          >
            {step === 3 ? "Wyślij zapytanie" : "Dalej"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
