"use client"

import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "center" | "left"
  inverted?: boolean
  className?: string
}

/**
 * Spojny naglowek sekcji uzywany w calym serwisie.
 * Ujednolica eyebrow, tytul i podtytul - bez dekoracyjnych linii/ikon,
 * dzieki czemu uklad jest czytelny i stonowany.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  inverted = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em] mb-4",
            inverted ? "text-secondary" : "text-primary/70"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-semibold tracking-tight text-balance",
          inverted ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed",
            inverted ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
