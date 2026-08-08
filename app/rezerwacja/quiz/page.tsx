"use client"

import { ReservationOverlay } from "@/components/reservation-overlay"
import { QuizExperience } from "@/components/quiz-experience"

// Samodzielna podstrona quizu — używana przy twardym wejściu / bezpośrednim
// linku. Przy nawigacji ze strony głównej quiz otwiera się jako nakładka nad
// stroną główną (trasa przechwytująca: app/@modal/(.)rezerwacja/quiz).
export default function QuizPage() {
  return (
    <ReservationOverlay mode="page">
      {({ close }) => <QuizExperience close={close} />}
    </ReservationOverlay>
  )
}
