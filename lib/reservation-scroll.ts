// ---------------------------------------------------------------------------
// Zarządzanie powrotem z kreatora rezerwacji (konfigurator / quiz) na stronę
// główną — bez widocznej animacji przewijania "od góry".
//
// Dwa scenariusze powrotu:
//   • "restore" — zwykłe zamknięcie / wstecz: wracamy DOKŁADNIE do miejsca,
//     w którym użytkownik wszedł do kreatora.
//   • "section" — po wysłaniu zapytania: ustawiamy się na POCZĄTKU sekcji
//     "Rezerwacja online", aby potwierdzenie było dobrze widoczne.
//
// Intencja i pozycja przekazywane są przez sessionStorage, ponieważ przejście
// do podstrony i z powrotem odmontowuje stronę główną (nowy render trasy).
// ---------------------------------------------------------------------------

const INTENT_KEY = "reservation-return-intent"
const SCROLL_KEY = "reservation-entry-scroll"

export type ReservationReturnIntent = "restore" | "section"

// Zapamiętaj pozycję scrolla w chwili wejścia do kreatora (ze strony głównej).
export function rememberReservationEntry() {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)))
  } catch {
    /* sessionStorage niedostępne — pomijamy */
  }
}

// Ustaw sposób powrotu tuż przed nawigacją na stronę główną.
export function setReservationReturnIntent(intent: ReservationReturnIntent) {
  try {
    sessionStorage.setItem(INTENT_KEY, intent)
  } catch {
    /* pomijamy */
  }
}

// Odczytaj i wyczyść intencję powrotu (wywoływane na stronie głównej).
export function consumeReservationReturn():
  | { intent: ReservationReturnIntent; scrollY: number }
  | null {
  try {
    const explicitIntent = sessionStorage.getItem(INTENT_KEY) as ReservationReturnIntent | null
    const raw = sessionStorage.getItem(SCROLL_KEY)

    // Brak jakichkolwiek śladów wejścia do kreatora — normalne wejście na stronę.
    if (!explicitIntent && raw === null) return null

    // Gdy użytkownik wróci przyciskiem "wstecz" przeglądarki, nie ma jawnej
    // intencji — ale mamy zapamiętaną pozycję wejścia, więc domyślnie
    // przywracamy dokładnie to miejsce (tak jak przy zamknięciu w aplikacji).
    const intent: ReservationReturnIntent = explicitIntent ?? "restore"
    const parsed = raw ? Number.parseInt(raw, 10) : 0

    sessionStorage.removeItem(INTENT_KEY)
    sessionStorage.removeItem(SCROLL_KEY)

    return { intent, scrollY: Number.isFinite(parsed) ? parsed : 0 }
  } catch {
    return null
  }
}
