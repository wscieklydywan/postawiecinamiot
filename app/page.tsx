import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { BookingFlow } from "@/components/booking-flow"
import { AmbianceSection } from "@/components/ambiance-section"
import { WhyUsSection } from "@/components/why-us-section"
import { FaqSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ReservationScrollRestore } from "@/components/reservation-scroll-restore"

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <ReservationScrollRestore />
      <Navigation />
      <HeroSection />
      <WhyUsSection />
      <BookingFlow />
      <AmbianceSection />
      <FaqSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
