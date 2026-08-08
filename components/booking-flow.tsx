"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Sparkles,
  SquarePen,
  Wand2,
  Clock,
  Lock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar as CalendarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

// Dane namiotów/dodatków żyją teraz w @/lib/booking-data
// (re-eksport zachowany dla zgodności ze starszymi importami).
export {
  tents,
  extras,
  months,
  weekDays,
  bookedDates,
  steps,
  type TentData,
  type ExtraData,
} from "@/lib/booking-data"

// ---------------------------------------------------------------------------
// SEKCJA "REZERWACJA ONLINE"
// Dwa stany:
//   1. Kafelki (Konfigurator / Quiz) — prowadzą na pełnoekranowe podstrony.
//   2. Podziękowanie — po wysłaniu zapytania z kreatora/quizu.
// ---------------------------------------------------------------------------

export function BookingFlow() {
  const { confirmedBooking, clearConfirmedBooking } = useCart()

  // Po wysłaniu zapytania (z quizu/konfiguratora) przewiń do sekcji
  // "Rezerwacja online", aby potwierdzenie było od razu widoczne. Skok jest
  // natychmiastowy — chwilowo wyłączamy globalne `scroll-behavior: smooth`.
  useEffect(() => {
    if (!confirmedBooking) return
    const el = document.getElementById("rezerwacja")
    if (!el) return
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = "auto"

    // KLUCZOWE: bezpośrednio po wysłaniu nakładka kreatora jeszcze się domyka,
    // a tło może mieć chwilowo zablokowany scroll (`body { overflow: hidden }`),
    // więc `scrollIntoView` nie zadziała od razu. Dodatkowo sekcje POWYŻEJ
    // (hero, „dlaczego my") doładowują obrazy, które zmieniają wysokość strony
    // — pozycja sekcji „Rezerwacja online" potrafi przesunąć się o kilkadziesiąt
    // pikseli już PO pierwszym przewinięciu. Dlatego nie zgadujemy czasem, tylko
    // przypinamy sekcję do góry w pętli klatek AŻ layout faktycznie się ustabilizuje:
    //   • sekcja jest wyrównana do góry (rect.top ≈ offset `scroll-mt-16` = 64 px), ORAZ
    //   • jej bezwzględna pozycja na stronie nie zmienia się przez ~250 ms.
    // Dzięki temu widok nie „dryfuje" ani wyżej, ani niżej — ląduje dokładnie na
    // początku sekcji, niezależnie od tego, kiedy doładują się obrazy powyżej.
    //
    // KLUCZOWE: zamknięcie nakładki wywołuje `router.back()` (po ~320 ms), a Next.js
    // przy cofnięciu historii PRZYWRACA pozycję scrolla z chwili wejścia do kreatora
    // (czyli miejsce kliniętego kafelka) — co nadpisywało nasze wyrównanie i strona
    // lądowała sporo niżej. Dlatego pętla ma MINIMALNY czas życia (`MIN_MS`), aby
    // przetrwać cofnięcie historii i ponownie wyrównać sekcję już PO przywróceniu scrolla.
    //
    // WAŻNE: pętla NATYCHMIAST ustępuje użytkownikowi. Gdy tylko spróbuje on
    // przewinąć (kółko / dotyk / klawisze), przerywamy przypinanie, żeby nic
    // nie „blokowało" scrolla.
    const SCROLL_MT = 64 // odpowiada klasie `scroll-mt-16` na sekcji
    const MIN_MS = 700 // musi przeżyć `router.back()` (~320 ms) + przywrócenie scrolla
    let raf = 0
    const start = performance.now()
    let stopped = false
    let lastAbsTop = Number.NaN
    let stableSince = 0

    const finish = () => {
      if (stopped) return
      stopped = true
      cancelAnimationFrame(raf)
      html.style.scrollBehavior = previous
      window.removeEventListener("wheel", onUserScroll)
      window.removeEventListener("touchmove", onUserScroll)
      window.removeEventListener("keydown", onUserKey)
    }

    // Jakikolwiek gest przewijania = użytkownik przejmuje kontrolę.
    const onUserScroll = () => finish()
    const scrollKeys = new Set([
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
      "Spacebar",
    ])
    const onUserKey = (e: KeyboardEvent) => {
      if (scrollKeys.has(e.key)) finish()
    }
    window.addEventListener("wheel", onUserScroll, { passive: true })
    window.addEventListener("touchmove", onUserScroll, { passive: true })
    window.addEventListener("keydown", onUserKey)

    const tick = (now: number) => {
      if (stopped) return

      // Ponownie wyrównaj sekcję do góry (skok jest natychmiastowy, niewidoczny).
      el.scrollIntoView({ block: "start" })

      const rect = el.getBoundingClientRect()
      const absTop = Math.round(rect.top + window.scrollY)
      // Sekcja jest realnie wyrównana tylko gdy tło nie jest już zablokowane,
      // więc scroll rzeczywiście doszedł do celu (rect.top ≈ SCROLL_MT).
      const aligned = Math.abs(rect.top - SCROLL_MT) <= 1

      if (aligned && absTop === lastAbsTop) {
        if (stableSince === 0) stableSince = now
      } else {
        stableSince = 0
        lastAbsTop = absTop
      }

      // Koniec, gdy: minął minimalny czas życia pętli (przetrwaliśmy `router.back()`)
      // ORAZ layout jest wyrównany i stabilny od 250 ms — albo po 3 s jako twarde
      // zabezpieczenie (gdyby coś doładowywało się w nieskończoność).
      const settledLongEnough = stableSince !== 0 && now - stableSince > 250
      if ((now - start > MIN_MS && settledLongEnough) || now - start > 3000) {
        finish()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return finish
  }, [confirmedBooking])

  // -------------------------------------------------------------------------
  // STAN PO WYSŁANIU — PODZIĘKOWANIE
  // -------------------------------------------------------------------------
  if (confirmedBooking) {
    const b = confirmedBooking
    return (
      <section id="rezerwacja" className="py-14 md:py-20 bg-primary/5 overflow-hidden scroll-mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance">
              Zapytanie wysłane!
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              Numer zapytania:{" "}
              <span className="font-mono font-semibold text-foreground">{b.orderNumber}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Skontaktujemy się z Tobą telefonicznie, aby potwierdzić szczegóły i dostępność terminu.
            </p>

            <div className="bg-card border rounded-2xl p-5 text-left shadow-sm mb-6">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{b.dateLabel}</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Namiot {b.tentLabel} ({b.tentSize})
                  </span>
                  <span className="font-medium">{b.tentPrice} zł</span>
                </div>
                {b.extras.map((extra) => (
                  <div key={extra.label} className="flex justify-between">
                    <span className="text-muted-foreground">{extra.label}</span>
                    <span className="font-medium">{extra.price} zł</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-3 mt-3 border-t">
                <span className="font-semibold">Razem</span>
                <span className="font-bold text-primary">{b.total} zł</span>
              </div>
            </div>

            <Button onClick={clearConfirmedBooking} variant="outline" className="gap-2">
              Nowe zapytanie
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // -------------------------------------------------------------------------
  // STAN POCZĄTKOWY — WYBÓR ŚCIEŻKI
  // -------------------------------------------------------------------------
  const paths = [
    {
      key: "configurator",
      href: "/rezerwacja/konfigurator",
      icon: SquarePen,
      iconWrap: "bg-[#edf0e2] text-[#4e5630]",
      title: "Wybieram sam",
      desc: "Mam już pomysł, jaki namiot i dodatki będą mi potrzebne.",
      image: "/images/choose-self-tent.png",
      cta: "Przejdź do konfiguratora",
      ctaClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
    {
      key: "quiz",
      href: "/rezerwacja/quiz",
      icon: Wand2,
      iconWrap: "bg-accent/15 text-accent",
      title: "Pomóż mi wybrać",
      desc: "Odpowiedz na kilka pytań, a pokażemy Ci najlepszą opcję.",
      image: "/images/choose-quiz-tent.png",
      cta: "Rozpocznij quiz",
      ctaClass: "bg-accent text-accent-foreground hover:bg-accent/90",
    },
  ] as const

  const trust = [
    { icon: Clock, title: "Rezerwacja online", sub: "w kilka minut" },
    { icon: Lock, title: "Bez ukrytych kosztów", sub: "pełna przejrzystość" },
    { icon: Phone, title: "Wsparcie na każdym", sub: "etapie" },
    { icon: ShieldCheck, title: "Doświadczenie", sub: "i zaufanie" },
  ]

  return (
    <section id="rezerwacja" className="py-14 md:py-20 bg-primary/5 overflow-hidden scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-primary font-semibold mb-2.5 text-xs">
            <Sparkles className="w-4 h-4" />
            <span className="uppercase tracking-wide">Rezerwacja online</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
            Jak chcesz zacząć?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground text-pretty">
            Wybierz opcję, która bardziej do Ciebie pasuje. Obie drogi prowadzą do udanej imprezy.
          </p>
        </div>

        {/* Dwie ścieżki */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {paths.map((p) => {
            const Icon = p.icon
            return (
              <Link
                key={p.key}
                href={p.href}
                className="group flex flex-col text-center bg-card border rounded-2xl p-4 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40"
              >
                <span
                  className={cn(
                    "mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full",
                    p.iconWrap,
                  )}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
                <h3 className="mt-3 sm:mt-4 text-base sm:text-xl font-bold text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-[13px] sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                  {p.desc}
                </p>
                <div className="relative mx-auto mt-3 mb-4 sm:mt-4 sm:mb-5 w-full max-w-[180px] sm:max-w-[240px] aspect-[3/2]">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    aria-hidden
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 80vw, 240px"
                  />
                </div>
                <span
                  className={cn(
                    "mt-auto inline-flex h-9 sm:h-11 w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl px-2 text-xs sm:text-sm font-semibold transition-colors",
                    p.ctaClass,
                  )}
                >
                  <span className="truncate">{p.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>

        {/* Zaufanie */}
        <div className="max-w-3xl mx-auto mt-8 pt-6 border-t border-border/60">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4">
            {trust.map((t) => {
              const Icon = t.icon
              return (
                <li key={t.title} className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5 shrink-0 text-accent" strokeWidth={1.75} />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-foreground leading-tight">{t.title}</span>
                    <span className="block text-[11px] text-muted-foreground leading-tight">{t.sub}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
