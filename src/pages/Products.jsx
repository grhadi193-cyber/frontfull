import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { ProductSkeletonGrid } from '../components/ProductSkeleton.jsx'
import Pagination from '../components/Pagination.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import { getProducts, getCategories } from '../api/django.js'
import { getProductImages, pbImageUrl } from '../api/pocketbase.js'

const PAGE_SIZE = 12

// ── Category filter pills ─────────────────────────────────────
function CategoryPills({ categories, active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !active
            ? 'bg-primary text-white shadow-md shadow-primary/25'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        همه
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === cat.id
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

// ── Search input ──────────────────────────────────────────────
function SearchInput({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="جستجوی محصول..."
        className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-white"
      />
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ hasFilter }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="font-bold text-gray-600 mb-1">
        {hasFilter ? 'محصولی با این فیلتر یافت نشد' : 'محصولی موجود نیست'}
      </p>
      <p className="text-sm text-gray-400">
        {hasFilter ? 'فیلترهای دیگری امتحان کنید' : 'لطفاً بعداً مراجعه کنید'}
      </p>
    </div>
  )
}

// ── Main Products Page ────────────────────────────────────────
export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  // حالت‌ها
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [imageMap, setImageMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // فیلترها از URL
  const page       = parseInt(searchParams.get('page') || '1', 10)
  const categoryId = searchParams.get('category') || null
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')

  // debounce جستجو
  const debounceRef = useRef(null)
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(searchInput), 500)
    return () => clearTimeout(debounceRef.current)
  }, [searchInput])

  // sync search به URL
  useEffect(() => {
    const params = {}
    if (page > 1) params.page = page
    if (categoryId) params.category = categoryId
    if (search) params.search = search
    setSearchParams(params, { replace: true })
  }, [page, categoryId, search]) // eslint-disable-line

  // بارگذاری دسته‌بندی‌ها (یک بار)
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : data?.results || []))
      .catch(() => {})
  }, [])

  // بارگذاری محصولات
  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, page_size: PAGE_SIZE }
      if (categoryId) params.category_id = categoryId
      if (search) params.search = search

      const data = await getProducts(params)
      const items = data?.results || (Array.isArray(data) ? data : [])
      const count = data?.count || items.length
      setProducts(items)
      setTotalCount(count)
      setTotalPages(Math.ceil(count / PAGE_SIZE) || 1)

      // تصاویر PocketBase
      const imgMap = {}
      await Promise.all(
        items.map(async (p) => {
          try {
            const pbImages = await getProductImages(p.id)
            if (pbImages?.length > 0) {
              imgMap[p.id] = pbImageUrl(pbImages[0], pbImages[0].image)
            } else if (p.image) {
              imgMap[p.id] = p.image
            }
          } catch {
            if (p.image) imgMap[p.id] = p.image
          }
        })
      )
      setImageMap(imgMap)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, categoryId, search])

  useEffect(() => {
    loadProducts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [loadProducts])

  function handleCategoryChange(id) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (id) next.set('category', id); else next.delete('category')
      next.delete('page')
      return next
    })
  }

  function handlePageChange(p) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (p > 1) next.set('page', p); else next.delete('page')
      return next
    })
  }

  const hasFilter = !!(categoryId || search)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[
            { label: 'خانه', to: '/' },
            { label: 'محصولات' },
          ]} />
          <div className="flex items-end justify-between mt-3 flex-wrap gap-2">
            <div>
              <h1 className="text-2xl font-black text-gray-900">محصولات سخت‌افزاری</h1>
              {!loading && (
                <p className="text-sm text-gray-400 mt-1">
                  {String(totalCount).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])} محصول
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 min-w-0">
            <CategoryPills
              categories={categories}
              active={categoryId}
              onSelect={handleCategoryChange}
            />
          </div>
          <div className="w-full sm:w-64 flex-shrink-0">
            <SearchInput value={searchInput} onChange={setSearchInput} />
          </div>
        </div>

        {/* ── Error ── */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center mb-8">
            <p className="text-red-600 font-medium">خطا در بارگذاری محصولات</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
            <button
              onClick={loadProducts}
              className="mt-4 px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <ProductSkeletonGrid count={PAGE_SIZE} />
        ) : !error && (
          <>
            {products.length === 0 ? (
              <EmptyState hasFilter={hasFilter} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} imageUrl={imageMap[p.id]} />
                ))}
              </div>
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}
