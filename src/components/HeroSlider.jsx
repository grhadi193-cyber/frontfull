import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getBanners, pbImageUrl } from '../api/pocketbase.js'

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    title: 'ردیاب GPS حرفه‌ای ATI Farzam',
    subtitle: 'پیشرفته‌ترین دستگاه‌های ردیاب GPS برای خودرو، ناوگان و تجهیزات صنعتی. امنیت، دقت و قابلیت اطمینان در یک محصول.',
    cta_text: 'مشاهده محصولات',
    cta_link: '/products',
    image: null,
  },
]

function SlideContent({ slide, active }) {
  const imgUrl = slide.image
    ? pbImageUrl(slide, slide.image)
    : null

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ${
        active ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-l from-white via-blue-50/60 to-primary/10" />

      {/* Background image if exists */}
      {imgUrl && (
        <img
          src={imgUrl}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
          {/* Text — right side (RTL) */}
          <div className={`transition-all duration-700 delay-100 ${active ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              سیستم ردیابی هوشمند
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-5">
              {slide.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-8 mb-8 max-w-lg">
              {slide.subtitle}
            </p>
            {slide.cta_text && (
              <div className="flex flex-wrap gap-4">
                <Link
                  to={slide.cta_link || '/products'}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5"
                >
                  {slide.cta_text}
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition-colors"
                >
                  تماس با ما
                </Link>
              </div>
            )}
          </div>

          {/* Illustration — left side */}
          <div className={`hidden lg:flex items-center justify-center transition-all duration-700 delay-200 ${active ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
            <div className="relative">
              {/* Decorative circles */}
              <div className="w-80 h-80 rounded-full bg-primary/8 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-primary/15 flex items-center justify-center shadow-2xl shadow-primary/20">
                    {imgUrl ? (
                      <img src={imgUrl} alt={slide.title} className="w-36 h-36 object-contain" />
                    ) : (
                      <svg viewBox="0 0 120 120" className="w-36 h-36" fill="none">
                        <circle cx="60" cy="60" r="30" fill="#4F46E5" opacity="0.9" />
                        <circle cx="60" cy="60" r="12" fill="white" />
                        <circle cx="60" cy="60" r="5" fill="#F97316" />
                        <path d="M60 15 L60 35 M60 85 L60 105 M15 60 L35 60 M85 60 L105 60"
                          stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
                        <circle cx="60" cy="60" r="45" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.3" />
                        <circle cx="60" cy="60" r="55" stroke="#4F46E5" strokeWidth="1" strokeDasharray="3 6" opacity="0.15" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">آنلاین</div>
                  <div className="text-[10px] text-gray-400">۲۴/۷</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3">
                <div className="text-xs font-bold text-primary">+۵۰۰۰</div>
                <div className="text-[10px] text-gray-400">مشتری راضی</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroSlider() {
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBanners().then((data) => {
      setSlides(data.length > 0 ? data : DEFAULT_SLIDES)
      setLoading(false)
    })
  }, [])

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  if (loading) {
    return (
      <div className="h-[560px] sm:h-[600px] bg-gradient-to-l from-white to-primary/5 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <section className="relative h-[560px] sm:h-[600px] overflow-hidden bg-[#F8FAFC]">
      {slides.map((slide, idx) => (
        <SlideContent key={slide.id} slide={slide} active={idx === current} />
      ))}

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={next}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
            aria-label="اسلاید بعدی"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={prev}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
            aria-label="اسلاید قبلی"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? 'w-6 h-2.5 bg-primary'
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`اسلاید ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
