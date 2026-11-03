import Breadcrumb from './Breadcrumb'
import { emphasize } from '@/utils/emphasis'

export default function PageHeader({ title, description, breadcrumb, eyebrow, className = '' }) {
  return (
    <header className={`pt-12 pb-8 lg:pt-[72px] lg:pb-10 ${className}`}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 className="display-serif text-[clamp(44px,6.4vw,76px)]">{emphasize(title)}</h1>
      {description && <p className="mt-3 max-w-[60ch] text-[17px] text-muted">{description}</p>}
    </header>
  )
}
