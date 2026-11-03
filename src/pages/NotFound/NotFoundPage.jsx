import { Link, useLocation } from 'react-router'
import Seo from '@/components/common/Seo'
import PageTransition from '@/components/common/PageTransition'
import { useHydrated } from '@/hooks/useHydrated'

export default function NotFoundPage() {
  const { pathname } = useLocation()
  const hydrated = useHydrated()

  return (
    <PageTransition>
      <Seo title="Halaman tidak ditemukan" path={pathname} noindex />
      <div className="container-page">
        <section className="max-w-[560px] py-24">
          <p className="font-mono text-sm text-accent">404 · Halaman tidak ditemukan</p>
          <h1 className="display-serif mt-2 text-[clamp(46px,7vw,80px)]">
            Halaman ini tidak ada.
          </h1>
          <p className="mt-3 text-muted">
            {hydrated ? (
              <>
                Alamat <span className="font-mono break-all">{pathname}</span> mungkin
              </>
            ) : (
              'Alamatnya mungkin'
            )}{' '}
            salah ketik atau halamannya sudah dipindahkan.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link to="/" className="btn btn-primary">
              Kembali ke beranda
            </Link>
            <Link to="/blog" className="btn btn-ghost">
              Baca blog
            </Link>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
