"use client"

import { useLayoutEffect } from "react"
import { consumeReservationReturn } from "@/lib/reservation-scroll"

/**
 * Ustawia pozycję scrolla po powrocie z kreatora rezerwacji.
 * Działa w useLayoutEffect (przed malowaniem), więc nie widać animowanego
 * przewijania od sekcji hero w dół — strona od razu jest we właściwym miejscu.
 */
export function ReservationScrollRestore() {
  useLayoutEffect(() => {
    const ret = consumeReservationReturn()
    if (!ret) return

    // Chwilowo wyłącz globalne `scroll-behavior: smooth`, aby skok był natychmiastowy.
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = "auto"

    if (ret.intent === "section") {
      // Na początek sekcji — scrollIntoView respektuje `scroll-mt-16` (offset nav).
      document.getElementById("rezerwacja")?.scrollIntoView({ block: "start" })
    } else {
      // Powrót do dokładnie tej samej pozycji, z której wszedł użytkownik.
      window.scrollTo(0, ret.scrollY)
    }

    // Przywróć płynne przewijanie po ustawieniu pozycji.
    const raf = requestAnimationFrame(() => {
      html.style.scrollBehavior = previous
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}
