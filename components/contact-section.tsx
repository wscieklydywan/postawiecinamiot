"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MessageCircle,
  Phone,
  Mail,
  User,
  Pencil,
  AlignLeft,
  Send,
  ShieldCheck,
  Heart,
} from "lucide-react"

/* Delikatne „iskierki" po bokach nagłówka — osobne, rozłożone kreski rozchodzące się wachlarzowo */
function Sparkle({ mirrored = false, className = "" }: { mirrored?: boolean; className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute ${mirrored ? "-scale-x-100" : ""} ${className}`}
      aria-hidden="true"
    >
      <span className="relative block h-9 w-9 rotate-180 md:h-10 md:w-10">
        {/* trzy osobne kreski, każda w innym miejscu, rozłożone jak promienie */}
        <span className="absolute left-0 top-1 h-0.5 w-4 -rotate-[35deg] rounded-full bg-accent/75" />
        <span className="absolute left-1 top-4 h-0.5 w-[1.15rem] rounded-full bg-accent/65" />
        <span className="absolute left-0 top-7 h-0.5 w-4 rotate-[35deg] rounded-full bg-accent/75" />
      </span>
    </span>
  )
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <section id="kontakt" className="py-12 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-8 md:mb-14">
          <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-3 md:mb-4">
            <MessageCircle className="w-3.5 h-3.5 md:w-5 md:h-5 text-accent" />
            <p className="text-[0.65rem] md:text-xs font-semibold uppercase tracking-[0.2em] text-accent">Kontakt</p>
          </div>
          <div className="relative inline-block">
              <Sparkle className="-left-16 top-1 md:-left-24" />
              <Sparkle mirrored className="-right-16 top-1 md:-right-24" />
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
              <span className="block text-foreground">Masz pytania?</span>
              <span className="block text-accent">Napisz do nas!</span>
            </h2>
          </div>
          <p className="mt-3 md:mt-5 text-sm md:text-lg text-muted-foreground leading-relaxed text-pretty">
            Chętnie doradzimy, pomożemy wybrać najlepszy zestaw i odpowiemy na wszystkie pytania.
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                <Field label="Imię i nazwisko" htmlFor="contact-name">
                  <IconInput icon={User}>
                    <input
                      id="contact-name"
                      placeholder="Twoje imię"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm md:text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </IconInput>
                </Field>
                <Field label="Telefon (opcjonalnie)" htmlFor="contact-phone">
                  <IconInput icon={Phone}>
                    <input
                      id="contact-phone"
                      placeholder="Twój numer"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm md:text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </IconInput>
                </Field>
              </div>

              <Field label="E-mail" htmlFor="contact-email">
                <IconInput icon={Mail}>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Twój e-mail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm md:text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </IconInput>
              </Field>

              <Field label="Temat wiadomości" htmlFor="contact-subject">
                <div className="relative">
                  <AlignLeft className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/80 z-10" />
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger
                      id="contact-subject"
                      className="!h-12 w-full rounded-xl border-border bg-background pl-11 pr-4 text-sm md:text-base data-[placeholder]:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      <SelectValue placeholder="Wybierz temat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rezerwacja">Rezerwacja namiotu</SelectItem>
                      <SelectItem value="wycena">Wycena i dostępność</SelectItem>
                      <SelectItem value="dodatki">Dodatki i wyposażenie</SelectItem>
                      <SelectItem value="transport">Transport i montaż</SelectItem>
                      <SelectItem value="inne">Inne pytanie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Field>

              <Field label="Wiadomość" htmlFor="contact-message">
                <div className="relative">
                  <Pencil className="pointer-events-none absolute left-3.5 top-3.5 w-5 h-5 text-accent/80" />
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Napisz, czego potrzebujesz..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm md:text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors resize-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </Field>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-3.5 md:py-4 text-accent-foreground font-semibold uppercase tracking-[0.12em] text-xs md:text-sm transition-colors hover:bg-accent/90"
              >
                Wyślij wiadomość
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-accent/80" />
                <span>Twoje dane są u nas bezpieczne.</span>
              </div>
            </form>
          </div>

          {/* Info strip */}
          <div className="mt-5 md:mt-8 bg-muted/50 border border-border rounded-2xl md:rounded-3xl px-4 py-4 md:px-8 md:py-8">
            <div className="flex flex-col divide-y divide-border md:grid md:grid-cols-3 md:divide-y-0 md:divide-x">
              <InfoCol icon={MessageCircle} title="Szybka odpowiedź">
                <p className="text-muted-foreground">Zwykle odpisujemy w ciągu kilku godzin.</p>
              </InfoCol>
              <InfoCol icon={Phone} title="Zadzwoń do nas">
                <a href="tel:+48123456789" className="font-semibold text-accent hover:underline">
                  +48 123 456 789
                </a>
                <p className="text-muted-foreground">Pn–Pt: 8:00 – 18:00</p>
              </InfoCol>
              <InfoCol icon={Mail} title="Napisz e-mail">
                <a
                  href="mailto:kontakt@postawiecinamiot.pl"
                  className="font-semibold text-accent hover:underline break-words"
                >
                  kontakt@postawiecinamiot.pl
                </a>
                <p className="text-muted-foreground">Odpowiadamy w ciągu kilku godzin</p>
              </InfoCol>
            </div>
          </div>

          {/* Bottom note + polaroid */}
          <div className="mt-8 md:mt-12 flex items-center justify-between gap-3 md:gap-8">
            <div className="flex items-start gap-2.5 md:gap-4">
              <Heart className="w-6 h-6 md:w-10 md:h-10 text-accent shrink-0 mt-1" strokeWidth={1.5} />
              <p className="font-script text-base md:text-3xl leading-snug text-foreground">
                Z przyjemnością pomożemy{" "}
                <span className="relative inline-block">
                  w organizacji Twojej imprezy!
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-accent/70" />
                </span>
              </p>
            </div>

            <div className="shrink-0 rotate-3 mr-1 md:mr-0">
              <div className="relative bg-card border border-border p-2 pb-5 md:p-2.5 md:pb-7 rounded-sm shadow-md">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-14 md:w-20 bg-muted-foreground/15 rotate-[-4deg] rounded-sm" aria-hidden="true" />
                <div className="relative w-24 h-20 md:w-44 md:h-32 overflow-hidden rounded-sm">
                  <Image
                    src="/images/ambiance-evening.png"
                    alt="Namiot imprezowy oświetlony wieczorem"
                    fill
                    sizes="(max-width: 768px) 96px, 176px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm md:text-base font-medium text-foreground mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}

function IconInput({
  icon: Icon,
  children,
}: {
  icon: typeof User
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/80" />
      {children}
    </div>
  )
}

function InfoCol({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof User
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-row items-center gap-3.5 py-3.5 text-left md:flex-col md:items-center md:gap-0 md:py-0 md:px-4 md:text-center">
      <div className="w-11 h-11 md:w-12 md:h-12 shrink-0 rounded-full bg-accent/10 flex items-center justify-center md:mb-3">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div className="min-w-0 flex-1 md:flex-none">
        <p className="font-serif font-semibold text-sm md:text-lg text-foreground md:mb-2 text-balance">{title}</p>
        <div className="text-xs md:text-sm leading-relaxed break-words">{children}</div>
      </div>
    </div>
  )
}
