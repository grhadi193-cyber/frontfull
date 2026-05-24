import PocketBase from 'pocketbase'

const PB_URL = import.meta.env.VITE_PB_URL || 'http://localhost:8090'

// singleton instance
const pb = new PocketBase(PB_URL)
pb.autoCancellation(false)

// ── Banners ───────────────────────────────────
export async function getBanners() {
  try {
    return await pb.collection('banners').getFullList({ sort: 'order' })
  } catch (err) {
    console.error('getBanners error:', err)
    return []
  }
}

// ── Partners ──────────────────────────────────
export async function getPartners() {
  try {
    return await pb.collection('partners').getFullList({ sort: 'order' })
  } catch (err) {
    console.error('getPartners error:', err)
    return []
  }
}

// ── Product Images ────────────────────────────
export async function getProductImages(productId) {
  try {
    return await pb.collection('products_ui').getFullList({
      filter: `product_id = "${productId}"`,
    })
  } catch (err) {
    console.error('getProductImages error:', err)
    return []
  }
}

// ── Blogs ─────────────────────────────────────
export async function getBlogs(page = 1, perPage = 10) {
  try {
    return await pb.collection('blogs').getList(page, perPage, {
      sort: '-created',
    })
  } catch (err) {
    console.error('getBlogs error:', err)
    return { items: [], totalItems: 0, totalPages: 0 }
  }
}

export async function getBlog(slug) {
  try {
    const results = await pb.collection('blogs').getFullList({
      filter: `slug = "${slug}"`,
    })
    return results[0] || null
  } catch (err) {
    console.error('getBlog error:', err)
    return null
  }
}

// ── Site Config ───────────────────────────────
export async function getSiteConfig() {
  try {
    const records = await pb.collection('site_config').getFullList({ limit: 1 })
    return records[0] || null
  } catch (err) {
    console.error('getSiteConfig error:', err)
    return null
  }
}

// ── Pages ─────────────────────────────────────
export async function getPages() {
  try {
    return await pb.collection('pages').getFullList()
  } catch (err) {
    console.error('getPages error:', err)
    return []
  }
}

export async function getPage(slug) {
  try {
    const results = await pb.collection('pages').getFullList({
      filter: `slug = "${slug}"`,
    })
    return results[0] || null
  } catch (err) {
    console.error('getPage error:', err)
    return null
  }
}

// helper: ساخت URL تصویر PocketBase
export function pbImageUrl(record, filename) {
  if (!record || !filename) return null
  return pb.files.getUrl(record, filename)
}

export { pb }

const pbApi = {
  getBanners,
  getPartners,
  getProductImages,
  getBlogs,
  getBlog,
  getSiteConfig,
  getPages,
  getPage,
  pbImageUrl,
}

export default pbApi
