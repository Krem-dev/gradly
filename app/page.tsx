import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import LogoMarquee from '@/components/LogoMarquee'
import ServiceCards from '@/components/ServiceCards'
import Mission from '@/components/Mission'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <Navigation />
      <Hero />
      <LogoMarquee />
      <ServiceCards />
      <Mission />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}
