"use client"

import Image from "next/image"
import { SlidersHorizontal, Truck, Heart, Package, ArrowRight, CalendarCheck, Sparkles } from "lucide-react"

const steps = [
  {
    icon: SlidersHorizontal,
    title: "Rezerwujesz po swojemu",
    description:
      "Skorzystaj z konfiguratora, rozwiąż krótki quiz albo po prostu do nas zadzwoń. Wybierz sposób, który najbardziej Ci odpowiada.",
  },
  {
    icon: Truck,
    title: "My zajmujemy się resztą",
    description: "Przywozimy namiot, montujemy go na miejscu i dbamy o to, żeby wszystko było gotowe na czas.",
  },
  {
    icon: Heart,
    title: "Ty cieszysz się swoim wydarzeniem",
    description: "Resztę zostaw nam. Ty możesz skupić się na rodzinie, znajomych i dobrej zabawie.",
  },
  {
    icon: Package,
    title: "Po wszystkim wracamy",
    description:
      "Po zakończeniu imprezy demontujemy cały zestaw i zabieramy go ze sobą. Tobie zostają tylko wspomnienia i świetnie spędzony czas.",
  },
]

export function WhyUsSection() {
  return (
    <section className="bg-background overflow-hidden py-14 md:py-24">
      <div className="container mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        {/* Header — left aligned on every breakpoint */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
              Jak to działa?
            </p>
            <Sparkles className="h-4 w-4 shrink-0 text-accent/80" aria-hidden />
            <span className="h-px w-16 bg-gradient-to-r from-accent/40 to-transparent sm:w-24" />
          </div>

          <h2 className="mt-4 text-3xl font-semibold leading-[1.12] tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Zorganizowanie namiotu jest{" "}
            <span className="font-script font-normal text-accent" style={{ fontFamily: "var(--font-script)" }}>
              prostsze
            </span>
            , niż myślisz
          </h2>

          <p className="mt-5 max-w-lg text-base font-medium leading-relaxed text-foreground sm:text-lg">
            Wybierz termin, skonfiguruj swoją imprezę i zarezerwuj{" "}
            <strong className="font-semibold">wszystko online</strong>. A jeśli nie wiesz, od czego zacząć,
            skorzystaj z <strong className="font-semibold">krótkiego quizu</strong> &mdash; pomoże Ci dobrać
            odpowiedni namiot i dodatki.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Nie musisz wymieniać wiadomości ani czekać na wycenę. Wszystko zrobisz{" "}
            <strong className="font-semibold text-foreground">w jednym miejscu</strong>, a po złożeniu rezerwacji
            skontaktujemy się z Tobą, żeby potwierdzić szczegóły.
          </p>
        </div>

        {/* Timeline */}
        <ol className="mt-10 md:mt-14">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isLast = i === steps.length - 1
            return (
              <li key={step.title} className="relative flex gap-4 sm:gap-6">
                {/* Number + connector rail */}
                <div className="flex flex-col items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-base font-semibold text-accent sm:h-12 sm:w-12 sm:text-lg">
                    {i + 1}
                  </span>
                  {!isLast && (
                    <span
                      aria-hidden
                      className="my-1.5 w-px flex-1 border-l border-dashed border-accent/30"
                    />
                  )}
                </div>

                {/* Content */}
                <div className={isLast ? "pb-0" : "pb-8 sm:pb-10"}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20 sm:h-10 sm:w-10">
                      <Icon className="h-[1.1rem] w-[1.1rem] text-accent sm:h-5 sm:w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <h3 className="text-base font-semibold text-foreground sm:text-lg">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {step.description}
                  </p>
                  <ArrowRight className="mt-3 h-4 w-4 text-accent/70" aria-hidden />
                </div>
              </li>
            )
          })}
        </ol>

        {/* CTA card */}
        <div className="relative mt-4 overflow-hidden rounded-2xl md:rounded-3xl">
          <Image
            src="/images/ambiance-evening.png"
            alt=""
            width={1400}
            height={700}
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
          <div className="relative p-7 sm:p-10 md:p-12">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Brzmi dobrze?
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
              Sprawdź dostępność terminu i zarezerwuj online w kilka minut.
            </p>
            <a
              href="#rezerwacja"
              className="group mt-5 inline-flex h-12 items-center gap-3 rounded-full bg-accent px-7 text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground shadow-[0_12px_30px_-12px_rgba(60,46,55,0.6)] transition-all duration-200 hover:brightness-105"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden />
              Zarezerwuj termin
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
