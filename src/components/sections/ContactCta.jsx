import { Link } from 'react-router'
import Icon from '@/components/common/Icon'

export default function ContactCta() {
  return (
    <section className="pb-14 lg:pb-20">
      <div className="grid gap-5 rounded-2xl border border-line bg-surface px-6 py-10 md:grid-cols-[1fr_auto] md:items-center md:p-12">
        <div>
          <h2 className="text-[clamp(24px,3.2vw,34px)] font-extrabold tracking-[-0.02em]">Punya proyek atau lowongan?</h2>
          <p className="mt-2 text-muted">Ceritakan kebutuhan kamu. Saya balas dalam satu hari kerja.</p>
        </div>
        <Link to="/contact" className="btn btn-primary">
          Kirim pesan <Icon name="arrowRight" />
        </Link>
      </div>
    </section>
  )
}
