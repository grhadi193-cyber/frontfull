import React, { useEffect, useState } from 'react'
import { getPartners, pbImageUrl } from '../api/pocketbase.js'

const FALLBACK_PARTNERS = [
  { id: '1', name: 'شرکت الف' },
  { id: '2', name: 'شرکت ب' },
  { id: '3', name: 'شرکت ج' },
  { id: '4', name: 'شرکت د' },
  { id: '5', name: 'شرکت ه' },
  { id: '6', name: 'شرکت و' },
]

function PartnerLogo({ partner }) {
  const logoUrl = partner.logo ? pbImageUrl(partner, partner.logo) : null
  return (
    <div className="flex-shrink-0 mx-8 flex items-center justify-center h-16 opacity-60 hover:opacity-100 transition-opacity">
      {logoUrl ? (
        <img src={logoUrl} alt={partner.name} className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
      ) : (
        <div className="px-6 py-2 rounded-lg border border-gray-200 bg-white shadow-sm text-gray-600 font-semibold text-sm whitespace-nowrap">
          {partner.name}
        </div>
      )}
    </div>
  )
}

export default function PartnersMarquee() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPartners().then((data) => {
      setPartners(data.length > 0 ? data : FALLBACK_PARTNERS)
      setLoading(false)
    })
  }, [])

  if (loading) return null

  // Duplicate for seamless loop
  const doubled = [...partners, ...partners]

  return (
    <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <p className="text-sm font-medium text-gray-400 tracking-widest uppercase">
          مورد اعتماد کسب‌وکارهای برتر
        </p>
      </div>
      <div className="relative">
        <div className="flex marquee-track">
          {doubled.map((partner, idx) => (
            <PartnerLogo key={`${partner.id}-${idx}`} partner={partner} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 28s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
