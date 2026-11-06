import { Route, Routes } from 'react-router'
import Layout from '@/components/layout/Layout'
import { lazyPage } from '@/utils/lazyPage'

// Setiap halaman jadi file JavaScript sendiri, jadi pengunjung hanya mengunduh halaman yang dibuka.
const HomePage = lazyPage(() => import('@/pages/Home/HomePage'))
const AboutPage = lazyPage(() => import('@/pages/About/AboutPage'))
const ServicesPage = lazyPage(() => import('@/pages/Services/ServicesPage'))
const ProjectsPage = lazyPage(() => import('@/pages/Projects/ProjectsPage'))
const ProjectDetailPage = lazyPage(() => import('@/pages/Projects/ProjectDetailPage'))
const BlogPage = lazyPage(() => import('@/pages/Blog/BlogPage'))
const BlogDetailPage = lazyPage(() => import('@/pages/Blog/BlogDetailPage'))
const ContactPage = lazyPage(() => import('@/pages/Contact/ContactPage'))
const PrivacyPolicyPage = lazyPage(() => import('@/pages/Legal/PrivacyPolicyPage'))
const ChangelogPage = lazyPage(() => import('@/pages/Changelog/ChangelogPage'))
const CardPage = lazyPage(() => import('@/pages/Card/CardPage'))
const CmdbPage = lazyPage(() => import('@/pages/Cmdb/CmdbPage'))
const NotFoundPage = lazyPage(() => import('@/pages/NotFound/NotFoundPage'))

const ALL_PAGES = [
  HomePage,
  AboutPage,
  ServicesPage,
  ProjectsPage,
  ProjectDetailPage,
  BlogPage,
  BlogDetailPage,
  ContactPage,
  PrivacyPolicyPage,
  ChangelogPage,
  CardPage,
  CmdbPage,
  NotFoundPage,
]

/** Halaman untuk sebuah alamat (dipakai untuk memuat halaman lebih dulu). */
export function pageFor(pathname = '/') {
  const path = String(pathname).split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  if (path === '/') return HomePage
  if (path === '/about') return AboutPage
  if (path === '/layanan') return ServicesPage
  if (path === '/projects') return ProjectsPage
  if (/^\/projects\/[^/]+$/.test(path)) return ProjectDetailPage
  if (path === '/blog') return BlogPage
  if (/^\/blog\/[^/]+$/.test(path)) return BlogDetailPage
  if (path === '/contact') return ContactPage
  if (path === '/privacy-policy') return PrivacyPolicyPage
  if (path === '/changelog') return ChangelogPage
  if (path === '/kartu') return CardPage
  if (path === '/cmdb') return CmdbPage
  return NotFoundPage
}

/** Muat halaman untuk alamat tertentu (aman dipanggil berkali-kali). */
export const preloadRoute = (pathname) => pageFor(pathname).preload()

/** Muat semua halaman: dipakai saat prerender, dan di browser saat sedang senggang. */
export const preloadAll = () => Promise.all(ALL_PAGES.map((p) => p.preload()))

/** Sitemap PRD §5 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="layanan" element={<ServicesPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="changelog" element={<ChangelogPage />} />
        <Route path="kartu" element={<CardPage />} />
        <Route path="cmdb" element={<CmdbPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
