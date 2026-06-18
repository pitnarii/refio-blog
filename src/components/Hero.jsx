
export default function Hero() {
  return (
    <section className="grid grid-cols-1 items-center gap-10 py-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:py-12">
      <div className="text-left lg:pr-4">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          Stay Informed,
          <br />
          Stay Inspired
        </h1>
        <p className="mt-6 max-w-xs text-sm leading-relaxed text-gray-500">
          Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
          Inspiration and Information.
        </p>
      </div>

      <div className="flex justify-center">
        <img
          src= "src/assets/header_image.jpg"
          alt="Author with a cat in an autumn forest"
          className="h-[420px] w-[280px] rounded-3xl object-cover shadow-sm sm:h-[480px] sm:w-[320px]"
        />
      </div>

      <div className="text-left lg:pl-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          -Author
        </p>
        <h2 className="mt-2 text-xl font-bold text-gray-900">Pitnaree K.</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-500">
          <p>
            I am a pet enthusiast and freelance writer who specializes in
            animal behavior and care. With a deep love for cats, I enjoy
            sharing insights on feline companionship and wellness.
          </p>
          <p>
            When I&apos;m not writing, I spend time volunteering at my local
            animal shelter, helping cats find loving homes.
          </p>
        </div>
        <img
          src={authorAvatar}
          alt="Thompson P."
          className="mt-6 hidden h-10 w-10 rounded-full object-cover lg:block"
        />
      </div>
    </section>
  )
}
