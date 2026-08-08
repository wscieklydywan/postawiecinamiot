"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Heart,
  Church,
  Cake,
  Building2,
  FerrisWheel,
  PartyPopper,
  Users,
  Home,
  Trees,
  MapPin,
  Building,
  Briefcase,
  HelpCircle,
  Tent,
  LayoutGrid,
  Table,
  Armchair,
  Lightbulb,
  Flame,
  Wallet,
  Gem,
  Sofa,
  Scale,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Truck,
  Wrench,
  Zap,
  ShieldCheck,
  Lightbulb as LightbulbIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { tents, extras } from "@/lib/booking-data"
import { useWizardHistory } from "@/lib/use-wizard-history"

// ---------------------------------------------------------------------------
// TYPY WYNIKU / CALLBACKÓW
// ---------------------------------------------------------------------------

export type QuizDate = { day: number; month: number; year: number }

export type QuizPhase = "intro" | "quiz" | "result" | "contact"

export type QuizResult = {
  tentId: string
  extraIds: string[]
  guests: number
  guessedGuests: boolean
  occasionLabel: string
  locationLabel: string
  priorityLabel: string
  dateMode: "picked" | "flexible" | null
  date: QuizDate | null
  dateLabel: string
  why: string
  form: { name: string; phone: string; email: string; notes: string }
}

// ---------------------------------------------------------------------------
// DANE OPCJI
// ---------------------------------------------------------------------------

type Option = { value: string; label: string; icon: typeof Users }

const occasions: Option[] = [
  { value: "wedding", label: "Wesele", icon: Heart },
  { value: "communion", label: "Komunia", icon: Church },
  { value: "birthday", label: "Urodziny", icon: Cake },
  { value: "company", label: "Imprezę firmową", icon: Briefcase },
  { value: "festival", label: "Festyn / wydarzenie", icon: FerrisWheel },
  { value: "other", label: "Inną imprezę", icon: PartyPopper },
]

const guestOptions: { value: string; label: string; num: number | null }[] = [
  { value: "20", label: "do 20 osób", num: 20 },
  { value: "40", label: "20 – 40 osób", num: 40 },
  { value: "60", label: "40 – 60 osób", num: 60 },
  { value: "80", label: "60 – 80 osób", num: 80 },
  { value: "120", label: "80 – 120 osób", num: 120 },
  { value: "150", label: "ponad 120 osób", num: 150 },
  { value: "unknown", label: "Nie wiem jeszcze", num: null },
]

// Karty miejsc (bez „Inne" — to osobne pole tekstowe)
const locationCards: Option[] = [
  { value: "home", label: "Przy domu", icon: Home },
  { value: "garden", label: "W ogrodzie", icon: Trees },
  { value: "plot", label: "Na działce", icon: MapPin },
  { value: "hall", label: "Przy sali", icon: Building },
  { value: "company", label: "W firmie", icon: Building2 },
  { value: "unknown", label: "Jeszcze nie wiem", icon: HelpCircle },
]

type NeedOption = {
  value: string
  label: string
  icon: typeof Tent
  extraId?: string
  always?: boolean
  advise?: boolean
}

const needOptions: NeedOption[] = [
  { value: "namiot", label: "Namiot", icon: Tent, always: true },
  { value: "podloga", label: "Podłoga", icon: LayoutGrid, extraId: "podloga" },
  { value: "stoly", label: "Stoły", icon: Table, extraId: "stoly" },
  { value: "krzesla", label: "Krzesła", icon: Armchair, extraId: "krzesla" },
  { value: "oswietlenie", label: "Oświetlenie", icon: Lightbulb, extraId: "oswietlenie-led" },
  { value: "ogrzewanie", label: "Ogrzewanie", icon: Flame, extraId: "nagrzewnice" },
  { value: "dekoracje", label: "Dekoracje", icon: Sparkles, extraId: "dekoracje" },
]

const adviseOption: NeedOption = {
  value: "advise",
  label: "Nie wiem — doradźcie mi",
  icon: LightbulbIcon,
  advise: true,
}

const priorities: Option[] = [
  { value: "price", label: "Jak najlepsza cena", icon: Wallet },
  { value: "elegant", label: "Żeby wyglądało pięknie", icon: Gem },
  { value: "comfort", label: "Komfort gości", icon: Sofa },
  { value: "balance", label: "Dobry balans wszystkiego", icon: Scale },
  { value: "unknown", label: "Nie wiem", icon: HelpCircle },
]

const months = [
  "Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca",
  "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia",
]
const monthsNom = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
]
const weekDays = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"]
const bookedDates = [5, 12, 13, 20, 21, 27]

const TENT_TIERS = ["tent-small", "tent-medium", "tent-large", "tent-premium"]
export const TOTAL_STEPS = 6

// ---------------------------------------------------------------------------
// STAN ODPOWIEDZI
// ---------------------------------------------------------------------------

type Answers = {
  occasion: string | null
  guests: string | null
  location: string | null
  locationOther: string
  needs: string[]
  priority: string | null
  dateMode: "picked" | "flexible" | null
  date: QuizDate | null
}

const initialAnswers: Answers = {
  occasion: null,
  guests: null,
  location: null,
  locationOther: "",
  needs: ["namiot"],
  priority: null,
  dateMode: null,
  date: null,
}

// ---------------------------------------------------------------------------
// LOGO (maska w kolorze marki)
// ---------------------------------------------------------------------------

function QuizLogo() {
  return (
    <div className="-mt-6 mb-0 flex justify-center sm:-mt-8">
      <span
        role="img"
        aria-label="Postawię Ci Namiot — logo"
        className="block h-[150px] w-[235px] bg-foreground sm:h-[184px] sm:w-[288px]"
        style={{
          WebkitMaskImage: "url(/images/logo.png)",
          maskImage: "url(/images/logo.png)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// KOMPONENT GŁÓWNY
// ---------------------------------------------------------------------------

export function TentQuiz({
  onBack,
  onEditSet,
  onSubmit,
  onStateChange,
}: {
  onBack: () => void
  onEditSet: (result: { tentId: string; extraIds: string[] }) => void
  onSubmit: (result: QuizResult) => void
  onStateChange?: (state: { phase: QuizPhase; step: number }) => void
}) {
  const [phase, setPhase] = useState<QuizPhase>("intro")
  const [step, setStep] = useState(0)

  // Zgłaszamy bieżącą fazę i krok do rodzica (górny pasek żyje w page.tsx).
  useEffect(() => {
    onStateChange?.({ phase, step })
  }, [phase, step, onStateChange])
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" })
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  // Który wiersz podsumowania jest aktualnie rozwinięty do edycji (null = żaden).
  const [editingStep, setEditingStep] = useState<number | null>(null)

  // -----------------------------------------------------------------------
  // ALGORYTM REKOMENDACJI
  // -----------------------------------------------------------------------
  const recommendation = useMemo(() => {
    const guestOpt = guestOptions.find((g) => g.value === answers.guests)
    let guests = guestOpt?.num ?? null
    let guessed = false
    if (guests === null) {
      guests = answers.occasion === "wedding" ? 80 : 60
      guessed = true
    }

    let tierIdx = guests <= 20 ? 0 : guests <= 40 ? 1 : guests <= 80 ? 2 : 3
    if (answers.priority === "comfort" && tierIdx < TENT_TIERS.length - 1) tierIdx += 1
    const tentId = TENT_TIERS[tierIdx]

    const explicit = needOptions
      .filter((n) => answers.needs.includes(n.value) && n.extraId)
      .map((n) => n.extraId!) as string[]

    const nonNamiotSelected = answers.needs.filter((v) => v !== "namiot" && v !== "advise")
    const advise = answers.needs.includes("advise") || nonNamiotSelected.length === 0
    const eveningLikely = ["wedding", "birthday", "other", "festival"].includes(answers.occasion ?? "")

    const set = new Set<string>(explicit)

    if (advise) {
      set.add("stoly")
      set.add("krzesla")
      if (eveningLikely) set.add("oswietlenie-led")
      if (answers.occasion === "wedding") set.add("dekoracje")
    }
    if (answers.priority === "elegant") {
      set.add("podloga")
      set.add("oswietlenie-led")
    }
    if (answers.priority === "price") {
      if (!explicit.includes("podloga")) set.delete("podloga")
      if (!explicit.includes("dekoracje")) set.delete("dekoracje")
    }

    const extraIds = extras.filter((e) => set.has(e.id)).map((e) => e.id)
    const tent = tents.find((t) => t.id === tentId) ?? tents[1]
    const chosenExtras = extras.filter((e) => extraIds.includes(e.id))
    const total = tent.price + chosenExtras.reduce((s, e) => s + e.price, 0)

    const parts: string[] = []
    parts.push(
      `Przy około ${guests} gościach namiot ${tent.size} zapewnia wygodną ilość miejsca do siedzenia i swobodnego poruszania się.`,
    )
    if (guessed) parts.push("Nie znałeś jeszcze dokładnej liczby gości, więc przyjęliśmy bezpieczny zapas.")
    if (answers.priority === "comfort") parts.push("Postawiłeś na komfort gości, dlatego dobraliśmy namiot z zapasem przestrzeni.")
    if (chosenExtras.some((e) => e.id === "oswietlenie-led")) parts.push("Dodaliśmy oświetlenie LED, ponieważ taka impreza zwykle trwa do wieczora.")
    if (chosenExtras.some((e) => e.id === "podloga")) parts.push("Podłogę dołożyliśmy pod elegancki charakter przyjęcia.")
    if (answers.priority === "price") parts.push("Zależało Ci na najlepszej cenie, więc zestaw zawiera tylko to, co naprawdę potrzebne.")
    const why = parts.join(" ")

    return { tentId, extraIds, tent, chosenExtras, total, guests, guessed, why }
  }, [answers])

  // -----------------------------------------------------------------------
  // ETYKIETY DO PODSUMOWANIA
  // -----------------------------------------------------------------------
  const occasionLabel = occasions.find((o) => o.value === answers.occasion)?.label ?? "—"
  const occasionIcon = occasions.find((o) => o.value === answers.occasion)?.icon ?? PartyPopper
  const guestLabel = answers.guests ? guestOptions.find((g) => g.value === answers.guests)?.label ?? "—" : "—"
  const locationLabel =
    answers.location === "other"
      ? answers.locationOther.trim() || "Inne"
      : locationCards.find((l) => l.value === answers.location)?.label ?? "—"
  const priorityLabel = priorities.find((p) => p.value === answers.priority)?.label ?? "—"
  const priorityIcon = priorities.find((p) => p.value === answers.priority)?.icon ?? Scale
  const needsLabel =
    recommendation.chosenExtras.length > 0
      ? `Namiot, ${recommendation.chosenExtras.map((e) => e.label.replace(/ \(komplet\)| taneczna| LED/g, "")).join(", ")}`
      : "Sam namiot"
  const dateLabel = answers.date
    ? `${answers.date.day} ${months[answers.date.month]} ${answers.date.year}`
    : "—"

  // -----------------------------------------------------------------------
  // NAWIGACJA (zsynchronizowana z historią przeglądarki)
  // Indeksy ekranów: 0 = intro, 1–6 = kroki quizu, 7 = wynik, 8 = kontakt.
  // -----------------------------------------------------------------------
  const screen = phase === "intro" ? 0 : phase === "quiz" ? step + 1 : phase === "result" ? 7 : 8

  const applyScreen = (target: number) => {
    if (target <= 0) {
      setPhase("intro")
    } else if (target <= TOTAL_STEPS) {
      setPhase("quiz")
      setStep(target - 1)
    } else if (target === 7) {
      setPhase("result")
    } else {
      setPhase("contact")
    }
  }

  const { navigate } = useWizardHistory({
    screen,
    applyScreen,
    basePath: "/rezerwacja/quiz",
  })

  const advance = () => navigate(screen + 1)
  const goPrev = () => navigate(screen - 1)
  // Zaznaczenie opcji tylko zapisuje wybór — dalej przenosi dopiero „Dalej".
  const selectSingle = <K extends keyof Answers>(field: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [field]: value }))
  }
  const toggleNeed = (opt: NeedOption) => {
    if (opt.always) return
    setAnswers((prev) => {
      let next = [...prev.needs]
      if (opt.advise) {
        next = next.includes("advise") ? next.filter((v) => v !== "advise") : ["namiot", "advise"]
        return { ...prev, needs: next }
      }
      next = next.filter((v) => v !== "advise")
      next = next.includes(opt.value) ? next.filter((v) => v !== opt.value) : [...next, opt.value]
      return { ...prev, needs: next }
    })
  }
  const buildResult = (): QuizResult => ({
    tentId: recommendation.tentId,
    extraIds: recommendation.extraIds,
    guests: recommendation.guests,
    guessedGuests: recommendation.guessed,
    occasionLabel,
    locationLabel,
    priorityLabel,
    dateMode: answers.dateMode,
    date: answers.date,
    dateLabel,
    why: recommendation.why,
    form,
  })

  // Kalendarz
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDayRaw = new Date(calYear, calMonth, 1).getDay()
  const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1
  const isBooked = (d: number) => bookedDates.includes(d)
  const isPast = (d: number) => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return new Date(calYear, calMonth, d) < t
  }
  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11)
      setCalYear((y) => y - 1)
    } else setCalMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0)
      setCalYear((y) => y + 1)
    } else setCalMonth((m) => m + 1)
  }

  // Wspólny kalendarz — używany w kroku terminu oraz przy edycji w podsumowaniu.
  const renderCalendar = () => (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <div className="mb-3 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold">
          {monthsNom[calMonth]} {calYear}
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={nextMonth}>
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
          const booked = isBooked(day)
          const past = isPast(day)
          // Weekend = szósta (Sob) i siódma (Ndz) kolumna siatki.
          const isWeekend = (firstDay + i) % 7 >= 5
          const selected =
            answers.date?.day === day &&
            answers.date?.month === calMonth &&
            answers.date?.year === calYear
          return (
            <button
              key={day}
              disabled={booked || past}
              onClick={() =>
                setAnswers((p) => ({ ...p, dateMode: "picked", date: { day, month: calMonth, year: calYear } }))
              }
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-all duration-200",
                booked && "cursor-not-allowed border border-destructive/40 bg-destructive/[0.06] text-destructive/60 line-through",
                past && !booked && "cursor-not-allowed text-muted-foreground/30",
                !booked && !past && !selected && "cursor-pointer hover:bg-accent/15 hover:text-accent",
                // Delikatne wyróżnienie weekendów (dostępne dni) — szary, nie pomarańczowy.
                !booked && !past && !selected && isWeekend && "bg-foreground/[0.07] font-semibold text-foreground/80",
                selected && "bg-accent text-accent-foreground shadow-md",
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )

  // Rozwijany edytor pojedynczego wiersza podsumowania (bez zmiany ekranu).
  const renderRowEditor = (rowStep: number) => {
    const close = () => setEditingStep(null)
    switch (rowStep) {
      case 0:
        return (
          <div className="grid grid-cols-2 gap-2">
            {occasions.map((opt) => {
              const Icon = opt.icon
              const selected = answers.occasion === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    selectSingle("occasion", opt.value)
                    close()
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all",
                    selected ? "border-accent bg-accent/10" : "border-border hover:border-accent/40 hover:bg-muted/40",
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", selected ? "text-accent" : "text-foreground/60")} strokeWidth={1.5} />
                  <span className="text-[13px] font-medium text-foreground">{opt.label}</span>
                </button>
              )
            })}
          </div>
        )
      case 1:
        return (
          <div className="space-y-2">
            {guestOptions.map((opt) => {
              const selected = answers.guests === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    selectSingle("guests", opt.value)
                    close()
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all",
                    selected ? "border-accent bg-accent/10" : "border-border hover:border-accent/40 hover:bg-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      selected ? "border-accent" : "border-muted-foreground/40",
                    )}
                  >
                    {selected && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
                  </span>
                  <span className="text-sm font-medium text-foreground">{opt.label}</span>
                </button>
              )
            })}
          </div>
        )
      case 2:
        return (
          <div>
            <div className="grid grid-cols-3 gap-2.5">
              {locationCards.map((opt) => {
                const Icon = opt.icon
                const selected = answers.location === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      selectSingle("location", opt.value)
                      close()
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                      selected ? "border-accent bg-accent/10" : "border-border hover:border-accent/40 hover:bg-muted/40",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", selected ? "text-accent" : "text-foreground/70")} strokeWidth={1.5} />
                    <span className="text-[11px] font-semibold leading-tight text-foreground">{opt.label}</span>
                  </button>
                )
              })}
            </div>
            <div
              className={cn(
                "mt-2.5 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 transition-colors",
                answers.location === "other" ? "border-accent bg-accent/5" : "border-border",
              )}
            >
              <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Inne (napisz gdzie)"
                value={answers.locationOther}
                onChange={(e) => setAnswers((p) => ({ ...p, location: "other", locationOther: e.target.value }))}
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-2">
            {needOptions.map((opt) => {
              const Icon = opt.icon
              const checked = answers.needs.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleNeed(opt)}
                  disabled={opt.always}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all",
                    checked ? "border-accent bg-accent/10" : "border-border hover:border-accent/40 hover:bg-muted/40",
                    opt.always && "cursor-default",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                      checked ? "border-accent bg-accent text-accent-foreground" : "border-muted-foreground/40",
                    )}
                  >
                    {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                  <Icon className={cn("h-4 w-4 shrink-0", checked ? "text-accent" : "text-foreground/60")} strokeWidth={1.5} />
                  <span className="text-sm font-medium text-foreground">{opt.label}</span>
                </button>
              )
            })}
            <button
              onClick={() => toggleNeed(adviseOption)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all",
                answers.needs.includes("advise")
                  ? "border-accent bg-accent/10"
                  : "border-dashed border-accent/50 bg-accent/[0.04] hover:bg-accent/10",
              )}
            >
              <LightbulbIcon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-accent">{adviseOption.label}</span>
              {answers.needs.includes("advise") && <Check className="ml-auto h-4 w-4 text-accent" strokeWidth={3} />}
            </button>
            <Button onClick={close} className="mt-1 h-10 w-full bg-accent text-sm text-accent-foreground hover:bg-accent/90">
              Gotowe
            </Button>
          </div>
        )
      case 4:
        return (
          <div className="space-y-2">
            {priorities.map((opt) => {
              const Icon = opt.icon
              const selected = answers.priority === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    selectSingle("priority", opt.value)
                    close()
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all",
                    selected ? "border-accent bg-accent/10" : "border-border hover:border-accent/40 hover:bg-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                      selected ? "bg-accent text-accent-foreground" : "bg-muted text-foreground/70",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                </button>
              )
            })}
          </div>
        )
      case 5:
        return (
          <div>
            {renderCalendar()}
            <Button onClick={close} className="mt-2.5 h-10 w-full bg-accent text-sm text-accent-foreground hover:bg-accent/90">
              Gotowe
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  // =========================================================================
  // EKRAN STARTOWY
  // =========================================================================
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-md animate-fade-in-up text-center">
        <QuizLogo />
        <h3 className="text-balance text-xl font-bold leading-tight text-foreground sm:text-[28px]">
          Pomóż nam poznać Twoją imprezę
        </h3>
        <p className="mx-auto mt-2.5 max-w-sm text-pretty text-[13px] leading-relaxed text-muted-foreground sm:mt-3 sm:text-sm">
          Odpowiedz na kilka krótkich pytań. Na końcu przygotujemy gotową propozycję namiotu i dodatków,
          którą zawsze możesz zmienić.
        </p>

        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl sm:mt-5">
          <Image
            src="/images/ambiance-evening.png"
            alt="Namiot imprezowy o zachodzie słońca"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 448px"
            priority
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-muted-foreground">
          {[
            { icon: Zap, text: "Szybko i prosto" },
            { icon: Sparkles, text: "Propozycja dopasowana do Ciebie" },
            { icon: ShieldCheck, text: "Bez zobowiązań" },
          ].map((f) => {
            const Icon = f.icon
            return (
              <span key={f.text} className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                <Icon className="h-3.5 w-3.5 text-accent" />
                {f.text}
              </span>
            )
          })}
        </div>

        <Button
          onClick={() => navigate(1)}
          className="mt-5 h-11 w-full gap-2 bg-accent text-sm text-accent-foreground hover:bg-accent/90 sm:mt-6 sm:h-12 sm:text-base"
        >
          Zaczynamy
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">To zajmie tylko 2 minuty!</p>

        <button
          onClick={onBack}
          className="mx-auto mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Wróć do wyboru
        </button>
      </div>
    )
  }

  // =========================================================================
  // EKRAN WYNIKU — „Gotowe!" + Podsumowanie
  // =========================================================================
  if (phase === "result") {
    const { tent, chosenExtras, total, guests, why } = recommendation
    const guestsHigh = Math.round((guests + 10) / 5) * 5

    const itemLabel = (id: string, fallback: string) => {
      switch (id) {
        case "krzesla":
          return `${guests} krzeseł`
        case "stoly":
          return `${Math.max(1, Math.ceil(guests / 8))} stołów`
        case "podloga":
          return "Podłoga drewniana"
        case "oswietlenie-led":
          return "Oświetlenie LED"
        default:
          return fallback
      }
    }

    const summaryRows = [
      { icon: occasionIcon, label: "Rodzaj imprezy", value: occasionLabel, step: 0 },
      {
        icon: Users,
        label: "Liczba osób",
        value: recommendation.guessed ? `${guestLabel} (około ${guests})` : `${guestLabel} (około ${guests})`,
        step: 1,
      },
      { icon: MapPin, label: "Miejsce", value: locationLabel, step: 2 },
      { icon: CalendarIcon, label: "Termin", value: dateLabel, step: 5 },
      { icon: priorityIcon, label: "Priorytet", value: priorityLabel, step: 4 },
      { icon: Sparkles, label: "Potrzebne dodatki", value: needsLabel, step: 3 },
    ]

    return (
      <div className="mx-auto max-w-md animate-fade-in-up">
        {/* KARTA „GOTOWE" */}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          {/* Zdjęcie + nagłówek */}
          <div className="relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9]">
              <Image
                src={tent.image}
                alt={`Namiot ${tent.label}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 448px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
            </div>
            <div className="absolute inset-x-0 top-3.5 text-center sm:top-4">
              <h3 className="text-xl font-bold text-white drop-shadow sm:text-2xl">Gotowe!</h3>
              <p className="mx-auto mt-0.5 max-w-[16rem] text-[11px] text-white/90 drop-shadow sm:text-xs">
                Przygotowaliśmy propozycję dla Ciebie
              </p>
            </div>
          </div>

          {/* Biała karta propozycji — nachodzi na zdjęcie od dołu */}
          <div className="relative z-10 -mt-6 rounded-t-2xl bg-card p-4 sm:-mt-7 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Polecamy</p>
            <h4 className="text-xl font-bold text-foreground sm:text-2xl">Namiot {tent.size}</h4>
            <p className="text-[13px] text-muted-foreground sm:text-sm">
              dla około {guests}–{guestsHigh} osób
            </p>

            {/* Siatka pozycji zestawu */}
            {chosenExtras.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t pt-4 sm:grid-cols-4">
                {chosenExtras.slice(0, 4).map((e) => {
                  const Icon = e.icon
                  return (
                    <div key={e.id} className="flex flex-col items-center gap-1.5 text-center">
                      <Icon className="h-6 w-6 text-foreground/70" strokeWidth={1.5} />
                      <span className="text-[11px] leading-tight text-muted-foreground">
                        {itemLabel(e.id, e.label)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* W cenie */}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t pt-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wrench className="h-4 w-4 text-accent" strokeWidth={1.5} />
                Montaż i demontaż w cenie
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-accent" strokeWidth={1.5} />
                Transport w cenie
              </span>
            </div>

            {/* Cena */}
            <div className="mt-4 border-t pt-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Cena orientacyjna</p>
              <p className="text-3xl font-bold text-foreground">
                {total.toLocaleString("pl-PL")} zł{" "}
                <span className="text-sm font-normal text-muted-foreground">brutto</span>
              </p>
            </div>

            {/* Dlaczego taki zestaw */}
            <div className="mt-4 rounded-xl bg-accent/10 p-3.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
                Dlaczego właśnie taki zestaw?
              </p>
              <p className="text-pretty text-xs leading-relaxed text-muted-foreground">{why}</p>
            </div>
          </div>
        </div>

        {/* PODSUMOWANIE WYBORÓW */}
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm sm:mt-5">
          <h4 className="px-4 pb-2 pt-4 text-base font-bold text-foreground sm:px-5 sm:pt-5 sm:text-lg">Podsumowanie Twoich wyborów</h4>
          <ul className="divide-y">
            {summaryRows.map((row) => {
              const Icon = row.icon
              const isEditing = editingStep === row.step
              return (
                <li key={row.label} className="px-4 py-2.5 sm:px-5 sm:py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] leading-tight text-muted-foreground">{row.label}</p>
                        <p className="truncate text-sm font-medium leading-tight text-foreground">{row.value}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingStep(isEditing ? null : row.step)}
                      aria-expanded={isEditing}
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent/70"
                    >
                      {isEditing ? "Zwiń" : "Edytuj"}
                      <Pencil className={cn("h-3.5 w-3.5 transition-transform", isEditing && "rotate-45")} />
                    </button>
                  </div>
                  {isEditing && <div className="mt-3 animate-fade-in-up">{renderRowEditor(row.step)}</div>}
                </li>
              )
            })}
          </ul>
        </div>

        {/* AKCJE */}
        <div className="mt-4 space-y-2.5 sm:mt-5">
          <Button
            onClick={() => navigate(8)}
            className="h-11 w-full gap-2 bg-accent text-sm text-accent-foreground hover:bg-accent/90 sm:h-12 sm:text-base"
          >
            Wyślij zapytanie
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => onEditSet({ tentId: recommendation.tentId, extraIds: recommendation.extraIds })}
            className="h-11 w-full gap-2 text-sm sm:h-12"
          >
            Dopasuj w konfiguratorze
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Nic nie tracisz — wszystko możesz jeszcze zmienić!
        </p>
      </div>
    )
  }

  // =========================================================================
  // EKRAN KONTAKTU — zbieramy dane na sam koniec
  // =========================================================================
  if (phase === "contact") {
    const canSend = form.name.trim() !== "" && form.phone.trim() !== ""
    return (
      <div className="mx-auto max-w-md animate-fade-in-up">
        <QuizLogo />
        <div className="text-center">
          <h3 className="text-balance text-xl font-bold leading-tight text-foreground sm:text-2xl">
            Zostaw kontakt, a my się odezwiemy
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
              Twoja propozycja jest gotowa. Zostaw namiary, a odezwiemy się, żeby dopiąć szczegóły.
          </p>
        </div>

        {/* Mini-podsumowanie wybranego zestawu */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Tent className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] leading-tight text-muted-foreground">Twoja propozycja</p>
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              Namiot {recommendation.tent.size} · {recommendation.total.toLocaleString("pl-PL")} zł
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3.5">
          <div>
            <Label htmlFor="q-name" className="text-xs font-medium text-foreground">
              Imię
            </Label>
            <Input
              id="q-name"
              placeholder="Jan"
              className="mt-1.5"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="q-phone" className="text-xs font-medium text-foreground">
              Telefon
            </Label>
            <Input
              id="q-phone"
              type="tel"
              placeholder="512 345 678"
              className="mt-1.5"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="q-email" className="text-xs font-medium text-foreground">
              E-mail (opcjonalnie)
            </Label>
            <Input
              id="q-email"
              type="email"
              placeholder="jan.kowalski@mail.pl"
              className="mt-1.5"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="q-notes" className="text-xs font-medium text-foreground">
              Uwagi (opcjonalnie)
            </Label>
            <Textarea
              id="q-notes"
              placeholder="Napisz, jeśli masz dodatkowe informacje dla nas"
              className="mt-1.5 min-h-[84px]"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => navigate(7)} className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Wróć
          </Button>
          <Button
            onClick={() => onSubmit(buildResult())}
            disabled={!canSend}
            className="h-11 gap-1.5 bg-accent px-6 text-sm text-accent-foreground hover:bg-accent/90 sm:text-base"
          >
            Wyślij zapytanie
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // =========================================================================
  // KROKI QUIZU
  // =========================================================================
  const stepTitles = [
    "Co organizujesz?",
    "Dla ilu osób planujesz imprezę?",
    "Gdzie odbędzie się impreza?",
    "Czego potrzebujesz?",
    "Co jest dla Ciebie najważniejsze?",
    "Kiedy planujesz imprezę?",
  ]
  const stepHelpers = ["", "", "", "Zaznacz wszystko, co Cię interesuje.", "", ""]

  const canContinue = () => {
    switch (step) {
      case 0:
        return answers.occasion !== null
      case 1:
        return answers.guests !== null
      case 2:
        return answers.location !== null
      case 3:
        return true
      case 4:
        return answers.priority !== null
      case 5:
        return answers.date !== null
      default:
        return true
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div key={step} className="animate-fade-in-up">
        <h3 className="text-balance text-lg font-bold leading-tight text-foreground sm:text-xl">{stepTitles[step]}</h3>
        {stepHelpers[step] && <p className="mb-3.5 mt-0.5 text-xs text-muted-foreground sm:mb-4">{stepHelpers[step]}</p>}
        <div className={cn(stepHelpers[step] ? "" : "mt-3.5 sm:mt-4")}>
          {/* KROK 1 — Okazja */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {occasions.map((opt) => {
                const Icon = opt.icon
                const selected = answers.occasion === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectSingle("occasion", opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 sm:gap-2.5 sm:p-5",
                      selected
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border hover:border-accent/40 hover:bg-muted/40",
                    )}
                  >
                    <Icon className={cn("h-6 w-6 sm:h-7 sm:w-7", selected ? "text-accent" : "text-foreground/70")} strokeWidth={1.5} />
                    <span className="text-[13px] font-semibold leading-tight text-foreground sm:text-sm">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* KROK 2 — Liczba osób (radio) */}
          {step === 1 && (
            <div className="space-y-2">
              {guestOptions.map((opt) => {
                const selected = answers.guests === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectSingle("guests", opt.value)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200",
                      selected
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border hover:border-accent/40 hover:bg-muted/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        selected ? "border-accent" : "border-muted-foreground/40",
                      )}
                    >
                      {selected && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
                    </span>
                    <span className="text-sm font-medium text-foreground">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* KROK 3 — Miejsce (siatka 3 kolumny + Inne) */}
          {step === 2 && (
            <div>
              <div className="grid grid-cols-3 gap-3">
                {locationCards.map((opt) => {
                  const Icon = opt.icon
                  const selected = answers.location === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => selectSingle("location", opt.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200",
                        selected
                          ? "border-accent bg-accent/10 shadow-sm"
                          : "border-border hover:border-accent/40 hover:bg-muted/40",
                      )}
                    >
                      <Icon className={cn("h-6 w-6", selected ? "text-accent" : "text-foreground/70")} strokeWidth={1.5} />
                      <span className="text-xs font-semibold leading-tight text-foreground">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
              <div
                className={cn(
                  "mt-3 flex items-center gap-2 rounded-xl border px-3.5 py-3 transition-colors",
                  answers.location === "other" ? "border-accent bg-accent/5" : "border-border",
                )}
              >
                <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Inne (napisz gdzie)"
                  value={answers.locationOther}
                  onChange={(e) =>
                    setAnswers((p) => ({ ...p, location: "other", locationOther: e.target.value }))
                  }
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}

          {/* KROK 4 — Potrzeby (checkboxy) */}
          {step === 3 && (
            <div className="space-y-2">
              {needOptions.map((opt) => {
                const Icon = opt.icon
                const checked = answers.needs.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleNeed(opt)}
                    disabled={opt.always}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200",
                      checked
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border hover:border-accent/40 hover:bg-muted/40",
                      opt.always && "cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                        checked ? "border-accent bg-accent text-accent-foreground" : "border-muted-foreground/40",
                      )}
                    >
                      {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                    <Icon className={cn("h-4 w-4 shrink-0", checked ? "text-accent" : "text-foreground/60")} strokeWidth={1.5} />
                    <span className="text-sm font-medium text-foreground">{opt.label}</span>
                  </button>
                )
              })}

              {/* Nie wiem — doradźcie mi (wyróżniony) */}
              <button
                onClick={() => toggleNeed(adviseOption)}
                className={cn(
                  "mt-3 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200",
                  answers.needs.includes("advise")
                    ? "border-accent bg-accent/10 shadow-sm"
                    : "border-dashed border-accent/50 bg-accent/[0.04] hover:bg-accent/10",
                )}
              >
                <LightbulbIcon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-accent">{adviseOption.label}</span>
                {answers.needs.includes("advise") && <Check className="ml-auto h-4 w-4 text-accent" strokeWidth={3} />}
              </button>
            </div>
          )}

          {/* KROK 5 — Priorytet */}
          {step === 4 && (
            <div className="space-y-2">
              {priorities.map((opt) => {
                const Icon = opt.icon
                const selected = answers.priority === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectSingle("priority", opt.value)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200",
                      selected
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border hover:border-accent/40 hover:bg-muted/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                        selected ? "bg-accent text-accent-foreground" : "bg-muted text-foreground/70",
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* KROK 6 — Termin */}
          {step === 5 && (
            <div>
              {renderCalendar()}

              {/* Legenda — zajęte terminy */}
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="inline-block h-3 w-3 rounded-[4px] border border-destructive/40 bg-destructive/[0.06]" />
                Terminy zaznaczone na czerwono są już zajęte
              </p>
            </div>
          )}
        </div>
      </div>

      {/* NAWIGACJA */}
      <div className="mt-5 flex items-center justify-between gap-3 sm:mt-6">
        <Button variant="ghost" onClick={goPrev} className="gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Wróć
        </Button>
        <Button
          onClick={advance}
          disabled={!canContinue()}
          className="h-11 gap-1.5 bg-accent px-6 text-sm text-accent-foreground hover:bg-accent/90 sm:text-base"
        >
          {step === TOTAL_STEPS - 1 ? "Zobacz propozycję" : "Dalej"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
