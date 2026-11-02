import { site } from '@/data/site'
import Icon from './Icon'

/** Tombol unduh CV (FR-007). Taruh file CV di public/cv/ sesuai site.cvPath. */
export default function CvButton({ variant = 'ghost' }) {
  return (
    <a className={`btn btn-${variant}`} href={site.cvPath} download target="_blank" rel="noopener">
      <Icon name="download" /> Unduh CV
    </a>
  )
}
