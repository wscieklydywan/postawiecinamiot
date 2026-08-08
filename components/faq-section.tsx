"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import {
  ChevronDown,
  Sparkles,
  CalendarCheck,
  Workflow,
  MapPin,
  CloudRain,
  Clock,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Faq = {
  question: string
  answer: ReactNode
  icon: LucideIcon
}

function B({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>
}

const faqs: Faq[] = [
  {
    icon: CalendarCheck,
    question: "Jak wygląda rezerwacja?",
    answer: (
      <>
        <B>Wybierasz termin</B>, konfigurujesz swój zestaw i wysyłasz rezerwację online. Następnie kontaktujemy się z
        Tobą, żeby potwierdzić szczegóły. Rezerwację potwierdza <B>wpłata zaliczki</B>, a resztę rozliczamy przed lub w
        dniu montażu.
      </>
    ),
  },
  {
    icon: Workflow,
    question: "Jak wygląda cały proces?",
    answer: (
      <>
        To naprawdę proste. <B>Ty wybierasz namiot i dodatki</B> (albo rozwiązujesz krótki quiz), a{" "}
        <B>my zajmujemy się całą resztą</B>. Ustalamy szczegóły, przywozimy namiot, montujemy go przed imprezą, a po
        zakończeniu wszystko demontujemy i zabieramy.
      </>
    ),
  },
  {
    icon: MapPin,
    question: "Jak daleko dojeżdżacie?",
    answer: (
      <>
        Działamy głównie na terenie <B>Rybnika i całego Śląska</B>, ale bez problemu dojeżdżamy również dalej. W
        konfiguratorze od razu sprawdzisz <B>koszt transportu</B> do swojej lokalizacji.
      </>
    ),
  },
  {
    icon: CloudRain,
    question: "A jeśli będzie padać?",
    answer: (
      <>
        Spokojnie — <B>właśnie po to jest namiot</B>. Chroni przed deszczem, słońcem i wiatrem, dzięki czemu impreza może
        odbyć się zgodnie z planem <B>niezależnie od pogody</B>.
      </>
    ),
  },
  {
    icon: Clock,
    question: "Ile trwa montaż?",
    answer: (
      <>
        To zależy od wielkości namiotu, ale najczęściej zajmuje <B>od około 30 do 90 minut</B>. Przyjeżdżamy odpowiednio
        wcześniej, żeby wszystko było gotowe przed rozpoczęciem imprezy.
      </>
    ),
  },
  {
    icon: HelpCircle,
    question: "Nie wiem, jaki namiot wybrać. Co wtedy?",
    answer: (
      <>
        Od tego jesteśmy. Możesz skorzystać z <B>krótkiego quizu</B>, który zaproponuje gotowy zestaw, albo po prostu{" "}
        <B>napisać lub zadzwonić</B>. Doradzimy, jaki namiot i dodatki będą najlepsze do Twojej imprezy.
      </>
    ),
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-12 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-14">
          <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-2 md:mb-4">
            <Sparkles className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
            <p className="text-[0.65rem] md:text-xs font-semibold uppercase tracking-[0.2em] text-primary">FAQ</p>
          </div>
          <h2 className="font-serif text-2xl md:text-5xl font-semibold tracking-tight text-foreground mb-2 md:mb-4 text-balance">
            Częste pytania
          </h2>
          <p className="text-xs md:text-lg text-muted-foreground leading-relaxed text-pretty">
            Odpowiadamy na najczęściej zadawane pytania, żeby rozwiać Twoje wątpliwości.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-2xl mx-auto space-y-2 md:space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const Icon = faq.icon
            return (
              <div
                key={index}
                className={cn(
                  "bg-card rounded-xl md:rounded-2xl border overflow-hidden transition-colors duration-200",
                  isOpen ? "border-primary/40 shadow-sm" : "border-border hover:border-primary/20"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full p-2.5 md:p-5 flex items-center gap-2.5 md:gap-4 text-left group"
                >
                  <div
                    className={cn(
                      "w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                      isOpen ? "bg-primary/15 text-primary" : "bg-muted text-primary/70 group-hover:bg-primary/10"
                    )}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <span className="flex-1 font-serif text-sm md:text-xl font-medium text-foreground pr-1 text-balance">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "w-7 h-7 md:w-10 md:h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300",
                      isOpen
                        ? "border-primary/40 bg-primary/5 text-primary"
                        : "border-border text-muted-foreground group-hover:border-primary/30 group-hover:text-primary"
                    )}
                  >
                    <ChevronDown
                      className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform duration-300", isOpen && "rotate-180")}
                    />
                  </div>
                </button>
                <div
                  className={cn(
                    "grid will-change-[grid-template-rows] motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                  style={{
                    transition:
                      "grid-template-rows 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease-out",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pl-[3.25rem] md:pl-[4rem] pr-3 md:pr-6 pb-3 md:pb-6 text-xs md:text-base text-muted-foreground leading-relaxed text-pretty">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA card */}
        <div className="max-w-2xl mx-auto mt-6 md:mt-10">
          <div className="bg-card border border-border rounded-2xl md:rounded-3xl px-5 py-6 md:px-8 md:py-10 text-center">
            <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-primary mx-auto mb-2 md:mb-3" />
            <h3 className="font-serif text-lg md:text-3xl font-semibold text-foreground mb-1 md:mb-2 text-balance">
              Masz inne pytanie?
            </h3>
            <p className="text-xs md:text-base text-muted-foreground mb-4 md:mb-6">
              Napisz do nas – chętnie pomożemy!
            </p>
            <Link
              href="#kontakt"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 md:py-4 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-base font-semibold uppercase tracking-[0.15em]">
                Skontaktuj się z nami
              </span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-auto md:ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
