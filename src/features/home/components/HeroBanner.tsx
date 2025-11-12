import { useState, useEffect } from 'react'
import {
  CLASS_DOT_INDICATOR,
  CLASS_SVG_ICON_MD,
  CLASS_SVG_FILL,
  CLASS_SVG_VIEWBOX,
  AUTO_SLIDE_INTERVAL_MS,
} from '@/constants/common'
import { IMAGES } from '@/constants/images'

interface Slide {
  id: number
  image: string
}

const slides: Slide[] = [
  {
    id: 1,
    image: IMAGES.HERO_BANNER,
  },
  {
    id: 2,
    image: IMAGES.HERO_BANNER,
  },
  {
    id: 3,
    image: IMAGES.HERO_BANNER,
  },
]

export const RenderHeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, AUTO_SLIDE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  const handleGoToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleGoToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleGoToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="relative h-96 overflow-hidden">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          />
        ))}
      </div>

      <button
        onClick={handleGoToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
        aria-label="Previous slide"
      >
        <svg
          className={CLASS_SVG_ICON_MD}
          fill="none"
          stroke={CLASS_SVG_FILL}
          viewBox={CLASS_SVG_VIEWBOX}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleGoToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
        aria-label="Next slide"
      >
        <svg
          className={CLASS_SVG_ICON_MD}
          fill="none"
          stroke={CLASS_SVG_FILL}
          viewBox={CLASS_SVG_VIEWBOX}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleGoToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-3 h-3 bg-white'
                : `${CLASS_DOT_INDICATOR} cursor-pointer`
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

