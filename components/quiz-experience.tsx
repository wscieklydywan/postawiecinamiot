"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { QuizTopBar, ExitDialog } from "@/components/quiz-chrome"
import { TentQuiz, type QuizResult, type QuizPhase, TOTAL_STEPS } from "@/components/tent-quiz"
import { useCart, type BookingSummary } from "@/lib/cart-context"
import { tents, extras, months } from "@/lib/booking-data"

/**
 * Zawartość kreatora "Pomóż mi wybrać" (quiz). Współdzielona przez trasę
 * przechwytującą (nakładka nad stroną główną) oraz samodzielną podstronę.
 * `close` pochodzi z <ReservationOverlay> i decyduje, jak wrócić na stronę
 * główną (cofnięcie historii w trybie modal / push w trybie page).
 */
export function QuizExperience({
  close,
}: {
  close: (destination?: string, backSteps?: number) => void
}) {
  const { confirmBooking, setConfiguratorPrefill } = useCart()
  const [progress, setProgress] = useState<{ phase: QuizPhase; step: number }>({
    phase: "intro",
    step: 0,
  })
  const [exitOpen, setExitOpen] = useState(false)

  // Głębokość historii kreatora (liczba wpisów do zdjęcia przy powrocie na `/`).
  // Indeksy ekranów muszą odpowiadać mapowaniu w <TentQuiz>:
  //   intro = 0, kroki quizu = step + 1, wynik = 7, kontakt = 8.
  // Bazowy wpis nakładki to +1, dlatego cofamy `screen + 1` wpisów.
  const currentScreen =
    progress.phase === "intro"
      ? 0
      : progress.phase === "quiz"
        ? progress.step + 1
        : progress.phase === "result"
          ? 7
          : 8
  const homeSteps = currentScreen + 1

  // Obszar przewijania treści quizu. Po każdej zmianie ekranu (faza/krok)
  // wracamy na samą górę — inaczej po przejściu na wysoki ekran wyniku strona
  // zostawałaby przewinięta w połowie (pozycja z poprzedniego kroku).
  const scrollRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [progress.phase, progress.step])

  const handleSubmit = (result: QuizResult) => {
    const tent = tents.find((t) => t.id === result.tentId)!
    const extrasList = result.extraIds.map((id) => {
      const e = extras.find((x) => x.id === id)!
      return { label: e.label, price: e.price }
    })
    const total = tent.price + extrasList.reduce((s, e) => s + e.price, 0)
    const summary: BookingSummary = {
      orderNumber: `ZAP-${Date.now().toString(36).toUpperCase()}`,
      tentLabel: tent.label,
      tentSize: tent.size,
      tentPrice: tent.price,
      extras: extrasList,
      dateLabel: result.date
        ? `${result.date.day} ${months[result.date.month]} ${result.date.year}`
        : "Termin elastyczny — ustalimy telefonicznie",
      total,
    }
    // Ustawienie potwierdzenia sprawia, że sekcja "Rezerwacja online" na
    // stronie głównej przełącza się na podziękowanie i sama się przewija.
    confirmBooking(summary)
    close("/", homeSteps)
  }

  // Faktyczne wyjście na stronę główną.
  const exitToHome = () => close("/", homeSteps)

  // Kliknięcie „X": na ekranie powitalnym wychodzimy od razu (brak odpowiedzi),
  // w trakcie quizu/podsumowania najpierw pytamy w modalu.
  const requestClose = () => {
    if (progress.phase === "intro") exitToHome()
    else setExitOpen(true)
  }

  const handleEditSet = (result: { tentId: string; extraIds: string[] }) => {
    setConfiguratorPrefill(result)
    close("/rezerwacja/konfigurator")
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Górny pasek w stylu aplikacji: X + „Krok X z 6" + linia postępu */}
      <QuizTopBar
        showProgress={progress.phase === "quiz"}
        step={progress.step}
        totalSteps={TOTAL_STEPS}
        onClose={requestClose}
      />

      {/* Treść quizu (jedyny scrollowalny obszar) — wypełnia stronę jak w aplikacji */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        {/* Ekrany z logo (intro / kontakt) trzymamy blisko paska nawigacji — bez
            górnego odstępu, żeby logo siedziało tuż pod paskiem. Pozostałe ekrany
            (pytania oraz ekran propozycji) zachowują standardowy oddech od góry. */}
        <div
          className={
            progress.phase === "intro" || progress.phase === "contact"
              ? "mx-auto w-full max-w-2xl px-4 pb-8 pt-0 md:px-6 md:pb-10 md:pt-0"
              : "mx-auto w-full max-w-2xl px-4 py-8 md:px-6 md:py-10"
          }
        >
          <TentQuiz
            onBack={exitToHome}
            onEditSet={handleEditSet}
            onSubmit={handleSubmit}
            onStateChange={setProgress}
          />
        </div>
      </div>

      {/* Modal potwierdzenia wyjścia */}
      <ExitDialog open={exitOpen} onStay={() => setExitOpen(false)} onLeave={exitToHome} />
    </div>
  )
}
