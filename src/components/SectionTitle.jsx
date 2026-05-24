import React from 'react'

export default function SectionTitle({ title, subtitle, center = true, light = false }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : 'text-right'}`}>
      <h2
        className={`text-3xl sm:text-4xl font-black mb-3 ${
          light ? 'text-white' : 'text-gray-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg ${light ? 'text-white/70' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 mx-auto w-16 h-1 rounded-full ${
          light ? 'bg-white/40' : 'bg-primary'
        } ${center ? '' : 'mr-0 ml-auto'}`}
      />
    </div>
  )
}
