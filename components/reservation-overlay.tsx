"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { setReservationReturnIntent } from "@/lib/reservation-scroll"

type ReservationOverlayMode = "modal" | "page"

type ReservationOverlayProps = {
  /**
   * "modal" — nakładka renderowana przez trasę przechwytującą (intercepting
   *   route) NAD wciąż zamontowaną stroną główną. Zamknięcie cofa historię
   *   (`router.back()`), więc powrót jest natychmiastowy — strona główna nie
   *   jest ponownie renderowana, a pozycja scrolla zostaje zachowana.
   * "page" — samodzielna podstrona (twarde wejście / bezpośredni link). Brak
   *   strony głównej w historii, więc wracamy przez `router.push("/")`.
   */
  mode?: ReservationOverlayMode
  children: (api: { close: (destination?: string, backSteps?: number) => void }) => ReactNode
}

/**
 * Pełnoekranowa nakładka kreatora rezerwacji.
 * - wsuwa się z prawej strony (efekt modala) bez klasycznego przeładowania,
 * - blokuje scroll tła — przewija się tylko zawartość nakładki,
 * - w trybie "modal" strona główna zostaje zamontowana pod spodem, dzięki
 *   czemu zamknięcie jest natychmiastowe (bez ponownego ładowania).
 */
export function ReservationOverlay({ mode = "page", children }: ReservationOverlayProps) {
  const router = useRouter()
  const [entered, setEntered] = useState(false)
  const [closing, setClosing] = useState(false)
  const navigatingRef = useRef(false)
  const prevOverflowRef = useRef("")

  useEffect(() => {
    // Uruchom animację wsunięcia po pierwszym renderze.
    const raf = requestAnimationFrame(() => setEntered(true))

    // Zablokuj scroll tła na czas trwania nakładki.
    prevOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prevOverflowRef.current
    }
  }, [])

  // `backSteps` = ile wpisów historii trzeba cofnąć, aby wrócić na stronę
  // główną. Kreator (quiz/konfigurator) dokłada po jednym wpisie na każdy
  // ekran, więc powrót musi zdjąć je WSZYSTKIE naraz (bazowy wpis nakładki +
  // wpisy ekranów). Pojedyncze `router.back()` cofało tylko o jeden ekran i
  // zostawiało adres na `/rezerwacja/...`, przez co ponowne kliknięcie tego
  // samego kafelka było nawigacją „do bieżącego adresu" (czyli niczym).
  const close = (destination = "/", backSteps = 1) => {
    if (navigatingRef.current) return

    // Przejście MIĘDZY kreatorami (np. quiz → konfigurator): nowa nakładka
    // po prostu wchodzi na wierzch, bez animacji wysunięcia bieżącej.
    if (destination.startsWith("/rezerwacja/")) {
      navigatingRef.current = true
      router.replace(destination, { scroll: false })
      return
    }

    // Wyjście na stronę główną.
    navigatingRef.current = true
    setClosing(true)
    // Odblokuj scroll tła OD RAZU (nie dopiero przy odmontowaniu nakładki).
    // Nakładka i tak wysuwa się w bok (pozycja `fixed`), więc tło pod spodem
    // może już być przewijalne — dzięki temu sekcja "Rezerwacja online" nie
    // ma zablokowanego scrolla podczas 320 ms animacji wysuwania.
    document.body.style.overflow = prevOverflowRef.current
    // Poczekaj na animację wysunięcia, a potem wróć na stronę główną.
    window.setTimeout(() => {
      if (mode === "modal") {
        // Strona główna jest wciąż zamontowana pod nakładką — cofnięcie
        // historii ujawnia ją natychmiast, bez ponownego renderu i bez skoku
        // scrolla (pozycja zostaje zachowana). Cofamy o `backSteps`, aby zdjąć
        // wszystkie wpisy ekranów kreatora i faktycznie wrócić na adres `/`.
        window.history.go(-Math.max(1, backSteps))
      } else {
        // Twarde wejście na podstronę — brak strony głównej w historii, więc
        // wracamy pushem (pozycją steruje ReservationScrollRestore).
        setReservationReturnIntent("restore")
        router.push("/", { scroll: false })
      }
    }, 320)
  }

  const offscreen = !entered || closing

  return (
    <div
      className="fixed inset-0 z-[70] bg-card flex flex-col transition-transform duration-200 ease-out will-change-transform"
      style={{ transform: offscreen ? "translateX(100%)" : "translateX(0)" }}
      role="dialog"
      aria-modal="true"
    >
      {children({ close })}
    </div>
  )
}
