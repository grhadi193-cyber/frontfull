import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product, imageUrl }) {
  const { addItem } = useCart()

  const price     = product?.price ?? 0
  const hasDisc   = product?.is_on_sale && product?.sale_price
  const effPrice  = hasDisc ? product.sale_price : price
  const inStock   = product?.stock_quantity === undefined || product?.stock_quantity > 0

  const discPct = hasDisc
    ? Math.round((1 - product.sale_price / price) * 100)
    : 0

  function toFa(n) {
    return Number(n).toLocaleString('fa-IR')
  }

  function handleAddToCart(e) {
    e.preventDefault()
    addItem({
      product_id: product.id,
      name: product.name,
      price: effPrice,
      imageUrl: imageUrl || null,
      quantity: 1,
    })
  }

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
      {/* تصویر */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-square bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <svg viewBox="0 0 80 80" className="w-24 h-24 opacity-25" fill="none">
              <circle cx="40" cy="40" r="18" fill="#4F46E5" />
              <circle cx="40" cy="40" r="7" fill="white" />
              <circle cx="40" cy="40" r="3" fill="#F97316" />
              <path d="M40 10 L40 24 M40 56 L40 70 M10 40 L24 40 M56 40 L70 40"
                stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {!inStock && (
            <span className="px-2.5 py-1 bg-gray-600 text-white text-xs font-bold rounded-lg">ناموجود</span>
          )}
          {hasDisc && inStock && discPct > 0 && (
            <span className="px-2.5 py-1 bg-accent text-white text-xs font-bold rounded-lg">
              {String(discPct).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])}٪ تخفیف
            </span>
          )}
        </div>
      </Link>

      {/* محتوا */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 hover:text-primary transition-colors text-sm sm:text-base leading-snug">
            {product.name}
          </h3>
        </Link>
        {product.category_name && (
          <span className="text-xs text-gray-400 mb-3">{product.category_name}</span>
        )}

        <div className="mt-auto">
          {/* قیمت */}
          <div className="mb-3">
            {hasDisc ? (
              <>
                <div className="text-xs text-gray-400 line-through">{toFa(price)} تومان</div>
                <div className="text-lg font-black text-primary">{toFa(effPrice)} تومان</div>
              </>
            ) : (
              <div className="text-lg font-black text-primary">{toFa(effPrice)} تومان</div>
            )}
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="flex-1 text-center py-2 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              مشاهده محصول
            </Link>
            {inStock && (
              <button
                onClick={handleAddToCart}
                className="w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center flex-shrink-0"
                aria-label="افزودن به سبد"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
