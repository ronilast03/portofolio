import { Route, Routes } from 'react-router'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/Home/HomePage'
import AboutPage from '@/pages/About/AboutPage'
import ProjectsPage from '@/pages/Projects/ProjectsPage'
import ProjectDetailPage from '@/pages/Projects/ProjectDetailPage'
import BlogPage from '@/pages/Blog/BlogPage'
import BlogDetailPage from '@/pages/Blog/BlogDetailPage'
import ContactPage from '@/pages/Contact/ContactPage'
import PrivacyPolicyPage from '@/pages/Legal/PrivacyPolicyPage'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

/** Sitemap PRD §5 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
