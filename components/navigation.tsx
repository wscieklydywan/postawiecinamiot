"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Phone,
  X,
  Menu,
  Tent,
  CalendarDays,
  Package,
  HelpCircle,
  ChevronRight,
  Sparkle,
  Mail,
} from "lucide-react"
import { FacebookIcon, InstagramIcon } from "@/components/social-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#galeria", label: "Realizacje" },
  { href: "#rezerwacja", label: "Rezerwacja" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Kontakt" },
]

const mobileMenuItems = [
  { href: "#galeria", label: "Realizacje", icon: Tent },
  { href: "#rezerwacja", label: "Rezerwacja terminu", icon: CalendarDays },
  { href: "#rezerwacja", label: "Nasza oferta", icon: Package },
  { href: "#faq", label: "FAQ", icon: HelpCircle },
  { href: "#kontakt", label: "Kontakt", icon: Phone },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollPositionRef = useRef(0)
  const menuScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Block scroll when menu is open, preserving the page scroll position
  useEffect(() => {
    if (!isOpen) return

    // Store position in a ref so it survives the effect cleanup
    scrollPositionRef.current = window.scrollY
    const { current: scrollY } = scrollPositionRef

    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.width = "100%"
    document.body.style.top = `-${scrollY}px`

    // Reset the menu's internal scroll to the top each time it opens
    if (menuScrollRef.current) {
      menuScrollRef.current.scrollTop = 0
    }

    return () => {
      // Temporarily disable the global `scroll-behavior: smooth` so restoring
      // the position is instant instead of animating from the top.
      const html = document.documentElement
      const previousScrollBehavior = html.style.scrollBehavior
      html.style.scrollBehavior = "auto"

      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.top = ""
      window.scrollTo(0, scrollY)

      html.style.scrollBehavior = previousScrollBehavior
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 py-2.5 transition-all duration-300",
          isScrolled
            ? "bg-primary/95 backdrop-blur-xl border-b border-primary-foreground/10 shadow-[0_8px_30px_-12px_rgba(60,40,55,0.5)]"
            : "bg-transparent"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-[60] -ml-3 flex items-center md:-ml-4" aria-label="Postawię Ci Namiot — strona główna">
            <span
              role="img"
              aria-label="Postawię Ci Namiot — logo"
              className={cn(
                "block transition-colors duration-300",
                isScrolled ? "bg-primary-foreground" : "bg-foreground"
              )}
              style={{
                width: "84px",
                height: "84px",
                marginTop: "-42px",
                marginBottom: "-42px",
                transform: "translate(-4px, 5px)",
                WebkitMaskImage: "url(/images/logo-tent.svg)",
                maskImage: "url(/images/logo-tent.svg)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300",
                  isScrolled
                    ? "text-primary-foreground/85 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    : "text-foreground/80 hover:text-foreground hover:bg-foreground/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <a 
              href="tel:+48798389030"
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-all duration-300 hover:text-secondary",
                isScrolled ? "text-primary-foreground" : "text-foreground"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300",
                  isScrolled ? "bg-primary-foreground/10" : "bg-foreground/10"
                )}
              >
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span>798 389 030</span>
            </a>
            <Button 
              size="sm" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-4 h-8 text-sm"
              asChild
            >
              <a href="#rezerwacja">Zarezerwuj</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={cn(
              "lg:hidden relative z-[60] w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300",
              isScrolled ? "text-primary-foreground" : "text-foreground",
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            aria-label="Otwórz menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-[55] bg-background transition-all duration-500 ease-out",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Close button */}
        <button
          onClick={closeMenu}
          className="absolute top-3.5 right-4 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors"
          aria-label="Zamknij menu"
        >
          <X className="w-5 h-5" />
        </button>

        <div ref={menuScrollRef} className="relative z-10 h-full overflow-y-auto overscroll-contain">
          <div className="flex min-h-full flex-col">
          {/* Top: logo + nav */}
          <div className="px-6 pt-3 pb-2">
            {/* Logo in mobile menu */}
            <div
              className={cn(
                "flex flex-col items-center transition-all duration-500",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              )}
              style={{ transitionDelay: isOpen ? "50ms" : "0ms" }}
            >
              <Image
                src="/images/logo.png"
                alt="Postawię Ci Namiot — wynajem namiotów imprezowych"
                width={320}
                height={320}
                className="h-auto w-full max-w-[190px]"
              />
              {/* Tagline under logo */}
              <div className="-mt-[52px] flex items-center gap-2">
                <span className="h-px w-7 bg-border" />
                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Chrzciny · Wesela · Eventy
                </span>
                <span className="h-px w-7 bg-border" />
              </div>
              <Sparkle className="mt-2 h-2.5 w-2.5 text-secondary-foreground/70" />
            </div>

            {/* Menu items */}
            <nav className="mt-3 flex flex-col">
              {mobileMenuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={item.label}>
                    {index > 0 && <div className="h-px bg-border/30" />}
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "group flex items-center gap-3.5 py-2.5 transition-all duration-500",
                        isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                      )}
                      style={{ transitionDelay: isOpen ? `${index * 55 + 120}ms` : "0ms" }}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/25 transition-colors group-hover:bg-secondary/40">
                        <Icon className="h-[18px] w-[18px] text-primary" />
                      </span>
                      <span className="flex-1 font-serif text-lg text-foreground">
                        {item.label}
                      </span>
                      <ChevronRight className="h-[18px] w-[18px] text-primary/70 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                )
              })}
            </nav>
          </div>

          {/* Thin curved section divider (fala) — full width, edge to edge */}
          <div
            className={cn(
              "mt-auto flex items-center justify-center pt-3 pb-2 transition-all duration-500",
              isOpen ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: isOpen ? `${mobileMenuItems.length * 55 + 160}ms` : "0ms" }}
          >
            <svg
              className="h-8 flex-1 text-secondary/20"
              viewBox="0 0 700 32"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,6 C260,6 380,16 700,16"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
            <svg
              className="mx-3 h-3.5 w-3.5 shrink-0 text-secondary"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
                fill="currentColor"
              />
            </svg>
            <svg
              className="h-8 flex-1 text-secondary/20"
              viewBox="0 0 700 32"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,16 C320,16 440,6 700,6"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>

          {/* Bottom CTA section with wave + vivid photo bleed */}
          <div
            className={cn(
              "relative pt-6 transition-all duration-500",
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: isOpen ? "420ms" : "0ms" }}
          >
            {/* Wave divider (fala) */}
            <svg
              className="absolute -top-px left-0 w-full text-background"
              style={{ height: "38px" }}
              viewBox="0 0 1440 40"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,22 C240,44 480,-4 720,14 C960,32 1200,46 1440,18 L1440,0 L0,0 Z"
                fill="currentColor"
              />
            </svg>

            {/* Vivid tent photo bleed */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <Image
                src="/images/hero-bg-mobile.png"
                alt=""
                aria-hidden="true"
                fill
                className="object-cover object-top opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/55 to-background/10" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col items-center px-6 pb-4 pt-2 text-center">
              <p className="font-script text-xl text-primary">Masz pytania?</p>
              <p className="mt-1 max-w-xs text-pretty text-xs leading-snug text-muted-foreground">
                Jesteśmy tu, aby pomóc w organizacji Twojego wydarzenia.
              </p>

              <a
                href="tel:+48798389030"
                onClick={closeMenu}
                className="mt-2.5 flex w-full max-w-[260px] items-center justify-center gap-2.5 rounded-xl border border-border bg-card/70 py-2 text-foreground backdrop-blur-sm transition-colors hover:bg-card"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/25">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </span>
                <span className="text-lg font-semibold tracking-wide">798 389 030</span>
              </a>

              <Button
                className="mt-2 h-10 w-full max-w-[260px] gap-2 rounded-xl bg-secondary text-sm font-bold text-secondary-foreground hover:bg-secondary/90"
                onClick={closeMenu}
                asChild
              >
                <a href="#rezerwacja">
                  <CalendarDays className="h-4 w-4" />
                  Zarezerwuj termin
                </a>
              </Button>

              {/* Social icons */}
              <div className="mt-2.5 flex items-center gap-3.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-foreground/5"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-foreground/5"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="mailto:kontakt@postawiecinamiot.pl"
                  aria-label="E-mail"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-foreground/5"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  )
}
