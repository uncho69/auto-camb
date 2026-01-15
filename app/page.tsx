import Hero from '@/components/Hero'
import AdvancedSearch from '@/components/AdvancedSearch'
import FeaturedCars from '@/components/FeaturedCars'
import Services from '@/components/Services'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <div>
      <Hero />
      <AdvancedSearch />
      <FeaturedCars />
      <Services />
      <CTA />
    </div>
  )
}

