import Link from 'next/link'

export default function Hero() {
  return (
    <section 
      className="bg-gray-900 py-12 md:py-24 w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop)',
        backgroundBlendMode: 'overlay'
      } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-8 md:gap-16">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Your Path to Academic Success
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-6 md:mb-10 leading-relaxed">
              Calculate WASSCE aggregates, convert university grades, and discover your ideal programs at universities in Ghana and globally.
            </p>
            <div className="flex gap-3 md:gap-4">
              <Link 
                href="/start"
                className="bg-primary text-white px-5 md:px-7 py-2 md:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg text-xs md:text-sm"
              >
                Get Started Free
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:flex items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-primary rounded-full opacity-10"></div>
              <div className="absolute inset-4 border-2 border-primary rounded-full opacity-20"></div>
              <div className="absolute inset-8 border border-primary rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
