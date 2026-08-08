import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, ChevronRight, CalendarCheck, ArrowRight, Heart } from "lucide-react"
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/social-icons"

const navLinks = [
  { label: "Namioty", href: "#rezerwacja" },
  { label: "Dodatki", href: "#rezerwacja" },
  { label: "Jak to działa?", href: "#rezerwacja" },
  { label: "FAQ", href: "#faq" },
  { label: "O nas", href: "#kontakt" },
  { label: "Kontakt", href: "#kontakt" },
]

const contacts = [
  {
    icon: Phone,
    title: "+48 123 456 789",
    subtitle: "Pn–Pt: 8:00 – 18:00",
    href: "tel:+48123456789",
  },
  {
    icon: Mail,
    title: "kontakt@postawiecinamiot.pl",
    subtitle: "Zwykle odpisujemy tego samego dnia",
    href: "mailto:kontakt@postawiecinamiot.pl",
  },
  {
    icon: MapPin,
    title: "Rybnik, Śląsk",
    subtitle: "Działamy na terenie całego Śląska i okolic",
    href: "#kontakt",
  },
]

const socials = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: TikTokIcon, label: "TikTok", href: "https://tiktok.com" },
  { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/48123456789" },
]

export function Footer() {
  return (
    <footer className="bg-background text-foreground">
      {/* ===== Falisty dzielnik — pełna szerokość, bez gwiazdki, delikatnie większa fala ===== */}
      <div aria-hidden className="w-full leading-[0] text-secondary">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block h-7 w-full md:h-11">
          <path
            d="M0,35 C240,68 480,68 720,42 C960,16 1200,16 1440,44"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* ===== Logo + hasło ===== */}
        <div className="flex flex-col items-center gap-5 text-center md:flex-row md:justify-center md:gap-10 md:text-left">
          <Image
            src="/images/logo.png"
            alt="Postawię Ci Namiot — wynajem namiotów imprezowych"
            width={320}
            height={320}
            className="h-auto w-40 shrink-0 md:w-48"
          />
          <div className="flex flex-col items-center md:items-start">
            <p className="max-w-md text-pretty font-serif text-lg leading-relaxed text-foreground md:text-2xl">
              Namioty na Twoją imprezę.
              <br />
              Ty bawisz się – my ogarniamy resztę.
            </p>
            {/* serduszko z kreseczkami */}
            <div className="mt-3 flex items-center text-accent" aria-hidden="true">
              <Dashes className="-mr-1" />
              <Heart className="h-5 w-5" strokeWidth={1.75} />
              <Dashes className="-ml-1 rotate-180" />
            </div>
          </div>
        </div>

        {/* ===== Dane kontaktowe ===== */}
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-border md:mt-12">
          {contacts.map((contact) => {
            const Icon = contact.icon
            return (
              <a
                key={contact.title}
                href={contact.href}
                className="group flex items-center gap-4 py-4 md:gap-5 md:py-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 md:h-14 md:w-14">
                  <Icon className="h-5 w-5 text-accent md:h-6 md:w-6" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-bold text-foreground transition-colors group-hover:text-accent md:text-lg">
                    {contact.title}
                  </span>
                  <span className="block text-sm text-muted-foreground md:text-base">{contact.subtitle}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
            )
          })}
        </div>

        {/* ===== Linki nawigacyjne ===== */}
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:mt-10 md:gap-x-6">
          {navLinks.map((link, index) => (
            <span key={link.label} className="flex items-center gap-x-4 md:gap-x-6">
              <Link
                href={link.href}
                className="text-sm font-semibold text-foreground transition-colors hover:text-accent md:text-base"
              >
                {link.label}
              </Link>
              {index < navLinks.length - 1 && (
                <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
              )}
            </span>
          ))}
        </nav>

        {/* ===== CTA banner ===== */}
        <div className="mt-8 rounded-2xl border border-secondary/70 bg-secondary/40 md:mt-10">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 md:h-14 md:w-14">
                <CalendarCheck className="h-6 w-6 text-accent md:h-7 md:w-7" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-foreground md:text-xl">Masz termin? Nie czekaj!</p>
                <p className="text-sm text-muted-foreground md:text-base">Sprawdź dostępność i zarezerwuj online.</p>
              </div>
            </div>
            <Link
              href="#rezerwacja"
              className="group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground transition-colors hover:bg-accent/90 md:text-sm"
            >
              Zarezerwuj termin
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* ===== Znajdź nas ===== */}
        <div className="mt-9 flex flex-col items-center md:mt-12">
          <p className="font-serif text-lg font-semibold text-foreground md:text-xl">Znajdź nas</p>
          <div className="mt-4 flex items-center gap-3.5 md:gap-4">
            {socials.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/40 text-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground md:h-12 md:w-12"
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* ===== Dolna, dekoracyjna sekcja z rysunkami ===== */}
      <div className="relative mt-8 overflow-hidden md:mt-12">
        <Image
          src="/images/footer-tree.png"
          alt=""
          aria-hidden="true"
          width={512}
          height={512}
          className="pointer-events-none absolute bottom-0 left-0 w-24 select-none sm:w-36 md:w-52"
        />
        <Image
          src="/images/footer-tent.png"
          alt=""
          aria-hidden="true"
          width={512}
          height={512}
          className="pointer-events-none absolute bottom-0 right-0 w-28 select-none sm:w-44 md:w-64"
        />

        <div className="relative z-10 flex flex-col items-center px-5 pb-8 pt-6 text-center md:pb-10">
          {/* Divider z sercem */}
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent/50 md:w-16" />
            <Heart className="h-3.5 w-3.5 shrink-0 text-accent" fill="currentColor" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent/50 md:w-16" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Stawiamy nie tylko namioty, ale i dobre relacje!
          </p>
          <p className="mt-2 text-xs text-muted-foreground/70 md:text-sm">
            &copy; {new Date().getFullYear()} Postawię Ci Namiot. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  )
}

function Dashes({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={`h-4 w-4 ${className ?? ""}`}
      aria-hidden="true"
    >
      <path d="M4 12 h5" />
      <path d="M6 6 l3.5 3" />
      <path d="M6 18 l3.5 -3" />
    </svg>
  )
}
