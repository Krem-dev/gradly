import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import CircularFeatures from '@/components/CircularFeatures'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <HowItWorks />
      <CircularFeatures />
      <Testimonials />
      <Footer />
    </main>
  )
}
