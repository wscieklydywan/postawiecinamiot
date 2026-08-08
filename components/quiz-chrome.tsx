"use client"

import { Fragment } from "react"
import { X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Górny pasek kreatora w stylu mini-aplikacji:
 * - przycisk „X" (zamknięcie) w zaokrąglonym kwadracie po lewej,
 * - licznik „Krok X z N" na środku (tylko w trakcie quizu),
 * - linia postępu z kropkami pod spodem (tylko w trakcie quizu).
 */
export function QuizTopBar({
  showProgress,
  step,
  totalSteps,
  onClose,
}: {
  showProgress: boolean
  step: number
  totalSteps: number
  onClose: () => void
}) {
  return (
    <header className="shrink-0 bg-card px-4 pb-2 pt-4 md:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij rezerwację"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground shadow-sm transition-colors hover:bg-muted md:h-11 md:w-11 md:rounded-2xl"
          >
            <X className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.5} />
          </button>

          <span className="flex-1 text-center text-[15px] font-medium text-foreground">
            {showProgress ? `Krok ${step + 1} z ${totalSteps}` : ""}
          </span>

          {/* Pusty element równoważący szerokość przycisku X, by licznik był wyśrodkowany */}
          <span className="h-10 w-10 shrink-0 md:h-11 md:w-11" aria-hidden />
        </div>

        {showProgress && (
          <div className="mt-4 flex items-center px-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <Fragment key={i}>
                <span
                  className={cn(
                    "h-3 w-3 shrink-0 rounded-full border-2 transition-colors duration-300 md:h-4 md:w-4",
                    i <= step ? "border-accent bg-accent" : "border-border bg-card",
                  )}
                />
                {i < totalSteps - 1 && (
                  <span
                    className={cn(
                      "h-px flex-1 transition-colors duration-300",
                      i < step ? "bg-accent" : "bg-border",
                    )}
                  />
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

/**
 * Modal potwierdzenia wyjścia z rezerwacji — pojawia się przed powrotem
 * na stronę główną, żeby użytkownik nie utracił odpowiedzi przez przypadek.
 */
export function ExitDialog({
  open,
  onStay,
  onLeave,
}: {
  open: boolean
  onStay: () => void
  onLeave: () => void
}) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      {/* Przyciemnione tło */}
      <button
        type="button"
        aria-label="Zamknij okno"
        onClick={onStay}
        className="absolute inset-0 cursor-default bg-foreground/45"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="exit-dialog-title"
        aria-describedby="exit-dialog-desc"
        className="relative w-full max-w-sm animate-fade-in-up rounded-2xl border bg-card p-6 text-center shadow-xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <LogOut className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
        </div>

        <h3 id="exit-dialog-title" className="mt-4 text-xl font-bold text-foreground">
          Wyjść z rezerwacji?
        </h3>
        <p
          id="exit-dialog-desc"
          className="mx-auto mt-1.5 max-w-[17rem] text-pretty text-sm leading-relaxed text-muted-foreground"
        >
          Wszystkie dotychczasowe odpowiedzi zostaną utracone.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onStay} className="h-11">
            Zostań
          </Button>
          <Button
            onClick={onLeave}
            className="h-11 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Wyjdź
          </Button>
        </div>
      </div>
    </div>
  )
}
