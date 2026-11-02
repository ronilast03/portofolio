import Breadcrumb from './Breadcrumb'

export default function PageHeader({ title, description, breadcrumb, eyebrow, className = '' }) {
  return (
    <header className={`pt-12 pb-8 lg:pt-[72px] lg:pb-10 ${className}`}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 className="text-[clamp(34px,5vw,54px)] font-extrabold tracking-[-0.03em]">{title}</h1>
      {description && <p className="mt-3 max-w-[60ch] text-[17px] text-muted">{description}</p>}
    </header>
  )
}
