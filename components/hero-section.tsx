"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, ArrowDown, MapPin, Armchair, ShieldCheck, Tent, Sparkles, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { RealizationsCarousel } from "@/components/realizations-carousel"

const taglineWords = [
  "Wesela",
  "Komunie",
  "Urodziny",
  "Eventy firmowe",
  "Jubileusze",
  "Chrzciny",
  "Plenery",
]

const features = [
  {
    icon: Tent,
    title: "Elegancja",
    description: "Stylowe namioty dopasowane do charakteru wydarzenia",
  },
  {
    icon: Armchair,
    title: "Komfort",
    description: "Przestrzeń, która zapewnia wygodę gościom",
  },
  {
    icon: ShieldCheck,
    title: "Bezpieczeństwo",
    description: "Stabilne konstrukcje w każdych warunkach",
  },
  {
    icon: MapPin,
    title: "Dowolne miejsce",
    description: "Zrealizujemy Twoje wydarzenie wszędzie tam, gdzie chcesz",
  },
]

function FeatureAccordionItem({
  feature,
  open,
  onToggle,
}: {
  feature: (typeof features)[number]
  open: boolean
  onToggle: () => void
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  // Measure the real content height so we animate an explicit pixel value.
  // Animating `height` (instead of `grid-template-rows: fr`) is much smoother
  // on mobile, and a ResizeObserver keeps it correct if the text re-wraps.
  useEffect(() => {
    const el = innerRef.current
    if (!el || !open) return
    const measure = () => setHeight(el.scrollHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [open])

  const Icon = feature.icon

  return (
    <div
      className={cn(
        // Fade the shadow (and colours) gently in/out instead of snapping it in.
        "overflow-hidden rounded-2xl border transition-[background-color,border-color,box-shadow] duration-200 ease-out",
        open
          ? "border-accent/40 bg-card shadow-[0_10px_30px_-20px_rgba(60,46,55,0.4)]"
          : "border-border/70 bg-card/50 shadow-[0_10px_30px_-20px_rgba(60,46,55,0)]",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3.5 px-3.5 py-3 text-left"
      >
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ease-out",
            open ? "bg-accent text-accent-foreground" : "bg-accent/10 text-accent",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </span>
        <span className="flex-1 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
          {feature.title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
            open ? "rotate-180 text-accent" : "animate-hint-bob",
          )}
          aria-hidden
        />
      </button>
      {/* Smooth reveal via an explicit measured height on a promoted layer. */}
      <div
        className="overflow-hidden transition-[height] duration-[220ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none"
        style={{ height: open ? height : 0, willChange: "height" }}
      >
        <div ref={innerRef}>
          <p
            className={cn(
              "pb-4 pl-[4.4rem] pr-4 text-sm leading-relaxed text-muted-foreground transition-opacity duration-150 ease-out",
              open ? "opacity-100" : "opacity-0",
            )}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [openFeature, setOpenFeature] = useState<number | null>(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsLoaded(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % taglineWords.length)
    }, 1700)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      {/* ===== HERO ===== */}
      <section id="start" className="relative isolate overflow-hidden">
        {/* Full-bleed sunset tent photograph — a single continuous image that
            covers the whole hero so the logo sits on the sky. On mobile it's
            anchored toward the bottom so more sky shows behind the title. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-background">
          {/* Vertical crop for mobile — more sky above the tents */}
          <div className="absolute inset-0 bg-[url('/images/hero-bg-mobile.png')] bg-cover bg-[position:60%_bottom] bg-no-repeat sm:hidden" />
          {/* Wider landscape crop for tablet/desktop */}
          <div className="absolute inset-0 hidden bg-[url('/images/hero-bg-desktop.png')] bg-cover bg-center bg-no-repeat sm:block" />
          {/* Legibility washes — lighten the top where the text sits and
              fade the base into the cream section below. Kept lighter so the
              sunset photo keeps its warm, vivid colours. */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/15 to-background/5" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />
          {/* Soft beige blob — a contained warm cloud sitting on the sky
              behind the title, blending into the background for legibility */}
          <div
            className={cn(
              "absolute left-1/2 top-[52%] h-52 w-[24rem] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] sm:top-[46%] sm:h-72 sm:w-[40rem]",
              "bg-[radial-gradient(ellipse_at_center,var(--color-background)_0%,color-mix(in_srgb,var(--color-background)_82%,transparent)_40%,color-mix(in_srgb,var(--color-background)_38%,transparent)_66%,transparent_82%)]",
              "blur-2xl opacity-0 transition-opacity duration-1000 ease-out",
              isLoaded && "opacity-80",
            )}
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-6 pb-44 text-center sm:pt-12 sm:pb-48 lg:px-8">
          {/* Logo — the centerpiece */}
          <div
            className={cn(
              "w-full max-w-md",
              "scale-95 opacity-0 transition-all duration-700 ease-out [transition-delay:80ms]",
              isLoaded && "scale-100 opacity-100",
            )}
          >
            <Image
              src="/images/logo.png"
              alt="Postawię Ci Namiot — wynajem namiotów imprezowych, ESTD 2026"
              width={640}
              height={640}
              priority
              className="mx-auto h-auto w-full max-w-[300px] sm:max-w-[380px]"
            />
          </div>

          {/* Rotating categories with a progress dot — the word + dot animation */}
          <div
            className={cn(
              "-mt-24 mx-auto flex w-full max-w-sm flex-col items-center gap-2 sm:-mt-28 sm:max-w-md",
              "opacity-0 transition-opacity duration-700 ease-out [transition-delay:120ms]",
              isLoaded && "opacity-100",
            )}
          >
            <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
              <span className="h-px min-w-0 flex-1 bg-gradient-to-r from-transparent to-foreground/30 sm:max-w-16" />
              <Sparkles aria-hidden className="h-3 w-3 shrink-0 animate-pulse-soft text-accent/80" />
              <span className="relative inline-flex h-5 min-w-[8.5rem] shrink-0 items-center justify-center overflow-hidden sm:min-w-[10rem]">
                <span className="sr-only">
                  Wesela, komunie, urodziny, eventy firmowe, jubileusze, chrzciny i plenery
                </span>
                {taglineWords.map((word, i) => (
                  <span
                    key={word}
                    aria-hidden
                    className={cn(
                      "absolute whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/80 transition-all duration-500 ease-out sm:text-xs sm:tracking-[0.28em]",
                      i === wordIndex
                        ? "translate-y-0 opacity-100 blur-0"
                        : "pointer-events-none translate-y-3 opacity-0 blur-[1px]",
                    )}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <Sparkles aria-hidden className="h-3 w-3 shrink-0 animate-pulse-soft text-accent/80" />
              <span className="h-px min-w-0 flex-1 bg-gradient-to-l from-transparent to-foreground/30 sm:max-w-16" />
            </div>

            {/* Progress dot — slides left→right in sync with each word change */}
            <span aria-hidden className="relative block h-1 w-24 sm:w-28">
              <span key={wordIndex} className="animate-travel-runner absolute inset-0">
                <span className="animate-travel-dot absolute left-0 top-1/2 h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
            </span>
          </div>

          {/* Heading */}
          <h1
            className={cn(
              "mt-9 text-balance text-3xl font-medium leading-[1.1] text-foreground sm:mt-10 sm:text-5xl lg:text-6xl",
              "translate-y-4 opacity-0 transition-all duration-700 ease-out [transition-delay:200ms]",
              isLoaded && "translate-y-0 opacity-100",
            )}
          >
            Zadbamy o dach nad Twoją{" "}
            <span className="italic text-accent">najważniejszą imprezą</span>
          </h1>

          {/* CTA */}
          <div
            className={cn(
              "mt-9 sm:mt-10",
              "translate-y-4 opacity-0 transition-all duration-700 ease-out [transition-delay:300ms]",
              isLoaded && "translate-y-0 opacity-100",
            )}
          >
            <a
              href="#rezerwacja"
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-[0_12px_30px_-12px_rgba(60,46,55,0.6)] transition-all duration-200 hover:brightness-105"
            >
              Zarezerwuj termin
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Wavy divider into the cream section */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 leading-[0]">
          <svg
            viewBox="0 0 1440 140"
            preserveAspectRatio="none"
            className="h-16 w-full sm:h-24 lg:h-28"
          >
            <path
              d="M0,64 C240,120 420,120 720,80 C1020,40 1200,40 1440,88 L1440,140 L0,140 Z"
              fill="var(--color-background)"
            />
          </svg>
        </div>
      </section>

      {/* ===== INTRO + FEATURES ===== */}
      <section className="relative bg-background pb-20 pt-4 sm:pb-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          {/* Ornament */}
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-accent/40" />
            <Sparkles className="h-4 w-4 text-accent" aria-hidden />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-accent/40" />
          </div>

          <h2 className="mx-auto mt-8 max-w-3xl text-balance text-center text-[1.6rem] font-medium leading-[1.15] text-foreground sm:text-[2rem] lg:text-[2.4rem]">
            Wyjątkowe przestrzenie na plenerowe przyjęcia
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            Namioty, które łączą elegancję, komfort i bezpieczeństwo — niezależnie od
            miejsca i pogody.
          </p>

          {/* Mobile: subtle animated hint that the tiles are interactive */}
          <div className="mt-8 flex items-center justify-center gap-2 sm:hidden">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent/90">
              Poznaj nasze atuty
            </span>
            <ArrowDown className="h-3.5 w-3.5 animate-hint-bob text-accent" aria-hidden />
          </div>

          {/* Mobile: interactive accordion panel — tap an icon to reveal its detail */}
          <div className="mt-4 flex flex-col gap-2.5 sm:hidden">
            {features.map((feature, i) => (
              <FeatureAccordionItem
                key={feature.title}
                feature={feature}
                open={openFeature === i}
                onToggle={() => setOpenFeature(openFeature === i ? null : i)}
              />
            ))}
          </div>

          {/* Tablet / desktop: open feature columns */}
          <div className="mt-12 hidden grid-cols-2 gap-y-10 sm:grid lg:grid-cols-4 lg:gap-y-0">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={cn(
                  "flex flex-col items-center px-4 text-center",
                  "lg:border-l lg:border-border/70",
                  i === 0 && "lg:border-l-0",
                )}
              >
                <feature.icon
                  className="h-10 w-10 text-accent"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Selected realizations — carousel with a small supporting caption */}
          <p className="mx-auto mt-14 max-w-xl text-pretty text-center text-sm leading-relaxed text-muted-foreground">
            Wybrane realizacje z terenu Rybnika i całego Śląska — zobacz, jak wygląda
            impreza pod naszym dachem.
          </p>
        </div>

        <div id="galeria" className="mt-6 scroll-mt-16">
          <RealizationsCarousel />
        </div>
      </section>
    </>
  )
}
