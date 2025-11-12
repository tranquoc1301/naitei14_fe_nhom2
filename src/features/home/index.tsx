import { RenderHeroBanner } from './components/HeroBanner'
import { FeaturedProducts } from './components/FeaturedProducts'

export const RenderHome = () => {
  return (
    <div>
      <RenderHeroBanner />
      <FeaturedProducts />
    </div>
  )
}

