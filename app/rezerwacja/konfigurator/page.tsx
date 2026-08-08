"use client"

import { ReservationOverlay } from "@/components/reservation-overlay"
import { KonfiguratorExperience } from "@/components/konfigurator-experience"

// Samodzielna podstrona konfiguratora — używana przy twardym wejściu /
// bezpośrednim linku. Przy nawigacji ze strony głównej konfigurator otwiera
// się jako nakładka nad stroną główną (trasa przechwytująca).
export default function KonfiguratorPage() {
  return (
    <ReservationOverlay mode="page">
      {({ close }) => <KonfiguratorExperience close={close} />}
    </ReservationOverlay>
  )
}
