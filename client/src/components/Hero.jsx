import headerImage from "../assets/header_image.jpg"
import authorAvatar from "../assets/profile_aoey.jpg"

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 items-center gap-10 py-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:py-12">
      <div className="text-left lg:pr-4">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          For the love
          <br />
          of cats
        </h1>
        <p className="mt-6 max-w-xs text-sm leading-relaxed text-gray-500">
          Care tips, feline quirks, and everyday stories to help you understand
          — and spoil — the cats in your life.
        </p>
      </div>
      <div className="flex justify-center">
        <img
          src={headerImage}
          alt="Hero image"
          className="h-[420px] w-[280px] rounded-3xl object-cover shadow-sm sm:h-[480px] sm:w-[320px]"
        />
      </div>

      <div className="text-left lg:pl-4">
        <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
          -Founder
        </p>
        <h2 className="mt-2 text-xl font-bold text-gray-900">Pitnaree K.</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-500">
          <p>
            I write about cats — from everyday care and nutrition to the little
            quirks that make living with them so special.
          </p>
          <p>
            Refio is where I share practical tips and warm stories for fellow
            cat lovers who want to understand their feline friends better.
          </p>
        </div>
        <img
          src={authorAvatar}
          alt="Pitnaree K."
          className="mt-6 hidden h-10 w-10 rounded-full object-cover lg:block"
        />
      </div>
    </section>
  )
}
