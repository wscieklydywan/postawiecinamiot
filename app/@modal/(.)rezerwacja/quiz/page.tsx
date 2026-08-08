"use client"

import { ReservationOverlay } from "@/components/reservation-overlay"
import { QuizExperience } from "@/components/quiz-experience"

// Trasa przechwytująca: quiz otwierany ze strony głównej renderuje się jako
// nakładka NAD wciąż zamontowaną stroną główną. Zamknięcie cofa historię,
// więc powrót jest natychmiastowy (strona główna nie ładuje się ponownie).
export default function QuizModal() {
  return (
    <ReservationOverlay mode="modal">
      {({ close }) => <QuizExperience close={close} />}
    </ReservationOverlay>
  )
}
