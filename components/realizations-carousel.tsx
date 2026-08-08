"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { MapPin, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type Realization = {
  id: number
  title: string
  location: string
  category: string
  image: string
}

const realizations: Realization[] = [
  {
    id: 1,
    title: "Wesele plenerowe",
    location: "Żory",
    category: "Wesele",
    image: "/images/realizacja-wesele.png",
  },
  {
    id: 2,
    title: "Przyjęcie komunijne",
    location: "Rybnik",
    category: "Komunia",
    image: "/images/realizacja-komunia.png",
  },
  {
    id: 3,
    title: "Urodziny w ogrodzie",
    location: "Tychy",
    category: "Urodziny",
    image: "/images/realizacja-urodziny.png",
  },
  {
    id: 4,
    title: "Event firmowy",
    location: "Gliwice",
    category: "Firmowe",
    image: "/images/realizacja-firmowe.png",
  },
]

const AUTOPLAY_MS = 4500
const SCROLL_MS = 190

// easeOutCubic — a quick, decisive start that eases into the stop. Feels
// snappier than easeInOut (no slow ramp-up) while still landing softly.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function CardMedia({ item, priority }: { item: Realization; priority?: boolean }) {
  return (
    <>
      <Image
        src={item.image || "/placeholder.svg"}
        alt={`${item.title} — ${item.location}`}
        fill
        draggable={false}
        sizes="(max-width: 768px) 80vw, 460px"
        className="object-cover"
        priority={priority}
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/75 via-foreground/25 to-transparent p-4 sm:p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
          <Sparkles className="h-3 w-3" aria-hidden />
          {item.category}
        </span>
        <p className="mt-2 text-base font-medium text-background sm:text-xl">{item.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-background/80 sm:text-sm">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {item.location}
        </p>
      </figcaption>
    </>
  )
}

export function RealizationsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number | null>(null)
  const pointerDownRef = useRef(false)
  const pointerStartXRef = useRef(0)
  const barRef = useRef<HTMLSpanElement>(null)
  const elapsedRef = useRef(0)
  const activeRef = useRef(0)
  const interactingRef = useRef(false)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  // Respect users who prefer reduced motion — no autoplay for them.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduceMotion(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  // Only autoplay while the carousel is actually on screen.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.5,
    })
    io.observe(track)
    return () => io.disconnect()
  }, [])

  // Custom rAF scroll with easing — smoother and more consistent than native
  // `scroll-behavior: smooth`, which stutters on many mobile browsers.
  const animateScrollTo = useCallback(
    (targetLeft: number) => {
      const track = trackRef.current
      if (!track) return
      if (animRef.current) cancelAnimationFrame(animRef.current)

      if (reduceMotion) {
        track.scrollLeft = targetLeft
        return
      }

      const start = track.scrollLeft
      const change = targetLeft - start
      if (Math.abs(change) < 1) return
      const startTime = performance.now()

      // Mandatory scroll-snap fights a programmatic scrollLeft tween — on many
      // mobile browsers it snaps straight to the target, so the slide looks like
      // an instant jump. Turn snapping off for the duration of the animation and
      // restore it once we settle, so the eased glide is visible every time.
      track.style.scrollSnapType = "none"

      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / SCROLL_MS)
        track.scrollLeft = start + change * easeOutCubic(t)
        if (t < 1) {
          animRef.current = requestAnimationFrame(step)
        } else {
          animRef.current = null
          track.style.scrollSnapType = ""
        }
      }
      animRef.current = requestAnimationFrame(step)
    },
    [reduceMotion],
  )

  // Pick the card whose center is closest to the viewport center.
  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    const center = track.scrollLeft + track.clientWidth / 2
    let best = 0
    let bestDist = Number.POSITIVE_INFINITY
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement
      const cardCenter = el.offsetLeft + el.clientWidth / 2
      const dist = Math.abs(cardCenter - center)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    setActive(best)
  }

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current
      if (!track) return
      const el = track.children[i] as HTMLElement | undefined
      if (!el) return
      const left = el.offsetLeft - (track.clientWidth - el.clientWidth) / 2
      animateScrollTo(left)
    },
    [animateScrollTo],
  )

  const playing = inView && !reduceMotion

  // Keep active in a ref so the rAF loop can read it without restarting.
  useEffect(() => {
    activeRef.current = active
    // A new slide became active (autoplay advance, swipe, or dot): reset clock.
    elapsedRef.current = 0
    if (barRef.current) barRef.current.style.transform = "scaleX(0)"
  }, [active])

  // Single rAF clock drives BOTH the countdown and the progress bar. Because it
  // reads `interactingRef`/`activeRef` (not React state), a tap never remounts
  // or resets it — at most it pauses the clock for a few frames. This is what
  // stops the progress bar from blinking on tap and keeps it buttery at any Hz.
  useEffect(() => {
    if (!playing) {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, elapsedRef.current / AUTOPLAY_MS)})`
      }
      return
    }
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = now - last
      last = now
      if (!interactingRef.current) {
        elapsedRef.current += dt
        if (elapsedRef.current >= AUTOPLAY_MS) {
          elapsedRef.current = 0
          goTo((activeRef.current + 1) % realizations.length)
        }
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, elapsedRef.current / AUTOPLAY_MS)})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, goTo])

  // A plain tap on an image should NOT pause/reset the autoplay timer — only a
  // real swipe should. So on pointer-down we just arm a gesture; `interacting`
  // (which restarts the timer) is only set once the pointer actually moves past
  // a small threshold in onPointerMove.
  const onPointerDown = (e: React.PointerEvent) => {
    pointerDownRef.current = true
    pointerStartXRef.current = e.clientX
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointerDownRef.current || interactingRef.current) return
    if (Math.abs(e.clientX - pointerStartXRef.current) > 10) {
      // Real drag detected: cancel any in-flight glide and pause autoplay.
      const track = trackRef.current
      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
        animRef.current = null
      }
      if (track) track.style.scrollSnapType = ""
      interactingRef.current = true
      setInteracting(true)
    }
  }

  const endInteract = () => {
    pointerDownRef.current = false
    interactingRef.current = false
    if (interacting) setInteracting(false)
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endInteract}
        onPointerCancel={endInteract}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-[10%] pb-1 [scrollbar-width:none] sm:gap-5 md:px-[28%] [&::-webkit-scrollbar]:hidden"
        style={{ scrollBehavior: "auto" }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Galeria realizacji"
      >
        {realizations.map((item, i) => (
          <figure
            key={item.id}
            className="group relative aspect-[3/2] w-[80%] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_20px_50px_-30px_rgba(60,46,55,0.55)] sm:w-[55%] md:w-full"
          >
            <CardMedia item={item} priority={i === 0} />
          </figure>
        ))}
      </div>

      {/* Pagination dots — active one shows an animated countdown timer */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {realizations.map((item, i) => {
          const isActive = i === active
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Przejdź do realizacji: ${item.title}`}
              aria-current={isActive}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                isActive ? "w-7 bg-accent/25" : "w-2 bg-accent/30",
              )}
            >
              {isActive && (
                <span className="relative block h-full w-full overflow-hidden rounded-full">
                  <span
                    ref={barRef}
                    className="absolute inset-0 origin-left rounded-full bg-accent [backface-visibility:hidden] [will-change:transform]"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
