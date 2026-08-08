import Image from "next/image"

export function AmbianceSection() {
  return (
    <section className="bg-background overflow-hidden">
      <div className="px-0 py-0 sm:container sm:mx-auto sm:px-6 lg:px-8 sm:py-10 md:py-20">
        <div className="relative overflow-hidden rounded-none sm:rounded-3xl">
          {/* Background image */}
          <Image
            src="/images/ambiance-evening.png"
            alt="Namiot weselny wieczorem rozświetlony ciepłymi lampkami"
            width={1600}
            height={1000}
            className="h-[440px] w-full object-cover sm:h-[560px] md:h-[680px] lg:h-[760px]"
            sizes="(max-width: 768px) 100vw, 1400px"
          />

          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/15" />

          {/* Text content */}
          <div className="absolute inset-0 flex flex-col justify-start p-7 sm:p-12 md:p-16 lg:p-20">
            <div className="max-w-2xl">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary sm:mb-3 sm:text-xs md:mb-5 md:text-sm">
                Atmosfera
              </p>
              <h2 className="text-xl font-semibold leading-[1.15] tracking-tight text-white text-balance sm:text-4xl sm:leading-[1.1] md:text-5xl lg:text-6xl">
                To będzie dobra impreza. O resztę zadbamy my.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:mt-5 sm:text-base md:mt-7 md:text-lg">
                Namiot, oświetlenie, dodatki i cały klimat. Przywozimy wszystko na miejsce, montujemy i zostawiamy gotowe. Ty po prostu czekasz na gości.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
