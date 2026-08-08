"use client"

import { useMemo, useState } from "react"
import { ConfiguratorWizard } from "@/components/configurator-wizard"
import { useCart, type BookingSummary } from "@/lib/cart-context"

/**
 * Zawartość kreatora "Wybieram sam" (konfigurator). Współdzielona przez trasę
 * przechwytującą (nakładka nad stroną główną) oraz samodzielną podstronę.
 */
export function KonfiguratorExperience({
  close,
}: {
  close: (destination?: string, backSteps?: number) => void
}) {
  const { confirmBooking, configuratorPrefill, setConfiguratorPrefill } = useCart()

  // Bieżący krok kreatora (0–3). Każdy krok dokłada jeden wpis w historii, więc
  // powrót na `/` musi zdjąć `step + 1` wpisów (kroki + bazowy wpis nakładki).
  const [step, setStep] = useState(0)
  const homeSteps = step + 1

  // Odczytaj (jednorazowo) prefill przekazany np. z quizu "Edytuj zestaw".
  const prefill = useMemo(() => {
    const p = configuratorPrefill
    if (p) setConfiguratorPrefill(null)
    return p
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (summary: BookingSummary) => {
    // Potwierdzenie przełącza sekcję "Rezerwacja online" na stronie głównej
    // na widok podziękowania (która sama się przewija do widoku).
    confirmBooking(summary)
    close("/", homeSteps)
  }

  const handleClose = () => close("/", homeSteps)

  return (
    <div className="flex-1 min-h-0">
      <ConfiguratorWizard
        initialTentId={prefill?.tentId}
        initialExtraIds={prefill?.extraIds}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onStepChange={setStep}
      />
    </div>
  )
}
