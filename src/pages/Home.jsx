import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider.jsx'
import PartnersMarquee from '../components/PartnersMarquee.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import StatsCounter from '../components/StatsCounter.jsx'
import ToastContainer, { useToast } from '../components/Toast.jsx'
import { getSettings, getProducts } from '../api/django.js'
import { getSiteConfig, getProductImages, pbImageUrl } from '../api/pocketbase.js'

// ── About Section ────────────────────────────────────────────
function AboutSection({ aboutText }) {
  const stats = [
    { icon: '⚡', label: 'نصب آسان', desc: 'راه‌اندازی در کمتر از یک ساعت' },
    { icon: '🛡️', label: 'پشتیبانی ۲۴/۷', desc: 'همیشه در دسترس شما' },
    { icon: '🎯', label: 'دقت بالا', desc: 'موقعیت‌یابی با دقت ۲ متر' },
    { icon: '🗺️', label: 'سراسر کشور', desc: 'پوشش کامل ایران' },
  ]
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text — right */}
          <div>
            <SectionTitle title="درباره ما" subtitle="پیشرو در فناوری ردیابی GPS ایران" center={false} />
            <p className="text-gray-600 leading-9 mb-8 text-base">
              {aboutText ||
                'شرکت ATI Farzam Iranian با بیش از ۱۵ سال تجربه در طراحی و تولید سیستم‌های ردیابی GPS، یکی از پیشروان این صنعت در ایران است. ما با تکیه بر دانش فنی بومی و استفاده از فناوری‌های روز دنیا، راهکارهای جامع مدیریت ناوگان را برای کسب‌وکارهای کوچک تا بزرگ ارائه می‌دهیم.'}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{s.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
            >
              بیشتر درباره ما
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {/* Illustration — left */}
          <div className="relative flex items-center justify-center">
            <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border border-primary"
                    style={{
                      width: `${(i + 1) * 20}%`,
                      height: `${(i + 1) * 20}%`,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </div>
              <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56" fill="none">
                <circle cx="100" cy="100" r="45" fill="#4F46E5" opacity="0.85" />
                <circle cx="100" cy="100" r="18" fill="white" />
                <circle cx="100" cy="100" r="7" fill="#F97316" />
                <path d="M100 30 L100 60 M100 140 L100 170 M30 100 L60 100 M140 100 L170 100"
                  stroke="#4F46E5" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
                <circle cx="100" cy="100" r="70" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.25" />
              </svg>
              {/* Floating cards */}
              <div className="absolute top-4 left-4 bg-white rounded-xl p-3 shadow-lg">
                <div className="text-xs text-gray-500">موقعیت</div>
                <div className="font-bold text-primary text-sm">آنلاین ✓</div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white rounded-xl p-3 shadow-lg">
                <div className="text-xs text-gray-500">دقت</div>
                <div className="font-bold text-green-600 text-sm">۲ متر</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Products Section ─────────────────────────────────────────
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-100" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-10 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProductsSection() {
  const [products, setProducts] = useState([])
  const [imageMap, setImageMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts({ page_size: 6 })
        const items = data?.results || data?.items || (Array.isArray(data) ? data : [])
        setProducts(items)
        // Fetch PocketBase images for each product
        const imgMap = {}
        await Promise.all(
          items.map(async (p) => {
            try {
              const pbImages = await getProductImages(p.id)
              if (pbImages && pbImages.length > 0) {
                imgMap[p.id] = pbImageUrl(pbImages[0], pbImages[0].image)
              } else if (p.image) {
                imgMap[p.id] = p.image
              }
            } catch (_) {
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
    }
    load()
  }, [])

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="محصولات سخت‌افزاری" subtitle="ردیاب‌های GPS با کیفیت برتر برای هر نیاز" />
        {loading && <ProductsSkeleton />}
        {error && !loading && (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl">
            <p className="font-medium">خطا در بارگذاری محصولات</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl">
            محصولی یافت نشد
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} imageUrl={imageMap[p.id]} />
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors"
              >
                مشاهده همه محصولات
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

// ── Software Section ─────────────────────────────────────────
function SoftwareSection({ config }) {
  const features = [
    { icon: '📊', title: 'گزارش‌گیری پیشرفته', desc: 'گزارش کامل مسافت، سرعت و وضعیت دستگاه' },
    { icon: '👥', title: 'چند کاربره', desc: 'مدیریت تیم با سطوح دسترسی متفاوت' },
    { icon: '🗺️', title: 'تاریخچه مسیر', desc: 'بررسی مسیر طی‌شده تا ۱۸۰ روز گذشته' },
    { icon: '🔔', title: 'هشدار لحظه‌ای', desc: 'اعلان فوری برای رویدادهای مهم' },
  ]
  const softwareLink = config?.software_url || '/software'
  const panelLink = config?.panel_url || '#'

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Features — right (RTL) */}
          <div>
            <SectionTitle
              title="نرم‌افزار مدیریت و ردیابی"
              subtitle="کنترل همه چیز در یک پلتفرم هوشمند"
              center={false}
            />
            <div className="space-y-4 mb-8">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary/5 transition-colors">
                  <span className="text-2xl mt-0.5">{f.icon}</span>
                  <div>
                    <div className="font-bold text-gray-800">{f.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/software"
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
              >
                بیشتر بدانید
              </Link>
              <a
                href={panelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                ورود به سامانه ↗
              </a>
            </div>
          </div>

          {/* Mockup — left */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Laptop mockup */}
              <div className="bg-gray-800 rounded-2xl p-3 shadow-2xl">
                <div className="bg-gray-900 rounded-t-xl h-4 flex items-center justify-center mb-2">
                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                </div>
                <div className="bg-gradient-to-br from-primary/90 to-primary-dark rounded-xl aspect-video flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 grid-rows-5 h-full w-full gap-px">
                      {[...Array(40)].map((_, i) => (
                        <div key={i} className="bg-white rounded-sm" />
                      ))}
                    </div>
                  </div>
                  <svg viewBox="0 0 100 60" className="w-20 h-12 mb-3" fill="none">
                    <path d="M10 50 Q25 20 40 35 Q55 50 70 25 Q85 0 90 15"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <circle cx="40" cy="35" r="3" fill="#F97316" />
                    <circle cx="70" cy="25" r="3" fill="#F97316" />
                  </svg>
                  <div className="text-white text-xs font-bold opacity-80">پنل مدیریت ناوگان</div>
                  <div className="flex gap-3 mt-3">
                    {['آنلاین: ۲۴', 'توقف: ۳', 'آفلاین: ۱'].map((t) => (
                      <div key={t} className="bg-white/10 rounded-lg px-2 py-1 text-white text-[10px]">{t}</div>
                    ))}
                  </div>
                </div>
                <div className="h-3 bg-gray-900 rounded-b-xl mt-2" />
              </div>
              <div className="h-3 bg-gray-700 rounded-b-xl mx-6 shadow-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Mobile App Section ───────────────────────────────────────
function MobileAppSection({ config }) {
  const googlePlayUrl = config?.google_play_url || '#'
  const appStoreUrl = config?.app_store_url || '#'

  const features = [
    'ردیابی زنده روی نقشه',
    'هشدارهای فوری پوش',
    'گزارش‌گیری آسان',
    'رابط کاربری ساده و سریع',
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text — right */}
          <div>
            <SectionTitle title="اپلیکیشن موبایل" subtitle="همراه شما در هر لحظه و مکان" center={false} />
            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <a
                href={googlePlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M3.18 23.85C2.5 23.48 2 22.71 2 21.86V2.14C2 1.29 2.5.52 3.18.15L13.83 12 3.18 23.85zM16.5 8.5l-2.28-1.32L6.66 12l7.56 4.82 2.28-1.32L19.48 12 16.5 8.5zM4.34 1.1L14.5 7.5 12.22 9.78 4.34 1.1zM4.34 22.9l7.88-8.68L14.5 16.5 4.34 22.9z"/>
                </svg>
                <div>
                  <div className="text-[10px] text-gray-400">دریافت از</div>
                  <div className="font-bold text-sm">Google Play</div>
                </div>
              </a>
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div className="text-[10px] text-gray-400">دریافت از</div>
                  <div className="font-bold text-sm">App Store</div>
                </div>
              </a>
            </div>
          </div>

          {/* Phone mockup — left */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-52 bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                <div className="w-24 h-5 bg-gray-800 rounded-full mx-auto mb-2" />
                <div className="bg-gradient-to-b from-primary to-primary-dark rounded-[2rem] h-96 flex flex-col items-center justify-center p-5 overflow-hidden relative">
                  <div className="absolute top-4 w-full px-4 flex justify-between text-white text-[10px] opacity-60">
                    <span>۱۲:۳۰</span><span>●●●</span>
                  </div>
                  <svg viewBox="0 0 80 80" className="w-20 h-20 mb-4" fill="none">
                    <circle cx="40" cy="40" r="35" stroke="white" strokeWidth="1" opacity="0.2" />
                    <circle cx="40" cy="40" r="25" stroke="white" strokeWidth="1" opacity="0.3" />
                    <circle cx="40" cy="40" r="12" fill="white" opacity="0.9" />
                    <circle cx="40" cy="40" r="5" fill="#F97316" />
                    <path d="M40 10 L40 22 M40 58 L40 70 M10 40 L22 40 M58 40 L70 40"
                      stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                  </svg>
                  <div className="text-white text-xs font-bold mb-1">ردیابی زنده</div>
                  <div className="text-white/60 text-[10px]">تهران، خیابان ولیعصر</div>
                  <div className="mt-4 w-full bg-white/10 rounded-xl p-2 text-center">
                    <div className="text-white text-[10px]">سرعت: ۴۵ کیلومتر/ساعت</div>
                  </div>
                </div>
                <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mt-2" />
              </div>
              {/* Decoration */}
              <div className="absolute -right-8 top-12 w-16 h-16 rounded-full bg-primary/10 blur-xl" />
              <div className="absolute -left-6 bottom-12 w-12 h-12 rounded-full bg-accent/10 blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Newsletter Section ───────────────────────────────────────
function NewsletterSection({ showToast }) {
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit() {
    if (!phone || phone.length < 10) {
      showToast('لطفاً شماره موبایل معتبر وارد کنید', 'error')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      showToast('عضویت شما با موفقیت ثبت شد! 🎉', 'success')
      setPhone('')
      setSubmitting(false)
    }, 800)
  }

  return (
    <section className="py-20 bg-accent">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-black text-white mb-3">عضویت در خبرنامه</h2>
        <p className="text-white/80 mb-8">اولین نفری باشید که از جدیدترین محصولات و تخفیف‌ها باخبر می‌شود</p>
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            dir="ltr"
            className="flex-1 px-5 py-3 rounded-xl text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-3 bg-white text-accent font-bold rounded-xl hover:bg-orange-50 transition-colors disabled:opacity-70 flex-shrink-0"
          >
            {submitting ? '...' : 'عضویت'}
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Main Home Component ──────────────────────────────────────
export default function Home() {
  const [aboutText, setAboutText] = useState(null)
  const [siteConfig, setSiteConfig] = useState(null)
  const { toasts, showToast } = useToast()

  // Fetch stats config from PocketBase
  const statsData = siteConfig
    ? [
        { value: siteConfig.active_users || 5000, label: 'کاربر فعال', prefix: '+' },
        { value: siteConfig.uptime || 99, label: 'آپتایم سرویس', suffix: '%' },
        { value: siteConfig.happy_customers || 5000, label: 'مشتری راضی', prefix: '+' },
        { value: siteConfig.years_active || 15, label: 'سال فعالیت', prefix: '+' },
      ]
    : null

  useEffect(() => {
    // Django settings
    getSettings()
      .then((data) => setAboutText(data?.about_us || null))
      .catch(() => {})

    // PocketBase site config
    getSiteConfig()
      .then((cfg) => setSiteConfig(cfg))
      .catch(() => {})
  }, [])

  return (
    <div className="w-full overflow-x-hidden">
      <ToastContainer toasts={toasts} />

      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Partners Marquee */}
      <PartnersMarquee />

      {/* 3. About */}
      <AboutSection aboutText={aboutText} />

      {/* 4. Products */}
      <ProductsSection />

      {/* 5. Software */}
      <SoftwareSection config={siteConfig} />

      {/* 6. Stats Counter */}
      <StatsCounter stats={statsData} />

      {/* 7. Mobile App */}
      <MobileAppSection config={siteConfig} />

      {/* 8. Newsletter */}
      <NewsletterSection showToast={showToast} />
    </div>
  )
}
