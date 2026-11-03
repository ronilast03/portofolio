import { Link } from 'react-router'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import PageTransition from '@/components/common/PageTransition'
import { profile } from '@/data/profile'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Kebijakan Privasi' }]
const LAST_UPDATED = '3 November 2026'

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <Seo
        title="Kebijakan Privasi"
        description="Informasi penggunaan dan penyimpanan data formulir kontak di website ini."
        path="/privacy-policy"
      />
      <div className="container-page">
        <PageHeader title="Kebijakan *privasi*" description={`Terakhir diperbarui ${LAST_UPDATED}.`} breadcrumb={crumbs} />

        <div className="max-w-[68ch] pb-[72px] [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          <h2>Data yang dikumpulkan</h2>
          <p>
            Saat kamu mengirim pesan melalui formulir kontak, website ini menyimpan nama, alamat email, subjek, dan isi
            pesan. Tidak ada data lain yang diminta.
          </p>

          <h2>Tujuan penggunaan</h2>
          <p>Data dipakai hanya untuk membaca dan membalas pesan kamu. Data tidak dijual, dibagikan, atau dipakai untuk iklan.</p>

          <h2>Penyimpanan dan keamanan</h2>
          <ul>
            <li>
              Pesan diteruskan ke email pemilik website melalui layanan formulir pihak ketiga (Web3Forms), atau
              disimpan di server milik website jika layanan backend sendiri digunakan.
            </li>
            <li>Komunikasi menggunakan HTTPS.</li>
            <li>Formulir dilindungi pembatasan jumlah pengiriman untuk mencegah spam.</li>
          </ul>

          <h2>Statistik pengunjung</h2>
          <p>
            Website ini memakai Vercel Web Analytics untuk menghitung jumlah kunjungan dan halaman yang dibuka. Data
            yang dikumpulkan bersifat anonim dan digabungkan, tidak memakai cookie, dan tidak dipakai untuk melacak
            kamu di website lain.
          </p>

          <h2>Preferensi tema</h2>
          <p>Pilihan mode gelap atau terang disimpan di browser kamu sendiri (localStorage) dan tidak dikirim ke server.</p>

          <h2>Menghapus data</h2>
          <p>
            Kamu dapat meminta penghapusan pesan yang pernah dikirim dengan menghubungi {profile.email} atau melalui{' '}
            <Link to="/contact" className="text-accent underline underline-offset-2">
              halaman kontak
            </Link>
            .
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
