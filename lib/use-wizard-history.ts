"use client"

import { useCallback, useEffect, useRef } from "react"

/**
 * Synchronizuje wewnętrzne kroki kreatora (quiz / konfigurator) z historią
 * przeglądarki. Dzięki temu gest lub przycisk „wstecz" cofa o jeden etap
 * kreatora, zamiast od razu opuszczać całą podstronę.
 *
 * Model:
 * - Ekran ma indeks liczbowy (0, 1, 2, …). Ekran 0 to wpis bazowy podstrony
 *   (nie dodajemy dla niego osobnego wpisu w historii) — cofnięcie z niego
 *   naturalnie opuszcza podstronę, co jest pożądane na pierwszym etapie.
 * - Każde przejście „do przodu" dokłada wpis w historii, a przejście „wstecz"
 *   (przycisk w UI lub gest przeglądarki) zdejmuje odpowiednią liczbę wpisów.
 * - Zachowujemy istniejący `window.history.state` (Next.js trzyma tam swoje
 *   dane routingu) i dokładamy jedynie własny klucz `__wizardScreen`.
 */
export function useWizardHistory({
  screen,
  applyScreen,
  basePath,
}: {
  screen: number
  applyScreen: (target: number) => void
  basePath: string
}) {
  const screenRef = useRef(screen)
  screenRef.current = screen

  const applyRef = useRef(applyScreen)
  applyRef.current = applyScreen

  useEffect(() => {
    const onPop = () => {
      // Jeśli adres nie należy już do kreatora, użytkownik opuścił podstronę —
      // pozwalamy Next.js obsłużyć nawigację.
      if (window.location.pathname !== basePath) return
      const state = window.history.state as { __wizardScreen?: number } | null
      const target = typeof state?.__wizardScreen === "number" ? state.__wizardScreen : 0
      applyRef.current(target)
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [basePath])

  const navigate = useCallback((target: number) => {
    const current = screenRef.current
    if (target === current) return

    if (target > current) {
      // Do przodu — dokładamy po jednym wpisie na każdy pokonany ekran,
      // aby głębokość historii odpowiadała indeksowi ekranu.
      for (let i = current + 1; i <= target; i++) {
        window.history.pushState({ ...window.history.state, __wizardScreen: i }, "")
      }
      applyRef.current(target)
    } else {
      // Wstecz — cofamy się w historii; stan ekranu ustawi handler `popstate`.
      window.history.go(-(current - target))
    }
  }, [])

  return { navigate }
}
