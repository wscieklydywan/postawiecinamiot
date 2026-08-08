"use client"

import { ReservationOverlay } from "@/components/reservation-overlay"
import { KonfiguratorExperience } from "@/components/konfigurator-experience"

// Trasa przechwytująca: konfigurator otwierany ze strony głównej renderuje się
// jako nakładka NAD wciąż zamontowaną stroną główną. Zamknięcie cofa historię,
// więc powrót jest natychmiastowy (strona główna nie ładuje się ponownie).
export default function KonfiguratorModal() {
  return (
    <ReservationOverlay mode="modal">
      {({ close }) => <KonfiguratorExperience close={close} />}
    </ReservationOverlay>
  )
}
