import React, { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start || !target) return
    const numeric = parseInt(String(target).replace(/[^0-9]/g, ''), 10)
    if (isNaN(numeric)) return
    let startTime = null
    function step(ts) {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * numeric))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])

  return count
}

function StatItem({ value, label, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const count = useCountUp(value, 2200, started)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  function toFarsiDigits(n) {
    return String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
  }

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-black text-white mb-2">
        {prefix}{toFarsiDigits(count)}{suffix}
      </div>
      <div className="text-white/70 text-sm font-medium">{label}</div>
    </div>
  )
}

export default function StatsCounter({ stats }) {
  const defaultStats = [
    { value: 5000, label: 'کاربر فعال', prefix: '+' },
    { value: 99,   label: 'آپتایم سرویس', suffix: '%' },
    { value: 5000, label: 'مشتری راضی', prefix: '+' },
    { value: 15,   label: 'سال فعالیت', prefix: '+' },
  ]

  const items = stats || defaultStats

  return (
    <section className="py-20 bg-gradient-to-br from-primary-dark via-primary to-primary-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {items.map((stat, i) => (
            <StatItem key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
