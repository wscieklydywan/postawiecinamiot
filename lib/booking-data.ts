import {
  Tent,
  Users,
  Sparkles,
  CalendarDays,
  Lightbulb,
  Table,
  Armchair,
  Music,
  Camera,
  Flame,
  Martini,
  PartyPopper,
  User,
  LayoutGrid,
  Star,
} from "lucide-react"

// ---------------------------------------------------------------------------
// TYPY
// ---------------------------------------------------------------------------

export type TentData = {
  id: string
  label: string
  size: string
  capacity: string
  capacityNum: number
  price: number
  image: string
  tagline: string
  includes: string[]
}

export type ExtraCategoryId =
  | "oswietlenie"
  | "podlogi"
  | "meble"
  | "dekoracje"
  | "naglosnienie"
  | "ogrzewanie"
  | "atrakcje"

export type ExtraData = {
  id: string
  label: string
  price: number
  icon: typeof Lightbulb
  type: "extra" | "service"
  category: ExtraCategoryId
  description?: string
}

export type ExtraCategory = {
  id: ExtraCategoryId
  label: string
  icon: typeof Lightbulb
}

// ---------------------------------------------------------------------------
// DANE
// ---------------------------------------------------------------------------

export const tents: TentData[] = [
  {
    id: "tent-small",
    label: "Mały",
    size: "3 × 6 m",
    capacity: "do 20 osób",
    capacityNum: 20,
    price: 400,
    image: "/images/tent-small.png",
    tagline: "Idealny na kameralne spotkania",
    includes: ["Namiot 3×6 m", "Montaż i demontaż", "Transport do 20 km", "Biała plandeka"],
  },
  {
    id: "tent-medium",
    label: "Średni",
    size: "5 × 8 m",
    capacity: "do 40 osób",
    capacityNum: 40,
    price: 700,
    image: "/images/tent-medium.png",
    tagline: "Najczęściej wybierany na wesela i przyjęcia",
    includes: ["Namiot 5×8 m", "Montaż i demontaż", "Transport do 30 km", "Ściany boczne", "Biała plandeka"],
  },
  {
    id: "tent-large",
    label: "Duży",
    size: "6 × 12 m",
    capacity: "do 80 osób",
    capacityNum: 80,
    price: 1200,
    image: "/images/tent-large.png",
    tagline: "Dla większych wydarzeń i komfortu gości",
    includes: ["Namiot 6×12 m", "Montaż i demontaż", "Transport do 40 km", "Ściany z oknami", "Wejście frontowe"],
  },
  {
    id: "tent-premium",
    label: "Premium",
    size: "10 × 15 m",
    capacity: "do 150 osób",
    capacityNum: 150,
    price: 2500,
    image: "/images/tent-premium.png",
    tagline: "Największy namiot na wystawne przyjęcia",
    includes: ["Namiot 10×15 m", "Montaż i demontaż", "Transport do 50 km", "Podłoga", "Ściany z oknami", "2 wejścia"],
  },
]

export const extraCategories: ExtraCategory[] = [
  { id: "oswietlenie", label: "Oświetlenie", icon: Lightbulb },
  { id: "podlogi", label: "Podłogi i wyposażenie", icon: LayoutGrid },
  { id: "meble", label: "Meble", icon: Armchair },
  { id: "dekoracje", label: "Dekoracje", icon: PartyPopper },
  { id: "naglosnienie", label: "Nagłośnienie i multimedia", icon: Music },
  { id: "ogrzewanie", label: "Ogrzewanie i komfort", icon: Flame },
  { id: "atrakcje", label: "Atrakcje i rozrywka", icon: Star },
]

export const extras: ExtraData[] = [
  // Oświetlenie
  { id: "oswietlenie-led", label: "Oświetlenie LED", price: 200, icon: Lightbulb, type: "extra", category: "oswietlenie", description: "Ciepłe światło pod całą powierzchnią namiotu" },
  { id: "girlandy", label: "Girlandy świetlne", price: 150, icon: Lightbulb, type: "extra", category: "oswietlenie", description: "Retro żarówki nad strefą gości" },
  { id: "lampiony", label: "Lampiony ogrodowe", price: 120, icon: Lightbulb, type: "extra", category: "oswietlenie", description: "Klimatyczne lampiony wokół namiotu" },
  { id: "reflektory", label: "Reflektory sceniczne", price: 250, icon: Lightbulb, type: "extra", category: "oswietlenie", description: "Kolorowe światło na parkiet i scenę" },
  { id: "podswietlenie-rgb", label: "Podświetlenie RGB", price: 300, icon: Lightbulb, type: "extra", category: "oswietlenie", description: "Sterowane podświetlenie ścian namiotu" },

  // Podłogi i wyposażenie
  { id: "podloga", label: "Podłoga taneczna", price: 400, icon: LayoutGrid, type: "extra", category: "podlogi", description: "Solidny parkiet do tańca" },
  { id: "wykladzina", label: "Wykładzina podłogowa", price: 350, icon: LayoutGrid, type: "extra", category: "podlogi", description: "Wykładzina na całą powierzchnię" },
  { id: "scena", label: "Scena podestowa", price: 500, icon: LayoutGrid, type: "extra", category: "podlogi", description: "Podest dla zespołu lub pary młodej" },
  { id: "parkiet-drewno", label: "Parkiet drewniany", price: 450, icon: LayoutGrid, type: "extra", category: "podlogi", description: "Elegancki parkiet z prawdziwego drewna" },
  { id: "sciany-boczne", label: "Ściany boczne", price: 200, icon: LayoutGrid, type: "extra", category: "podlogi", description: "Dodatkowe pełne ściany namiotu" },
  { id: "panele-okna", label: "Panele z oknami", price: 180, icon: LayoutGrid, type: "extra", category: "podlogi", description: "Ściany z przezroczystymi oknami" },

  // Meble
  { id: "stoly", label: "Stoły (komplet)", price: 150, icon: Table, type: "extra", category: "meble", description: "Komplet stołów bankietowych" },
  { id: "krzesla", label: "Krzesła (komplet)", price: 120, icon: Armchair, type: "extra", category: "meble", description: "Komplet krzeseł dla gości" },
  { id: "stoly-koktajlowe", label: "Stoły koktajlowe", price: 100, icon: Table, type: "extra", category: "meble", description: "Wysokie stoły do strefy powitania" },
  { id: "strefa-lounge", label: "Strefa lounge", price: 350, icon: Armchair, type: "extra", category: "meble", description: "Wygodne sofy i pufy do relaksu" },

  // Dekoracje
  { id: "dekoracje", label: "Pakiet dekoracji", price: 300, icon: Sparkles, type: "extra", category: "dekoracje", description: "Kompleksowa aranżacja namiotu" },
  { id: "kwiaty", label: "Dekoracje kwiatowe", price: 250, icon: Sparkles, type: "extra", category: "dekoracje", description: "Świeże kompozycje kwiatowe" },
  { id: "obrusy", label: "Obrusy i pokrowce", price: 150, icon: Sparkles, type: "extra", category: "dekoracje", description: "Obrusy na stoły i pokrowce na krzesła" },
  { id: "scianka-balonowa", label: "Ścianka balonowa", price: 200, icon: PartyPopper, type: "extra", category: "dekoracje", description: "Efektowna ścianka do zdjęć" },
  { id: "swiece", label: "Świece i lampiony stołowe", price: 100, icon: Sparkles, type: "extra", category: "dekoracje", description: "Nastrojowe świece na każdym stole" },
  { id: "napis-led", label: 'Napis LED "LOVE"', price: 180, icon: Sparkles, type: "extra", category: "dekoracje", description: "Podświetlany napis dekoracyjny" },

  // Nagłośnienie i multimedia
  { id: "muzyka-dj", label: "DJ na imprezę", price: 800, icon: Music, type: "service", category: "naglosnienie", description: "Profesjonalny DJ z własnym sprzętem" },
  { id: "naglosnienie", label: "Nagłośnienie estradowe", price: 400, icon: Music, type: "extra", category: "naglosnienie", description: "Zestaw nagłośnieniowy z mikrofonami" },
  { id: "projektor", label: "Projektor i ekran", price: 300, icon: Camera, type: "extra", category: "naglosnienie", description: "Ekran do pokazu zdjęć i filmów" },

  // Ogrzewanie i komfort
  { id: "nagrzewnice", label: "Nagrzewnice", price: 250, icon: Flame, type: "extra", category: "ogrzewanie", description: "Gazowe nagrzewnice tarasowe" },
  { id: "klimatyzacja", label: "Wentylatory / klimatyzacja", price: 350, icon: Flame, type: "extra", category: "ogrzewanie", description: "Chłodzenie namiotu w upalne dni" },

  // Atrakcje i rozrywka
  { id: "fotobudka", label: "Fotobudka 360", price: 800, icon: Camera, type: "extra", category: "atrakcje", description: "Fotobudka 360° z obsługą" },
  { id: "rollbar", label: "Rollbar mobilny", price: 600, icon: Martini, type: "extra", category: "atrakcje", description: "Mobilny bar z barmanem" },
  { id: "popcorn", label: "Maszyna do popcornu", price: 250, icon: PartyPopper, type: "extra", category: "atrakcje", description: "Świeży popcorn przez całą imprezę" },
  { id: "fontanna-czekolady", label: "Fontanna czekoladowa", price: 300, icon: Martini, type: "extra", category: "atrakcje", description: "Fontanna z owocami do maczania" },
]

export const months = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
]
export const weekDays = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"]
export const bookedDates = [5, 12, 13, 20, 21, 27]

export const steps = [
  { id: 0, label: "Namiot", icon: Tent },
  { id: 1, label: "Dodatki", icon: Sparkles },
  { id: 2, label: "Termin", icon: CalendarDays },
  { id: 3, label: "Dane", icon: User },
]
